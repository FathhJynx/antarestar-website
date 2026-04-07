import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";

const SHOWCASE_ITEMS = [
  { 
    id: 1, 
    title: "JAKET KUSTOM", 
    desc: "Windbreaker premium dengan logo bordir presisi tinggi untuk tim operasional.",
    img: "/corporate_jacket.png",
    size: "col-span-1 row-span-2"
  },
  { 
    id: 2, 
    title: "SERAGAM LAPANGAN", 
    desc: "Bahan tactical yang adem & kuat.",
    img: "/corporate_jersey.png",
    size: "col-span-1 row-span-1"
  },
  { 
    id: 3, 
    title: "CARRIER & BAGS", 
    desc: "Tas lapangan untuk logistik khusus.",
    img: "/corporate_carrier.png",
    size: "col-span-1 row-span-1"
  },
  { 
    id: 4, 
    title: "OUTDOOR GEAR", 
    desc: "Perlengkapan ekspedisi tim profesional.",
    img: "/corporate_watch.png",
    size: "col-span-2 row-span-1"
  }
];

const ProductShowcase = () => {
  return (
    <section className="py-24 md:py-48 bg-black">
       <div className="container mx-auto px-6">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 md:mb-32">
             <Reveal className="space-y-4">
                <p className="font-bold text-[9px] uppercase tracking-[0.6em] text-orange-600 leading-none">Produk High-End</p>
                <h2 className="font-display font-black text-4xl md:text-8xl uppercase tracking-tighter text-white italic italic italic leading-none">
                   CONTOH HASIL <br /> <span className="text-white/10">PRODUKSI.</span>
                </h2>
             </Reveal>
             <Reveal delay={0.2} className="md:w-1/3">
                <p className="text-white/30 text-sm leading-relaxed font-body">Portofolio nyata dari berbagai project corporate yang udah kita kerjain. Kualitas Antarestar yang udah teruji di lapangan.</p>
             </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:auto-rows-[300px]">
             {SHOWCASE_ITEMS.map((item) => (
                <div 
                   key={item.id}
                   className={`group relative bg-[#090909] border border-white/5 hover:border-orange-600 rounded-none overflow-hidden transition-all duration-700 min-h-[300px] ${
                     item.id === 1 ? "md:row-span-2" : 
                     item.id === 4 ? "md:col-span-2" : ""
                   }`}
                >
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20" />
                   
                   {/* Badge */}
                   <div className="absolute top-6 right-6 z-30">
                      <div className="px-3 py-1.5 rounded-none bg-white/5 border border-white/10 backdrop-blur-md">
                         <p className="text-[8px] font-black italic text-orange-600 tracking-widest uppercase">Verified Quality</p>
                      </div>
                   </div>

                   {/* Image Reveal */}
                   <div className="absolute inset-0 z-10 overflow-hidden">
                      <img 
                         src={item.img} 
                         alt={item.title} 
                         className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                      />
                   </div>

                   {/* Info Layer */}
                   <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-20 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="space-y-1">
                         <h4 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tighter italic leading-none">{item.title}</h4>
                      </div>
                      <p className="text-white/40 text-[10px] md:text-xs font-bold leading-relaxed max-w-xs">{item.desc}</p>
                   </div>
                </div>
             ))}
          </StaggerContainer>

       </div>
    </section>
  );
};

export default ProductShowcase;
