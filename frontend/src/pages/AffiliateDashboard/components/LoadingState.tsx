import React from "react";
import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-12 overflow-hidden relative">
      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-50 opacity-20" />
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      <div className="relative flex flex-col items-center gap-10">
         <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                animate={{ 
                  height: [10, 80, 10],
                  backgroundColor: ["#111", "#EA580C", "#111"]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.2, 
                  delay: i * 0.15,
                  ease: "easeInOut" 
                }}
                className="w-1 bg-[#222]"
              />
            ))}
         </div>
         
         <div className="flex flex-col items-center gap-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
            >
               <h2 className="font-display font-black text-[14px] md:text-[18px] uppercase tracking-[1em] text-white pl-[1em]">
                  INITIALIZING HUB
               </h2>
            </motion.div>
            <div className="w-64 h-[1px] bg-white/5 relative overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "100%" }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="absolute inset-0 w-full bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]"
               />
            </div>
            <p className="text-[8px] font-black uppercase text-orange-600/40 tracking-[0.4em] animate-pulse">DEPLOYING SECURITY PROTOCOLS...</p>
         </div>
      </div>

      <div className="absolute bottom-12 left-12 space-y-2 opacity-30">
         <p className="text-[8px] font-black uppercase text-white tracking-[0.3em]">Status: Syncing Agent_DB</p>
         <p className="text-[8px] font-black uppercase text-white tracking-[0.3em]">Module: Affiliate_Core_V2</p>
      </div>
      <div className="absolute bottom-12 right-12 text-right opacity-30">
         <p className="text-[8px] font-black uppercase text-white tracking-[0.3em]">SECURE ACCESS ONLY</p>
         <p className="text-[8px] font-black uppercase text-white tracking-[0.3em] font-mono">0xDEADBEEF4421</p>
      </div>
    </div>
  );
};

export default LoadingState;
