import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Flame, ShoppingBag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductSkeleton from "@/components/ProductSkeleton";

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

const FlashSaleSection = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data: activeCampaign, isLoading } = useQuery({
    queryKey: ['active-flash-sale'],
    queryFn: async () => {
      const res = await api.get('/promotions/flash-sales');
      const campaigns = res.data.data || [];
      return campaigns[0] || null;
    }
  });

  useEffect(() => {
    if (activeCampaign?.end_date) {
      const interval = setInterval(() => {
        const end = new Date(activeCampaign.end_date).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCampaign]);

  const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  const FLASH = activeCampaign?.products?.map((fsp: any) => {
    const p = fsp.product;
    if (!p) return null;
    const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
    
    return {
      id: String(p.id),
      name: String(p.name),
      image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
      price: Number(activeVariant?.price || 0),
      flashSalePrice: activeVariant?.is_on_flash_sale ? Number(activeVariant.flash_sale_price) : Number(activeVariant?.price || 0),
      saleStock: fsp.sale_stock,
    };
  }).filter(Boolean) || [];

  const rp = (n: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

  if (!isLoading && !activeCampaign) return null;

  return (
    <section className="py-16 md:py-24 bg-transparent relative overflow-hidden border-t border-white/5">
      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "28px 28px" }} />
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header row */}
        <InView className="mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(234,88,12,0.4)]">
                <Zap className="w-6 h-6 text-white fill-current" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">Gercep Ya!</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight">Promo Kilat!</h2>
              </div>
            </div>
            {/* Countdown */}
            <div>
              <p className="font-body text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5 text-right">Berakhir dalam</p>
              <div className="flex items-center gap-1.5 font-display font-black text-xl sm:text-2xl">
                {[h, m, s].map((u, i) => (
                  <React.Fragment key={i}>
                    <span className="bg-orange-500 text-white px-2.5 py-1 rounded-xl min-w-[44px] text-center shadow">{u}</span>
                    {i < 2 && <span className="text-orange-400 text-lg">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </InView>

        {/* Product cards */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-5">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="group shrink-0 w-[240px] sm:w-[260px] snap-start h-[350px]">
                 <ProductSkeleton />
              </div>
            ))
          ) : FLASH.map((p: any, i: number) => {
            const orig  = p.price;
            const flash = p.flashSalePrice;
            const pct   = orig > 0 ? Math.round(((orig - flash) / orig) * 100) : 0;
            const stock = p.saleStock || 0;
            const isLowStock = stock < 10;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="group shrink-0 w-[280px] sm:w-auto snap-start flex flex-col h-full bg-transparent"
              >
                {/* image */}
                <div className="relative block aspect-[4/5] bg-[#111111] overflow-hidden mb-4">
                  <Link to={`/product/${p.id}`} className="absolute inset-0 block">
                    <img src={p.image} alt={p.name} loading="lazy"
                      className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal opacity-80 group-hover:opacity-100 transition-all duration-[1.2s] group-hover:scale-105" />
                  </Link>
                  <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
                    <span className="bg-orange-500 text-white font-display font-black text-[10px] px-2 py-1 uppercase tracking-widest leading-none">
                      -{pct}%
                    </span>
                    {isLowStock && stock > 0 && (
                      <span className="bg-red-600 text-white font-display font-black text-[9px] px-2 py-1 uppercase tracking-widest leading-none mt-1">
                        Hampir Habis
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex pointer-events-none">
                    <Link to={`/product/${p.id}`} className="pointer-events-auto flex-1 h-12 bg-white text-black hover:bg-orange-500 hover:text-white font-display font-black text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center justify-center shadow-xl">
                      Ambil Gear
                    </Link>
                  </div>
                </div>

                {/* info */}
                <div className="flex flex-col flex-1 px-1">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-display font-black text-sm uppercase leading-snug tracking-tight mb-2 text-white group-hover:text-orange-500 transition-colors line-clamp-2">{p.name}</h3>
                  </Link>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="font-display font-black text-xl text-orange-500">{rp(flash)}</span>
                    <span className="font-body text-xs text-white/20 line-through pb-0.5">{rp(orig)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
