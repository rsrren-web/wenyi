interface YaoLine {
  position: number;
  name: string;
  isShiYao: boolean;
  isYingYao: boolean;
  isYang?: boolean;
  text: string;
  explanation: string;
}

export function YaoLineDiagram({ lines }: { lines: YaoLine[] }) {
  const sortedLines = [...lines].sort((a, b) => b.position - a.position);

  return (
    <div className="flex flex-col gap-2.5 py-5 px-8 border border-border bg-card relative">
      {sortedLines.map((line) => (
        <div key={line.position} className="flex items-center gap-4">
          <div className="w-10 text-right text-xs tracking-wide text-foreground/30">
            {line.name}
          </div>
          <div className="w-36 h-3 flex items-center">
            {line.isYang ? (
              <div className="w-full h-full bg-primary/60" />
            ) : (
              <div className="w-full h-full flex justify-between gap-1">
                <div className="flex-1 h-full bg-foreground/25" />
                <div className="flex-1 h-full bg-foreground/25" />
              </div>
            )}
          </div>
          <div className="w-6 text-[10px] tracking-wider text-primary/50 flex gap-1">
            {line.isShiYao && <span>世</span>}
            {line.isYingYao && <span className="text-foreground/30">应</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
