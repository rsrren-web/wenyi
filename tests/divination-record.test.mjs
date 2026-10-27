import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DIVINATION_RECORD_KEY, createDivinationRecord, readDivinationRecord, saveDivinationRecord } from '../src/lib/divination-record.ts';

const ids = Array.from({ length: 64 }, (_, i) => i + 1);
function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('saved questions and hexagrams remain identical across repeated result reads', t => {
  const random = t.mock.method(Math, 'random', () => 0.5);
  const storage = memoryStorage();
  const record = createDivinationRecord('  一个完整的问题？  ', ids);
  saveDivinationRecord(storage, record);
  assert.equal(record.question, '一个完整的问题？');
  assert.equal(record.hexagramId, 33);
  for (let i = 0; i < 20; i++) assert.deepEqual(readDivinationRecord(storage), { status: 'ready', record });
  assert.equal(random.mock.callCount(), 1, 'reading the result must never cast again');
});

test('explicit submission replaces the latest record even for the same question', () => {
  const storage = memoryStorage();
  const first = createDivinationRecord('同一个问题', ids);
  saveDivinationRecord(storage, first);
  const second = createDivinationRecord('同一个问题', ids);
  saveDivinationRecord(storage, second);
  assert.notEqual(second.id, first.id);
  assert.deepEqual(readDivinationRecord(storage), { status: 'ready', record: second });
});

test('missing and legacy-only storage never silently generate a result', () => {
  const storage = memoryStorage();
  storage.setItem('divination_question', '旧版问题，不包含卦号');
  assert.deepEqual(readDivinationRecord(storage), { status: 'missing' });
});

test('malformed, unsupported and invalid saved records are rejected without rewriting them', () => {
  const storage = memoryStorage();
  const valid = createDivinationRecord('测试', ids);
  for (const bad of ['{', 'null', '[]', ...[
    { ...valid, version: 2 }, { ...valid, id: '' }, { ...valid, question: ' ' },
    ...[0, 65, 1.5, '1', null].map(hexagramId => ({ ...valid, hexagramId })),
    { ...valid, createdAt: 'invalid' },
  ].map(JSON.stringify)]) {
    storage.setItem(DIVINATION_RECORD_KEY, bad);
    assert.deepEqual(readDivinationRecord(storage), { status: 'invalid' });
    assert.equal(storage.getItem(DIVINATION_RECORD_KEY), bad);
  }
});

test('unavailable storage reports failure and never overwrites a previous result', () => {
  assert.deepEqual(readDivinationRecord({ getItem() { throw new Error('blocked'); } }), { status: 'unavailable' });
  const record = createDivinationRecord('测试', ids);
  assert.throws(() => saveDivinationRecord({ setItem() { throw new Error('full'); } }, record));
});

test('all draw boundaries are in range and invalid submissions are rejected', t => {
  const random = t.mock.method(Math, 'random', () => 0);
  assert.equal(createDivinationRecord('开始', ids).hexagramId, 1);
  random.mock.mockImplementation(() => 1 - Number.EPSILON);
  assert.equal(createDivinationRecord('结束', ids).hexagramId, 64);
  assert.throws(() => createDivinationRecord('  ', ids));
  assert.throws(() => createDivinationRecord('测试', []));
  assert.throws(() => createDivinationRecord('测试', [65]));
});
