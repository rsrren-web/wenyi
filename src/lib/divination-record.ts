export const DIVINATION_RECORD_KEY = 'wenyi.divination.v1';

export interface DivinationRecord {
  version: 1;
  id: string;
  question: string;
  hexagramId: number;
  createdAt: string;
}

export type RecordStorage = Pick<Storage, 'getItem' | 'setItem'>;
export type SavedDivination =
  | { status: 'ready'; record: DivinationRecord }
  | { status: 'missing' | 'invalid' | 'unavailable' };

export function readDivinationRecord(storage: Pick<RecordStorage, 'getItem'>): SavedDivination {
  let raw: string | null;
  try {
    raw = storage.getItem(DIVINATION_RECORD_KEY);
  } catch {
    return { status: 'unavailable' };
  }
  if (raw === null) return { status: 'missing' };
  try {
    const record = JSON.parse(raw) as Partial<DivinationRecord> | null;
    if (!record || record.version !== 1 || typeof record.id !== 'string' || !record.id.trim()
      || typeof record.question !== 'string' || !record.question.trim()
      || !Number.isInteger(record.hexagramId) || record.hexagramId! < 1 || record.hexagramId! > 64
      || typeof record.createdAt !== 'string' || !Number.isFinite(Date.parse(record.createdAt))) {
      return { status: 'invalid' };
    }
    return { status: 'ready', record: record as DivinationRecord };
  } catch {
    return { status: 'invalid' };
  }
}

// Called only by an explicit submission, never while rendering a result page.
export function createDivinationRecord(question: string, hexagramIds: readonly number[]): DivinationRecord {
  const trimmed = question.trim();
  if (!trimmed) throw new Error('请输入所问之事。');
  if (!hexagramIds.length || hexagramIds.some(id => !Number.isInteger(id) || id < 1 || id > 64)) {
    throw new Error('卦象资料暂不可用，请刷新后重试。');
  }
  return {
    version: 1,
    id: crypto.randomUUID(),
    question: trimmed,
    hexagramId: hexagramIds[Math.floor(Math.random() * hexagramIds.length)],
    createdAt: new Date().toISOString(),
  };
}

export function saveDivinationRecord(storage: Pick<RecordStorage, 'setItem'>, record: DivinationRecord) {
  storage.setItem(DIVINATION_RECORD_KEY, JSON.stringify(record));
}
