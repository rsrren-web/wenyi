import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/hexagrams.json', import.meta.url), 'utf8'));
const explanations = JSON.parse(readFileSync(new URL('../src/data/gua-image-explanation.json', import.meta.url), 'utf8'));

test('all 64 hexagrams retain complete original content and valid related references', () => {
  assert.equal(Object.keys(data).length, 64);
  for (let id = 1; id <= 64; id++) {
    const key = String(id).padStart(2, '0');
    const h = data[key];
    assert.ok(h, key);
    for (const value of [h.shortName, h.symbol, h.palace, h.element, h.palaceLevel,
      h.judgment.original, h.imageText.original, h.folkJudgment.text,
      ...['situation', 'summary', 'coreMeaning', 'advice', 'warning'].map(field => h.detailedInterpretation[field])]) {
      assert.ok(typeof value === 'string' && value.trim(), `${key} missing text`);
    }
    assert.equal(h.lines.length, 6);
    assert.deepEqual(h.lines.map(l => l.position).sort(), [1, 2, 3, 4, 5, 6]);
    assert.equal(h.yaoDiagram.lines.length, 6);
    for (const line of h.lines) {
      const stem = line.yinYang === '阳' ? '九' : '六';
      const expectedName = line.position === 1 ? `初${stem}` : line.position === 6 ? `上${stem}` : `${stem}${'一二三四五六'[line.position - 1]}`;
      assert.equal(line.positionName, expectedName, `${key} line name must match position and yin/yang`);
      assert.ok(line.text.trim(), `${key} missing original line`);
      assert.ok(line.explanation.trim(), `${key} missing plain-language explanation`);
      const diagramLine = h.yaoDiagram.lines.find(item => item.position === line.position);
      for (const field of ['positionName', 'yinYang', 'isShi', 'isYing']) {
        assert.equal(diagramLine[field], line[field], `${key} diagram differs from line ${line.position}`);
      }
    }
    for (const related of Object.values(h.relatedHexagrams)) assert.ok(data[related.id], `${key} invalid relationship`);
    assert.ok(explanations[key].guaImageExplanation.length, `${key} missing image explanations`);
    assert.ok(existsSync(new URL(`../public/images/${key}-yaoxiang.jpg`, import.meta.url)), `${key} missing image`);
  }
});

test('Meng retains its missing-first-line correction and all six original lines in order', () => {
  assert.deepEqual(data['04'].lines.map(line => [line.positionName, line.text]), [
    ['初六', '发蒙，利用刑人，用说桎梏，以往吝。'],
    ['九二', '包蒙吉；纳妇吉；子克家。'],
    ['六三', '勿用娶女；见金夫，不有躬，无攸利。'],
    ['六四', '困蒙，吝。'],
    ['六五', '童蒙，吉。'],
    ['上九', '击蒙；不利为寇，利御寇。'],
  ]);
});
