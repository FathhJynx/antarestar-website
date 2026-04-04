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
import HeroSection     from "@/components/HeroSection";
import MarqueeBanner   from "@/components/MarqueeBanner";
import CommunityGallery from "@/components/CommunityGallery";
import BrandStory      from "@/components/BrandStory";
import ProductCard     from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { products }    from "@/data/products";
import { useQuery }    from "@tanstack/react-query";
import api             from "@/lib/api";
import AnnouncementBanner from "@/components/AnnouncementBanner";

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
const STATS = [
  { n: "10 K+",  l: "Produk Terjual" },
  { n: "4.9 ★",  l: "Rating Pelanggan" },
  { n: "100+",   l: "Korporat & Instansi" },
  { n: "7 Thn",  l: "Dedikasi Outdoor" },
];

const StatsStrip = () => (
  <div className="bg-primary border-b border-white/10">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {STATS.map((s, i) => (
          <InView key={s.l} delay={i * 0.08}>
            <div className="text-center">
              <p className="font-display font-black text-3xl md:text-4xl text-accent mb-1 leading-none">{s.n}</p>
              <p className="font-body text-xs md:text-sm text-white/50 uppercase tracking-widest">{s.l}</p>
            </div>
          </InView>
        ))}
      </div>
    </div>
  </div>
);

// ─── 2. Shop by Category ────────────────────────────────────────
// Categories are now fetched from API

