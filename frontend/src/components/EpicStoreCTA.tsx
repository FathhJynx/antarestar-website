import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-outdoor.jpg";

const EpicStoreCTA = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const textX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const textX2 = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-[#050505] flex flex-col items-center justify-center border-t border-white/10"
    >
      {/* Parallax Background Images */}
      <motion.div 
        className="absolute inset-0 w-full h-[140%] -top-[20%] pointer-events-none"
        style={{ y: bgY }}
      >
        <img 
          src={heroImg} 
          alt="Antarestar Explore"
          className="w-full h-full object-cover mix-blend-luminosity opacity-40 blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-[#050505]" />
        
        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </motion.div>

      {/* Massive Parallax Typography */}
      <div className="absolute inset-0 flex flex-col justify-center gap-8 pointer-events-none overflow-hidden mix-blend-overlay z-10 opacity-30">
        <motion.h2 
          style={{ x: textX1 }}
          className="whitespace-nowrap font-display font-black text-[clamp(6rem,15vw,20rem)] uppercase text-white leading-none tracking-tighter"
        >
          TIDAK ADA BATASAN BATASAN BATASAN
        </motion.h2>
        <motion.h2 
          className="whitespace-nowrap font-display font-black text-[clamp(6rem,15vw,20rem)] uppercase text-transparent stroke-text leading-none tracking-tighter"
          style={{ x: textX2, WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
        >
          HANYA ADA PERJALANAN PERJALANAN
        </motion.h2>
      </div>

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           viewport={{ once: true }}
           className="w-16 h-1 bg-orange-500 mb-8"
        />
        
        <motion.h3 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter text-white mb-6"
        >
          Bergabung<br/>Dengan Elite
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-body text-sm sm:text-base text-white/50 max-w-lg mb-10"
        >
          Kekuatan, ketahanan, dan presisi di setiap langkah. Bergabunglah dengan Antarestar Explorer Hub dan dapatkan akses prioritas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <Link 
            to="/member" 
            className="group flex items-center gap-4 bg-orange-500 text-white font-display font-black uppercase tracking-widest text-xs px-8 py-5 transition-all hover:bg-white hover:text-black overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              Daftar Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EpicStoreCTA;
