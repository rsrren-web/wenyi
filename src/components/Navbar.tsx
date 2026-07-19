import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "首页" },
    { href: "/hexagrams", label: "六十四卦" },
    { href: "/iching", label: "易经" },
    { href: "/about", label: "关于" },
  ];

  return (
    <nav className="w-full py-4 px-5 md:px-10 flex items-center justify-between border-b border-border bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 group">
        <span className="text-lg font-medium tracking-[0.15em] text-primary transition-colors group-hover:text-primary/80">
          问易
        </span>
      </Link>

      <div className="flex gap-6 items-center">
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
      </div>
    </nav>
  );
}
