import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroSequenceProps {
  scrollRef: React.RefObject<HTMLDivElement>;
  scrollYProgress: MotionValue<number>;
}

const FRAME_COUNT = 240;

const HeroSequence = ({ scrollRef, scrollYProgress }: HeroSequenceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const loaded: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/image/sequence2/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      if (i === 1) {
        img.onload = () => {
          if (canvasRef.current) {
            render(0);
          }
        };
      }
      loaded.push(img);
    }
    imagesRef.current = loaded;
  }, []);

  const render = (idxOverride?: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const progress = scrollYProgress.get();
    const idx = idxOverride !== undefined ? idxOverride : Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(progress * (FRAME_COUNT - 1)))
    );

    const img = imagesRef.current[idx];
    if (img && (img.complete || idx === 0) && img.naturalWidth > 0) {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      canvas.width = cw;
      canvas.height = ch;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  };

  useEffect(() => {
    let raf: number;
    const loop = () => {
      render();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const handleResize = () => {
      render();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollYProgress]);

  return (
    <section ref={scrollRef} className="relative h-[600vh] bg-black">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Dark layers for readability */}
        <motion.div 
          className="absolute inset-0 bg-black/40"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 0.3, 0.5, 0.8]) }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

        {/* Content Layers */}
        <div className="relative h-full container mx-auto px-6">
          
          {/* 0% Scroll: CENTER (Intro) */}
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.01, 0.05, 0.12, 0.18], [0, 1, 1, 0]),
              y: useTransform(scrollYProgress, [0, 0.15], [50, -50])
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          >
            <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">LOG: KELAHIRAN</p>
            <h1 className="font-display font-black text-[clamp(2.5rem,10vw,7rem)] uppercase tracking-tighter leading-none text-white mb-6 italic">
              CERITA <br /> <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '2px white' }}>KAMI.</span>
            </h1>
            <p className="font-body text-base md:text-lg text-white/50 max-w-lg mx-auto leading-relaxed uppercase font-bold tracking-widest">
              DARI PUNCAK TERTINGGI HINGGA <span className="text-white">DALAMNYA HUTAN TROPIS.</span> SETIAP GEAR ADALAH CERITA KETANGGUHAN.
            </p>
          </motion.div>

          {/* 30% Scroll: LEFT (Origins) */}
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.22, 0.30, 0.42, 0.48], [0, 1, 1, 0]),
              x: useTransform(scrollYProgress, [0.22, 0.3], [-50, 0])
            }}
            className="absolute inset-y-0 left-6 md:left-20 flex flex-col items-start justify-center pointer-events-none max-w-2xl"
          >
            <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">FILOSOFI KAMI</p>
            <h2 className="font-display font-black text-[clamp(2rem,8vw,5rem)] text-white uppercase leading-none tracking-tighter mb-6 italic">
              LAHIR DI <br />
              <span className="text-orange-600 text-transparent stroke-orange-600" style={{ WebkitTextStroke: '1.5px #ea580c' }}>KAKI GUNUNG</span> <br />
              GEDE.
            </h2>
            <p className="font-body text-sm md:text-lg text-white/50 max-w-md leading-relaxed uppercase font-bold tracking-widest">
              KAMI TIDAK MEMBUAT GEAR DI ATAS MEJA KERJA. KAMI MENEMPANNYA DI TERJALNYA ALAM TROMIS ASLI SEJAK 2019.
            </p>
          </motion.div>

          {/* 60% Scroll: RIGHT (Innovation) */}
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.48, 0.56, 0.68, 0.74], [0, 1, 1, 0]),
              x: useTransform(scrollYProgress, [0.48, 0.56], [50, 0])
            }}
            className="absolute inset-y-0 right-6 md:right-20 flex flex-col items-end justify-center text-right pointer-events-none max-w-2xl"
          >
            <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">MANIFESTO</p>
            <h2 className="font-display font-black text-[clamp(2rem,8vw,5rem)] text-white uppercase leading-none tracking-tighter mb-6 italic">
              JAHITAN <br />
              ADALAH <br />
              <span className="text-orange-600">KEAMANAN.</span>
            </h2>
            <p className="font-body text-sm md:text-lg text-white/50 max-w-md leading-relaxed uppercase font-bold tracking-widest ml-auto">
              SETIAP JAHITAN DIUJI OLEH RIUHAN HUJAN DAN TERIKNYA MATAHARI — UNTUK MEMASTIKAN LO SELALU SIAP HADAPI APAPUN.
            </p>
          </motion.div>

          {/* 90% Scroll: CENTER (CTA) */}
          <motion.div 
            style={{ 
              opacity: useTransform(scrollYProgress, [0.76, 0.85, 1, 1], [0, 1, 1, 1]),
              scale: useTransform(scrollYProgress, [0.76, 1], [0.95, 1])
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
          >
             <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">MISI TERAKHIR</p>
             <h2 className="font-display font-black text-[clamp(2.5rem,9vw,6rem)] text-white uppercase leading-none tracking-tighter mb-10 italic">
                READY TO <br />
                <span className="text-orange-600 text-transparent stroke-orange-600" style={{ WebkitTextStroke: '2px #ea580c' }}>CONQUER?</span>
             </h2>
             <div className="pointer-events-auto">
                <button className="bg-orange-600 text-white px-12 py-5 font-display font-black uppercase tracking-[0.2em] italic hover:bg-white hover:text-black transition-all rounded-none group flex items-center gap-4 text-sm">
                    PELAJARI KOLEKSI <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.03], [1, 0]) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30"
        >
          <span className="text-[10px] uppercase font-black tracking-widest italic animate-pulse">SCROLL TO START LOG</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-600 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSequence;
