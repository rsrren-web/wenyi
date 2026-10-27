import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";

export function HexagramImage({ src, alt, onError }: { src: string; alt: string; onError: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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

      {open && createPortal(
        <dialog ref={dialogRef} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-black/95 p-5 open:flex" aria-label={alt} onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
          <button type="button" autoFocus aria-label="关闭图片" onClick={() => setOpen(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-border text-foreground/60 hover:text-primary">
            <X className="h-5 w-5" />
          </button>
          <img src={src} alt={alt} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={event => event.stopPropagation()} />
        </dialog>, document.body
      )}
    </>
  );
}
