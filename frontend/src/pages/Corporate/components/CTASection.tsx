import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-24 md:py-48 bg-black">
       <div className="container mx-auto px-6">
          <div className="relative group p-8 md:p-32 rounded-none bg-[#090909] border border-white/5 overflow-hidden text-center">
             
             {/* Background glow overlay */}
             <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-600/5 rounded-none blur-[160px] pointer-events-none" />

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative z-10 space-y-12"
             >
                <div className="space-y-4">
                   <p className="font-bold text-[8px] md:text-[10px] uppercase tracking-[0.5em] text-orange-600 leading-none mb-4 italic">SIAP BIKIN GEAR TIM LO?</p>
                   <h2 className="font-display font-black text-3xl md:text-8xl uppercase tracking-tighter text-white italic leading-[0.85] italic">
                      KITA BANTU DARI <br /> KONSEP <span className="text-white/10">SAMPE JADI.</span>
                   </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                   <Button 
                     asChild
                     className="w-full sm:w-auto h-16 md:h-20 px-12 bg-green-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest rounded-none transition-all group overflow-hidden shadow-2xl shadow-green-600/20"
                   >
                      <a href="https://wa.me/62812345678" target="_blank" rel="noreferrer" className="flex items-center gap-4">
                         <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                         Konsultasi via WhatsApp
                      </a>
                   </Button>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest italic animate-pulse">Fast Response Guarantee</p>
                </div>
             </motion.div>

          </div>
       </div>
    </section>
  );
};

export default CTASection;
