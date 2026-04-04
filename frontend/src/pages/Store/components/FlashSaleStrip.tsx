import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductSkeleton from "@/components/ProductSkeleton";
import { rp } from "@/utils/formatters";
import { useCountdown } from "@/hooks/useCountdown";

const FlashSaleStrip = () => {
  const { data: flashData, isLoading } = useQuery({
    queryKey: ['flash-strip-api'],
    queryFn: async () => {
      const res = await api.get('/promotions/flash-sales');
      const campaigns = res.data?.data || [];
      const campaign = campaigns[0];
      if (!campaign || !campaign.products?.length) return null;

      const endDate = new Date(campaign.end_date);
      const remainingSeconds = Math.max(0, Math.floor((endDate.getTime() - Date.now()) / 1000));

      const items = campaign.products.slice(0, 4).map((fsp: any) => {
        const p = fsp.product;
        if (!p) return null;
        const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
        const originalPrice = Number(activeVariant?.price || 0);
        const flashPrice = activeVariant?.is_on_flash_sale ? Number(activeVariant.flash_sale_price) : originalPrice;
        return {
          id: String(p.id),
          name: String(p.name),
          image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
          price: originalPrice,
          flashSalePrice: flashPrice,
          saleStock: fsp.sale_stock || 0,
          category: p.category?.name || "Equipment"
        };
      }).filter(Boolean);

      return { items, remainingSeconds, campaignName: campaign.name };
    }
  });

  const items = flashData?.items || [];
  const { h, m, s } = useCountdown(flashData?.remainingSeconds ?? 0);

  if (!isLoading && !items.length) return null;

  return (
    <section className="py-8 md:py-12 bg-primary relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[400px] h-[150px] bg-red-600/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1 }}
              className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              <Zap className="w-5 h-5 text-white fill-current" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">Stok Terbatas</span>
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase text-white tracking-tight">Flash Sale</h2>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-display font-black text-lg sm:text-xl">
            {[h, m, s].map((u, i) => (
              <React.Fragment key={i}>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-lg min-w-[38px] text-center shadow">{u}</span>
                {i < 2 && <span className="text-red-500 text-base">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-6 sm:px-0">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[240px] sm:w-[260px] h-full">
                <ProductSkeleton />
              </div>
            ))
          ) : (
            items.map((p: any) => {
              const orig = p.price;
              const flash = p.flashSalePrice;
              const pct = orig > 0 ? Math.round(((orig - flash) / orig) * 100) : 0;
              const stock = p.saleStock || 0;
              return (
                <Link key={p.id} to={`/product/${p.id}`}
                  className="group flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-2xl overflow-hidden snap-start">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img src={p.image} alt={p.name} loading="lazy"
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                    {pct > 0 && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white font-display font-black text-sm px-2 py-0.5 rounded-lg" style={{ transform: "rotate(-3deg)" }}>
                        -{pct}%
                      </span>
                    )}
                    {stock < 10 && stock > 0 && (
                      <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                        <Flame className="w-2.5 h-2.5" /> Hampir Habis
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-display font-bold text-xs leading-snug line-clamp-2 mb-1.5 group-hover:text-red-600 transition-colors">{p.name}</h3>
                    <div className="flex items-end gap-1.5 mb-2">
                      <span className="font-display font-black text-base text-red-600">{rp(flash)}</span>
                      {pct > 0 && <span className="font-body text-[10px] text-gray-400 line-through pb-0.5">{rp(orig)}</span>}
                    </div>
                    {stock > 0 && (
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[9px] font-bold font-body text-gray-500">
                          <span>Sisa {stock} item</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashSaleStrip;
