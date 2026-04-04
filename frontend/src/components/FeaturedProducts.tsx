import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import ProductCard from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductSkeleton from "@/components/ProductSkeleton";

import heroImg        from "@/assets/hero-outdoor.jpg";
import lifestyleHike  from "@/assets/lifestyle-hiker.jpg";
import community3     from "@/assets/community-3.jpg";

// data slices will be calculated inside component

/* ─── shared banner sub-component ─────────────────────── */
interface SectionBannerProps {
  bg: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  linkTo: string;
  linkLabel: string;
  index: number;
}

const SectionBanner = ({ bg, icon, eyebrow, title, subtitle, linkTo, linkLabel, index }: SectionBannerProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.75, delay: 0.05 * index, ease: [0.16, 1, 0.3, 1] }}
    className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 rounded-2xl overflow-hidden mb-8 group"
  >
    {/* Landscape background */}
    <img
      src={bg}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
    />

    {/* Gradient overlays */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

    {/* Logo watermark */}
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-25">
      <img src="/logo.webp" alt="Antarestar" className="h-7 w-auto object-contain brightness-[100]" />
      <span className="text-white font-body text-[9px] tracking-[0.3em] uppercase">Antarestar</span>
    </div>

    {/* Text — left side */}
    <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-6 sm:p-8">
      {/* Eyebrow pill */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 + index * 0.1 }}
        className="flex items-center gap-2 mb-3"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent">
          {icon}
        </span>
        <span className="font-display text-[11px] tracking-[0.2em] font-bold uppercase text-white/80">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + index * 0.1 }}
        className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-white mb-3 uppercase tracking-tighter"
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 + index * 0.1 }}
        className="font-body text-[13px] md:text-sm text-white/80 font-medium max-w-[85%]"
      >
        {subtitle}
      </motion.p>
    </div>

    {/* Button — right side / bottom */}
    <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-10">
      <Button variant="secondary" size="sm" className="hidden sm:flex group rounded-none uppercase tracking-widest font-bold text-[10px] px-6" asChild><Link to={linkTo}>
          {linkLabel} <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link></Button>
      <Button variant="secondary" size="icon" className="sm:hidden w-10 h-10 rounded-none group" asChild><Link to={linkTo}>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link></Button>
    </div>
  </motion.div>
);

/* ─── CTA Block ─────────────────────────────────────────── */
const GearCTA = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="relative overflow-hidden rounded-2xl my-16 md:my-20"
  >
    {/* Background */}
    <img
      src={community3}
      alt="Adventure awaits"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-accent/30" />

    {/* Decorative orb */}
    <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 sm:px-12 py-12 md:py-16">
      {/* Left text */}
      <div className="text-center md:text-left max-w-lg">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-accent mb-3">
          Antarestar Explorer Hub
        </p>
        <h2 className="font-display font-black text-white text-3xl sm:text-4xl md:text-5xl leading-tight text-balance">
          Gear Terbaik untuk<br />
          <span className="text-accent">Petualangan Nyata</span>
        </h2>
        <p className="mt-4 text-white/60 font-body text-sm sm:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
          Dari puncak gunung hingga jalur hutan — temukan koleksi lengkap perlengkapan outdoor pilihan para explorer sejati.
        </p>
      </div>

      {/* Right buttons */}
      <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
        <Button
          asChild
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-body font-semibold tracking-wide px-8 shadow-lg shadow-accent/25 transition-shadow hover:shadow-accent/40"
        ><Link to="/store" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Belanja Sekarang
          </Link></Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-white/30 text-accent hover:bg-white/10 hover:border-white/50 font-body tracking-wide px-8 backdrop-blur-sm"
        ><Link to="/store" className="flex items-center gap-2">
            Lihat Semua Koleksi
            <ArrowRight className="w-4 h-4" />
          </Link></Button>
      </div>
    </div>
  </motion.div>
);

/* ─── Main component ─────────────────────────────────────── */
const FeaturedProducts = () => {
  const { data: popular = [], isLoading: isLoadingPopular } = useQuery({
    queryKey: ['popular-features'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { sort: 'popular', limit: 4 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw.slice(0,4).map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
        image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
        price: p.variants?.[0]?.price || 0,
        originalPrice: p.variants?.[0]?.price ? p.variants?.[0]?.price * 1.2 : null,
        rating: 4.8,
        reviewCount: 154,
        category: p.category?.name || "Equipment"
      }));
    }
  });

  const { data: newArrivals = [], isLoading: isLoadingNew } = useQuery({
    queryKey: ['new-features'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { sort: 'newest', limit: 4 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw.slice(0,4).map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
        image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
        price: p.variants?.[0]?.price || 0,
        originalPrice: p.variants?.[0]?.price ? p.variants?.[0]?.price * 1.2 : null,
        rating: 4.8,
        reviewCount: 154,
        category: p.category?.name || "Equipment"
      }));
    }
  });

  return (
    <section className="pt-24 md:pt-32 pb-8 md:pb-12 section-padding relative">
      <div className="section-container">

        {/* ── Section heading ── */}
        <SectionHeading subtitle="Pilihan Unggulan" title="Featured Gear" />

        {/* ══ BEST SELLERS ══ */}
        <SectionBanner
          bg={heroImg}
          icon={<Flame className="w-3 h-3" />}
          eyebrow="Terlaris"
          title="Best Sellers"
          subtitle="Produk paling banyak dicari dan dipercaya oleh ribuan explorer."
          linkTo="/store?sort=Popular"
          linkLabel="Lihat Semua Terlaris"
          index={0}
        />

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 mb-16">
          {isLoadingPopular ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StaggerItem key={i}>
                <ProductSkeleton />
              </StaggerItem>
            ))
          ) : popular.map((product: any, i: number) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ══ CTA BLOCK ══ */}
        <GearCTA />

        {/* ══ NEW ARRIVALS ══ */}
        <SectionBanner
          bg={lifestyleHike}
          icon={<Sparkles className="w-3 h-3" />}
          eyebrow="Terbaru"
          title="New Arrivals"
          subtitle="Koleksi fresh yang baru hadir — jadilah yang pertama memakainya."
          linkTo="/store?sort=Newest"
          linkLabel="Lihat Semua Produk Baru"
          index={1}
        />

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {isLoadingNew ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StaggerItem key={i}>
                <ProductSkeleton />
              </StaggerItem>
            ))
          ) : newArrivals.map((product: any, i: number) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
};

export default FeaturedProducts;
