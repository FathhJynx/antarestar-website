/**
 * HomePage — single unified component.
 *
 * All homepage sections live here so design, spacing, typography and colours
 * are guaranteed consistent. Only the complex/reusable units (Navbar, Footer,
 * HeroSection, MarqueeBanner, ProductCard, CommunityGallery, BrandStory)
 * are imported as shared components.
 *
 * Colour rhythm:  dark → light → dark → light → dark → light → dark
 * Section order:
 *   1. Hero            (dark – full-screen)
 *   2. Stats Strip     (dark – numbers)
 *   3. Marquee         (dark – divider band)
 *   4. Categories      (light – shop grid)
 *   5. Products        (light – 6 bestsellers)
 *   6. Flash Sale      (dark – urgency)
 *   7. Brand Story     (light – emotional)
 *   8. Business CTAs   (dark – corporate/affiliate/member)
 *   9. Community       (light – social proof)
 *  10. Newsletter      (dark – capture)
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Zap, Timer, Flame, Star, ShoppingBag,
  Building2, Award, Gift, Truck, ShieldCheck, Check,
  ChevronRight, Users
} from "lucide-react";

import Navbar          from "@/components/Navbar";
import Footer          from "@/components/Footer";
import HeroSection     from "@/pages/Home/components/HeroSection";
import MarqueeBanner   from "@/pages/Home/components/MarqueeBanner";
import CommunityGallery from "@/pages/Home/components/CommunityGallery";
import BrandStory      from "@/pages/Home/components/BrandStory";
import ProductCard     from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { products }    from "@/data/products";
import { useQuery }    from "@tanstack/react-query";
import api             from "@/lib/api";
import AnnouncementBanner from "@/pages/Home/components/AnnouncementBanner";

import heroImg       from "@/assets/hero-outdoor.jpg";
import lifestyleCamp from "@/assets/lifestyle-camping.jpg";
import lifestyleHike from "@/assets/lifestyle-hiker.jpg";
import community1    from "@/assets/community-1.jpg";
import community2    from "@/assets/community-2.jpg";

// ─── shared helpers ──────────────────────────────────────────
const rp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const fade = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const ease = [0.16, 1, 0.3, 1] as const;

const InView = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    variants={fade}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── 1. Stats Strip ──────────────────────────────────────────
const StatsStrip = () => {
  const { data: stats } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const res = await api.get('/stats');
      return res.data.data;
    },
    staleTime: 60000, // 1 minute
  });

  const displayStats = [
    { n: stats?.sold?.display || "10 K+",  l: stats?.sold?.label || "Produk Terjual" },
    { n: stats?.explorers?.display || "5.0 K+",  l: stats?.explorers?.label || "Penjelajah Aktif" },
    { n: stats?.rating?.display || "4.9 ★",  l: stats?.rating?.label || "Rating Pelanggan" },
    { n: stats?.experience?.display || "7 Thn",  l: stats?.experience?.label || "Dedikasi Outdoor" },
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

// ─── 2. Shop by Category ────────────────────────────────────────
// Categories are now fetched from API

// ─── Category card UI (shared by mobile + desktop layouts) ──
interface CategoryItem {
  name: string;
  img: string;
  href: string;
  count: number;
  big: boolean;
}

interface CatCardProps {
  cat: CategoryItem;
  big?: boolean;
  desktopFill?: boolean; // on desktop the parent grid cell determines height
}
const CategoryCardUI = ({ cat, big = false, desktopFill = false }: CatCardProps) => (
  <Link
    to={cat.href}
    className={`group relative flex flex-col justify-end overflow-hidden w-full bg-[#111111]
      ${desktopFill ? "h-full" : big ? "aspect-[16/7]" : "aspect-[4/5] sm:aspect-[4/3]"} 
      transition-all duration-500`}
  >
    <img src={cat.img} alt={cat.name} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
    
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
      <ArrowRight className="w-6 h-6 text-white" />
    </div>
    
    <div className="relative p-6 md:p-8">
      <p className="font-body text-[10px] text-white/60 font-bold uppercase tracking-[0.3em] mb-2">{String(cat.count).padStart(2, '0')} — Produk</p>
      <h3 className={`font-display font-black text-white uppercase tracking-tighter
        ${big ? "text-5xl sm:text-7xl leading-none" : "text-3xl sm:text-4xl leading-none"}`}>
        {cat.name}
      </h3>
    </div>
  </Link>
);

const ShopCategories = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      const raw = res.data.data || [];
      return raw.map((c: any, i: number) => ({
        name: c.name,
        img: c.image_url || [heroImg, lifestyleHike, community2, community1, lifestyleCamp][i % 5],
        href: `/store?category=${encodeURIComponent(c.name)}`,
        count: c.products_count || 0,
        big: i === 0
      }));
    }
  });

  const CATS = categories.length > 0 ? categories : [
    { name: "Jaket",       img: heroImg,        href: "/store?category=Jackets",     count: 0, big: true  },
    { name: "Tas",         img: lifestyleHike,  href: "/store?category=Bags",        count: 0, big: false },
    { name: "Aksesoris",   img: community2,     href: "/store?category=Accessories", count: 0, big: false },
    { name: "Alas Kaki",   img: community1,     href: "/store?category=Footwear",    count: 0, big: false },
    { name: "Pakaian",     img: lifestyleCamp,  href: "/store?category=Apparel",     count: 0,  big: false },
  ];

  return (
    <section className="py-16 md:py-24 bg-transparent border-t border-white/5 relative z-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <InView className="mb-10 md:mb-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-2">Pilih Gear Sesuai Kebutuhan Lo</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-none tracking-tight">
                Kategori Pilihan
              </h2>
            </div>
            <Link to="/store" className="inline-flex items-center gap-2 h-11 px-6 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors shrink-0">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </InView>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[440px]">
             <div className="md:col-span-2 md:row-span-2 bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
          </div>
        ) : (
          <>
            {/* ── Mobile layout ────────────────────────────────── */}
            <div className="md:hidden space-y-3">
              {/* Hero card: First Category */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, ease }}
              >
                <CategoryCardUI cat={CATS[0]} big />
              </motion.div>
              {/* 2×2 grid for rest */}
              <div className="grid grid-cols-2 gap-3">
                {CATS.slice(1, 5).map((c, i) => (
                  <motion.div key={c.name}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.65, delay: (i + 1) * 0.08, ease }}
                  >
                    <CategoryCardUI cat={c} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Desktop layout ───────────────────────────────── */}
            <div
              className="hidden md:grid md:grid-cols-4 gap-4"
              style={{ gridTemplateRows: "220px 220px" }}
            >
              {CATS.slice(0, 5).map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease }}
                  className={c.big ? "md:col-span-2 md:row-span-2" : ""}
                >
                  <CategoryCardUI cat={c} big={c.big} desktopFill />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// ─── 3. Best Sellers ────────────────────────────────────────
