import React from "react";
import { UserPlus, Share2, DollarSign, Repeat } from "lucide-react";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";

const STEPS = [
  { icon: UserPlus, title: "Gabung Program", desc: "Daftar gratis. Ga butuh modal apapun buat mulai." },
  { icon: Share2, title: "Share Link", desc: "Inspirasikan orang lain pake gear yang lo suka." },
  { icon: DollarSign, title: "Dapet Komisi", desc: "Cuan cair tiap ada yang beli lewat link lo." },
  { icon: Repeat, title: "Cairin Saldo", desc: "Tarik komisi lo gampang tiap bulan. No drama." }
];

const HowItWorks = () => {
  return (
    <section className="py-12 md:py-24 bg-black">
       <div className="container mx-auto px-4 md:px-6">
          
          <Reveal className="mb-16">
             <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-600/10 text-orange-600 font-bold uppercase text-[10px] tracking-[0.2em] italic mb-6">
                GIMANA CARA KERJANYA?
             </div>
             <h2 className="font-display font-black text-3xl md:text-6xl uppercase tracking-tighter text-white italic leading-none">
                SHARE GEARNYA, <br /> <span className="text-white/10 italic">DAPET CUANNYA.</span>
             </h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             {STEPS.map((step, i) => (
                <div 
                   key={i} 
                   className="group relative p-12 bg-[#111111] border border-white/5 hover:border-orange-600 transition-all duration-700 min-h-[300px] flex flex-col justify-end overflow-hidden"
                >
                   {/* Step Number Dot */}
                   <div className="absolute top-12 left-12">
                      <span className="font-display font-black text-5xl text-white/5 italic group-hover:text-orange-600/20 transition-all duration-700">0{i+1}</span>
                   </div>
                   
                   <div className="space-y-6 relative z-10">
                      <div className="w-16 h-16 rounded-none bg-black border border-white/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-700">
                         <step.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="space-y-3">
                         <h4 className="font-display font-black text-2xl text-white uppercase italic leading-none">{step.title}</h4>
                         <p className="text-white/30 text-sm leading-relaxed font-body">{step.desc}</p>
                      </div>
                   </div>

                   {/* Hover Accent (Bottom edge) */}
                   <div className="absolute inset-x-0 bottom-0 h-1 bg-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                </div>
             ))}
          </StaggerContainer>

       </div>
    </section>
  );
};

export default HowItWorks;
