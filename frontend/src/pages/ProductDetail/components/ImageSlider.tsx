import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <div className="relative w-full aspect-square bg-[#080808] overflow-hidden lg:hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-contain p-6"
        />
      </AnimatePresence>

      {/* Swipe Overlay (Invisible Buttons) */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={prev} />
      <div className="absolute inset-y-0 right-0 w-1/4 z-10" onClick={next} />

      {/* Controls */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
         <button onClick={prev} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto">
            <ChevronLeft className="w-6 h-6" />
         </button>
         <button onClick={next} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto">
            <ChevronRight className="w-6 h-6" />
         </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === i ? "bg-orange-600 w-6" : "bg-white/20 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
