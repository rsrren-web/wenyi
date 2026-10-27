import { useState, type ReactNode } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import type { ProcessedHexagram } from "@/data/hexagrams";
import { motion } from "framer-motion";
import { YaoLineDiagram } from "@/components/YaoLineDiagram";
import { RelatedHexagramSection } from "@/components/RelatedHexagramSection";
import { BackToTop } from "@/components/BackToTop";
import { ReadingNav } from "@/components/ReadingNav";
import { HexagramImage } from "@/components/HexagramImage";
import { YaoLinesDetail } from "@/components/YaoLinesDetail";

interface HexagramDetailsProps {
  hexagram: ProcessedHexagram;
  question?: string;
  actions?: ReactNode;
}

export function HexagramDetails(props: HexagramDetailsProps) {
  // A new hexagram gets fresh image, accordion and reading-navigation state.
  return <HexagramDetailsContent key={props.hexagram.id} {...props} />;
}

function HexagramDetailsContent({ hexagram, question, actions }: HexagramDetailsProps) {
  const id = hexagram.id;
  const [imageError, setImageError] = useState(false);
  const ext = hexagram;

  const imgId = String(hexagram.id).padStart(2, "0");
  const imgSrc = `${import.meta.env.BASE_URL}images/${imgId}-yaoxiang.jpg`;
  const hasImage = !imageError;
  const hasExplanation = !!(ext.guaImageExplanation?.length);
  const hasTuchen = !!ext.tuchen;
  const hasImageSection = hasImage || hasExplanation || hasTuchen;
  const hasSituation = !!(hexagram.duanyiTianji || hexagram.advice || hexagram.warning);
  const hasClassics = !!(hexagram.guaci || hexagram.xiangci || hexagram.poem || hexagram.folkJudgment);
  const readingItems = [
    ...(hasSituation ? [{ id: "situation", label: hexagram.duanyiTianji ? "情势研判" : "宜忌" }] : []),
    ...(hasClassics ? [{ id: "classics", label: "经典文本" }] : []),
    ...(hexagram.explanation ? [{ id: "interpretation", label: "综合解读" }] : []),
    ...(hasImageSection ? [{ id: "image", label: "图像" }] : []),
    { id: "lines", label: "爻位" },
    { id: "related", label: "关联卦象" },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 xl:max-w-[76rem] xl:pl-8 xl:pr-64">
      {/* Breadcrumbs */}
      <nav aria-label="面包屑" className="flex flex-wrap items-center text-sm text-foreground/50 tracking-widest mb-12">
        <Link href="/" className="hover:text-primary transition-colors">首页</Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-foreground/30" />
        <Link href="/hexagrams" className="hover:text-primary transition-colors">六十四卦</Link>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-foreground/30" />
        <span className="text-primary/80">{hexagram.name}卦</span>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-16"
      >
        {question && (
          <section aria-label="所问之事" className="break-words border-b border-border pb-8">
            <div className="mb-3 text-xs tracking-[0.4em] text-foreground/50">所问之事</div>
            <h2 className="text-xl font-light tracking-wider text-white">「{question}」</h2>
          </section>
        )}
        {/* ══════════════════════════════════════════
            HERO — 卦象身份
        ══════════════════════════════════════════ */}
        <div className="border-b border-border pb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Symbol + name + meta */}
            <div className="flex items-center gap-5 flex-1">
              <div className="text-[64px] sm:text-[88px] leading-none text-primary hexagram-symbol shrink-0">
                {hexagram.symbol}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-light tracking-[0.2em] text-white mb-2">
                  {hexagram.name}卦
                </h1>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm tracking-widest text-foreground/60 mb-2">
                  <span>{hexagram.palace}宫</span>
                  <span>·</span>
                  <span>{hexagram.element}</span>
                  <span>·</span>
                  <span>{hexagram.palaceLevel}</span>
                </div>
                {ext.coreMeaning && (
                  <div className="text-sm text-primary tracking-wide">{ext.coreMeaning}</div>
                )}
              </div>
            </div>
            {/* Yao diagram */}
            <div className="shrink-0">
              <YaoLineDiagram lines={hexagram.lines} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            § 1  情势研判 + 宜忌
        ══════════════════════════════════════════ */}
        {hasSituation && <div id="situation" className="scroll-mt-24 space-y-6">
          <SectionTitle label={hexagram.duanyiTianji ? "情势研判" : "宜 · 忌"} />
          {hexagram.duanyiTianji && <p className="text-lg leading-loose text-foreground/90 tracking-wide">
            {hexagram.duanyiTianji}
          </p>}
          {(ext.advice || ext.warning) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {ext.advice && (
                <div className="p-5 border border-primary/30 bg-primary/5">
                  <div className="text-xs tracking-[0.35em] text-primary uppercase mb-3">宜</div>
                  <p className="text-base text-foreground/85 leading-relaxed">{ext.advice}</p>
                </div>
              )}
              {ext.warning && (
                <div className="p-5 border border-border bg-muted/30">
                  <div className="text-xs tracking-[0.35em] text-foreground/65 uppercase mb-3">忌</div>
                  <p className="text-base text-foreground/80 leading-relaxed">{ext.warning}</p>
                </div>
              )}
            </div>
          )}
        </div>}

        {/* ══════════════════════════════════════════
            § 2  经典文本
        ══════════════════════════════════════════ */}
        {hasClassics && <div id="classics" className="scroll-mt-24 space-y-10">
          <SectionTitle label="经典文本" />
          <div className="space-y-8">
            {hexagram.guaci && <div>
              <FieldLabel label="卦辞" />
              <p className="text-xl font-light leading-relaxed text-white tracking-wider mt-2">
                {hexagram.guaci}
              </p>
            </div>}
            {hexagram.xiangci && <div>
              <FieldLabel label="象辞" />
              <p className="text-lg leading-relaxed text-foreground/90 tracking-wide mt-2">
                {hexagram.xiangci}
              </p>
            </div>}
            {hexagram.poem && (
              <div className="py-5 border-y border-border/50 text-center space-y-1.5">
                {hexagram.poem.split('\n').map((line, i) => (
                  <p key={i} className="text-base tracking-[0.45em] text-foreground/70">{line}</p>
                ))}
              </div>
            )}
            {hexagram.folkJudgment && <div className="p-5 border border-border bg-card">
              <FieldLabel label="民间断语" />
              <p className="text-base leading-relaxed text-foreground/85 tracking-wide mt-2">
                {hexagram.folkJudgment}
              </p>
            </div>}
          </div>
        </div>}

        {/* ══════════════════════════════════════════
            § 3  综合解读
        ══════════════════════════════════════════ */}
        {hexagram.explanation && <div id="interpretation" className="scroll-mt-24 space-y-4">
          <SectionTitle label="综合解读" />
          <p className="text-base leading-loose text-foreground/80 tracking-wide">
            {hexagram.explanation}
          </p>
        </div>}

        {/* ══════════════════════════════════════════
            § 4  图像专区  ——  全宽双列
        ══════════════════════════════════════════ */}
        {hasImageSection && (
          <div id="image" className="scroll-mt-24 space-y-6">
            <SectionTitle label="图像参考" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">

              {/* 左列 — 《天纪》卦图 */}
              {hasImage && (
                <div className="flex flex-col items-center justify-start p-7 border-b lg:border-b-0 lg:border-r border-border bg-card/50">
                  <div className="text-[10px] tracking-[0.45em] text-foreground/50 uppercase mb-5 self-start">
                    《天纪》卦图
                  </div>
                  <HexagramImage
                    src={imgSrc}
                    alt={`${hexagram.name}卦图`}
                    onError={() => setImageError(true)}
                  />
                </div>
              )}

              {/* 右列 — 图象解说 + 图谶参考 */}
              {(hasExplanation || hasTuchen) && (
                <div className={`flex flex-col p-7 gap-8 ${!hasImage ? 'lg:col-span-2' : ''}`}>
                  {hasExplanation && (
                    <div>
                      <div className="text-[10px] tracking-[0.45em] text-primary/75 uppercase mb-4">
                        图象解说
                      </div>
                      <div className="space-y-3">
                        {ext.guaImageExplanation!.map((item, i) => (
                          <p key={i} className="text-sm leading-relaxed text-foreground/75 tracking-wide">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {hasTuchen && (
                    <div className={hasExplanation ? 'pt-6 border-t border-border/50' : ''}>
                      <div className="text-[10px] tracking-[0.45em] text-foreground/50 uppercase mb-4">
                        图谶参考
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/65 italic tracking-wide">
                        {ext.tuchen}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            § 5  爻位详表
        ══════════════════════════════════════════ */}
        <div id="lines" className="scroll-mt-24 space-y-4">
          <SectionTitle label="爻位详表" />
          <YaoLinesDetail lines={hexagram.lines} />
        </div>

        {/* ══════════════════════════════════════════
            § 6  关联卦象
        ══════════════════════════════════════════ */}
        <div id="related" className="scroll-mt-24">
          <RelatedHexagramSection
            mutual={hexagram.relatedHexagrams.mutual}
            opposite={hexagram.relatedHexagrams.opposite}
            reversed={hexagram.relatedHexagrams.reversed}
          />
        </div>

        {/* ══════════════════════════════════════════
            导航
        ══════════════════════════════════════════ */}
        {actions && <div className="border-t border-border pt-10">{actions}</div>}
        <nav aria-label="卦象浏览" className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-10">
          <Link href="/hexagrams" className="px-6 py-3 border border-border text-foreground/65 text-sm tracking-[0.25em] hover:border-foreground/40 hover:text-foreground/90 transition-colors">
              返回六十四卦
          </Link>
          <div className="flex gap-3">
            {id > 1 && (
              <Link href={`/hexagrams/${id - 1}`} className="px-4 py-3 border border-border text-foreground/65 text-sm tracking-wider hover:border-primary/50 hover:text-primary transition-colors">
                  ← 上一卦
              </Link>
            )}
            {id < 64 && (
              <Link href={`/hexagrams/${id + 1}`} className="px-4 py-3 border border-border text-foreground/65 text-sm tracking-wider hover:border-primary/50 hover:text-primary transition-colors">
                  下一卦 →
              </Link>
            )}
          </div>
        </nav>
      </motion.div>
      <ReadingNav items={readingItems} />
      <BackToTop />
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-5 h-px bg-primary/60" />
      <span className="text-xs tracking-[0.3em] text-primary/80 uppercase">{label}</span>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <span className="text-[10px] tracking-[0.35em] text-foreground/50 uppercase">{label}</span>
  );
}
