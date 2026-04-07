import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Tag, Zap } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";

import promoDiscountBanner from "@/assets/promo-discount-banner.png";
import promoFlashSaleBanner from "@/assets/promo-flashsale-banner.png";

// Nike / Adidas style: full-bleed image campaign cards
const campaigns = [
  {
    title: "Diskon Spesial",
    sub: "Gear pilihan dengan harga lebih hemat",
    cta: "Lihat Semua Diskon",
    link: "/store?sort=Diskon",
    image: promoDiscountBanner,
    icon: Tag,
    accent: "orange",
  },
  {
    title: "Flash Sale 🔥",
    sub: "Waktu terbatas, stok cepat habis",
    cta: "Cek Flash Sale",
    link: "/store?sort=Flash+Sale",
    image: promoFlashSaleBanner,
    icon: Zap,
    accent: "red",
  },
];

const PromoCards = () => {
  return (
    <section className="section-container section-padding py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {campaigns.map((c, i) => {
          const isRed = c.accent === "red";
          return (
            <FadeIn key={c.title} delay={i * 0.12}>
              <Link
                to={c.link}
                className="group relative block w-full overflow-hidden aspect-[16/9] md:aspect-[16/8]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Dark overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>

                {/* Content — Nike style bottom-left aligned */}
                <div className="relative h-full flex flex-col justify-end p-5 sm:p-6 md:p-8 lg:p-10 z-10">
                  {/* Icon Badge */}
                  <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${
                    isRed ? "bg-red-600" : "bg-orange-600"
                  }`}>
                    <c.icon className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-[0.95] mb-2 md:mb-3">
                    {c.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-body text-white/60 text-xs sm:text-sm md:text-base leading-relaxed mb-4 md:mb-6 max-w-sm">
                    {c.sub}
                  </p>

                  {/* CTA — Nike pill button style */}
                  <div className="flex items-center">
                    <span className={`inline-flex items-center gap-2 h-10 md:h-12 px-5 md:px-7 rounded-full font-display font-black text-[10px] md:text-xs uppercase tracking-[0.15em] text-white transition-all duration-500 ${
                      isRed
                        ? "bg-red-600 group-hover:bg-red-500"
                        : "bg-orange-600 group-hover:bg-orange-500"
                    }`}>
                      {c.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </div>
                </div>

                {/* Hover border glow */}
                <div className={`absolute inset-0 rounded-2xl md:rounded-3xl border-2 transition-colors duration-500 pointer-events-none ${
                  isRed
                    ? "border-transparent group-hover:border-red-600/40"
                    : "border-transparent group-hover:border-orange-600/40"
                }`} />
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
};

export default PromoCards;
