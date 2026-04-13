import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
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

  return (
    <section className="pt-2 pb-16 md:pb-24 bg-transparent border-b border-white/5">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <InView className="mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-display font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Gear Paling Laku 🔥</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </InView>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : popular.length > 0 ? (
            popular.map((p: any, i: number) => (
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

export default BestSellers;