// ─── Category card UI (shared by mobile + desktop layouts) ──
interface CatCardProps {
  cat: typeof CATS[number];
  big?: boolean;
  desktopFill?: boolean; // on desktop the parent grid cell determines height
}
const CategoryCardUI = ({ cat, big = false, desktopFill = false }: CatCardProps) => (
  <Link
    to={cat.href}
    className={`group relative flex flex-col justify-end rounded-2xl overflow-hidden w-full
      ${desktopFill ? "h-full" : big ? "aspect-[16/7]" : "aspect-[4/3]"}`}
  >
    <img src={cat.img} alt={cat.name} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
    {/* hover caret */}
    <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
      <ArrowRight className="w-4 h-4 text-white" />
    </div>
    <div className="relative p-4 md:p-5">
      <p className="font-body text-[10px] text-white/50 uppercase tracking-[0.2em] mb-1">{cat.count} produk</p>
      <h3 className={`font-display font-black text-white uppercase leading-none
        ${big ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl md:text-2xl"}`}>
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
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <InView className="mb-10 md:mb-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-2">Koleksi Lengkap</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase leading-none tracking-tight">
                Kategori Pilihan
              </h2>
            </div>
            <Link to="/store" className="flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors shrink-0">
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
          rating: p.reviews?.length > 0 
            ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
            : 0,
          reviewCount: p.reviews?.length || 0,
          category: p.category?.name || "Perlengkapan"
        };
      });
    }
  });

  // Use real data or empty array, no mock fallback
  const BEST = popular;

  return (
    <section className="pt-2 pb-16 md:pb-24 bg-background border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <InView className="mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-display font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">Produk Terlaris</span>
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
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "28px 28px" }} />
      {/* glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Header row */}
        <InView className="mb-10 md:mb-12">
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
                <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl uppercase text-white tracking-tight">Promo Kilat</h2>
              </div>
            </div>
            {/* Countdown */}
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
              <motion.div key={p.id} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1, ease }}
                className="bg-white rounded-2xl overflow-hidden group shrink-0 w-[280px] sm:w-auto snap-start shadow-sm border border-white/5 sm:shadow-none"
              >
                {/* image */}
                <Link to={`/product/${p.id}`} className="relative block aspect-square bg-muted overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy"
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-display font-black text-base px-2.5 py-1 rounded-lg" style={{ transform: "rotate(-3deg)" }}>
                    -{pct}%
                  </span>
                  {isLowStock && stock > 0 && (
                    <span className="absolute bottom-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                      <Flame className="w-3 h-3" /> Hampir Habis
                    </span>
                  )}
                </Link>
                {/* info */}
                <div className="p-4">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 mb-2 hover:text-red-600 transition-colors">{p.name}</h3>
                  </Link>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="font-display font-black text-xl text-red-600">{rp(flash)}</span>
                    <span className="font-body text-xs text-gray-400 line-through pb-0.5">{rp(orig)}</span>
                  </div>
                  {/* stock bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold font-body text-gray-500">
                      <span>Stok tersisa</span><span className="text-red-500">{stock} unit</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, (stock / 100) * 100)}%` }} // normalized for demo
                        viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 + i * 0.15 }}
                        className="h-full bg-red-500 rounded-full" />
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

        <InView delay={0.3} className="mt-8 text-center">
          <Link to="/store" className="inline-flex items-center gap-2 h-11 px-8 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors">
            Lihat Semua Sale <ArrowRight className="w-4 h-4" />
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
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative bg-primary rounded-3xl overflow-hidden px-6 py-12 md:px-14 md:py-16">
          {/* bg texture */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <InView>
              <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Mega Sale — Hari ini saja</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-tight tracking-tight mb-5">
                Hemat<br /><span className="text-accent">Hingga<br />50% OFF</span>
              </h2>
              <p className="font-body text-white/60 text-sm md:text-base leading-relaxed mb-7 max-w-md">
                Lebih dari <strong className="text-white">10.000 adventurer</strong> sudah memilih Antarestar. Jangan jadi yang terakhir — stok terbatas untuk setiap item.
              </p>
              {/* Countdown */}
              <div className="flex items-center gap-3 mb-8">
                <Timer className="w-4 h-4 text-white/40" />
                <p className="font-body text-xs text-white/40 uppercase tracking-widest">Promo berakhir dalam</p>
                <div className="flex items-center gap-1.5 font-display font-black text-xl">
                  {[h, m, s].map((u, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="bg-accent/20 border border-accent/30 text-accent px-2.5 py-0.5 rounded-lg">{u}</span>
                      {i < 2 && <span className="text-white/30">:</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/store?sort=Popular"
                  className="group inline-flex items-center gap-2 h-12 px-7 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_28px_hsl(18_85%_52%/0.35)]">
                  <ShoppingBag className="w-4 h-4" /> Belanja Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/store" className="inline-flex items-center gap-2 h-12 px-7 border border-white/20 text-white hover:bg-white/5 font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors">
                  Katalog Sale
                </Link>
              </div>
            </InView>

            {/* Social proof stats */}
            <InView delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Star,        n: "4.8/5",   l: "Rating rata-rata dari 20rb+ ulasan" },
                  { icon: Users,       n: "50rb+",    l: "Pembeli aktif bulan ini" },
                  { icon: ShieldCheck, n: "100%",    l: "Produk bergaransi resmi" },
                  { icon: Truck,       n: "1–3 Hari",l: "Estimasi pengiriman nasional" },
                ].map((s, i) => (
                  <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <s.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="font-display font-black text-xl md:text-2xl text-white">{s.n}</p>
                    <p className="font-body text-[11px] text-white/50 leading-snug mt-1">{s.l}</p>
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
  <section className="py-16 md:py-24 bg-primary">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
      <InView className="mb-10 md:mb-12 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-accent mb-3">Lebih dari sekadar toko</p>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-tight tracking-tight">
          Ekosistem Antarestar
        </h2>
      </InView>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Corporate */}
        {[
          {
            to: "/corporate",
            icon: Building2,
            title: "Pesanan Perusahaan",
            desc: "Seragam tim, merchandise event, perlengkapan lapangan. Mulai 10 pcs dengan harga grosir & logo custom.",
            points: ["Harga grosir mulai 10 pcs", "Custom bordir logo", "Pengiriman ke 34 provinsi"],
            cta: "Konsultasi Gratis",
            dark: false,
          },
          {
            to: "/affiliate",
            icon: Award,
            title: "Program Afiliasi",
            desc: "Share link produk favorit dan earn komisi hingga 15% per transaksi. Daftar gratis, tanpa target.",
            points: ["Komisi 15% per sale", "Daftar 100% gratis", "Dashboard real-time"],
            cta: "Daftar Affiliate",
            dark: true,
          },
          {
            to: "/member",
            icon: Gift,
            title: "Klub Member",
            desc: "Kumpulkan poin dari setiap pembelian, naik tier Explorer → Summit, dan nikmati keuntungan eksklusif.",
            points: ["Poin dari setiap transaksi", "Diskon tier eksklusif", "Hadiah ulang tahun"],
            cta: "Gabung Sekarang",
            dark: true,
          },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: i * 0.1, ease }}>
            <Link to={card.to} className={`group flex flex-col h-full rounded-3xl p-6 md:p-8 border-2 transition-all duration-300 hover:border-accent/50
              ${card.dark ? "bg-white/5 border-white/10" : "bg-background border-border hover:shadow-lg hover:shadow-black/20"}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-colors
                ${card.dark ? "bg-accent/20 border border-accent/30" : "bg-accent/10 border border-accent/20 group-hover:bg-accent"}`}>
                <card.icon className={`w-5 h-5 transition-colors ${card.dark ? "text-accent" : "text-accent group-hover:text-white"}`} />
              </div>
              <h3 className={`font-display font-black text-xl uppercase tracking-tight mb-3 ${card.dark ? "text-white" : "text-foreground"}`}>{card.title}</h3>
              <p className={`font-body text-sm leading-relaxed mb-5 flex-1 ${card.dark ? "text-white/60" : "text-muted-foreground"}`}>{card.desc}</p>
              <ul className="space-y-2 mb-6">
                {card.points.map(pt => (
                  <li key={pt} className={`flex items-center gap-2.5 font-body text-xs ${card.dark ? "text-white/70" : "text-muted-foreground"}`}>
                    <Check className="w-3.5 h-3.5 text-accent shrink-0" />{pt}
                  </li>
                ))}
              </ul>
              <div className={`flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider
                text-accent group-hover:gap-3 transition-all duration-300`}>
                {card.cta} <ArrowRight className="w-4 h-4" />
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
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-accent mb-3">Tetap Terhubung</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase mb-4 tracking-tight">
            Jangan Ketinggalan<br />Promo Eksklusif
          </h2>
          <p className="font-body text-sm text-white/50 mb-8">Subscribe dan dapatkan notifikasi flash sale, produk baru, dan kode diskon langsung ke email kamu.</p>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 h-12 text-accent font-display font-bold">
                <Check className="w-5 h-5" /> Terima kasih! Kamu sudah terdaftar.
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 1 }}
                onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
                className="flex gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com" required
                  className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-accent transition-colors" />
                <button type="submit"
                  className="h-12 px-6 bg-accent hover:bg-accent/90 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shrink-0">
                  Berlangganan
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </InView>
      </div>
    </section>
  );
};

// ─── Main Page ──────────────────────────────────────────────
const HomePage = () => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main>
      {/* 1. Hero */}
      <HeroSection />
      {/* 2. Stats — dark */}
      <StatsStrip />
      {/* 3. Marquee — dark band */}
      <MarqueeBanner />
      {/* 4. Categories — light */}
      <ShopCategories />
      {/* 5. Bestsellers — light */}
      <BestSellers />
      {/* 6. Flash Sale — dark */}
      <FlashSaleSection />
      {/* 7. Brand Story — light */}
      <BrandStory />
      {/* 8. Mega Sale CTA — light wrapper / dark card */}
      <MegaSaleCTA />
      {/* 9. Biz Strip — dark */}
      <BizStrip />
      {/* 10. Community — light */}
      <CommunityGallery />
      {/* 11. Newsletter — dark */}
      <NewsletterStrip />
    </main>
    <Footer />
  </div>
);

export default HomePage;
