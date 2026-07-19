import { useListHexagrams } from "@/lib/local-api";
import { HexagramCard } from "@/components/HexagramCard";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

interface HexagramBriefExtended {
  id: number;
  number?: number;
  name: string;
  symbol: string;
  palace?: string;
  element?: string;
  guaci?: string;
  coreMeaning?: string;
}

const PALACES = ["全部", "乾", "坤", "坎", "离", "震", "巽", "艮", "兑"];
const ELEMENTS = ["全部", "金", "木", "水", "火", "土"];

export default function Hexagrams() {
  const { data: rawHexagrams, isLoading } = useListHexagrams();
  const hexagrams = rawHexagrams as HexagramBriefExtended[] | undefined;
  const [filterPalace, setFilterPalace] = useState("全部");
  const [filterElement, setFilterElement] = useState("全部");
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-57px)] flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  const filtered = hexagrams?.filter(h => {
    if (filterPalace !== "全部" && h.palace !== filterPalace) return false;
    if (filterElement !== "全部" && h.element !== filterElement) return false;
    if (search) {
      const q = search.toLowerCase();
      const numQ = parseInt(q, 10);
      if (!isNaN(numQ) && h.id === numQ) return true;
      if (h.name.toLowerCase().includes(q)) return true;
      if (h.guaci?.includes(q)) return true;
      if (h.coreMeaning?.includes(q)) return true;
      return false;
    }
    return true;
  }) ?? [];

  return (
    <div className="container mx-auto px-5 py-12 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-light tracking-[0.2em] text-primary mb-2">六十四卦</h1>
        <p className="text-sm text-foreground/60 tracking-widest">
          易有太极，是生两仪，两仪生四象，四象生八卦
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索卦名、关键词或序号…"
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 text-sm tracking-wider text-foreground/85 placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Palace filter */}
        <div className="flex flex-wrap gap-2">
          {PALACES.map(p => (
            <button
              key={p}
              onClick={() => setFilterPalace(p)}
              className={`text-sm tracking-widest px-3 py-1.5 border transition-colors ${
                filterPalace === p
                  ? 'border-primary text-primary'
                  : 'border-border text-foreground/60 hover:border-primary/40 hover:text-foreground/85'
              }`}
            >
              {p === "全部" ? "全部" : `${p}宫`}
            </button>
          ))}
        </div>

        {/* Element filter */}
        <div className="flex flex-wrap gap-2">
          {ELEMENTS.map(el => (
            <button
              key={el}
              onClick={() => setFilterElement(el)}
              className={`text-sm tracking-widest px-3 py-1.5 border transition-colors ${
                filterElement === el
                  ? 'border-primary text-primary'
                  : 'border-border text-foreground/60 hover:border-primary/40 hover:text-foreground/85'
              }`}
            >
              {el === "全部" ? "全部五行" : `${el}行`}
            </button>
          ))}
        </div>

        {filtered.length !== (hexagrams?.length ?? 0) && (
          <p className="text-sm text-foreground/60 tracking-widest">
            显示 {filtered.length} / {hexagrams?.length ?? 0} 卦
          </p>
        )}
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-32 gap-5"
        >
          <div className="text-5xl text-foreground/15 hexagram-symbol">☯</div>
          <p className="text-base text-foreground/55 tracking-widest">
            未找到符合条件的卦象
          </p>
          <p className="text-sm text-foreground/35 tracking-wide">
            {search
              ? `「${search}」无匹配结果，请换个关键词`
              : '请调整宫位或五行筛选条件'}
          </p>
          <button
            onClick={() => { setSearch(""); setFilterPalace("全部"); setFilterElement("全部"); }}
            className="mt-2 px-6 py-2.5 border border-border text-sm tracking-[0.25em] text-foreground/60 hover:border-primary/50 hover:text-primary transition-colors"
          >
            清除筛选
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
        >
          {filtered.map((hexagram, index) => (
            <motion.div
              key={hexagram.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.01, 0.3) }}
              className="h-full"
            >
              <HexagramCard hexagram={hexagram} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
