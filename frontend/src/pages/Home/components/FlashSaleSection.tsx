import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Flame, ShoppingBag, ArrowRight } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import { useCountdown } from "@/hooks/useCountdown";
import { rp } from "@/utils/formatters";
import api from "@/lib/api";

const ease = [0.16, 1, 0.3, 1] as const;

// Fallback image since relations might not be fully loaded
import fallbackImg from "@/assets/hero-outdoor.jpg";

const FlashSaleSection = () => {
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [targetDate, setTargetDate] = useState<Date>(new Date(Date.now() + 24 * 3600 * 1000));
  
  useEffect(() => {
    api.get('/promotions/flash-sales').then(res => {
      const data = res.data?.data || [];
      if (data.length > 0) {
        setTargetDate(new Date(data[0].end_date));
        const prods = data[0].products || [];
        setFlashSales(prods.map((fp: any) => ({
           id: fp.product_variant.product_id, // we map to product details
           name: fp.product_variant.product.name,
           image: fallbackImg,
           price: parseFloat(fp.product_variant.price),
           flashSalePrice: parseFloat(fp.sale_price),
           stockLevel: fp.sale_stock,
        })));
      }
    }).catch(console.warn);
  }, []);

  const diffMs = Math.max(0, targetDate.getTime() - Date.now());
  const { h, m, s } = useCountdown(Math.floor(diffMs / 1000));

  if (!flashSales.length) return null;

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#050505]">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[50%] bg-orange-600/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] grain" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <FadeIn className="mb-14 md:mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="relative group">
              {/* Floating Badge */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">Live Now</span>
              </motion.div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="relative">
                  <motion.div 
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }} 
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(220,38,38,0.3)] relative z-10"
                  >
                    <Zap className="w-10 h-10 md:w-12 md:h-12 text-white fill-current" />
                  </motion.div>
                  {/* Decorative glow behind icon */}
                  <div className="absolute inset-0 bg-red-600 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-red-600/50" />
                    <span className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-orange-400">Limited Collection</span>
                  </div>
                  <h2 className="font-display font-black text-5xl md:text-7xl lg:text-8xl uppercase text-white tracking-tighter leading-[0.9] flex flex-col">
                    <span className="text-white">Flash</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 italic -mt-2">Sale</span>
                  </h2>
                </div>
              </div>
            </div>

            <div className="lg:mb-4">
              <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group/timer">
                {/* Background glow in timer */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-600/10 blur-2xl rounded-full group-hover/timer:bg-red-600/20 transition-colors" />
                
                <p className="font-body text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-5 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-orange-500" /> Offer Ends In
                </p>
                
                <div className="flex items-end gap-4">
                  {[
                    { val: h, label: "Hours" },
                    { val: m, label: "Mins" },
                    { val: s, label: "Secs" }
                  ].map((item, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <span className="font-display font-black text-4xl md:text-5xl text-white min-w-[60px] md:min-w-[70px] text-center block tracking-tighter">
                            {item.val}
                          </span>
                        </div>
                        <span className="font-body text-[8px] font-bold uppercase tracking-widest text-white/30">{item.label}</span>
                      </div>
                      {i < 2 && (
                        <span className="font-display font-black text-2xl text-red-600/50 mb-6 animate-pulse">:</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-5">
          {flashSales.map((p, i) => {
            const orig  = p.price;
            const flash = p.flashSalePrice;
            const pct   = orig > 0 ? Math.round(((orig - flash) / orig) * 100) : 0;
            const stock = p.stockLevel;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="bg-white rounded-2xl overflow-hidden group shrink-0 w-[280px] sm:w-auto snap-start shadow-sm border border-white/5 sm:shadow-none"
              >
                <Link to={`/product/${p.id}`} className="relative block aspect-square bg-muted overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy"
                    className="w-full h-full object-cover p-4 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-display font-black text-base px-2.5 py-1 rounded-lg" style={{ transform: "rotate(-3deg)" }}>
                    -{pct}%
                  </span>
                  {stock < 10 && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      <Flame className="w-3 h-3" /> Hampir Habis
                    </span>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 mb-2 hover:text-red-600 transition-colors">{p.name}</h3>
                  </Link>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="font-display font-black text-xl text-red-600">{rp(flash)}</span>
                    <span className="font-body text-xs text-gray-400 line-through pb-0.5">{rp(orig)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold font-body text-gray-500">
                      <span>Sisa</span><span className="text-red-500">{stock} pcs</span>
                    </div>
                  </div>
                  <Link to={`/product/${p.id}`}
                    className="mt-3 flex items-center justify-center gap-2 h-9 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors">
                    <ShoppingBag className="w-3.5 h-3.5" /> Ambil Sekarang
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <FadeIn delay={0.3} className="mt-16 text-center">
          <Link to="/store" className="inline-flex items-center gap-4 group/btn">
            <span className="font-display font-black text-lg uppercase tracking-tighter text-white/60 group-hover/btn:text-white transition-colors">Lihat Semua Sale</span>
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover/btn:border-red-600/50 group-hover/btn:bg-red-600 transition-all duration-500">
              <ArrowRight className="w-6 h-6 text-white group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};

export default FlashSaleSection;
