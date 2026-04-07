import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Display */}
      <div className="relative aspect-[4/5] bg-[#111111] rounded-none overflow-hidden border border-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[activeIndex]}
            src={images[activeIndex]}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover rounded-none"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails - Mobile Friendly Scroll */}
      <div className="flex lg:grid lg:grid-cols-5 gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide snap-x">
        {images.map((img, i) => (
          <button
            key={img}
            onClick={() => setActiveIndex(i)}
            className={`flex-shrink-0 w-20 lg:w-full aspect-square rounded-none overflow-hidden border-2 transition-all snap-center ${
              activeIndex === i ? "border-orange-600 p-0.5" : "border-white/5 hover:border-white/20"
            }`}
          >
            <img src={img} className="w-full h-full object-cover rounded-none" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
