import { useEffect, useRef, useState } from 'react';
import { ImageDown, Loader2 } from 'lucide-react';
import type { ProcessedHexagram } from '@/data/hexagrams';
import type { DivinationRecord } from '@/lib/divination-record';
import { generateShareCard } from '@/lib/share-card';

export function DownloadDivination({ record, hexagram }: { record: DivinationRecord; hexagram: ProcessedHexagram }) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'downloaded' | 'error'>('idle');
  const busy = useRef(false);
  const mounted = useRef(true);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; clearTimeout(resetTimer.current); };
  }, []);

  const download = async () => {
    if (busy.current) return;
    busy.current = true;
    clearTimeout(resetTimer.current);
    setStatus('generating');
    let url: string | undefined;
    try {
      url = await generateShareCard({ ...hexagram, question: record.question });
      if (!mounted.current) {
        URL.revokeObjectURL(url);
        return;
      }
      const link = document.createElement('a');
      link.href = url;
      const date = new Date(record.createdAt).toLocaleDateString('zh-CN').replace(/\//g, '-');
      link.download = `问易_${hexagram.name}卦_${date}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Give the browser time to consume the image before releasing its URL.
      const downloadedUrl = url;
      window.setTimeout(() => URL.revokeObjectURL(downloadedUrl), 30_000);
      setStatus('downloaded');
      resetTimer.current = setTimeout(() => setStatus('idle'), 2400);
    } catch {
      if (url) URL.revokeObjectURL(url);
      if (mounted.current) setStatus('error');
    } finally {
      busy.current = false;
    }
  };

  return (
    <div className="space-y-3">
      <button type="button" onClick={download} disabled={status === 'generating'} className="flex items-center gap-2 border border-primary/50 px-8 py-3 text-sm tracking-[0.25em] text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50">
        {status === 'generating' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageDown className="h-3.5 w-3.5" />}
        <span aria-live="polite">{status === 'generating' ? '生成中…' : status === 'downloaded' ? '已生成并下载' : '生成图片'}</span>
      </button>
      {status === 'error' && <p role="alert" className="text-sm text-primary">图片生成失败，请重试。本次起卦结果已保留。</p>}
    </div>
  );
}
