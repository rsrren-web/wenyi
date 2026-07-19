import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5">
      <div className="text-7xl text-primary/40 hexagram-symbol">䷿</div>
      <h1 className="text-2xl tracking-[0.25em] text-white">此路未济</h1>
      <Link href="/" className="text-sm tracking-widest text-primary hover:underline">返回首页</Link>
    </div>
  );
}
