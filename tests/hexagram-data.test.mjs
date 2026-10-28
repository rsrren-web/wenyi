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

test('all 64 彖传, 384 小象 and two special lines are present without placeholder glyphs', () => {
  let smallImages = 0;
  const interpretations = new Set();
  for (const [id, h] of Object.entries(data)) {
    assert.ok(h.tuan.length > 20, `${id}: 彖传`);
    const originals = [h.judgment.original, h.imageText.original, h.tuan];
    for (const line of h.lines) {
      assert.ok(line.xiang.length >= 6, `${id}: 小象 ${line.position}`);
      originals.push(line.text, line.xiang);
      interpretations.add(line.explanation);
      assert.doesNotMatch(line.explanation, /此爻处于|爻辞提示/);
      smallImages++;
    }
    for (const text of originals) assert.doesNotMatch(text, /[\uE000-\uF8FF□�]|一作|variant-tooltip/);
    assert.doesNotMatch(h.detailedInterpretation.situation, /应先判断自己处于六爻/);
    assert.doesNotMatch(h.detailedInterpretation.summary, /关键不在机械判断/);
  }
  assert.equal(smallImages, 384);
  assert.equal(interpretations.size, 384, 'no repeated template interpretations');
  assert.deepEqual(Object.entries(data).filter(([, h]) => h.specialLine).map(([id]) => id).sort(), ['01', '02']);
  for (const id of ['01','02']) {
    assert.ok(data[id].specialLine.xiang);
    assert.equal(data[id].lines.length, 6, 'special text is not a seventh line');
    assert.equal(data[id].yaoDiagram.lines.length, 6);
  }
});

test('confirmed classical corrections stay fixed', () => {
  assert.equal(data['17'].judgment.original.replace(/[\s，。；]/g, ''), '元亨利贞无咎');
  assert.match(data['17'].imageText.original, /向晦入宴息/);
  assert.match(data['04'].judgment.original, /初筮告/);
  assert.match(data['03'].lines[3].text, /往吉/);
  assert.match(data['16'].imageText.original, /殷荐之上帝，以配祖考/);
  assert.equal(data['26'].lines[1].text, '舆说輹。');
  assert.match(data['26'].lines[3].text, /童牛/);
  assert.match(data['48'].lines[5].text, /有孚元吉/);
  assert.match(data['53'].lines[1].text, /衎衎/);
  assert.match(data['57'].lines[1].text, /床下/);
  assert.match(data['29'].tuan, /险之时用大矣哉/);
  assert.doesNotMatch(data['10'].tuan, /亨，利贞/);
  assert.match(data['22'].tuan, /刚柔交错/);
  assert.match(data['61'].lines[2].xiang, /或鼓或罢/);
});

test('negative and ritual readings are not reduced to character-based fortune templates', () => {
  for (const [id, index] of [['19',2],['25',5],['27',2],['32',0],['34',5],['45',2],['54',5]]) {
    assert.match(data[id].lines[index].explanation, /没有好处|没有实际|没有好|无所利/);
  }
  assert.match(data['44'].lines[1].explanation, /不宜.*宾客/);
  assert.match(data['17'].lines[5].explanation, /祭享/);
  assert.match(data['46'].lines[3].explanation, /祭享/);
  assert.match(data['32'].lines[1].explanation, /悔恨.*消失/);
});
