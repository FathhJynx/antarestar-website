import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronRight, ChevronLeft } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

const TESTIMONIALS = [
  { 
    name: "ADITYA PUTRA", 
    role: "Operational Manager", 
    company: "Pertamina Geothermal", 
    text: "Gak sangka kualitas produksinya sebagus ini. Jaket taktikalnya bener-bener dipake kerja lapangan & tujuannya tercapai: tim kelihatan profesional & terlindungi." 
  },
  { 
    name: "REZA SYAH", 
    role: "Founder", 
    company: "Indopora Running Club", 
    text: "Prosesnya cepet banget! Dari desain mockup sampe barang nyampe cuma butuh 14 hari. Member kita seneng banget sama material jersey-nya." 
  },
  { 
    name: "SITI AISYAH", 
    role: "Head of HR", 
    company: "Unilever Indonesia", 
    text: "Employee Kit Antarestar jadi kado favorit di acara outing kemarin. Brandingnya presisi, box-nya premium. Totally recommended buat corporate gifting." 
  }
];

const TestimonialSlider = () => {
  const [current, setCurrent] = React.useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-24 md:py-48 bg-black overflow-hidden">
       <div className="container mx-auto px-6">
          
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             
             {/* Text Side */}
             <Reveal className="space-y-12">
                <div className="space-y-4">
                   <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">Apa kata mereka?</p>
                   <h2 className="font-display font-black text-4xl md:text-8xl uppercase tracking-tighter text-white italic leading-[0.9] italic">
                      TRUSTED BY <br /> <span className="text-white/10">THE PROS.</span>
                   </h2>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={prev}
                     className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all active:scale-95"
                   >
                      <ChevronLeft className="w-6 h-6" />
                   </button>
                   <button 
                     onClick={next}
                     className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-orange-600 hover:border-orange-600 transition-all active:scale-95"
                   >
                      <ChevronRight className="w-6 h-6" />
                   </button>
                </div>
             </Reveal>

             {/* Slider Side */}
             <div className="relative">
                <AnimatePresence mode="wait">
                   <motion.div 
                     key={current}
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -50 }}
                     transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                     className="bg-[#0D0D0D] p-12 md:p-20 rounded-[4rem] border border-white/5 relative"
                   >
                      <Quote className="absolute top-12 right-12 w-24 h-24 text-white/5" />
                      
                      <div className="space-y-12 relative z-10">
                         <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-orange-600 text-orange-600" />)}
                         </div>

                         <p className="font-display font-black text-2xl md:text-3xl text-white italic leading-relaxed uppercase tracking-tighter">
                            "{TESTIMONIALS[current].text}"
                         </p>

                         <div className="space-y-2 pt-8 border-t border-white/5">
                            <h4 className="font-display font-black text-2xl text-white uppercase italic leading-none">{TESTIMONIALS[current].name}</h4>
                            <p className="text-orange-600 font-bold text-[10px] uppercase tracking-widest">{TESTIMONIALS[current].role} • {TESTIMONIALS[current].company}</p>
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

export default TestimonialSlider;
