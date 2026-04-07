import React from "react";
import { Star, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";

const BENEFITS = [
  { 
    icon: Star, 
    title: "KOMISI GEDE", 
    desc: "Dapet up to 10% dari tiap penjualan. Cuan paling kompetitif di market outdoor." 
  },
  { 
    icon: ShieldCheck, 
    title: "AKSES PRIORITAS", 
    desc: "Cobain produk terbaru Antarestar duluan sebelum rilis resmi ke publik." 
  },
  { 
    icon: Zap, 
    title: "PAYOUT CEPET", 
    desc: "Sistem payout otomatis tiap bulan tanpa minimum saldo yang nyusahin lo." 
  },
  { 
    icon: TrendingUp, 
    title: "SUPPORT TIM", 
    desc: "Dapet akses ke grup komunitas & materi marketing buat naikin penjualan lo." 
  }
];

const BenefitGrid = () => {
  return (
    <section className="py-12 md:py-24 bg-black">
       <div className="container mx-auto px-4 md:px-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
             
             {/* Large Info Block */}
             <Reveal className="p-8 md:p-16 bg-[#111111] border border-white/5 flex flex-col justify-center space-y-8 min-h-[400px] md:min-h-[500px]">
                <div className="space-y-4">
                   <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">AMBASSADOR VALUE</p>
                   <h2 className="font-display font-black text-4xl md:text-7xl uppercase text-white leading-tight italic tracking-tighter">
                      KEUNTUNGAN <br /> <span className="text-white/10 italic">YANG NYATA.</span>
                   </h2>
                </div>
                <p className="text-white/40 text-sm md:text-xl leading-relaxed max-w-sm">Lo bukan cuma sekedar partner, tapi bagian dari gear-testing mission kita di seluruh Indonesia.</p>
             </Reveal>

             {/* Grid Block */}
             <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {BENEFITS.map((benefit, i) => (
                   <div key={i} className="group relative p-12 bg-[#111111] border border-white/5 hover:border-orange-600 transition-all duration-700 space-y-8 overflow-hidden">
                      {/* Icon */}
                      <div className="w-14 h-14 bg-black border border-white/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-700">
                         <benefit.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="space-y-4">
                         <h4 className="font-display font-black text-2xl text-white uppercase italic leading-none">{benefit.title}</h4>
                         <p className="text-white/30 text-sm leading-relaxed font-body">{benefit.desc}</p>
                      </div>
                   </div>
                ))}
             </StaggerContainer>

          </div>

       </div>
    </section>
  );
};

export default BenefitGrid;
