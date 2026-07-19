import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface YaoLine {
  position: number;
  name: string;
  isYang: boolean;
  isShiYao: boolean;
  isYingYao: boolean;
  text: string;
  explanation: string;
}

export function YaoLinesDetail({ lines }: { lines: YaoLine[] }) {
  const ordered = [...lines].sort((a, b) => b.position - a.position);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <>
      <div className="space-y-2 md:hidden">
        {ordered.map(line => {
          const open = expanded === line.position;
          const marker = line.isShiYao ? "世" : line.isYingYao ? "应" : "";
          return (
            <div key={line.position} className="border border-border bg-card/40">
              <button type="button" aria-expanded={open} onClick={() => setExpanded(open ? null : line.position)} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                <span className="text-base tracking-wider text-white">{line.name}</span>
                <span className="ml-auto text-xs tracking-widest text-foreground/50">{line.isYang ? "阳" : "阴"}{marker && ` · ${marker}`}</span>
                {open ? <ChevronUp className="h-4 w-4 text-primary/60" /> : <ChevronDown className="h-4 w-4 text-foreground/35" />}
              </button>
              {open && (
                <div className="space-y-4 border-t border-border px-4 py-5">
                  <div><div className="mb-2 text-[10px] tracking-[0.3em] text-primary/55">爻辞</div><p className="text-base leading-relaxed text-foreground/90">{line.text}</p></div>
                  <div><div className="mb-2 text-[10px] tracking-[0.3em] text-foreground/40">白话解</div><p className="text-sm leading-relaxed text-foreground/70">{line.explanation}</p></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto border border-border md:block">
        <table className="w-full border-collapse text-left">
          <thead><tr className="border-b border-border text-xs uppercase tracking-[0.3em] text-foreground/55"><th className="px-4 py-3 font-normal">爻位</th><th className="px-4 py-3 font-normal">阴阳</th><th className="px-4 py-3 font-normal">世/应</th><th className="w-1/3 px-4 py-3 font-normal">爻辞</th><th className="w-1/3 px-4 py-3 font-normal">白话解</th></tr></thead>
          <tbody className="divide-y divide-border">{ordered.map(line => <tr key={line.position} className="transition-colors hover:bg-card"><td className="px-4 py-4 text-base tracking-wider text-white">{line.name}</td><td className="px-4 py-4 text-sm text-foreground/60">{line.isYang ? "阳" : "阴"}</td><td className="px-4 py-4 text-sm font-medium tracking-widest text-primary/80">{line.isShiYao ? "世" : line.isYingYao ? "应" : ""}</td><td className="px-4 py-4 text-base leading-relaxed text-foreground/90">{line.text}</td><td className="px-4 py-4 text-sm leading-relaxed text-foreground/75">{line.explanation}</td></tr>)}</tbody>
        </table>
      </div>
    </>
  );
}
