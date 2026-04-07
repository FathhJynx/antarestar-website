import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronRight, ChevronLeft, Quote } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

const TESTIMONIALS = [
  { 
    name: "ADITYA PUTRA", 
    role: "Outdoor Influencer", 
    text: "Gue dapet komisi sampe 5 jutaan sebulan cuma dari share link di bio IG. Barangnya emang bagus jadi user ga mikir dua kali buat checkout." 
  },
  { 
    name: "REZA SYAH", 
    role: "Youtube Reviewer", 
    text: "Sistem affiliate paling transparan yang pernah gue pake. Tracking-nya real-time & dashboard-nya gampang dipahami buat liat traffic." 
  },
  { 
    name: "SITI AISYAH", 
    role: "Hiker Community", 
    text: "Beli gear buat komunitas dapet komisi balik? Cuma Antarestar yang bisa. Cuan ini gue balikin lagi buat modal trip member komunitas." 
  }
];

const TestimonialSection = () => {
  const [current, setCurrent] = React.useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 bg-black overflow-hidden">
       <div className="container mx-auto px-4 md:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
             
             {/* Info Block */}
             <Reveal className="space-y-8 md:space-y-12 text-center lg:text-left">
                <div className="space-y-4">
                   <p className="font-body font-bold text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none italic">AMBASSADOR VOICE</p>
                   <h2 className="font-display font-black text-3xl sm:text-4xl md:text-8xl uppercase text-white leading-tight italic tracking-tighter">
                      APA KATA <br /> <span className="text-white/10 italic">MEREKA?</span>
                   </h2>
                </div>
                <div className="flex justify-center lg:justify-start gap-4">
                   <button 
                     onClick={prev}
                     className="w-14 h-14 md:w-16 md:h-16 border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all active:scale-95"
                   >
                      <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={next}
                     className="w-14 h-14 md:w-16 md:h-16 border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all active:scale-95"
                   >
                      <ChevronRight className="w-6 h-6" />
                   </button>
                </div>
             </Reveal>

             {/* Slider Block */}
             <div className="relative w-full max-w-2xl mx-auto lg:mx-0">
                <AnimatePresence mode="wait">
                   <motion.div 
                     key={current}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                     className="bg-[#111111] p-8 sm:p-12 md:p-20 border border-white/5 relative group hover:border-orange-600 transition-all duration-700 min-h-[350px] md:h-[500px] flex flex-col justify-end"
                   >
                      <Quote className="absolute top-8 right-8 md:top-12 md:right-12 w-16 h-16 md:w-24 md:h-24 text-white/5 group-hover:text-orange-600/10 transition-colors" />
                      
                      <div className="space-y-6 md:space-y-10 relative z-10">
                         <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 md:w-4 md:h-4 fill-orange-600 text-orange-600" />)}
                         </div>

                         <p className="font-display font-black text-lg sm:text-xl md:text-3xl text-white leading-relaxed uppercase tracking-tighter">
                            "{TESTIMONIALS[current].text}"
                         </p>

                         <div className="space-y-2 pt-6 md:pt-8 border-t border-white/5">
                            <h4 className="font-display font-black text-xl md:text-2xl text-white uppercase leading-none">{TESTIMONIALS[current].name}</h4>
                            <p className="text-orange-600 font-body font-bold text-[9px] md:text-[10px] uppercase tracking-widest">{TESTIMONIALS[current].role}</p>
                         </div>
                      </div>
                   </motion.div>
                </AnimatePresence>
             </div>

          </div>

       </div>
    </section>
  );
};

export default TestimonialSection;
