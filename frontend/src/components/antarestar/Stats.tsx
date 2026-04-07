import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1] as const;

const CountUp = ({ end, suffix = "", duration = 2.5 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 4); // easeOutQuart
      setCount(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const stats = [
  { value: 10000, suffix: "+", label: "Products Sold", color: "text-white" },
  { value: 5, suffix: " Climates", label: "Tested In", color: "text-orange-500" },
  { value: 100, suffix: "%", label: "Satisfaction", color: "text-white" },
  { value: 7, suffix: " Years", label: "Of Craft", color: "text-white" },
];

const Stats = () => (
  <section className="relative py-32 md:py-40 bg-black border-y border-white/[0.06] overflow-hidden">
    {/* Ambient */}
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/[0.04] blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />

    <div className="max-w-7xl mx-auto px-8 md:px-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mb-20 md:mb-24"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-orange-500" />
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">By The Numbers</p>
        </div>
        <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight leading-none">
          Numbers Don't Lie
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 md:gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease }}
            className="text-center md:text-left"
          >
            <h4 className={`font-display font-black text-5xl md:text-[4.5rem] leading-none mb-4 tracking-tight ${s.color}`}>
              <CountUp end={s.value} suffix={s.suffix} />
            </h4>
            <div className="w-8 h-[1px] bg-white/10 mx-auto md:mx-0 mb-3" />
            <p className="font-body text-white/40 uppercase tracking-[0.25em] text-[10px] font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
