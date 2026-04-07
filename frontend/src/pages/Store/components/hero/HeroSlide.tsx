import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSlideProps {
  image: string;
  headline: string;
  sub: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  isActive: boolean;
}

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSlide = ({ image, headline, sub, ctaText, ctaLink, badge, isActive }: HeroSlideProps) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image with Ken Burns */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: isActive ? 1 : 1.08 }}
        transition={{ duration: 12, ease: "linear" }}
        className="absolute inset-0"
      >
        <img
          src={image}
          alt={headline}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Overlay Gradient - readable text */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-[#0B0B0B]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-transparent" />

      {/* Content Container */}
      <div className="relative h-full flex flex-col justify-end z-10 section-container section-padding pb-24 sm:pb-28 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="flex items-center gap-3 mb-4 md:mb-5"
          >
            <span className="w-8 h-px bg-orange-600" />
            <span className="font-display font-black text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-orange-500">
              {badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-[1] text-white mb-4 md:mb-5"
          >
            {headline}
          </motion.h2>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.45, ease }}
            className="font-body text-white/50 text-sm md:text-base lg:text-lg max-w-md leading-relaxed mb-6 md:mb-8"
          >
            {sub}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
          >
            <Link
              to={ctaLink}
              className="group inline-flex items-center gap-3 h-12 md:h-14 px-7 md:px-10 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-display font-black text-[11px] md:text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/30"
            >
              {ctaText}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSlide;
