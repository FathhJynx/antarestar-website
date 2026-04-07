import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductCard from "@/pages/Store/components/ProductCard";

const ProductGrid = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['affiliate-products'],
    queryFn: async () => {
       const res = await api.get('/products?limit=8');
       const raw = res.data?.data?.data || res.data?.data || [];
       
       return raw.map((p: any) => {
         const primaryImage = p.images?.find((img: any) => img.is_primary)?.image_url 
                         || p.images?.[0]?.image_url
                         || p.image
                         || 'https://via.placeholder.com/300';
         const activeVariant = p.variants?.[0];
         return {
           id: String(p.id),
           name: String(p.name),
           category: typeof p.category === 'object' ? p.category?.name : (p.category || "Equipment"),
           badge: p.badge || null,
           image: primaryImage,
           price: Number(activeVariant?.price || p.price || 0),
           originalPrice: activeVariant?.original_price || p.original_price || null,
         };
       });
    }
  });

  if (isLoading) {
     return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
           {[1,2,3,4].map(i => (
              <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse border border-white/5" />
           ))}
        </div>
     );
  }

  return (
    <div className="space-y-10 md:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-4">
            <p className="font-body font-black text-[9px] uppercase tracking-[0.4em] text-white/20">GEAR SELECTION</p>
            <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">PRODUK TERBAIK.</h3>
         </div>
         <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Pilih gear yang cocok buat audience lo dan mulai share.
         </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10">
        {products.map((p: any, i: number) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
