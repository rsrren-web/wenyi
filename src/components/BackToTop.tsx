import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 640);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      aria-label="返回顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-5 z-40 grid h-10 w-10 place-items-center border border-border bg-black/90 text-foreground/55 backdrop-blur transition-all hover:border-primary/50 hover:text-primary md:bottom-8 md:right-8 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
