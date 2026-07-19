import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useListHexagrams } from "@/lib/local-api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

interface HexagramBriefExtended {
  id: number;
  name: string;
  symbol: string;
  palace?: string;
  element?: string;
  guaci?: string;
  coreMeaning?: string;
}

export function QuoteCarousel() {
  const [, setLocation] = useLocation();
  const { data: rawHexagrams } = useListHexagrams();
  const hexagrams = rawHexagrams as HexagramBriefExtended[] | undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HexagramBriefExtended[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (!hexagrams || hexagrams.length === 0 || searchQuery) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % hexagrams.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hexagrams, searchQuery]);

  // Search logic
  useEffect(() => {
    if (!hexagrams || !searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const q = searchQuery.trim().toLowerCase();
    const numQ = parseInt(q, 10);
    const results = hexagrams.filter(h => {
      if (!isNaN(numQ) && h.id === numQ) return true;
      if (h.name.includes(q)) return true;
      if (h.guaci?.includes(q)) return true;
      if (h.coreMeaning?.includes(q)) return true;
      if (h.palace?.includes(q)) return true;
      if (h.element?.includes(q)) return true;
      return false;
    }).slice(0, 8);
    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery, hexagrams]);

  const handleSearchSelect = useCallback((id: number) => {
    setSearchQuery("");
    setShowResults(false);
    setLocation(`/hexagrams/${id}`);
  }, [setLocation]);

  const current = hexagrams?.[currentIndex];

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-foreground/45 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 150)}
            placeholder="搜索卦名、关键词或序号…"
            className="w-full bg-card border border-border pl-9 pr-8 py-2.5 text-xs tracking-wider text-foreground/80 placeholder:text-foreground/35 focus:outline-none focus:border-primary/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setShowResults(false); }}
              className="absolute right-3 text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown results */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border mt-px shadow-2xl max-h-64 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="px-4 py-5 text-center text-xs tracking-wider text-foreground/50">
                无法找到你所查询的内容
              </div>
            ) : searchResults.map(h => (
              <button
                key={h.id}
                onMouseDown={() => handleSearchSelect(h.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left group"
              >
                <span className="text-xl text-primary/70 hexagram-symbol group-hover:text-primary transition-colors shrink-0">
                  {h.symbol}
                </span>
                <div className="min-w-0">
                  <div className="text-sm text-foreground/85 tracking-wide">
                    <span className="text-foreground/50 text-xs mr-2">#{h.id}</span>
                    {h.name}
                  </div>
                  {h.coreMeaning && (
                    <div className="text-xs text-foreground/50 truncate">{h.coreMeaning}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quote card — fixed compact height, content centered */}
      <div className="relative border border-border bg-card h-[200px] overflow-hidden">
        <AnimatePresence mode="wait">
          {current && !searchQuery ? (
            <motion.button
              key={currentIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
              onClick={() => setLocation(`/hexagrams/${current.id}`)}
              className="absolute inset-0 w-full text-left p-5 flex flex-col justify-center group hover:bg-primary/5 transition-colors duration-300 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-3xl text-primary/60 hexagram-symbol group-hover:text-primary/90 transition-colors">
                  {current.symbol}
                </span>
                <div>
                  <div className="text-sm font-medium text-foreground/80 tracking-wider">
                    {current.name}
                  </div>
                  {current.coreMeaning && (
                    <div className="text-[10px] text-primary/65 tracking-wide mt-0.5">
                      {current.coreMeaning}
                    </div>
                  )}
                </div>
              </div>

              {/* Guaci */}
              {current.guaci && (
                <p className="text-xs text-foreground/65 leading-relaxed tracking-wide line-clamp-2">
                  {current.guaci}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <span className="text-[10px] text-foreground/40 tracking-widest">
                  第 {current.id} 卦 / 点击查看详情
                </span>
                <div className="flex gap-1">
                  {hexagrams && hexagrams.slice(
                    Math.max(0, currentIndex - 2),
                    Math.min(hexagrams.length, currentIndex + 3)
                  ).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full transition-colors ${
                        i === Math.min(currentIndex, 2) ? 'bg-primary/70' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.button>
          ) : (
            <div key="empty" className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs text-foreground/35 tracking-widest">正在加载卦象…</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
