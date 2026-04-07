import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSlide from "./HeroSlide";

import heroSlideBrand from "@/assets/hero-slide-brand.png";
import heroOutdoor from "@/assets/hero-outdoor.jpg";
import lifestyleCamping from "@/assets/lifestyle-camping.jpg";

const slides = [
  {
    image: heroSlideBrand,
    headline: "Gear Buat Jalan Lebih Jauh",
    sub: "Eksplor koleksi terbaik Antarestar untuk petualangan tanpa batas.",
    ctaText: "Lihat Koleksi",
    ctaLink: "/store",
    badge: "New Collection",
  },
  {
    image: heroOutdoor,
    headline: "Diskon Sampai 30%",
    sub: "Gear pilihan dengan harga lebih ringan untuk misi harianmu.",
    ctaText: "Lihat Diskon",
    ctaLink: "/store?sort=Diskon",
    badge: "Special Offer",
  },
  {
    image: lifestyleCamping,
    headline: "Flash Sale Lagi Jalan 🔥",
    sub: "Waktu terbatas, jangan sampe kehabisan penawaran terbaik.",
    ctaText: "Cek Sekarang",
    ctaLink: "/store?sort=Flash+Sale",
    badge: "Flash Sale",
  },
];

const SLIDE_DURATION = 7000;

const StoreHeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[60vh] sm:h-[65vh] md:h-[75vh] lg:h-[80vh] bg-[#0B0B0B] overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <HeroSlide {...slides[current]} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Bar: Progress + Slide Counter */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <div className="section-container section-padding pb-6 sm:pb-8 md:pb-10 flex items-center justify-between gap-6">
          {/* Progress bars */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xs">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="group relative h-[3px] flex-1 focus:outline-none rounded-full overflow-hidden"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div className="absolute inset-0 bg-white/15 rounded-full" />
                {current === i && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-orange-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                  />
                )}
                {current !== i && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 rounded-full transition-colors" />
                )}
              </button>
            ))}
          </div>

          {/* Slide counter */}
          <div className="font-display font-black text-[11px] tracking-[0.2em] text-white/30 tabular-nums">
            <span className="text-white">{String(current + 1).padStart(2, "0")}</span>
            <span className="mx-1.5">/</span>
            <span>{String(slides.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreHeroSlider;
