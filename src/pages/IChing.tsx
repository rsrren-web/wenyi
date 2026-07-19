import { motion } from "framer-motion";

export default function IChing() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl min-h-[calc(100vh-89px)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="space-y-16"
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl font-zcool tracking-[0.3em] text-primary mb-6">易经</h1>
          <p className="text-xl text-foreground/80 tracking-widest font-light">
            大道之源，群经之首
          </p>
        </div>

        <div className="prose prose-invert prose-lg max-w-none font-light leading-loose tracking-wide">
          <p className="indent-8 text-xl text-foreground/90 mb-8">
            《易经》不仅是一部占卜之书，更是中国古人关于宇宙运行规律的哲学总集。它以“太极生两仪，两仪生四象，四象生八卦”为底层逻辑，推演世间万物的发展变化。
          </p>

          <div className="my-12 p-8 border border-primary/20 bg-card relative">
            <h3 className="text-2xl font-zcool text-primary mb-4 tracking-widest text-center mt-0">核心理念</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg text-primary/90 font-medium mb-2">变易</h4>
                <p className="text-foreground/80 m-0">世间万物无时无刻不在变化，唯一不变的就是“变”本身。</p>
              </div>
              <div>
                <h4 className="text-lg text-primary/90 font-medium mb-2">简易</h4>
                <p className="text-foreground/80 m-0">宇宙运转的规律虽然浩瀚复杂，但其背后的道却是简单而纯粹的。</p>
              </div>
              <div>
                <h4 className="text-lg text-primary/90 font-medium mb-2">不易</h4>
                <p className="text-foreground/80 m-0">在千变万化之中，有其恒定不变的法则，顺应这些法则，即是顺应天道。</p>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-zcool text-primary mt-16 mb-8 tracking-widest">八卦基础</h3>
          <p className="indent-8 text-foreground/80">
            八卦代表了构成宇宙的八种基本元素，两两相叠，形成了六十四卦，象征事物的六十四种情境。
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 not-prose">
            {[
              { name: "乾", symbol: "☰", elem: "天", attr: "健" },
              { name: "坤", symbol: "☷", elem: "地", attr: "顺" },
              { name: "震", symbol: "☳", elem: "雷", attr: "动" },
              { name: "巽", symbol: "☴", elem: "风", attr: "入" },
              { name: "坎", symbol: "☵", elem: "水", attr: "陷" },
              { name: "离", symbol: "☲", elem: "火", attr: "丽" },
              { name: "艮", symbol: "☶", elem: "山", attr: "止" },
              { name: "兑", symbol: "☱", elem: "泽", attr: "悦" },
            ].map((bagua) => (
              <div key={bagua.name} className="flex flex-col items-center p-6 border border-border bg-background/50 text-center">
                <span className="text-5xl text-primary font-sans mb-4">{bagua.symbol}</span>
                <span className="text-xl font-zcool tracking-widest mb-2">{bagua.name}为{bagua.elem}</span>
                <span className="text-sm text-foreground/60 tracking-widest">属性：{bagua.attr}</span>
              </div>
            ))}
          </div>

          <h3 className="text-3xl font-zcool text-primary mt-16 mb-8 tracking-widest">占卜之道</h3>
          <p className="indent-8 text-foreground/80">
            “善易者不占”。易经的真正智慧不在于预测吉凶，而在于指引我们在不同的人生境遇下，应持有什么样的人生态度，采取什么样的行动。处泰卦之境时不骄奢，处否卦之境时不绝望，方为君子之道。
          </p>
        </div>
      </motion.div>
    </div>
  );
}
