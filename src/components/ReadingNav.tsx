interface ReadingNavItem {
  id: string;
  label: string;
}

export function ReadingNav({ items }: { items: ReadingNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const itemKey = items.map(item => item.id).join("|");

  useEffect(() => {
    const update = () => {
      const current = [...items]
        .reverse()
        .find(item => (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= 180);
      setActive(current?.id ?? items[0]?.id ?? "");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [itemKey]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="本页阅读目录" className="fixed right-5 top-1/2 z-30 hidden w-44 -translate-y-1/2 xl:block 2xl:right-10">
      <div className="border border-border border-l-primary/70 bg-[#080808]/95 px-5 py-6 shadow-[-12px_0_30px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mb-5 border-b border-border pb-4">
          <div className="text-[10px] tracking-[0.4em] text-primary/80">本页目录</div>
          <div className="mt-1 text-[10px] tracking-widest text-foreground/30">快速阅读</div>
        </div>
        <div className="space-y-1">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              aria-current={active === item.id ? "location" : undefined}
              className={`group flex w-full items-center gap-3 py-2 text-left text-xs tracking-widest transition-colors ${active === item.id ? "text-primary" : "text-foreground/45 hover:text-foreground/80"}`}
            >
              <span className={`text-[10px] tabular-nums transition-colors ${active === item.id ? "text-primary" : "text-foreground/25 group-hover:text-primary/50"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item.label}</span>
              <span className={`h-1 w-1 bg-primary transition-opacity ${active === item.id ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
import { useEffect, useState } from "react";