const BestSellers = () => {
  const { data: popular = [], isLoading } = useQuery({
    queryKey: ['popular-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { sort_by: 'popular', per_page: 6 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw.slice(0, 6).map((p: any) => {
        const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
        const isOnFlashSale = activeVariant?.is_on_flash_sale;
        
        return {
          id: String(p.id),
          name: String(p.name),
          image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
          price: Number(activeVariant?.price || 0),
          originalPrice: isOnFlashSale ? Number(activeVariant.price) : undefined,
          flashSalePrice: isOnFlashSale ? Number(activeVariant.flash_sale_price) : undefined,
          rating: p.reviews_avg_rating || p.rating || (p.reviews?.length > 0 ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length : 0),
          reviewCount: p.reviews_count || p.reviewCount || p.reviews?.length || 0,
          sold_count: p.sold_count || 0,
          category: p.category?.name || "Perlengkapan"
        };
      });
    }
  });

  // Use real data or empty array, no mock fallback
  const BEST = popular;

  return (
    <section className="pt-2 pb-16 md:pb-24 bg-transparent border-b border-white/5">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <InView className="mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-display font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Paling Banyak Dicari</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </InView>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : BEST.length > 0 ? (
            BEST.map((p: any, i: number) => (
              <ProductCard key={p.id} product={p as any} index={i} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-muted-foreground text-sm">Belum ada produk terlaris.</div>
          )}
        </div>
      </div>
    </section>
  );
};

