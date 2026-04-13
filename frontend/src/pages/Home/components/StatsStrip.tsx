import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ease = [0.16, 1, 0.3, 1] as const;

const InView = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}
    transition={{ duration: 0.7, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

const StatsStrip = () => {
  const { data: stats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const res = await api.get('/stats');
      return res.data.data;
    },
    staleTime: 60000,
  });

  const displayStats = [
    { n: stats?.sold?.display || "10 K+",  l: "Gear Terjual" },
    { n: stats?.explorers?.display || "5.0 K+",  l: "Explorer Aktif" },
    { n: stats?.rating?.display || "4.9 ★",  l: "Puas Banget" },
    { n: stats?.experience?.display || "7 Thn",  l: "Udah Berpengalaman" },
  ];

  return (
    <div className="bg-primary border-b border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {displayStats.map((s, i) => (
            <InView key={s.l} delay={i * 0.08}>
              <div className="text-center">
                <p className="font-display font-black text-3xl md:text-4xl text-accent mb-1 leading-none tracking-tighter italic">{s.n}</p>
                <p className="font-body text-[10px] md:text-[11px] text-white/50 uppercase tracking-[0.2em]">{s.l}</p>
              </div>
            </InView>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsStrip;
