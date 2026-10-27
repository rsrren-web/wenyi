import { Link, useRoute } from 'wouter';
import { getHexagramById } from '@/data/hexagrams';
import { HexagramDetails } from '@/components/HexagramDetails';

export default function HexagramDetail() {
  const [, params] = useRoute('/hexagrams/:id');
  const value = params?.id ?? '';
  const id = /^\d+$/.test(value) ? Number(value) : NaN;
  const hexagram = Number.isInteger(id) ? getHexagramById(id) : undefined;

  if (!hexagram) {
    return (
      <div className="flex min-h-[calc(100vh-57px)] flex-col items-center justify-center gap-4">
        <p className="text-base text-foreground/70">未能找到该卦象信息</p>
        <Link href="/hexagrams" className="text-sm tracking-widest text-primary hover:underline">返回六十四卦</Link>
      </div>
    );
  }

  return <HexagramDetails hexagram={hexagram} />;
}