// ─── 4. Flash Sale ──────────────────────────────────────────
const useCountdown = (totalSec: number) => {
  const [t, setT] = useState(totalSec);
  useEffect(() => { const id = setInterval(() => setT(x => Math.max(0, x - 1)), 1000); return () => clearInterval(id); }, []);
  return {
    h: String(Math.floor(t / 3600)).padStart(2, "0"),
    m: String(Math.floor((t % 3600) / 60)).padStart(2, "0"),
    s: String(t % 60).padStart(2, "0"),
  };
};

const FlashSaleSection = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data: activeCampaign, isLoading } = useQuery({
    queryKey: ['active-flash-sale'],
    queryFn: async () => {
      const res = await api.get('/promotions/flash-sales');
      // Get the first active campaign
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
      totalStockAfterSale: 100 
    };
  }).filter(Boolean) || [];

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
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400">Siapa Cepat Dia Dapat</span>
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight">Diskon Kilat</h2>
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

        {/* Product cards — Horizontal scroll on mobile, Grid on desktop */}
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
                  
                  {/* Minimalist Add to Cart on Image Hover */}
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
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-display font-black text-lg text-white">{rp(flash)}</span>
                    <span className="font-display font-bold text-[10px] text-white/30 line-through tracking-wider">{rp(orig)}</span>
                  </div>
                  {/* sleek stock indicator */}
                  <div className="mt-auto space-y-2 pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest font-display text-white/50">
                      <span>Sisa Stok</span><span className="text-orange-500">{stock}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <InView delay={0.3} className="mt-8 text-center">
          <Link to="/store" className="inline-flex items-center gap-2 h-14 px-8 border border-white/20 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors">
            Cek Semua Promo <ArrowRight className="w-4 h-4" />
          </Link>
        </InView>
      </div>
    </section>
  );
};

