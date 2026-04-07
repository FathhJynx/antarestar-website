import React from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/AnimationPrimitives";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const CorporateFooter = () => {
  return (
    <footer className="pt-24 bg-black overflow-hidden">
       <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-24 md:pb-48">
             
             {/* Brand Side */}
             <div className="md:col-span-2 space-y-12">
                <div className="space-y-4">
                   <h1 className="font-display font-black text-4xl text-white uppercase italic tracking-tighter">ANTARESTAR.</h1>
                   <p className="text-white/30 text-sm max-w-sm leading-relaxed uppercase tracking-widest font-black italic">GEAR FOR EXPLORERS. GEAR FOR CORPORATES.</p>
                </div>
                <div className="flex gap-4">
                   {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
                      <button key={i} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all active:scale-95">
                         <Icon className="w-5 h-5" />
                      </button>
                   ))}
                </div>
             </div>

             {/* Quick Links */}
             <div className="space-y-8">
                <h4 className="font-display font-black text-xl text-white uppercase italic tracking-tighter">QUICK NAV.</h4>
                <div className="flex flex-col gap-4 text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
                   <Link to="/" className="hover:text-orange-600 transition-colors">HOME</Link>
                   <Link to="/store" className="hover:text-orange-600 transition-colors">STORE</Link>
                   <Link to="/corporate" className="hover:text-orange-600 transition-colors">B2B HUB</Link>
                   <Link to="/about" className="hover:text-orange-600 transition-colors">OUR STORY</Link>
                </div>
             </div>

             {/* Contact */}
             <div className="space-y-8">
                <h4 className="font-display font-black text-xl text-white uppercase italic tracking-tighter">CONTACT.</h4>
                <div className="flex flex-col gap-6 text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
                   <div className="flex items-center gap-4">
                      <Mail className="w-5 h-5 text-orange-600" />
                      CO@ANTARESTAR.COM
                   </div>
                   <div className="flex items-center gap-4">
                      <Phone className="w-5 h-5 text-orange-600" />
                      +62 812-3456-7890
                   </div>
                   <div className="flex items-center gap-4">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      JAKARTA HUB
                   </div>
                </div>
             </div>

          </div>
       </div>

       {/* Massive Typography Footer Reveal */}
       <div className="relative border-t border-white/5 overflow-hidden py-1; md:py-20 group">
          <Reveal direction="up" className="container mx-auto px-6 overflow-hidden">
             <h1 
                className="font-display font-black text-[12vw] sm:text-[20vw] text-white/5 leading-none italic uppercase tracking-tighter select-none transition-all duration-1000 group-hover:text-white/10 group-hover:drop-shadow-[0_0_100px_rgba(255,255,255,0.05)]"
                style={{ marginLeft: "-2%" }}
             >
                ANTARESTAR
             </h1>
          </Reveal>
          
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 py-10 border-t border-white/5">
              <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-center md:text-left">© 2026 PT. ANTARESTAR HUB EKSELENSIA. ALL RIGHTS RESERVED.</p>
              <div className="flex items-center gap-8">
                 <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em] hover:text-orange-600 transition-all cursor-pointer">PRIVACY POLICY</p>
                 <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.5em] hover:text-orange-600 transition-all cursor-pointer">TERMS OF MISSION</p>
              </div>
          </div>
       </div>
    </footer>
  );
};

export default CorporateFooter;
