import { useState } from "react";
import { useGetHexagram } from "@/lib/local-api";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { YaoLineDiagram } from "./YaoLineDiagram";

interface HexagramRef {
  id: number;
  name: string;
  symbol: string;
}

interface RelatedHexagramSectionProps {
  mutual: HexagramRef;
  opposite: HexagramRef;
  reversed: HexagramRef;
}

function RelatedCard({
  label,
  desc,
  hexRef,
}: {
  label: string;
  desc: string;
  hexRef: HexagramRef;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: hexagram, isLoading } = useGetHexagram(expanded ? hexRef.id : 0);

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-5 hover:bg-primary/5 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl text-primary/60 hexagram-symbol group-hover:text-primary transition-colors">
              {hexRef.symbol}
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] tracking-[0.3em] text-primary/50 uppercase border border-primary/20 px-2 py-0.5">
                {label}
              </span>
            </div>
            <div className="text-base font-medium tracking-wider text-foreground/80">
              {hexRef.name}卦
            </div>
            <div className="text-xs text-foreground/35 tracking-wide mt-0.5">{desc}</div>
          </div>
        </div>
        <div className="text-foreground/30">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border">
          {isLoading || !hexagram ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
            </div>
          ) : (
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                  <YaoLineDiagram lines={hexagram.lines} />
                </div>

                <div className="space-y-5">
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs tracking-widest text-foreground/35">
                    <span>{hexagram.palace}宫</span>
                    <span>·</span>
                    <span>{hexagram.element}</span>
                    <span>·</span>
                    <span>{hexagram.palaceLevel}</span>
                  </div>

                  {/* Guaci */}
                  <div>
                    <div className="text-[10px] tracking-[0.3em] text-primary/40 mb-2 uppercase">卦辞</div>
                    <p className="text-sm leading-relaxed text-foreground/70">{hexagram.guaci}</p>
                  </div>

                  {/* Xiangci */}
                  <div>
                    <div className="text-[10px] tracking-[0.3em] text-primary/40 mb-2 uppercase">象辞</div>
                    <p className="text-sm leading-relaxed text-foreground/70">{hexagram.xiangci}</p>
                  </div>
                </div>
              </div>

              {/* Extended fields from JSON */}
              {(hexagram as unknown as { coreMeaning?: string; advice?: string; warning?: string }).coreMeaning && (
                <div className="pt-4 border-t border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(hexagram as unknown as { coreMeaning?: string }).coreMeaning && (
                      <div className="bg-muted/50 p-4">
                        <div className="text-[10px] tracking-[0.3em] text-primary/40 mb-1.5 uppercase">核心</div>
                        <p className="text-xs text-foreground/60 leading-relaxed">
                          {(hexagram as unknown as { coreMeaning?: string }).coreMeaning}
                        </p>
                      </div>
                    )}
                    {(hexagram as unknown as { advice?: string }).advice && (
                      <div className="bg-muted/50 p-4">
                        <div className="text-[10px] tracking-[0.3em] text-primary/40 mb-1.5 uppercase">宜</div>
                        <p className="text-xs text-foreground/60 leading-relaxed">
                          {(hexagram as unknown as { advice?: string }).advice}
                        </p>
                      </div>
                    )}
                    {(hexagram as unknown as { warning?: string }).warning && (
                      <div className="bg-muted/50 p-4">
                        <div className="text-[10px] tracking-[0.3em] text-primary/40 mb-1.5 uppercase">忌</div>
                        <p className="text-xs text-foreground/60 leading-relaxed">
                          {(hexagram as unknown as { warning?: string }).warning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Link href={`/hexagrams/${hexRef.id}`}>
                  <span className="text-xs text-primary/50 hover:text-primary tracking-widest transition-colors">
                    查看完整卦详情 →
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RelatedHexagramSection({ mutual, opposite, reversed }: RelatedHexagramSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs tracking-[0.3em] text-foreground/30 uppercase mb-4">关联卦象</h3>
      <RelatedCard
        label="互卦"
        desc="取中间四爻重组，揭示事物内在发展"
        hexRef={mutual}
      />
      <RelatedCard
        label="错卦"
        desc="六爻阴阳全部相反，揭示对立面"
        hexRef={opposite}
      />
      <RelatedCard
        label="综卦"
        desc="六爻上下颠倒，揭示换位看法"
        hexRef={reversed}
      />
    </div>
  );
}
