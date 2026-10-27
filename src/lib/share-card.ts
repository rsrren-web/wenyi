/* ── Canvas text-wrap helper ─────────────────────────────────── */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let line = '';
  for (const char of text) {
    if (char === '\r') continue;
    if (char === '\n') { lines.push(line); line = ''; continue; }
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
export async function generateShareCard(params: {
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
  const W = 900;
  const PAD = 56;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建图片画布');

  const cjk  = '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';
  const sans  = `"Inter", ${cjk}`;

  ctx.font = `26px ${cjk}`;
  const qLines = wrapText(ctx, `「${params.question}」`, W - PAD * 2);
  ctx.font = `22px ${cjk}`;
  const dLines = wrapText(ctx, params.duanyiTianji, W - PAD * 2);
  const boxW = (W - PAD * 2 - 16) / 2;
  ctx.font = `18px ${cjk}`;
  const aLines = wrapText(ctx, params.advice ?? '', boxW - 32);
  const wLines = wrapText(ctx, params.warning ?? '', boxW - 32);
  const boxH = Math.max(96, 52 + Math.max(aLines.length, wLines.length) * 26);
  const H = Math.max(1240, 804 + qLines.length * 38 + dLines.length * 34 + boxH);
  canvas.height = H;

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
  dLines.forEach(l => { ctx.fillText(l, PAD, y); y += 34; });
  y += 20;

  /* ── 宜 / 忌 ──────────────────────────────────────── */
  if (params.advice || params.warning) {

    if (params.advice) {
      ctx.strokeStyle = 'rgba(162,196,221,0.28)';
      ctx.lineWidth = 1;
      ctx.strokeRect(PAD, y, boxW, boxH);
      ctx.font = `13px ${cjk}`;
      ctx.fillStyle = '#A2C4DD';
      ctx.fillText('宜', PAD + 16, y + 24);
      ctx.font = `18px ${cjk}`;
      ctx.fillStyle = 'rgba(237,254,255,0.75)';
      aLines.forEach((l, i) => ctx.fillText(l, PAD + 16, y + 52 + i * 26));
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
      wLines.forEach((l, i) => ctx.fillText(l, x2 + 16, y + 52 + i * 26));
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

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(URL.createObjectURL(blob));
      else reject(new Error('图片生成失败'));
    }, 'image/png');
  });
}
