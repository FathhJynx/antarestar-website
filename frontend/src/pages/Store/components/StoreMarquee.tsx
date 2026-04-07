import React from "react";
import { motion } from "framer-motion";

/**
 * Awwwards-style infinite scrolling marquee typography.
 * Creates an editorial "ticker" effect commonly seen on high-end fashion
 * and outdoor brand websites (Nike, Adidas, Arc'teryx).
 */
const StoreMarquee = () => {
  const words = [
    "EXPLORE",
    "◆",
    "ADVENTURE",
    "◆",
    "OUTDOOR GEAR",
    "◆",
    "ANTARESTAR",
    "◆",
    "MISSION READY",
    "◆",
    "EQUIPMENT",
    "◆",
  ];

  const marqueeContent = words.join("   ");

  return (
    <section className="relative overflow-hidden py-6 md:py-8 border-y border-[#1F1F1F] bg-[#0B0B0B]">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
          className="flex shrink-0"
        >
          {/* Duplicate content for seamless loop */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {words.map((word, i) => (
                <span
                  key={`${copy}-${i}`}
                  className={`font-display font-black uppercase mx-4 md:mx-6 select-none ${
                    word === "◆"
                      ? "text-orange-600 text-xs md:text-sm"
                      : "text-white/[0.06] text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter hover:text-white/10 transition-colors duration-700"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StoreMarquee;