// ─── 5. Mega Sale CTA ───────────────────────────────────────
const MegaSaleCTA = () => {
  const { h, m, s } = useCountdown(12 * 3600 + 45 * 60);
  return (
    <section className="py-16 md:py-24 bg-transparent border-t border-white/5 relative z-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative bg-[#111111] overflow-hidden px-6 py-16 md:px-20 md:py-24 border-y border-white/[0.04]">
          {/* bg abstract structure */}
          <div className="absolute inset-0 opacity-[0.2]"
            style={{ backgroundImage: "linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)", backgroundSize: "4rem 4rem" }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-500/20 to-transparent pointer-events-none mix-blend-screen" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <InView>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-1 bg-accent" />
                <p className="font-display text-xs font-black uppercase tracking-[0.3em] text-accent">DISKON GEDE // 24 JAM</p>
              </div>
              <h2 className="font-display font-black text-5xl sm:text-6xl md:text-[5.5rem] text-white uppercase leading-[0.88] tracking-tighter mb-6">
                Hemat<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Mulai<br />DARI 50%</span>
              </h2>
              <p className="font-body text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-md italic">
                Stok terakhir musim ini nih. Jangan sampe gear premium incaran lo keburu diambil penjelajah lain.
              </p>
              {/* Serious Countdown */}
              <div className="mb-10">
                <p className="font-display text-[10px] text-white/30 uppercase tracking-[0.4em] font-black mb-3">Waktu Tersisa</p>
                <div className="flex items-end gap-3 font-display font-black text-4xl sm:text-5xl text-white tracking-widest">
                  {[h, m, s].map((u, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col">
                        <span>{u}</span>
                      </div>
                      {i < 2 && <span className="text-white/20 pb-1">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/store"
                  className="group inline-flex items-center gap-3 h-14 px-8 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_28px_rgba(234,88,12,0.35)]">
                  <ShoppingBag className="w-4 h-4" /> Gas Belanja <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/store" className="inline-flex items-center gap-2 h-14 px-8 border border-white/20 text-white hover:bg-white/5 font-display font-black text-[10px] uppercase tracking-widest rounded-xl transition-colors">
                  Katalog Diskon
                </Link>
              </div>
            </InView>

            {/* High-End Stats / Proof */}
            <InView delay={0.15}>
              <div className="grid grid-cols-2 gap-0 border-t border-l border-white/[0.06]">
                {[
                  { icon: Star,        n: "4.8/5",   l: "RATING RATA-RATA" },
                  { icon: Users,       n: "50K+",    l: "PENJELAJAH AKTIF" },
                  { icon: ShieldCheck, n: "100%",    l: "TERJAMIN AMAN" },
                  { icon: Truck,       n: "3 HARI",  l: "PENGIRIMAN CEPAT" },
                ].map((s, i) => (
                  <div key={s.l} className="p-8 border-b border-r border-white/[0.06] bg-black/20 flex flex-col items-start gap-4">
                    <h3 className="font-display font-black text-3xl md:text-4xl text-white tracking-tighter">{s.n}</h3>
                    <p className="font-display text-[9px] text-white/40 leading-snug uppercase tracking-[0.2em] font-bold">{s.l}</p>
                  </div>
                ))}
              </div>
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── 6. Business CTA Strip ──────────────────────────────────
const BizStrip = () => (
  <section className="py-24 md:py-32 bg-[#050505] relative z-10 border-t border-white/[0.04]">
    <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
      <InView className="mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-1 bg-orange-500" />
            <p className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">Beyond Commerce</p>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-[0.9] tracking-tighter max-w-2xl">
            Ekosistem<br />Antarestar
          </h2>
        </div>
        <p className="font-body text-sm text-white/50 max-w-xs md:text-right uppercase tracking-widest font-bold">
          Platform terpadu untuk pendakian, bisnis, dan kemitraan tanpa batas.
        </p>
      </InView>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.08] border border-white/[0.08]">
        {[
          {
            to: "/corporate",
            icon: Building2,
            title: "Pesanan\nPerusahaan",
            desc: "Seragam tim, merchandise event & perlengkapan lapangan.",
            points: ["Harga grosir", "Custom bordir", "Kirim Nasional"],
            cta: "Konsultasi",
          },
          {
            to: "/affiliate",
            icon: Award,
            title: "Program\nAfiliasi",
            desc: "Bagikan link produk dan dapatkan komisi hingga 15% per transaksi.",
            points: ["Komisi 15%", "Daftar Gratis", "Dashboard Real-time"],
            cta: "Join Sekarang",
          },
          {
            to: "/member",
            icon: Gift,
            title: "Klub\nMember",
            desc: "Pengumpulan poin dan keuntungan eksklusif tier Explorer hingga Summit.",
            points: ["Earn Points", "Diskon Tier", "Hadiah Ulang Tahun"],
            cta: "Gabung",
          },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1, ease }}>
            <Link to={card.to} className="group relative flex flex-col h-full bg-black hover:bg-white p-8 md:p-12 transition-colors duration-500 overflow-hidden">
              
              {/* Massive background index */}
              <div className="absolute -bottom-10 -right-4 font-display font-black text-[12rem] leading-none text-white/[0.02] group-hover:text-black/[0.03] transition-colors duration-500 pointer-events-none tracking-tighter">
                0{i + 1}
              </div>

              <div className="w-12 h-12 flex items-center justify-center mb-10 bg-white/5 group-hover:bg-black/5 transition-colors duration-500">
                <card.icon className="w-6 h-6 text-white group-hover:text-black transition-colors duration-500" />
              </div>
              
              <h3 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tighter mb-4 text-white group-hover:text-black transition-colors duration-500 whitespace-pre-line leading-[0.9]">
                {card.title}
              </h3>
              
              <p className="font-body text-xs leading-relaxed mb-10 flex-1 text-white/50 group-hover:text-black/60 transition-colors duration-500 font-bold uppercase tracking-widest">
                {card.desc}
              </p>
              
              <ul className="space-y-3 mb-10 border-t border-white/10 group-hover:border-black/10 pt-6 transition-colors duration-500">
                {card.points.map(pt => (
                  <li key={pt} className="flex items-center gap-3 font-display text-[10px] uppercase font-black tracking-widest text-white/70 group-hover:text-black/70 transition-colors duration-500">
                    <Check className="w-4 h-4 text-orange-500" />{pt}
                  </li>
                ))}
              </ul>
              
              <div className="flex items-center mt-auto gap-4 text-orange-500 font-display font-black text-xs uppercase tracking-[0.2em] group-hover:gap-6 transition-all duration-500">
                {card.cta} <ArrowRight className="w-5 h-5 text-white group-hover:text-black transition-colors duration-500" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── 7. Newsletter ──────────────────────────────────────────
const NewsletterStrip = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="py-16 md:py-20 bg-primary border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <InView className="max-w-2xl mx-auto text-center">
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-3">Dapetin Infonya Duluan</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase mb-4 tracking-tight">
            Jangan Ketinggalan<br />Promo Eksklusif Kami
          </h2>
          <p className="font-body text-sm text-white/50 mb-8 lowercase tracking-wide font-medium italic">Subscribe dan dapatkan notifikasi diskon kilat, produk baru, dan kode voucher langsung ke email lo.</p>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 h-12 text-accent font-display font-bold">
                <Check className="w-5 h-5" /> Mantap! Kamu sudah terdaftar.
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 1 }}
                onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
                className="flex gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com" required
                  className="flex-1 h-14 px-5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-accent transition-colors" />
                <button type="submit"
                  className="h-14 px-8 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_28px_rgba(234,88,12,0.35)] shrink-0">
                  Gaskeun
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </InView>
      </div>
    </section>
  );
};

import SequenceScroll    from "@/components/antarestar/SequenceScroll";
import TextReveal        from "@/components/antarestar/TextReveal";
import BentoGrid         from "@/components/antarestar/BentoGrid";
import Stats             from "@/components/antarestar/Stats";
import TestimonialSlider from "@/components/antarestar/TestimonialSlider";
import CTASection        from "@/components/antarestar/CTASection";

// ─── Main Page ──────────────────────────────────────────────
const HomePage = () => {

  return (
    <div className="dark bg-black text-white min-h-screen selection:bg-orange-500/30 selection:text-orange-200 cursor-none" style={{ overflowX: 'clip' }}>
      <Navbar />
      <main>
        {/* Cinematic Hero — 500vh scroll-driven canvas sequence */}
        <SequenceScroll />

        {/* About — Word-by-word text reveal */}
        <TextReveal />

        {/* Product DNA — Bento grid showcase */}
        <BentoGrid />

        {/* By The Numbers — Animated stats */}
        <Stats />

        {/* Shop by Category — existing e-commerce section */}
        <ShopCategories />

        {/* Bestsellers — existing e-commerce section */}
        <BestSellers />

        {/* Flash Sale — existing urgency section */}
        <FlashSaleSection />

        {/* Social Proof — Testimonial slider */}
        <TestimonialSlider />

        {/* Mega Sale CTA */}
        <MegaSaleCTA />

        {/* Ecosystem — Corporate / Affiliate / Member */}
        <BizStrip />

        {/* Community Gallery */}
        <CommunityGallery />

        {/* Final CTA — conversion close */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
