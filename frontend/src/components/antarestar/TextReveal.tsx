import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TextReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 35%"]
  });

  const paragraph = "We don't just make gear — we engineer confidence. Every Antarestar product is born from obsessive testing in the harshest environments on Earth. Because when you're 4,000 meters above sea level, there's no room for compromise.";
  const words = paragraph.split(" ");

  return (
    <section ref={containerRef} className="relative py-48 md:py-64 px-8 md:px-20 lg:px-32 bg-black overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/[0.03] blur-[150px] rounded-full pointer-events-none" />
      
      {/* Side accent */}
      <motion.div
        style={{ scaleY: scrollYProgress }}
        className="absolute left-8 md:left-20 top-48 w-[1px] h-48 bg-gradient-to-b from-orange-500 to-transparent origin-top hidden md:block"
      />

      <div className="max-w-5xl mx-auto relative z-10">
        <p className="font-body text-[10px] uppercase tracking-[0.5em] text-orange-500/60 mb-12 font-medium">Our Philosophy</p>
        <p className="font-display font-black text-[clamp(1.5rem,4vw,4.5rem)] leading-[1.1] tracking-[-0.02em]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <motion.span
                key={i}
                style={{
                  color: useTransform(scrollYProgress, [start, end], ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.95)"]),
                }}
                className="inline-block mr-[0.3em] will-change-[color]"
              >
                {word}
              </motion.span>
            );
          })}
        </p>
      </div>
    </section>
  );
};

export default TextReveal;
