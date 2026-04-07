import React from "react";
import { motion } from "framer-motion";

const CLIENT_LOGOS = [
  "/logos/nike.png",
  "/logos/adidas.png",
  "/logos/tnf.png",
  "/logos/nike.png",
  "/logos/adidas.png",
  "/logos/tnf.png"
];

const TrustMarquee = () => {
  return (
    <section className="py-24 md:py-20 bg-[#090909] border-y border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
         <p className="font-body text-[8px] font-black uppercase tracking-[0.6em] text-white/20">DI PERCAYA OLEH TIM & PERUSAHAAN</p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div
           animate={{ x: [0, -1035] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="flex gap-20 items-center justify-around translate-z-0"
        >
          {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
            <div key={i} className="grayscale opacity-20 hover:opacity-100 transition-all duration-500 hover:scale-110">
               <img src={logo} alt="Client" className="h-8 md:h-10 w-auto object-contain opacity-50" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustMarquee;
