import { useState, useEffect } from "react";
import FadeIn from "@/components/common/FadeIn";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";
import fallbackImage from "@/assets/hero-outdoor.jpg";

const BestSellers = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/products').then(res => {
      const data = res.data?.data?.data || [];
      if (data.length > 0) {
        const mapped = data.slice(0, 6).map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category?.name || "Equipment",
          price: p.variants?.[0]?.price ? parseFloat(p.variants[0].price) : 0,
          originalPrice: p.variants?.[0]?.price ? parseFloat(p.variants[0].price) * 1.2 : null,
          image: p.images?.[0]?.image_url || fallbackImage,
          rating: 5,
          reviews: 10,
          colors: ["#000", "#555"],
          isNew: true,
        }));
        setProducts(mapped);
      }
    }).catch(console.warn);
  }, []);

  if (!products.length) return null;

  return (
    <section className="pt-2 pb-16 md:pb-24 bg-background border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="font-display font-black text-xs uppercase tracking-[0.3em] text-muted-foreground">Best Sellers</span>
            <div className="flex-1 h-px bg-border" />
          </div>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
