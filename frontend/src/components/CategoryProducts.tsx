import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { categories } from "@/data/products";
import { StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";

// Assign a landscape bg + representative product image per category
import heroImg       from "@/assets/hero-outdoor.jpg";
import lifestyleCamp from "@/assets/lifestyle-camping.jpg";
import lifestyleHike from "@/assets/lifestyle-hiker.jpg";
import community1    from "@/assets/community-1.jpg";
import community2    from "@/assets/community-2.jpg";

import productJacket  from "@/assets/product-jacket.jpg";
import productBag     from "@/assets/product-bag.jpg";
import productBoots   from "@/assets/product-boots.jpg";
import productCap     from "@/assets/product-cap.jpg";
import productTshirt  from "@/assets/product-tshirt.jpg";

const categoryMeta: Record<string, { bg: string; productImg: string }> = {
  Jackets:     { bg: heroImg,        productImg: productJacket  },
  Bags:        { bg: lifestyleHike,  productImg: productBag     },
  Footwear:    { bg: community1,     productImg: productBoots   },
  Accessories: { bg: community2,     productImg: productCap     },
  Apparel:     { bg: lifestyleCamp,  productImg: productTshirt  },
};

const CategoryProducts = () => {
  const realCategories = categories.filter((c) => c !== "All");

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['category-products-all'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { per_page: 50 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw.map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
        description: String(p.description),
        category: p.category?.name || "Equipment",
        image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
        price: p.variants?.[0]?.price || 0,
        originalPrice: p.variants?.[0]?.price ? p.variants?.[0]?.price * 1.2 : null,
        rating: 4.8,
        reviewCount: 154,
      }));
    }
  });

  return (
    <section className="py-16 md:py-24 section-padding bg-background">
      <div className="section-container space-y-20 md:space-y-28">
        {realCategories.map((category, catIndex) => {
          const catProducts = allProducts
            .filter((p: any) => p.category === category)
            .slice(0, 5);

          const meta = categoryMeta[category];
          if (!meta) return null;

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.75, delay: 0.04 * catIndex, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ── Full-image Category Banner ── */}
              <div className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 rounded-2xl overflow-hidden mb-8 group">
                {/* Background landscape */}
                <img
                  src={meta.bg}
                  alt={category}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark overlay — heavier on left for text, fades to transparent right */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                {/* Bottom-to-top subtle fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Logo watermark */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
                  <img src="/logo.webp" alt="Antarestar" className="h-7 w-auto object-contain brightness-[100]" />
                  <span className="text-white font-body text-[9px] tracking-[0.3em] uppercase">Antarestar</span>
                </div>

                {/* Category name — left side */}
                <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-6 sm:p-8">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.65, delay: 0.1 + 0.04 * catIndex, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white mb-2 uppercase tracking-tighter"
                  >
                    {category}
                  </motion.h2>

                  {/* "Lihat semua" link */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + 0.04 * catIndex }}
                  >
                    <Link
                      to={`/store?category=${encodeURIComponent(category)}`}
                      className="mt-4 inline-flex items-center gap-2 text-white/80 hover:text-white font-display text-[11px] tracking-[0.2em] font-bold uppercase transition-colors group/link"
                    >
                      Lihat Koleksi
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* ── Product Grid ── */}
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <StaggerItem key={i}>
                      <ProductSkeleton />
                    </StaggerItem>
                  ))
                ) : catProducts.length > 0 ? (
                  catProducts.map((product: any, i: number) => (
                    <StaggerItem key={product.id}>
                      <ProductCard product={product} index={i} />
                    </StaggerItem>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                    Belum ada produk untuk kategori ini.
                  </div>
                )}
              </StaggerContainer>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryProducts;
