import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/AnimationPrimitives";
import heroBg from "@/assets/community-3.jpg";

interface MemberHeroProps {
  profile: any;
  progressPercentage: number;
}

const MemberHero = ({ profile, progressPercentage }: MemberHeroProps) => {
  return (
    <div className="relative h-[400px] bg-black overflow-hidden flex items-end border-b border-white/5">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }} 
          animate={{ scale: 1, opacity: 0.4 }} 
          transition={{ duration: 2 }}
          src={heroBg} 
          className="absolute inset-0 w-full h-full object-cover grayscale" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent z-[1]" />
        
        <div className="relative z-10 p-12 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
           <Reveal delay={0.1}>
              <div className="space-y-2">
                <p className="text-orange-600 font-display font-black uppercase tracking-[0.4em] text-xs">OFFICIAL EXPLORER</p>
                <h1 className="font-display font-black text-4xl md:text-7xl text-white uppercase tracking-tighter italic leading-[0.85]">
                   SIAP <br /> MENDAKI.
                </h1>
              </div>
           </Reveal>

           <Reveal delay={0.25}>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-none w-full md:w-[320px] shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tier Progress</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">{profile.tier}</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-none overflow-hidden mb-4">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${progressPercentage}%` }} 
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]" 
                    />
                 </div>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                    Butuh <span className="text-white">{(profile.nextTierPoints - profile.points).toLocaleString()} AP</span> lagi buat naik level selanjutnya.
                 </p>
              </div>
           </Reveal>
        </div>
    </div>
  );
};

export default MemberHero;
