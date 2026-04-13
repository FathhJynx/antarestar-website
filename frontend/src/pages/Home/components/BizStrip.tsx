import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Award, Gift, ArrowRight } from "lucide-react";

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

const BizStrip = () => {
  return (
    <section className="py-24 md:py-32 section-padding bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none" />

      <InView className="mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-1 bg-orange-500" />
            <p className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Gak Cuma Jualan</p>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.9] tracking-tighter max-w-2xl">
            Dunia<br />Antarestar
          </h2>
        </div>
        <p className="font-body text-sm text-white/50 max-w-xs md:text-right uppercase tracking-widest font-bold leading-relaxed">
          Platform terpadu untuk pendakian, bisnis, dan kemitraan tanpa batas.
        </p>
      </InView>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.08] border border-white/[0.08] relative z-10">
        {[
          {
            to: "/corporate",
            icon: Building2,
            title: "Grosir /\nKantor",
            desc: "Bikin seragam tim atau perlengkapan kantor lo di sini.",
            points: ["Harga grosir", "Custom bordir", "Kirim Nasional"],
            cta: "Konsultasi",
          },
          {
            to: "/affiliate",
            icon: Award,
            title: "Misi\nCuan",
            desc: "Cuma share link doang bisa dapet komisi sampe 15% per transaksi.",
            points: ["Komisi 15%", "Daftar Gratis", "Dashboard Real-time"],
            cta: "Join Sekarang",
          },
          {
            to: "/member",
            icon: Gift,
            title: "Basecamp\nMember",
            desc: "Kumpulin poin dan sikat hadiah spesial khusus explorer.",
            points: ["Earn Points", "Diskon Tier", "Hadiah Ulang Tahun"],
            cta: "Gabung",
          },
        ].map((card, i) => (
          <motion.div 
            key={card.title} 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8, ease }}
            className="bg-black p-10 lg:p-14 group hover:bg-orange-600 transition-all duration-700 cursor-default"
          >
            <div className="flex justify-between items-start mb-12">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:border-white transition-all duration-500 shadow-xl">
                <card.icon className="w-8 h-8 text-orange-500 group-hover:text-orange-600" />
              </div>
              <span className="font-display font-black text-4xl text-white/5 group-hover:text-white/20 transition-colors italic">0{i+1}</span>
            </div>
            
            <h3 className="font-display font-black text-3xl text-white uppercase tracking-tight mb-4 whitespace-pre-line leading-none group-hover:translate-x-2 transition-transform duration-500 italic">
              {card.title}
            </h3>
            <p className="font-body text-sm text-white/40 group-hover:text-white/80 mb-10 leading-relaxed font-medium">
              {card.desc}
            </p>
            
            <ul className="space-y-3 mb-12">
              {card.points.map(p => (
                <li key={p} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/60">
                  <div className="w-1 h-1 bg-orange-500 rounded-full" /> {p}
                </li>
              ))}
            </ul>

            <Link to={card.to} className="inline-flex items-center gap-3 font-display font-black text-[11px] uppercase tracking-[0.2em] text-orange-500 group-hover:text-white transition-colors">
              {card.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BizStrip;
