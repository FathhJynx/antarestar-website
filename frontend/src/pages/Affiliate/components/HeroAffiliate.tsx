import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onJoin: () => void;
}

const HeroAffiliate = ({ onJoin }: HeroProps) => {
  return (
    <section className="py-12 md:py-24 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Text Block */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-[#111111] border border-white/5 p-8 md:p-16 flex flex-col justify-center space-y-8 min-h-[400px] md:min-h-[600px] hover:border-orange-600/20 transition-colors"
          >
            <div className="space-y-4">
               <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-600 text-white font-black uppercase text-[10px] tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5" /> AMBASSADOR PROGRAM
               </div>
               <h1 className="font-display font-black text-[clamp(2.25rem,9vw,6.5rem)] uppercase text-white leading-[0.85] tracking-tighter">
                  HASILIN DARI <br /> 
                  <span className="text-orange-600 drop-shadow-[0_0_40px_rgba(234,88,12,0.3)]">GEAR YANG LO PAKAI.</span>
               </h1>
               <p className="font-body text-sm md:text-xl text-white/40 max-w-lg leading-relaxed pt-2">
                  Share link. Dapet komisi. Simple. Gak perlu ribet stok barang atau urus kiriman. Fokus share vibe lo, cuannya biar kita yang urus.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button 
                onClick={onJoin}
                className="w-full sm:w-auto h-16 px-10 bg-white hover:bg-orange-600 hover:text-white text-black font-black uppercase tracking-widest transition-all group overflow-hidden rounded-none"
              >
                 <span className="relative z-10 flex items-center gap-3">
                   Gabung Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </span>
              </Button>
              <button className="w-full sm:w-auto h-16 px-10 border border-white/10 hover:border-white text-white font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-3 group">
                 CARA KERJA
              </button>
            </div>
            
            {/* Box Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 -translate-y-16 translate-x-16 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>

          {/* Image Block */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#111111] border border-white/5 overflow-hidden group min-h-[400px] md:min-h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            <img 
              src="/affiliate_hero.png" 
              alt="Affiliate Community" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
            />
            {/* Data Badge */}
            <div className="absolute bottom-8 right-8 z-20 bg-black/80 backdrop-blur-md border border-white/10 p-6 space-y-1 min-w-[200px]">
               <p className="text-orange-600 font-black text-3xl leading-none italic uppercase">12.500+</p>
               <p className="text-white/40 font-bold text-[9px] uppercase tracking-widest leading-none">TOTAL AMBASSADOR AKTIF</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroAffiliate;
