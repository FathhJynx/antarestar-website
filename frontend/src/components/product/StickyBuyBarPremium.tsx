import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Zap } from "lucide-react";

interface StickyBuyBarProps {
  product: {
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
  };
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const StickyBuyBarPremium = ({ product, onAddToCart, onBuyNow }: StickyBuyBarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show bar after hero info
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-[#050505]/95 backdrop-blur-2xl border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,1)]"
        >
          <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
            
            {/* Info Section (Gojek Style - Left Side) */}
            <div className="flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl text-white tracking-tighter leading-none mb-1">
                   {formatPrice(product.price)}
                </span>
                <span className="font-display font-bold text-[9px] text-white/30 uppercase tracking-[0.2em]">Harga Gear</span>
            </div>

            {/* Action Section (Gojek Style - Right Side) */}
            <div className="flex items-center gap-3 flex-1 max-w-[320px]">
               <button 
                  onClick={onAddToCart}
                  className="flex-1 h-12 sm:h-14 bg-orange-600 text-white font-display font-black text-[10px] sm:text-[11px] uppercase tracking-widest rounded-none flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-orange-600/30 group"
               >
                  <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                  <span className="hidden sm:inline">MASUKIN KE TAS</span>
                  <span className="sm:hidden">AMBIL</span>
               </button>
               
               <button 
                  onClick={onBuyNow}
                  className="hidden md:flex flex-1 h-14 border border-white/20 text-white font-display font-black text-[11px] uppercase tracking-widest rounded-none items-center justify-center gap-3 transition-all hover:bg-white hover:text-black active:scale-95 group"
               >
                  <Zap className="w-4 h-4 group-hover:fill-current transition-transform" /> GAS CHECKOUT
               </button>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBuyBarPremium;
