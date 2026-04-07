import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

interface CTAProps {
  onJoin: () => void;
}

const CTASection = ({ onJoin }: CTAProps) => {
  return (
    <section className="py-12 md:py-24 bg-black">
       <div className="container mx-auto px-4 md:px-6">
          <div className="relative group p-12 md:p-32 bg-[#111111] border border-white/5 overflow-hidden text-center hover:border-orange-600 transition-all duration-700">
             
             {/* Background glow overlay */}
             <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-full blur-[160px] pointer-events-none" />

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative z-10 space-y-12"
             >
                <div className="space-y-4">
                   <p className="font-bold text-[10px] uppercase tracking-[0.5em] text-orange-600 leading-none mb-4 italic">SIAP JADI BAGIAN DARI MISI?</p>
                   <h2 className="font-display font-black text-4xl md:text-8xl uppercase tracking-tighter text-white italic leading-[0.85] italic">
                      YUK, MULAI <br /> DAPET DARI LINK <span className="text-white/10 italic">LO SENDIRI.</span>
                   </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                   <Button 
                     onClick={onJoin}
                     className="w-full sm:w-auto h-20 px-12 bg-white hover:bg-orange-600 hover:text-white text-black font-black uppercase tracking-widest text-sm transition-all group overflow-hidden rounded-none shadow-2xl shadow-white/5"
                   >
                     <span className="flex items-center gap-4">
                        GABUNG SEKARANG <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                     </span>
                   </Button>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic animate-pulse flex items-center gap-3">
                     <Wallet className="w-4 h-4" /> NO REGISTRATION FEE
                   </p>
                </div>
             </motion.div>

          </div>
       </div>
    </section>
  );
};

export default CTASection;
