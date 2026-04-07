import React from "react";
import ProductCard from "@/components/shared/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface StoreLayoutProps {
  products: any[];
  isLoading: boolean;
}

const StoreLayout = ({ products, isLoading }: StoreLayoutProps) => {
  return (
    <div className="section-container section-padding pb-32">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <div key="loading" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] bg-[#111111] animate-pulse rounded-none" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 flex flex-col items-center text-center gap-8"
          >
            <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center border border-[#1F1F1F]">
               <span className="text-3xl">🏜️</span>
            </div>
            <div className="space-y-2">
               <h2 className="font-display font-black text-3xl uppercase tracking-tighter">Gear yang lo cari belum ada nih...</h2>
               <p className="text-gray-500 max-w-sm uppercase text-[10px] font-black tracking-widest">Coba cek keyword lain atau filter-nya ya, biar misi lo tetep jalan!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreLayout;
