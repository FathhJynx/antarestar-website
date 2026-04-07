import React, { useState, useEffect } from "react";
import { X, Shield, ArrowRight, Zap, Target, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MissionBriefing = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenBriefing = localStorage.getItem("affiliate_briefing_seen");
    if (!hasSeenBriefing) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeBriefing = () => {
    localStorage.setItem("affiliate_briefing_seen", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-12 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBriefing}
            className="absolute inset-0 bg-black/98 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: 10 }}
            className="w-full max-w-5xl bg-[#090909] border border-white/5 relative flex flex-col md:flex-row overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            {/* Left Visual Block - Tactial Accent */}
            <div className="w-full md:w-[35%] bg-orange-600 p-8 md:p-12 flex flex-col justify-between relative order-2 md:order-1">
               <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
               
               <div className="hidden md:block">
                  <Shield className="w-12 h-12 text-black/20" />
               </div>

               <div className="space-y-4 relative z-10 pt-10 md:pt-0">
                  <p className="text-[8px] font-black uppercase text-black/30 tracking-[0.4em] mb-2 font-mono">ID: DEPLOY_AUTH_772</p>
                  <h3 className="font-display font-black text-3xl md:text-5xl uppercase text-black leading-none tracking-tighter">
                     AGENT <br /> ENROLLED.
                  </h3>
               </div>
            </div>

            {/* Right Content - Command Data */}
            <div className="flex-1 p-6 sm:p-10 lg:p-16 space-y-8 md:p-12 relative order-1 md:order-2 bg-[radial-gradient(circle_at_top_right,rgba(234,88,12,0.05),transparent)]">
               <button 
                 onClick={closeBriefing}
                 className="absolute top-6 right-6 md:top-8 md:right-8 text-white/20 hover:text-white transition-colors p-2 bg-white/5 md:bg-transparent rounded-full md:rounded-none z-50"
               >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
               </button>

               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-orange-600/10 border border-orange-600/20">
                     <Zap className="w-3 h-3 text-orange-600 fill-orange-600" />
                     <p className="text-[9px] font-black uppercase text-orange-600 tracking-[0.3em]">MISSION_BRIEFING.DOC</p>
                  </div>
                  <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase text-white tracking-tighter leading-[0.9]">
                     SELAMAT DATANG <br className="hidden sm:block" /> DI COMMAND CENTER.
                  </h2>
                  <p className="font-body text-xs md:text-sm text-white/40 leading-relaxed max-w-xl">
                     Sekarang lo bukan cuma customer, lo adalah Agent Resmi Antarestar. Ini adalah pusat kendali lo buat pantau cuan, gear, dan performa link lo. Gas gear up! 🔥
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 py-6 border-y border-white/5">
                  <div className="space-y-3">
                     <Target className="w-5 h-5 text-orange-600" />
                     <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">OBJECTIVE</p>
                     <p className="text-[9px] font-bold text-white/20 uppercase leading-relaxed tracking-wider">Share gear terbaik lo pake link affiliate & dapet komisi flat 10%.</p>
                  </div>
                  <div className="space-y-3">
                     <TrendingUp className="w-5 h-5 text-orange-600" />
                     <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">TARGET RANKS</p>
                     <p className="text-[9px] font-bold text-white/20 uppercase leading-relaxed tracking-wider">Naikin status lo jadi Platinum Agent buat nikmatin benefit premium.</p>
                  </div>
               </div>

               <div className="pt-4">
                  <button 
                    onClick={closeBriefing}
                    className="w-full md:w-auto h-16 px-12 bg-white text-black hover:bg-orange-600 hover:text-white transition-all font-display font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-4 justify-center"
                  >
                     AYO GEAR UP! <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MissionBriefing;
