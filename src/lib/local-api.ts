import { useMemo, useState } from "react";
import { getAllHexagrams, getHexagramById, type ProcessedHexagram } from "@/data/hexagrams";

export function useListHexagrams() {
  const data = useMemo(() => getAllHexagrams(), []);
  return { data, isLoading: false, error: null };
}

export function useGetHexagram(id: number) {
  const data = id > 0 ? getHexagramById(id) : undefined;
  return { data, isLoading: false, error: id > 0 && !data ? new Error("卦象不存在") : null };
}

function interpretation(question: string, h: ProcessedHexagram) {
  return [
    "【本卦解读】", "", `您所问之事：「${question}」`, "",
    `天机示以第 ${h.id} 卦——${h.symbol} ${h.name}卦（${h.coreMeaning}）`, "",
    `【卦辞】\n${h.guaci}`, "", `【象辞】\n${h.xiangci}`, "",
    `【情势研判】\n${h.duanyiTianji}`, "", `【综合指引】\n${h.explanation}`, "",
    `宜：${h.advice}`, `忌：${h.warning}`,
  ].join("\n");
}

export function useCastDivination() {
  const [data, setData] = useState<{question: string; hexagram: ProcessedHexagram; interpretation: string}>();
  const [isPending, setPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mutate = ({ data: input }: { data: { question: string } }) => {
    setPending(true);
    setError(null);
    try {
      const all = getAllHexagrams();
      const hexagram = all[Math.floor(Math.random() * all.length)];
      setData({ question: input.question.trim(), hexagram, interpretation: interpretation(input.question.trim(), hexagram) });
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error("起卦失败"));
    } finally {
      setPending(false);
    }
  };
  return { mutate, data, isPending, error };
}
