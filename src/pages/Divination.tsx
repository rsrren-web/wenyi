import { useState } from 'react';
import { Link } from 'wouter';
import { getHexagramById } from '@/data/hexagrams';
import { HexagramDetails } from '@/components/HexagramDetails';
import { DownloadDivination } from '@/components/DownloadDivination';
import { readDivinationRecord, type SavedDivination } from '@/lib/divination-record';

function loadSavedResult(): SavedDivination {
  try {
    return readDivinationRecord(window.sessionStorage);
  } catch {
    return { status: 'unavailable' };
  }
}

export default function Divination() {
  const [saved] = useState(loadSavedResult);
  const record = saved.status === 'ready' ? saved.record : undefined;
  const hexagram = record ? getHexagramById(record.hexagramId) : undefined;

  if (!record || !hexagram) {
    const message = saved.status === 'unavailable'
      ? '暂时无法读取本次起卦记录，请允许浏览器保存本站数据后重试。'
      : saved.status === 'missing'
        ? '尚无起卦记录，请先在首页输入所问之事。'
        : '本次起卦记录无法读取，请返回首页重新起卦。';
    return (
      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-4 px-5 text-center">
        <p role="status" className="text-base text-foreground/75">{message}</p>
        <Link href="/" className="text-sm tracking-widest text-primary hover:underline">返回首页</Link>
      </div>
    );
  }

  return (
    <HexagramDetails
      hexagram={hexagram}
      question={record.question}
      actions={<DownloadDivination key={record.id} record={record} hexagram={hexagram} />}
    />
  );
}
