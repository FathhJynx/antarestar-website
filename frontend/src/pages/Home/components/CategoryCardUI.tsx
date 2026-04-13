import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CategoryItem {
  name: string;
  img: string;
  href: string;
  count: number;
  big: boolean;
}

interface CatCardProps {
  cat: CategoryItem;
  big?: boolean;
  desktopFill?: boolean;
}

export const CategoryCardUI = ({ cat, big = false, desktopFill = false }: CatCardProps) => (
  <Link
    to={cat.href}
    className={`group relative flex flex-col justify-end overflow-hidden w-full bg-[#111111]
      ${desktopFill ? "h-full" : big ? "aspect-[16/7]" : "aspect-[4/5] sm:aspect-[4/3]"} 
      transition-all duration-500`}
  >
    <img src={cat.img} alt={cat.name} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 transition-opacity duration-500" />
    
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
      <ArrowRight className="w-6 h-6 text-white" />
    </div>
    
    <div className="relative p-5 sm:p-8 z-10">
      <p className="font-body text-[10px] text-white/80 font-black uppercase tracking-[0.3em] mb-2 drop-shadow-md">{String(cat.count).padStart(2, '0')} — Produk</p>
      <h3 className={`font-display font-black text-white uppercase tracking-tighter drop-shadow-2xl
        ${big ? "text-3xl sm:text-7xl leading-none" : "text-xl sm:text-4xl leading-none"}`}>
        {cat.name}
      </h3>
    </div>
  </Link>
);
