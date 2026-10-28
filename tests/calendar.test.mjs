import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { getBeijingPillars } from '../src/lib/calendar.ts';

const at = value => getBeijingPillars(new Date(value));

test('Beijing pillars do not depend on the device timezone', () => {
  const script = "import {getBeijingPillars} from './src/lib/calendar.ts';console.log(JSON.stringify(getBeijingPillars(new Date('2026-07-19T15:00:00Z'))))";
  const results = ['UTC', 'America/Vancouver', 'Asia/Shanghai'].map(TZ =>
    execFileSync(process.execPath, ['--input-type=module', '-e', script], { env: { ...process.env, TZ }, encoding: 'utf8' }));
  assert.equal(results[0], results[1]);
  assert.equal(results[1], results[2]);
  assert.equal(JSON.parse(results[0]).time, '23:00:00');
});

test('day and hour roll together at 23:00, not again at midnight', () => {
  const before = at('2026-07-19T22:59:59+08:00');
  const after = at('2026-07-19T23:00:00+08:00');
  const midnight = at('2026-07-20T00:00:00+08:00');
  assert.equal(before.day, '甲午');
  assert.equal(after.day, '乙未');
  assert.equal(after.hour, '丙子');
  assert.equal(midnight.day, after.day);
  assert.equal(midnight.hour, after.hour);
  assert.equal(after.date, '2026-07-19');
  assert.equal(midnight.date, '2026-07-20');
});

test('year and month change at exact 立春, not midnight or lunar new year', () => {
  const before = at('2026-02-04T04:02:07+08:00');
  const after = at('2026-02-04T04:02:08+08:00');
  assert.equal(before.year, '乙巳');
  assert.equal(before.month, '己丑');
  assert.equal(after.year, '丙午');
  assert.equal(after.month, '庚寅');
  assert.equal(before.day, after.day);
});

test('month changes at exact 惊蛰 while the year and day remain unchanged', () => {
  const before = at('2026-03-05T21:58:59+08:00');
  const after = at('2026-03-05T21:59:00+08:00');
  assert.equal(before.month, '庚寅');
  assert.equal(after.month, '辛卯');
  assert.equal(before.year, after.year);
  assert.equal(before.day, after.day);
});
