import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Zap } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/AnimationPrimitives";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

import heroImg       from "@/assets/hero-outdoor.jpg";
import lifestyleCamp from "@/assets/lifestyle-camping.jpg";
import lifestyleHike from "@/assets/lifestyle-hiker.jpg";
import community1    from "@/assets/community-1.jpg";
import community2    from "@/assets/community-2.jpg";

interface CatMeta { bg: string; slug: string; count: number; }
const cats: Record<string, CatMeta> = {
  Jackets:     { bg: heroImg,        slug: "Jackets",     count: 24 },
  Bags:        { bg: lifestyleHike,  slug: "Bags",        count: 18 },
  Footwear:    { bg: community1,     slug: "Footwear",    count: 12 },
  Accessories: { bg: community2,     slug: "Accessories", count: 30 },
  Apparel:     { bg: lifestyleCamp,  slug: "Apparel",     count: 8  },
};

// Flash sale products for the "hot right now" strip
// Now fetched inside component

const CategoryCard = ({
  name, bg, slug, count, span = false, delay = 0,
}: { name: string; bg: string; slug: string; count: number; span?: boolean; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={span ? "md:col-span-2 row-span-2" : ""}
  >
    <Link
      to={`/store?category=${slug}`}
      className="group relative flex flex-col justify-end rounded-2xl overflow-hidden aspect-[4/3] md:h-full min-h-[180px]"
    >
      <img
        src={bg}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
        loading="lazy"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Hover arrow badge */}
      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-accent flex items-center justify-center
                      scale-0 group-hover:scale-100 transition-transform duration-400 ease-out-expo">
        <ArrowUpRight className="w-4 h-4 text-accent-foreground" />
      </div>

      {/* Text */}
      <div className="relative p-5 md:p-6">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">{count} Produk</p>
        <h3 className={`font-display font-black uppercase tracking-tight text-white leading-none
          ${span ? "text-3xl md:text-4xl lg:text-5xl" : "text-xl md:text-2xl"}`}>
          {name}
        </h3>
      </div>
    </Link>
  </motion.div>
);

const ShopByCategory = () => {
  const { data: hotProducts = [], isLoading } = useQuery({
    queryKey: ['hot-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { is_flash_sale: true, limit: 4 } });
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
    <section className="py-20 md:py-28 section-padding bg-primary relative overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

      <div className="section-container relative z-10">
        <SectionHeading
          subtitle="Koleksi Lengkap"
          title="Temukan Gear Kamu"
          light
          center
        />

        {/* Category grid — asymmetric masonry-style */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3 md:gap-4 mb-16">
          {/* Jackets — large hero cell */}
          <CategoryCard name="Jackets"     {...cats.Jackets}     span  delay={0}   />
          {/* Right column: 4 smaller cells */}
          <CategoryCard name="Bags"        {...cats.Bags}              delay={0.1} />
          <CategoryCard name="Accessories" {...cats.Accessories}        delay={0.15}/>
          <CategoryCard name="Footwear"    {...cats.Footwear}           delay={0.2} />
          <CategoryCard name="Apparel"     {...cats.Apparel}            delay={0.25}/>
        </div>

        {/* Hot Right Now strip */}
        {(isLoading || hotProducts.length > 0) && (
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-600 rounded-xl flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-current" />
                </div>
                <h3 className="font-display font-black text-xl text-white uppercase tracking-tight">Hot Right Now</h3>
                <div className="flex-1 h-px bg-white/10" />
                <Link to="/store" className="font-body text-xs font-bold text-accent uppercase tracking-wider hover:underline">
                  Lihat Semua →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden h-full">
                    <ProductSkeleton />
                  </div>
                ))
              ) : (
                hotProducts.map((p: any, i: number) => (
                  <div key={p.id} className="bg-white rounded-2xl overflow-hidden">
                    <ProductCard product={p} index={i} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;
