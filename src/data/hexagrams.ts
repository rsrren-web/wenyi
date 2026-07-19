// 64-hexagram database loaded from JSON
// JSON is keyed "01"–"64"; lines ordered bottom→top (position 1 = 初爻)

import hexagramDataRaw from './hexagrams.json';
import guaImageExplanationRaw from './gua-image-explanation.json';

interface JsonLine {
  position: number;
  positionName: string;
  yinYang: string;
  text: string;
  explanation: string;
  isShi: boolean;
  isYing: boolean;
}

interface JsonHexagram {
  id: string;
  name: string;
  shortName: string;
  symbol: string;
  upperTrigram: { name: string; element: string };
  lowerTrigram: { name: string; element: string };
  palace: string;
  element: string;
  palaceLevel: string;
  judgment: { original: string; explanation: string };
  imageText: { original: string; explanation: string };
  folkJudgment: { text: string };
  shijue: { text: string; explanation: string };
  tuchen: { text: string; explanation: string[] };
  detailedInterpretation: {
    coreMeaning: string;
    situation: string;
    summary: string;
    advice: string;
    warning: string;
  };
  relatedHexagrams: {
    mutual: { id: string; name: string };
    opposite: { id: string; name: string };
    reversed: { id: string; name: string };
  };
  lines: JsonLine[];
}

const hexagramData = hexagramDataRaw as Record<string, JsonHexagram>;
const guaImageExplanation = guaImageExplanationRaw as Record<string, { guaImageExplanation: string[] }>;

// ─── Public types ───────────────────────────────────────────────────────────

export interface ProcessedYao {
  position: number;
  name: string;
  isShiYao: boolean;
  isYingYao: boolean;
  isYang: boolean;
  text: string;
  explanation: string;
}

export interface ProcessedHexagram {
  id: number;
  number: number;
  name: string;
  pinyin: string | null;
  symbol: string;
  upperTrigram: string;
  lowerTrigram: string;
  palace: string;
  element: string;
  palaceLevel: string;
  guaci: string;
  xiangci: string;
  folkJudgment: string;
  duanyiTianji: string;
  poem: string;
  explanation: string;
  coreMeaning: string;
  advice: string;
  warning: string;
  tuchen: string;
  guaImageExplanation: string[];
  lines: ProcessedYao[];
  relatedHexagrams: {
    mutual: { id: number; name: string; symbol: string };
    opposite: { id: number; name: string; symbol: string };
    reversed: { id: number; name: string; symbol: string };
  };
}

// ─── Build the processed list ────────────────────────────────────────────────

function buildAll(): ProcessedHexagram[] {
  const keys = Object.keys(hexagramData).sort((a, b) => parseInt(a) - parseInt(b));

  // First pass: build without resolved related hexagram symbols
  const symbolById = new Map<number, string>();
  const nameById = new Map<number, string>();

  const partials: (ProcessedHexagram & { _rawRelated: JsonHexagram['relatedHexagrams'] })[] = keys.map(key => {
    const json = hexagramData[key];
    const id = parseInt(key, 10);
    const palace = json.palace.replace(/宫$/, '');

    symbolById.set(id, json.symbol);
    nameById.set(id, json.shortName);

    const lines: ProcessedYao[] = (json.lines ?? []).map(line => ({
      position: line.position,
      name: line.positionName,
      isShiYao: line.isShi,
      isYingYao: line.isYing,
      isYang: line.yinYang === '阳',
      text: line.text,
      explanation: line.explanation,
    }));

    return {
      id,
      number: id,
      name: json.shortName,
      pinyin: null,
      symbol: json.symbol,
      upperTrigram: json.upperTrigram?.name ?? '',
      lowerTrigram: json.lowerTrigram?.name ?? '',
      palace,
      element: json.element,
      palaceLevel: json.palaceLevel,
      guaci: json.judgment?.original ?? '',
      xiangci: json.imageText?.original ?? '',
      folkJudgment: json.folkJudgment?.text ?? '',
      duanyiTianji: json.detailedInterpretation?.situation ?? '',
      poem: json.shijue?.text ?? '',
      explanation: json.detailedInterpretation?.summary ?? '',
      coreMeaning: json.detailedInterpretation?.coreMeaning ?? '',
      advice: json.detailedInterpretation?.advice ?? '',
      warning: json.detailedInterpretation?.warning ?? '',
      tuchen: json.tuchen?.text ?? '',
      guaImageExplanation: guaImageExplanation[key]?.guaImageExplanation ?? [],
      lines,
      relatedHexagrams: {
        mutual: { id: 0, name: '', symbol: '' },
        opposite: { id: 0, name: '', symbol: '' },
        reversed: { id: 0, name: '', symbol: '' },
      },
      _rawRelated: json.relatedHexagrams,
    };
  });

  // Second pass: resolve related hexagram symbols
  return partials.map(h => {
    const resolve = (ref: { id: string; name: string }) => {
      const refId = parseInt(ref.id, 10);
      return {
        id: refId,
        name: nameById.get(refId) ?? ref.name,
        symbol: symbolById.get(refId) ?? '',
      };
    };

    const result: ProcessedHexagram = {
      ...h,
      relatedHexagrams: {
        mutual: resolve(h._rawRelated.mutual),
        opposite: resolve(h._rawRelated.opposite),
        reversed: resolve(h._rawRelated.reversed),
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (result as any)._rawRelated;
    return result;
  });
}

let _cache: ProcessedHexagram[] | null = null;

export function getAllHexagrams(): ProcessedHexagram[] {
  if (!_cache) _cache = buildAll();
  return _cache;
}

export function getHexagramById(id: number): ProcessedHexagram | undefined {
  return getAllHexagrams().find(h => h.id === id);
}
