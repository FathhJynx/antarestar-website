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
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <FadeIn className="mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(220,38,38,0.5)]">
                <Zap className="w-6 h-6 text-white fill-current" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">Stok Terbatas</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight">Flash Sale</h2>
              </div>
            </div>
            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 text-right">Berakhir dalam</p>
              <div className="flex items-center gap-1.5 font-display font-black text-xl sm:text-2xl">
                {[h, m, s].map((u, i) => (
                  <React.Fragment key={i}>
                    <span className="bg-red-600 text-white px-2.5 py-1 rounded-xl min-w-[44px] text-center shadow">{u}</span>
                    {i < 2 && <span className="text-red-500 text-lg">:</span>}
                  </React.Fragment>
                ))}
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

        <FadeIn delay={0.3} className="mt-8 text-center">
          <Link to="/store" className="inline-flex items-center gap-2 h-11 px-8 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors">
            Lihat Semua Sale <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
};

export default FlashSaleSection;
