import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center mt-10">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover scale-105"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-hikers-walking-on-a-mountain-peak-40483-large.mp4" type="video/mp4" />
        </video>
        {/* Subtle Parallax Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-20" />
      </div>

      <div className="relative z-30 container mx-auto px-6 text-center max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="space-y-8"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
             <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">B2B & Partnerships</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-8xl text-white uppercase tracking-tighter leading-[0.85]">
            BIKIN GEAR TIM LO <br /> 
            <span className="text-orange-600 drop-shadow-[0_0_40px_rgba(234,88,12,0.3)]">LEBIH SIAP.</span>
          </h1>

          <p className="font-body text-xs md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
            Custom jaket, seragam, dan gear outdoor premium buat perusahaan, komunitas, dan tim lapangan lo. Dibuat dengan standar ekspedisi Antarestar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-32">
            <Button className="w-full sm:w-auto h-16 px-10 bg-orange-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest rounded-full transition-all group overflow-hidden">
               <span className="relative z-10 flex items-center gap-2">
                 Konsultasi Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </span>
            </Button>
            <button className="w-full sm:w-auto h-16 px-10 border border-white/20 hover:border-white text-white font-black uppercase text-xs tracking-widest rounded-full transition-all flex items-center gap-3 group justify-center">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <Play className="w-4 h-4 fill-current" />
               </div>
               Lihat Contoh
            </button>
          </div>

          
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
