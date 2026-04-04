import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductSkeleton from "@/components/ProductSkeleton";
import { rp } from "@/utils/formatters";

const DiscountedStrip = () => {
  const { data: discountItems = [], isLoading } = useQuery({
    queryKey: ['discount-strip-real'],
    queryFn: async () => {
      // Fetch products and filter only those with active flash sale prices
      const res = await api.get('/products', { params: { per_page: 20 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw
        .filter((p: any) => p.variants?.some((v: any) => v.is_on_flash_sale && v.flash_sale_price))
        .slice(0, 6)
        .map((p: any) => {
          const variant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
          return {
            id: String(p.id),
            name: String(p.name),
            image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
            price: Number(variant?.flash_sale_price || variant?.price || 0),
            originalPrice: Number(variant?.price || 0),
            category: p.category?.name || "Equipment"
          };
        });
    }
  });

  // Don't render if no actual discounted products
  if (!isLoading && !discountItems.length) return null;

  return (
    <section className="py-8 md:py-10 bg-background border-b border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
              <Tag className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-display font-black text-lg sm:text-xl uppercase text-foreground tracking-tight">Sedang Diskon</h2>
          </div>
          <span className="font-body text-xs text-muted-foreground">{discountItems.length} produk</span>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none px-6 sm:px-0">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] sm:w-[220px]">
                <ProductSkeleton />
              </div>
            ))
          ) : (
            discountItems.map((p: any) => {
              const pct = p.originalPrice > 0 ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
              return (
                <Link key={p.id} to={`/product/${p.id}`}
                  className="group flex-shrink-0 w-[200px] sm:w-[220px] snap-start">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border mb-2.5 shadow-sm">
                    <img src={p.image} alt={p.name} loading="lazy"
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                    {pct > 0 && (
                      <span className="absolute top-2 right-2 bg-accent text-white font-display font-black text-[11px] px-2 py-0.5 rounded-full shadow-sm">
                        -{pct}%
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-0.5">{p.category}</p>
                  <h3 className="font-display font-bold text-xs line-clamp-2 group-hover:text-accent transition-colors mb-1">{p.name}</h3>
                  <div className="flex items-end gap-1.5">
                    <span className="font-display font-black text-sm text-foreground">{rp(p.price)}</span>
                    {pct > 0 && <span className="font-body text-[10px] text-muted-foreground line-through">{rp(p.originalPrice)}</span>}
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

export default DiscountedStrip;
