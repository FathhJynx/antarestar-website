import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section ref={ref} className="relative py-48 md:py-64 bg-black flex items-center justify-center overflow-hidden border-t border-white/[0.06]">
      {/* Glow */}
      <motion.div
        style={{ y: bgY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-orange-600/[0.08] blur-[180px] rounded-full pointer-events-none"
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ y: textY }}
        className="relative z-10 text-center px-8 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold mb-8">Mulai Perjalanan Lo</p>
          <h2 className="font-display font-black text-5xl md:text-[clamp(4rem,10vw,9rem)] text-white uppercase tracking-[-0.04em] leading-[0.85] mb-6">
            Siap buat<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">misi lo</span><br/>
            berikutnya?
          </h2>
          <p className="font-body text-sm md:text-base text-white/40 mb-14 max-w-lg mx-auto leading-relaxed">
            Cek koleksi lengkap gear outdoor kita yang udah teruji tempur. Dibuat buat performa, didesain buat selamanya.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/store"
              className="group relative inline-flex items-center gap-3 h-14 px-10 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_28px_rgba(234,88,12,0.35)]"
            >
              <span>Gas Cek Koleksi</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-3 h-14 px-10 border border-white/20 text-white hover:bg-white/5 font-display font-black text-sm uppercase tracking-wider rounded-xl transition-colors"
            >
              Cerita Kita
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
