import React from "react";
import { motion } from "framer-motion";
import { Search, PenTool, Factory, Truck } from "lucide-react";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";

const STEPS = [
  { icon: Search, title: "Konsultasi Kebutuhan", desc: "Ceritain apa yang lo butuhin. Budget, jumlah, & jenis produk." },
  { icon: PenTool, title: "Desain & Approval", desc: "Kita bantu bikinin mockup digital sampe lo sreg sama hasilnya." },
  { icon: Factory, title: "Produksi", desc: "Gear diproses dengan material premium di workshop Antarestar." },
  { icon: Truck, title: "Pengiriman", desc: "Barang siap meluncur ke basecamp tim lo tepat waktu." }
];

const ProcessSteps = () => {
  return (
    <section className="py-24 md:py-40 bg-[#090909] text-white">
       <div className="container mx-auto px-6">
          
          <Reveal className="text-center mb-24 md:mb-32">
             <div className="space-y-4">
                <p className="font-bold text-[9px] uppercase tracking-[0.5em] text-orange-600 leading-none mb-4">Gimana cara mulai?</p>
                <h2 className="font-display font-black text-4xl md:text-8xl uppercase tracking-tighter leading-none italic italic">
                   FLOW KERJA <br /> <span className="text-white/10">ANTI RIBET.</span>
                </h2>
             </div>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             {/* Connector line (Desktop) */}
             <div className="absolute top-[3.5rem] left-[10%] right-[10%] h-[2px] bg-white/5 hidden md:block" />

             {STEPS.map((step, i) => (
                <div key={i} className="group relative pt-4 space-y-12 md:space-y-16">
                   {/* Step Number Dot */}
                   <div className="flex items-center justify-between md:justify-center relative z-10">
                      <div className="w-24 h-24 rounded-full border-4 border-[#090909] bg-white/5 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-700">
                         <step.icon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="md:hidden flex-1 h-[2px] bg-white/5 mx-4" />
                      <span className="font-display font-black text-4xl text-white/5 italic">0{i+1}</span>
                   </div>

                   <div className="space-y-4 md:text-center">
                      <h4 className="font-display font-black text-2xl uppercase tracking-tighter text-white group-hover:text-orange-600 transition-colors italic leading-none">{step.title}</h4>
                      <p className="text-white/40 text-sm max-w-xs md:mx-auto leading-relaxed">{step.desc}</p>
                   </div>
                </div>
             ))}
          </StaggerContainer>

       </div>
    </section>
  );
};

export default ProcessSteps;
