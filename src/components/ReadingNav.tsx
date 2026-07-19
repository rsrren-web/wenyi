interface ReadingNavItem {
  id: string;
  label: string;
}

export function ReadingNav({ items }: { items: ReadingNavItem[] }) {
  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav aria-label="本页阅读目录" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <div className="border border-border bg-black/90 px-4 py-5 backdrop-blur">
        <div className="mb-4 text-[10px] tracking-[0.35em] text-foreground/35">阅读目录</div>
        <div className="space-y-3">
          {items.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              className="block text-xs tracking-widest text-foreground/45 transition-colors hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
