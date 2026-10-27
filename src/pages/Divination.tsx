import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useCastDivination } from "@/lib/local-api";
import { motion } from "framer-motion";
import { YaoLineDiagram } from "@/components/YaoLineDiagram";
import { RelatedHexagramSection } from "@/components/RelatedHexagramSection";
import { BackToTop } from "@/components/BackToTop";
import { ReadingNav } from "@/components/ReadingNav";
import { HexagramImage } from "@/components/HexagramImage";
import { YaoLinesDetail } from "@/components/YaoLinesDetail";
import { Loader2, ImageDown } from "lucide-react";

/* ── Canvas text-wrap helper ─────────────────────────────────── */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let line = '';
  for (const char of text) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line.length > 0) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* ── Share card image generator ─────────────────────────────── */
async function generateShareCard(params: {
  symbol: string;
  name: string;
  id: number;
  palace: string;
  element: string;
  palaceLevel: string;
  coreMeaning?: string;
  question: string;
  duanyiTianji: string;
  advice?: string;
  warning?: string;
}): Promise<string> {
  const W = 900, H = 1240;
  const PAD = 56;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  const cjk  = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';
  const sans  = `"Inter", ${cjk}`;

  /* Background */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  /* Outer border */
  ctx.strokeStyle = '#1c1c1c';
  ctx.lineWidth = 1;
  ctx.strokeRect(PAD - 16, PAD - 16, W - (PAD - 16) * 2, H - (PAD - 16) * 2);

  /* ── Header ───────────────────────────────────────── */
  ctx.font = `500 20px ${sans}`;
  ctx.fillStyle = '#A2C4DD';
  ctx.textAlign = 'left';
  ctx.fillText('问  易', PAD, PAD + 18);

  ctx.font = `16px ${cjk}`;
  ctx.fillStyle = 'rgba(237,254,255,0.35)';
  ctx.textAlign = 'right';
  ctx.fillText(`第 ${params.id} 卦`, W - PAD, PAD + 18);

  ctx.fillStyle = '#A2C4DD';
  ctx.fillRect(PAD, PAD + 32, W - PAD * 2, 0.5);

  /* ── Symbol ───────────────────────────────────────── */
  ctx.font = `160px ${cjk}`;
  ctx.fillStyle = '#A2C4DD';
  ctx.textAlign = 'center';
  ctx.fillText(params.symbol, W / 2, PAD + 210);

  /* Name */
  ctx.font = `300 58px ${cjk}`;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${params.name}卦`, W / 2, PAD + 290);

  /* Meta */
  ctx.font = `20px ${cjk}`;
  ctx.fillStyle = 'rgba(237,254,255,0.50)';
  ctx.fillText(`${params.palace}宫  ·  ${params.element}  ·  ${params.palaceLevel}`, W / 2, PAD + 330);

  if (params.coreMeaning) {
    ctx.font = `22px ${cjk}`;
    ctx.fillStyle = '#A2C4DD';
    ctx.fillText(params.coreMeaning, W / 2, PAD + 368);
  }

  /* ── Separator ────────────────────────────────────── */
  let y = 490;
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(PAD, y, W - PAD * 2, 1);
  y += 36;

  /* ── Question ─────────────────────────────────────── */
  ctx.font = `15px ${cjk}`;
  ctx.fillStyle = 'rgba(237,254,255,0.40)';
  ctx.textAlign = 'left';
  ctx.fillText('所问之事', PAD, y);
  y += 32;

  ctx.font = `26px ${cjk}`;
  ctx.fillStyle = '#FFFFFF';
  const qLines = wrapText(ctx, `「${params.question}」`, W - PAD * 2);
  qLines.forEach(l => { ctx.fillText(l, PAD, y); y += 38; });
  y += 16;

  /* ── Separator ────────────────────────────────────── */
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(PAD, y, W - PAD * 2, 1);
  y += 36;

  /* ── 情势研判 ──────────────────────────────────────── */
  ctx.font = `14px ${cjk}`;
  ctx.fillStyle = 'rgba(162,196,221,0.70)';
  ctx.fillText('情  势  研  判', PAD, y);
  y += 30;

  ctx.font = `22px ${cjk}`;
  ctx.fillStyle = 'rgba(237,254,255,0.82)';
  const dLines = wrapText(ctx, params.duanyiTianji, W - PAD * 2);
  dLines.slice(0, 5).forEach(l => { ctx.fillText(l, PAD, y); y += 34; });
  y += 20;

  /* ── 宜 / 忌 ──────────────────────────────────────── */
  if (params.advice || params.warning) {
    const boxW = (W - PAD * 2 - 16) / 2;
    const boxH = 96;

    if (params.advice) {
      ctx.strokeStyle = 'rgba(162,196,221,0.28)';
      ctx.lineWidth = 1;
      ctx.strokeRect(PAD, y, boxW, boxH);
      ctx.font = `13px ${cjk}`;
      ctx.fillStyle = '#A2C4DD';
      ctx.fillText('宜', PAD + 16, y + 24);
      ctx.font = `18px ${cjk}`;
      ctx.fillStyle = 'rgba(237,254,255,0.75)';
      const aLines = wrapText(ctx, params.advice, boxW - 32);
      aLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, PAD + 16, y + 52 + i * 26));
    }

    if (params.warning) {
      const x2 = PAD + boxW + 16;
      ctx.strokeStyle = 'rgba(237,254,255,0.10)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x2, y, boxW, boxH);
      ctx.font = `13px ${cjk}`;
      ctx.fillStyle = 'rgba(237,254,255,0.50)';
      ctx.fillText('忌', x2 + 16, y + 24);
      ctx.font = `18px ${cjk}`;
      ctx.fillStyle = 'rgba(237,254,255,0.65)';
      const wLines = wrapText(ctx, params.warning, boxW - 32);
      wLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, x2 + 16, y + 52 + i * 26));
    }

    y += boxH + 24;
  }

  /* ── Footer ────────────────────────────────────────── */
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(PAD, H - PAD - 24, W - PAD * 2, 1);
  ctx.font = `16px ${cjk}`;
  ctx.fillStyle = 'rgba(162,196,221,0.40)';
  ctx.textAlign = 'center';
  ctx.fillText('问  易  ·  天机流转', W / 2, H - PAD + 4);

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(URL.createObjectURL(blob!)), 'image/png');
  });
}

/* ══════════════════════════════════════════════════════════════
   Page component
══════════════════════════════════════════════════════════════ */
export default function Divination() {
  const [, setLocation] = useLocation();
  const { mutate: castDivination, data: result, isPending, error } = useCastDivination();
  const [imageError, setImageError] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const question = sessionStorage.getItem("divination_question");
    if (!question) { setLocation("/"); return; }
    castDivination({ data: { question } });
  }, [castDivination, setLocation]);

  const handleGenerateImage = async () => {
    if (!result) return;
    const { hexagram, question } = result;
    const ext = hexagram as typeof hexagram & {
      coreMeaning?: string; advice?: string; warning?: string;
    };
    setGenerating(true);
    try {
      const url = await generateShareCard({
        symbol: hexagram.symbol,
        name: hexagram.name,
        id: hexagram.id,
        palace: hexagram.palace,
        element: hexagram.element,
        palaceLevel: hexagram.palaceLevel,
        coreMeaning: ext.coreMeaning,
        question,
        duanyiTianji: hexagram.duanyiTianji,
        advice: ext.advice,
        warning: ext.warning,
      });
      const a = document.createElement('a');
      a.href = url;
      a.download = `问易_${hexagram.name}卦_${new Date().toLocaleDateString("zh-CN").replace(/\//g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2400);
    } finally {
      setGenerating(false);
    }
  };

  if (isPending || !result) {
    return (
      <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs tracking-[0.3em] text-foreground/60">天机流转，正在成卦…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-57px)] flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-foreground/65">起卦失败</p>
        <button onClick={() => setLocation("/")} className="text-xs text-primary hover:underline tracking-widest">
          返回首页
        </button>
      </div>
    );
  }

  const { hexagram, interpretation, question } = result;
  const ext = hexagram as typeof hexagram & {
    coreMeaning?: string;
    advice?: string;
    warning?: string;
    tuchen?: string;
    guaImageExplanation?: string[];
  };

  const imgId = String(hexagram.id).padStart(2, "0");
  const imgSrc = `${import.meta.env.BASE_URL}images/${imgId}-yaoxiang.jpg`;
  const hasImage = !imageError;
  const hasExplanation = !!(ext.guaImageExplanation?.length);
  const hasTuchen = !!ext.tuchen;
  const hasImageSection = hasImage || hasExplanation || hasTuchen;

  return (
    <div className="container mx-auto px-5 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-16"
      >

        {/* ══════════════════════════════════════════
            HERO — 所问之事 + 卦象身份
        ══════════════════════════════════════════ */}
        <div className="border-b border-border pb-12">
          {/* Question */}
          <div className="mb-10">
            <div className="text-xs tracking-[0.4em] text-foreground/50 uppercase mb-3">所问之事</div>
            <h2 className="text-xl font-light tracking-wider text-white">「{question}」</h2>
          </div>

          {/* Identity + Yao diagram */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
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
            <div className="shrink-0 mx-auto sm:mx-0">
              <YaoLineDiagram lines={hexagram.lines} />
            </div>
          </div>
        </div>

        {/* 宜忌 */}
        <div id="advice" className="scroll-mt-24 space-y-6">
          <SectionTitle label="宜 · 忌" />
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
        </div>

        {/* ══════════════════════════════════════════
            深度解读
        ══════════════════════════════════════════ */}
        <div id="interpretation" className="scroll-mt-24 space-y-10">
          <SectionTitle label="深度解读" />
          <div>
            <FieldLabel label="综合解读" />
            <p className="text-base leading-loose text-foreground/80 tracking-wide mt-3">
              {hexagram.explanation}
            </p>
          </div>
          <div className="border border-border bg-card p-7">
            <FieldLabel label="本卦解读" />
            <div className="mt-5 space-y-4 text-base leading-loose text-foreground/80 font-light">
              {interpretation.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    paragraph.startsWith('【')
                      ? 'text-primary font-medium tracking-wider mt-6 first:mt-0'
                      : 'tracking-wide'
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            § 4  图像专区
        ══════════════════════════════════════════ */}
        {hasImageSection && (
          <div id="image" className="scroll-mt-24 space-y-6">
            <SectionTitle label="图像参考" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border">
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
            操作区
        ══════════════════════════════════════════ */}
        <div className="flex gap-4 border-t border-border pt-10">
          <button
            onClick={handleGenerateImage}
            disabled={generating}
            className="flex items-center gap-2 px-8 py-3 border border-primary/50 text-primary text-sm tracking-[0.25em] hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <ImageDown className="w-3.5 h-3.5" />
            }
            {generating ? '生成中…' : downloaded ? '已生成并下载' : '生成图片'}
          </button>
          <Link href="/">
            <button className="px-8 py-3 border border-border text-foreground/65 text-sm tracking-[0.25em] hover:border-foreground/40 hover:text-foreground/90 transition-colors">
              返回首页
            </button>
          </Link>
        </div>
      </motion.div>
      <ReadingNav items={[
        { id: "advice", label: "宜忌" },
        { id: "interpretation", label: "深度解读" },
        { id: "image", label: "图像" },
        { id: "lines", label: "爻位" },
        { id: "related", label: "关联卦象" },
      ]} />
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
