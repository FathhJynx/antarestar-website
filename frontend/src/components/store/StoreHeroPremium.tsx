import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, ArrowDown } from "lucide-react";
// Import asset to avoid broken link
import heroBg from "@/assets/hero-outdoor.jpg"; 

const StoreHeroPremium = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Cinematic Background Layer */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={heroBg} 
          alt="Extreme Outdoor" 
          className="w-full h-full object-cover grayscale-[20%] brightness-75"
        />
      </motion.div>

      {/* Extreme Branding Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-20 select-none">
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.03, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="font-display font-black text-[20vw] text-white uppercase leading-none tracking-tighter opacity-[0.03]"
        >
            ARSENAL
        </motion.p>
      </div>

      {/* Content Info */}
      <div className="relative z-30 max-w-screen-xl mx-auto px-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="inline-flex items-center gap-3 px-6 py-2 bg-orange-600 text-white rounded-none font-display font-black text-[10px] uppercase tracking-[0.4em] mb-10"
        >
           <Zap className="w-4 h-4 fill-white" /> MISSION READY EQUIPMENT
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-5xl sm:text-7xl md:text-8xl xl:text-[10vw] text-white uppercase leading-[0.8] tracking-tighter mb-8"
        >
          GEAR BUILT FOR<br />
          <span className="text-orange-600">EXTREME</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-center gap-6 mt-12"
        >
          <p className="font-display font-black text-xs sm:text-sm text-white/40 uppercase tracking-[0.5em]">Explore Collection</p>
          <div className="w-px h-24 bg-gradient-to-b from-orange-600 to-transparent animate-pulse" />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="w-5 h-5 text-orange-600" />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Bottom Mesh */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-white/10 z-30" />
    </section>
  );
};

export default StoreHeroPremium;
