import { useState } from "react";
import { useLocation } from "wouter";
import { DateTimePanel } from "@/components/DateTimePanel";
import { QuoteCarousel } from "@/components/QuoteCarousel";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [question, setQuestion] = useState("");

  const handleCast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    sessionStorage.setItem("divination_question", question.trim());
    setLocation("/divination");
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-[calc(100vh-57px)]">
      {/* Mobile compact datetime strip */}
      <div className="md:hidden">
        <DateTimePanel compact />
      </div>

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full">
        {/* Left: DateTime (desktop only) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:flex md:w-[45%] items-center min-h-full"
        >
          <DateTimePanel />
        </motion.div>

        {/* Center: Title + Form */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-0 border-r border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-lg"
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-[0.2em] text-primary mb-10">
              问易
            </h1>

            <div className="space-y-3 mb-12 pl-3 border-l border-primary/20 py-1">
              <p className="text-sm md:text-base leading-relaxed tracking-widest text-foreground/65 font-light">
                一切有为法，如梦幻泡影。
              </p>
              <p className="text-sm md:text-base leading-relaxed tracking-widest text-foreground/65 font-light">
                如露亦如电，应作如是观。
              </p>
            </div>

            <form onSubmit={handleCast} className="space-y-5 w-full max-w-md">
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
                className="px-10 py-3.5 bg-primary text-primary-foreground text-sm font-medium tracking-[0.25em] hover:bg-primary/90 transition-colors"
              >
                起卦
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right: Search + Quote Carousel — vertically centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full md:w-[29%] flex flex-col justify-center px-6 md:px-7 lg:px-8 py-8 md:py-0 border-t border-border md:border-t-0"
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
