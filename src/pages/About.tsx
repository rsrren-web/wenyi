import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl min-h-[calc(100vh-89px)] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="space-y-12 text-center"
      >
        <div className="w-16 h-16 mx-auto border-2 border-primary rotate-45 flex items-center justify-center mb-8">
          <div className="w-8 h-8 border border-primary/50"></div>
        </div>

        <h1 className="text-4xl font-zcool tracking-[0.4em] text-primary mb-8">关于问易</h1>
        
        <div className="space-y-8 text-lg font-light tracking-wider leading-loose text-foreground/80">
          <p>
            「问易」是一座建构在数字世界中的星空庙宇。
          </p>
          <p>
            在这个喧嚣、浮躁、瞬息万变的现代社会，我们希望为您提供一个可以片刻安顿心灵的静谧之所。
          </p>
          <p>
            这里的每一次起卦，不是迷信的断定，而是一次与内心深处自我的对话。<br/>
            借助三千年前的智慧，照亮当下的迷惘。
          </p>
          <p className="text-primary/80 font-zcool text-xl mt-12">
            心诚则灵，道法自然。
          </p>
        </div>
        
        <div className="pt-24 text-sm text-foreground/40 tracking-widest font-light">
          © {new Date().getFullYear()} 问易 · 探寻内心指引
        </div>
      </motion.div>
    </div>
  );
}
