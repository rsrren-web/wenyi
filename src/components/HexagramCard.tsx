import { Link } from "wouter";
import { motion } from "framer-motion";

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

export function HexagramCard({ hexagram }: { hexagram: HexagramBriefExtended }) {
  return (
    <Link href={`/hexagrams/${hexagram.id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="group relative flex h-full min-h-[240px] flex-col overflow-hidden border border-border bg-card p-5 cursor-pointer transition-all duration-300 hover:border-primary/30"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Header: symbol + number */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-5xl leading-none text-primary/80 hexagram-symbol group-hover:text-primary transition-colors duration-300">
            {hexagram.symbol}
          </span>
          <span className="text-xs tracking-widest text-foreground/55 mt-1">
            {hexagram.number ?? hexagram.id}
          </span>
        </div>

        {/* Name + coreMeaning */}
        <div className="space-y-1.5 flex-1">
          <div className="text-lg font-medium tracking-[0.1em] text-foreground/90">
            {hexagram.name}
          </div>
          {hexagram.coreMeaning && (
            <div className="text-sm text-primary/70 tracking-wide line-clamp-1">
              {hexagram.coreMeaning}
            </div>
          )}
          {hexagram.guaci && (
            <div className="text-sm text-foreground/60 leading-relaxed tracking-wide line-clamp-2 pt-1.5 border-t border-border/50">
              {hexagram.guaci}
            </div>
          )}
        </div>

        {/* Footer: palace + element */}
        {(hexagram.palace || hexagram.element) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
            {hexagram.palace && (
              <span className="text-xs tracking-widest text-foreground/55">{hexagram.palace}宫</span>
            )}
            {hexagram.palace && hexagram.element && (
              <span className="w-0.5 h-0.5 rounded-full bg-foreground/30" />
            )}
            {hexagram.element && (
              <span className="text-xs tracking-widest text-foreground/55">{hexagram.element}</span>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
