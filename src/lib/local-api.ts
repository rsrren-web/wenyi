import { useCallback, useMemo, useState } from "react";
import { getAllHexagrams, getHexagramById, type ProcessedHexagram } from "@/data/hexagrams";

export function useListHexagrams() {
  const data = useMemo(() => getAllHexagrams(), []);
  return { data, isLoading: false, error: null };
}

export function useGetHexagram(id: number) {
  const data = id > 0 ? getHexagramById(id) : undefined;
  return { data, isLoading: false, error: id > 0 && !data ? new Error("卦象不存在") : null };
}

function interpretation(h: ProcessedHexagram) {
  return [
    `【卦辞】\n${h.guaci}`,
    `【象辞】\n${h.xiangci}`,
    h.duanyiTianji && `【情势研判】\n${h.duanyiTianji}`,
  ].filter(Boolean).join("\n\n");
}

export function useCastDivination() {
  const [data, setData] = useState<{question: string; hexagram: ProcessedHexagram; interpretation: string}>();
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mutate = useCallback(({ data: input }: { data: { question: string } }) => {
    setPending(true);
    setError(null);
    try {
      const all = getAllHexagrams();
      const hexagram = all[Math.floor(Math.random() * all.length)];
      setData({ question: input.question.trim(), hexagram, interpretation: interpretation(hexagram) });
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error("起卦失败"));
    } finally {
      setPending(false);
    }
  }, []);
  return { mutate, data, isPending, error };
}
