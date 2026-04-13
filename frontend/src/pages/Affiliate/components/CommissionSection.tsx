import React from "react";
import { motion } from "framer-motion";
import { DollarSign, CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

const DETAIL_ITEMS = [
  "Komisi dasar 5% untuk semua kategori produk",
  "Akses ke dashboard tracking real-time",
  "Payout tiap tanggal 15 setiap bulannya",
  "No minimum withdrawal (ga ribet cairin saldo)",
  "Cookie 30 hari (lo tetep dapet cuan kalo user beli ntar)"
];

interface CommissionProps {
  onJoin: () => void;
}

const CommissionSection = ({ onJoin }: CommissionProps) => {
  return (
    <section className="py-24 bg-black overflow-hidden">
       <div className="container mx-auto px-4 md:px-6">
          <div className="bg-[#111111] border border-white/5 p-8 sm:p-12 md:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-24">
             
             {/* Text Block */}
             <Reveal className="space-y-6 md:space-y-12 flex-1 w-full text-center lg:text-left">
                <div className="space-y-4">
                   <p className="font-bold text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">SKEMA KOMISI</p>
                   <h2 className="font-display font-black text-[clamp(3rem,12vw,8rem)] uppercase text-white leading-[0.8] tracking-tighter">
                      10% <br /> <span className="text-white/10">CUAN.</span>
                   </h2>
                </div>
                <p className="text-white/40 text-sm md:text-xl leading-relaxed max-w-sm mx-auto lg:mx-0 font-body">Dapet komisi gede dari gear outdoor terbaik di Indonesia. Tanpa drama, langsung cair.</p>
             </Reveal>

             {/* Detail Block */}
             <Reveal direction="left" className="flex-1 w-full max-w-2xl">
                <div className="bg-black/80 backdrop-blur-md border border-white/10 p-8 sm:p-12 md:p-16 space-y-12 group hover:border-orange-600 transition-all duration-700">
                   <div className="space-y-6">
                      {DETAIL_ITEMS.map((item, i) => (
                         <div key={i} className="flex items-start gap-4 md:gap-8 group/item">
                            <div className="w-8 h-8 md:w-10 md:h-10 border border-white/10 shrink-0 flex items-center justify-center text-orange-600 group-hover/item:bg-orange-600 group-hover/item:text-white transition-all duration-300">
                               <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <p className="text-white/40 text-[10px] sm:text-xs md:text-sm font-black group-hover/item:text-white transition-colors uppercase tracking-[0.1em] leading-relaxed pt-2 md:pt-3">{item}</p>
                         </div>
                      ))}
                   </div>

                   <button 
                     onClick={onJoin}
                     className="h-16 md:h-20 w-full bg-orange-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-xs md:text-sm transition-all group overflow-hidden rounded-none shadow-2xl shadow-orange-600/20"
                   >
                      DAFTAR SEKARANG & MULAI CUAN
                   </button>
                </div>
             </Reveal>

          </div>
       </div>
    </section>
  );
};

export default CommissionSection;
