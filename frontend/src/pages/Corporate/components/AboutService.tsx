import React from "react";
import { motion } from "framer-motion";
import { Target, Zap, ShieldCheck, TrendingUp, Check } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

const PROP_CARDS = [
  { icon: Target, title: "Custom sesuai kebutuhan", desc: "Dari desain bordir logo sampai detail teknis seperti waterproof coating & heat seal." },
  { icon: Zap, title: "Produksi rapi & scalable", desc: "Kami punya workflow efisien buat handle ratusan sampai ribuan unit dalam waktu singkat." },
  { icon: ShieldCheck, title: "Material Premium", desc: "Bahan gear outdoor grade-A yang tahan banting untuk kondisi lapangan tersulit." },
  { icon: TrendingUp, title: "Cocok untuk lapangan", desc: "Gear yang di-desain khusus buat mobilitas tinggi tim lo di gunung maupun kota." }
];

const AboutService = () => {
  return (
    <section className="py-24 md:py-48 bg-black relative">
       {/* Background accent */}
       <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

       <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
             
             {/* Text Side */}
             <Reveal className="space-y-10 md:space-y-16">
                <div className="space-y-4">
                   <p className="font-bold text-[9px] uppercase tracking-[0.4em] text-orange-600 leading-none">Antarestar B2B Excellence</p>
                   <h2 className="font-display font-black text-3xl sm:text-4xl md:text-7xl uppercase text-white leading-tight tracking-tighter">
                      KENAPA PILIH <br /> <span className="text-white/10 uppercase">ANTARESTAR?</span>
                   </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {PROP_CARDS.map((card, i) => (
                      <div key={i} className="group space-y-4">
                         <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-600 transition-all duration-500">
                            <card.icon className="w-6 h-6 text-orange-600 group-hover:text-white transition-all" />
                         </div>
                         <div>
                            <h4 className="font-bold text-white text-lg uppercase mb-2 tracking-tight">{card.title}</h4>
                            <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="flex flex-col gap-4 text-white/60 text-xs font-bold uppercase tracking-widest pt-8">
                   <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-none bg-white/10 flex items-center justify-center text-orange-600"><Check className="w-3.5 h-3.5" /></div>
                      FREE DIGITAL SAMPLE
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-none bg-white/10 flex items-center justify-center text-orange-600"><Check className="w-3.5 h-3.5" /></div>
                      QUALITY CONTROL GARANTI
                   </div>
                </div>
             </Reveal>

             {/* Visual Side */}
             <Reveal direction="left" className="relative group">
                <div className="absolute -inset-4 bg-orange-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                <div className="relative aspect-[4/5] rounded-none overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                   <img 
                      src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" 
                      alt="Outdoor Team Gear" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                   />
                </div>
                {/* Float Badge */}
                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-none shadow-2xl space-y-2 hidden md:block">
                   <p className="text-black font-black text-4xl leading-none italic uppercase">4.9★</p>
                   <p className="text-black/40 font-bold text-[8px] uppercase tracking-widest leading-none">TRUSTED RATING CLIENT</p>
                </div>
             </Reveal>

          </div>
       </div>
    </section>
  );
};

export default AboutService;
