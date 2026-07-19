import { useState } from "react";
import { Maximize2, X } from "lucide-react";

export function HexagramImage({ src, alt, onError }: { src: string; alt: string; onError: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => loaded && setOpen(true)}
        className="group relative flex h-[340px] w-full max-w-[320px] items-center justify-center overflow-hidden border border-border/40 bg-black/40"
        aria-label={`放大查看${alt}`}
      >
        {!loaded && <span className="h-8 w-8 animate-pulse border border-primary/25 bg-primary/5" />}
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={onError}
          className={`max-h-full max-w-full object-contain transition-opacity ${loaded ? "opacity-90" : "absolute opacity-0"}`}
        />
        {loaded && (
          <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center border border-border bg-black/80 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-3.5 w-3.5" />
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-5" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <button type="button" aria-label="关闭图片" onClick={() => setOpen(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-border text-foreground/60 hover:text-primary">
            <X className="h-5 w-5" />
          </button>
          <img src={src} alt={alt} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={event => event.stopPropagation()} />
        </div>
      )}
    </>
  );
}
