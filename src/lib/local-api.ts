import { useMemo } from "react";
import { getAllHexagrams, getHexagramById } from "@/data/hexagrams";

export function useListHexagrams() {
  const data = useMemo(() => getAllHexagrams(), []);
  return { data, isLoading: false, error: null };
}

export function useGetHexagram(id: number) {
  const data = id > 0 ? getHexagramById(id) : undefined;
  return { data, isLoading: false, error: id > 0 && !data ? new Error("卦象不存在") : null };
}
