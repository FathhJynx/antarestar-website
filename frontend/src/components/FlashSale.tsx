import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, ArrowRight, ShoppingBag, Flame, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductSkeleton from "@/components/ProductSkeleton";

const FlashSale = () => {
  const { data: flashSaleProducts = [], isLoading } = useQuery({
    queryKey: ['flash-sale-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { is_flash_sale: true, limit: 3 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw.slice(0,3).map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
        image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
        price: p.variants?.[0]?.price || 0,
        originalPrice: p.variants?.[0]?.price ? p.variants?.[0]?.price * 1.2 : null,
        flashSalePrice: (p.variants?.[0]?.price || 0) * 0.7,
        stockLevel: 30,
        category: p.category?.name || "Equipment"
      }));
    }
  });

  // 4-hour countdown
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const fmt = (s: number) => ({ h: String(Math.floor(s / 3600)).padStart(2, '0'), m: String(Math.floor((s % 3600) / 60)).padStart(2, '0'), s: String(s % 60).padStart(2, '0') });
  const { h, m, s } = fmt(timeLeft);

  if (!isLoading && flashSaleProducts.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-[#0c0c0c] relative overflow-hidden text-white">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
      {/* Red glow */}
      <motion.div animate={{ opacity: [0.15, 0.35, 0.15] }} transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-red-600/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-padding relative z-10">
        <div className="section-container">

          {/* Header row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)]"
              >
                <Zap className="w-7 h-7 fill-current text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="font-body text-xs font-bold uppercase tracking-[0.25em] text-orange-400">Penawaran Terbatas</span>
                </div>
                <h2 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight text-white">
                  Flash Sale ⚡
                </h2>
                <p className="font-body text-sm text-white/60 mt-0.5">Harga terendah hanya hari ini. Stok sangat terbatas!</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-start sm:items-end gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-white/60">
                <Timer className="w-3.5 h-3.5" /> Berakhir dalam
              </div>
              <div className="flex items-center gap-1.5 font-display font-black text-2xl md:text-3xl">
                {[h, m, s].map((unit, i) => (
                  <React.Fragment key={i}>
                    <motion.div
                      key={unit}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-xl min-w-[52px] text-center shadow-lg"
                    >
                      {unit}
                    </motion.div>
                    {i < 2 && <span className="text-red-500 text-xl">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[400px]">
                  <ProductSkeleton />
                </div>
              ))
            ) : (
              flashSaleProducts.map((product: any, idx: number) => {
                const stock = product.stockLevel || 60;
                const isHot = stock > 80;
                const originalPrice = product.originalPrice || product.price;
                const flashPrice = product.flashSalePrice!;
                const discountPct = Math.round(((originalPrice - flashPrice) / originalPrice) * 100);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden border-2 border-transparent hover:border-red-500 transition-all duration-300 group flex flex-col"
                  >
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="relative aspect-square bg-muted block overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-red-600 text-white font-display font-black text-lg px-3 py-1 rounded-lg shadow-md" style={{ transform: 'rotate(-3deg)' }}>
                        -{discountPct}%
                      </div>
                      {isHot && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <Flame className="w-3 h-3" /> Hampir Habis!
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-grow text-foreground">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-display font-bold text-base leading-tight line-clamp-2 mb-3 hover:text-red-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-end gap-3 mb-4">
                        <span className="font-display font-black text-2xl text-red-600">
                          Rp {flashPrice.toLocaleString('id-ID')}
                        </span>
                        <span className="font-body text-sm text-gray-400 line-through mb-0.5">
                          Rp {originalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Stock bar */}
                      <div className="mt-auto space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold font-body">
                          <span className="text-gray-500 uppercase tracking-wider">Stok tersisa</span>
                          <span className={isHot ? 'text-red-600' : 'text-orange-500'}>{100 - stock}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stock}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.3 + idx * 0.2 }}
                            className={`h-full rounded-full ${isHot ? 'bg-red-500' : 'bg-orange-400'}`}
                          />
                        </div>
                      </div>

                      <Link to={`/product/${product.id}`} className="mt-4 flex items-center justify-center gap-2 h-10 bg-red-600 hover:bg-red-700 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors group/btn">
                        <ShoppingBag className="w-4 h-4" /> Ambil Sekarang <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 animate-pulse" />
              <p className="font-body text-sm text-white/70">
                <span className="text-white font-bold">Ribuan item</span> sudah terjual minggu ini. Jangan sampai kehabisan giliran kamu!
              </p>
            </div>
            <Link to="/store" className="shrink-0 flex items-center gap-1.5 font-display font-bold text-sm text-accent uppercase tracking-wider hover:text-accent/80 transition-colors">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FlashSale;
