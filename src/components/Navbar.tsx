import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);

  useEffect(() => {
    if (!supportOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSupportOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [supportOpen]);

  const links = [
    { href: "/", label: "首页" },
    { href: "/hexagrams", label: "六十四卦" },
    { href: "/iching", label: "易经" },
    { href: "/about", label: "关于" },
  ];

  return (
    <>
    <nav className="w-full py-4 px-4 md:px-10 flex items-center justify-between border-b border-border bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-lg font-medium tracking-[0.15em] text-primary transition-colors group-hover:text-primary/80">
          问易
        </span>
      </Link>

      <div className="flex gap-3 sm:gap-5 md:gap-6 items-center">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm tracking-widest transition-colors hover:text-primary ${
              location === link.href
                ? "text-primary"
                : "text-foreground/50"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => setSupportOpen(true)}
          className="flex items-center gap-1.5 border-l border-border pl-3 text-sm tracking-widest text-primary/80 transition-colors hover:text-primary sm:pl-5"
          aria-haspopup="dialog"
        >
          <Heart className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">随缘随喜</span>
          <span className="sm:hidden">随喜</span>
        </button>
      </div>
    </nav>

    {supportOpen && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-title"
        onClick={() => setSupportOpen(false)}
      >
        <div
          className="relative w-full max-w-md border border-primary/35 bg-[#080808] p-5 shadow-[0_0_50px_rgba(0,0,0,0.7)] sm:p-7"
          onClick={event => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setSupportOpen(false)}
            aria-label="关闭随缘随喜"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center border border-border bg-black/70 text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-5 pr-12">
            <div id="support-title" className="text-xl font-light tracking-[0.2em] text-white">随缘随喜</div>
            <p className="mt-2 whitespace-nowrap text-xs text-foreground/75 sm:text-sm">随缘支持，量力而行，心意已足。</p>
          </div>

          <div className="flex justify-center border border-border bg-white p-2">
            <img
              src={`${import.meta.env.BASE_URL}wechat-support-v2.jpg`}
              alt="微信支付随缘随喜二维码"
              className="max-h-[62vh] w-full object-contain"
            />
          </div>
          <p className="mt-4 text-center text-xs tracking-widest text-foreground/65">微信扫码 · 随缘随喜</p>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-foreground/55">本站不会获取或保存任何支付信息</p>
        </div>
      </div>
    )}
    </>
  );
}
