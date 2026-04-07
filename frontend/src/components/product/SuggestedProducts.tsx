import React from "react";
import ProductCard from "../shared/ProductCard";
import { motion } from "framer-motion";

interface SuggestedProductsProps {
  products: any[];
}

const SuggestedProducts = ({ products }: SuggestedProductsProps) => {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div className="space-y-2">
            <p className="text-orange-600 font-display font-black text-[10px] uppercase tracking-[0.5em] mb-2 leading-none">BIAR MAKIN SIAP</p>
            <h2 className="text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tighter leading-none">Mungkin lo juga butuh ini</h2>
         </div>
         <button className="h-14 px-8 bg-white/5 border border-white/5 text-white/50 hover:bg-white hover:text-black transition-all rounded-none font-display font-black text-[10px] uppercase tracking-widest active:scale-95">Lihat semua gear</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
