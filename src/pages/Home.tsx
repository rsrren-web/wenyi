import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { DateTimePanel } from "@/components/DateTimePanel";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { motion } from "framer-motion";
import { getAllHexagrams } from "@/data/hexagrams";
import { createDivinationRecord, saveDivinationRecord } from "@/lib/divination-record";

export default function Home() {
  const [, setLocation] = useLocation();
  const [question, setQuestion] = useState("");
  const [castError, setCastError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleCast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setCastError("");
    try {
      const record = createDivinationRecord(question, getAllHexagrams().map(h => h.id));
      saveDivinationRecord(window.sessionStorage, record);
      setLocation("/divination");
    } catch {
      setCastError("暂时无法保存本次起卦，请允许浏览器保存本站数据后重试。");
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-57px)]">
      {/* Mobile compact datetime strip */}
      <div className="lg:hidden">
        <DateTimePanel compact />
      </div>

      {/* Main layout */}
      <div className="flex w-full flex-1 flex-col lg:grid lg:grid-cols-[24%_52%_24%] lg:items-stretch">
        {/* Left: DateTime (desktop only) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden min-h-full items-center lg:flex"
        >
          <DateTimePanel />
        </motion.div>

        {/* Center: Title + Form */}
        <div className="flex w-full flex-col justify-center px-6 py-14 sm:px-10 lg:border-r lg:border-border/50 lg:px-12 lg:py-10 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mx-auto w-full max-w-xl"
          >
            <h1 className="mb-10 text-center text-6xl font-light tracking-[0.2em] text-primary md:text-8xl">
              问易
            </h1>

            <div className="mx-auto mb-12 max-w-md space-y-3 py-1 text-center">
              <p className="text-sm md:text-base leading-relaxed tracking-widest text-foreground/65 font-light">
                一切有为法，如梦幻泡影。
              </p>
              <p className="text-sm md:text-base leading-relaxed tracking-widest text-foreground/65 font-light">
                如露亦如电，应作如是观。
              </p>
            </div>

            <form onSubmit={handleCast} className="mx-auto w-full max-w-md space-y-5">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="请输入您的问题……"
                  className="w-full bg-card border border-border px-5 py-4 text-sm tracking-wider text-foreground/85 placeholder:text-foreground/35 focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary px-10 py-3.5 text-sm font-medium tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {submitting ? '正在起卦…' : '起卦'}
              </button>
              {castError && <p role="alert" className="text-sm leading-relaxed text-primary">{castError}</p>}
            </form>
          </motion.div>
        </div>

        {/* Right: Search + Quote Carousel — vertically centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex w-full flex-col justify-center border-t border-border px-6 py-10 sm:px-10 lg:border-t-0 lg:px-6 lg:py-10 xl:px-8"
        >
          <div className="text-[10px] tracking-[0.35em] text-foreground/45 uppercase mb-4">
            六十四卦 · 随机探索
          </div>
          <QuoteCarousel />
        </motion.div>
      </div>
    </div>
  );
}
