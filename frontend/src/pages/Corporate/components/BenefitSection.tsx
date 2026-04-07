import React from "react";
import { Building2, Users, Tent, Map } from "lucide-react";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";

const BENEFITS = [
  { 
    icon: Building2, 
    title: "PERUSAHAAN", 
    desc: "Seragam tim operasional, office kits, sampe employee gifting kit eksklusif." 
  },
  { 
    icon: Users, 
    title: "KOMUNITAS", 
    desc: "Kaos member, jaket touring, atau hoodie kustom buat identitas komunitas lo." 
  },
  { 
    icon: Tent, 
    title: "EVENT ORGANIZER", 
    desc: "Gear khusus event outdoor, merchandise lari, atau apparel panitia profesional." 
  },
  { 
    icon: Map, 
    title: "TIM LAPANGAN", 
    desc: "Jaket teknis & apparel khusus buat lo yang kerja di kondisi paling ekstrim." 
  }
];

const BenefitSection = () => {
  return (
    <section className="py-24 md:py-48 bg-[#090909]">
       <div className="container mx-auto px-6">
          
          <div className="text-center mb-20 md:mb-32 space-y-4">
             <Reveal>
                <p className="font-bold text-[9px] uppercase tracking-[0.5em] text-orange-600 leading-none mb-4 italic">COCOK BUAT SIAPA?</p>
                <h2 className="font-display font-black text-4xl md:text-8xl uppercase tracking-tighter text-white italic leading-none italic">
                   SIAP BIKIN GEAR <br /> <span className="text-white/10">UNTUK TIM LO?</span>
                </h2>
             </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4">
             {BENEFITS.map((benefit, i) => (
                <div 
                   key={i} 
                   className="group relative p-12 bg-black border border-white/5 hover:border-orange-600 rounded-none transition-all duration-700 h-[400px] flex flex-col justify-end overflow-hidden"
                >
                   {/* Background accent */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 -translate-y-16 translate-x-16 rounded-none blur-[60px] group-hover:bg-orange-600/20 transition-all duration-1000" />
                   
                   <div className="space-y-8 relative z-10">
                      <div className="w-16 h-16 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white group-hover:rotate-12 transition-all duration-700">
                         <benefit.icon className="w-8 h-8" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="font-display font-black text-2xl md:text-3xl text-white uppercase italic leading-none">{benefit.title}</h4>
                         <p className="text-white/30 text-xs md:text-sm leading-relaxed font-body">{benefit.desc}</p>
                      </div>
                   </div>

                   {/* Hover Glow */}
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
             ))}
          </StaggerContainer>

       </div>
    </section>
  );
};

export default BenefitSection;
