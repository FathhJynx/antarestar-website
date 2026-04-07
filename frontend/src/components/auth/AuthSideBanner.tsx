import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533240332313-0dbf2cf6a003?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506905917360-39446f0dec14?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533580451471-bc66ca770c67?q=80&w=1964&auto=format&fit=crop"
];

const AuthSideBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4000); // 4s per frame for cinematic look
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black select-none">
      {/* ── IMAGE SEQUENCE LAYER ── */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1, filter: "grayscale(100%) blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "grayscale(0%) blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, filter: "grayscale(100%) blur(5px)" }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <img 
            src={IMAGES[index]} 
            className="w-full h-full object-cover" 
            alt="Cinematic Experience"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── OVERLAYS ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 z-[2]" />
      <div className="absolute inset-0 bg-orange-600/5 mix-blend-overlay z-[2]" />
      
      {/* Film Grain Texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-[3] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 p-20 flex flex-col justify-between h-full w-full">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-12 h-12 bg-orange-600 rounded-none flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
             <img src="/logo.webp" alt="Logo" className="w-7 h-7 object-contain brightness-0 invert" />
          </div>
          <span className="font-display font-black text-2xl text-white uppercase tracking-tighter drop-shadow-lg">
             ANTARE<span className="text-orange-600">STAR</span>
          </span>
        </Link>

        <div>
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5, duration: 1 }}
             className="space-y-6 max-w-lg"
          >
             <h2 className="font-display font-black text-6xl md:text-7xl text-white uppercase leading-[0.85] tracking-tighter italic">
                EXPLORE <br /> 
                <span className="text-orange-600">LIMITLESS.</span>
             </h2>
             <div className="w-20 h-1 bg-orange-600" />
             <p className="text-white/60 text-lg font-medium leading-relaxed uppercase tracking-tight">
                Gear lo, Misi lo. <br />
                Siapkan diri lo untuk tantangan yang sebenarnya di alam bebas Indonesia.
             </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
           {/* Status Micro-Stats */}
           <div className="flex items-center gap-8">
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Status</p>
                 <p className="text-xs font-black uppercase text-orange-600 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                    Mission Ready
                 </p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Archive</p>
                 <p className="text-xs font-black uppercase text-white tracking-widest">v2.4.0</p>
              </div>
           </div>
           
           <div className="flex items-center gap-12 text-white/20 text-[9px] font-black uppercase tracking-[0.3em]">
             <span>© 2024 ANTARESTAR HUB</span>
             <span>GEAR FOR THE BRAVE</span>
           </div>
        </div>
      </div>

      {/* Retro Scanner Effect Line */}
      <motion.div 
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="absolute inset-x-0 h-[2px] bg-white/5 blur-[1px] z-10 pointer-events-none"
      />
    </div>
  );
};

export default AuthSideBanner;
