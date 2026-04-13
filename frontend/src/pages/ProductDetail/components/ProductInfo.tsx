import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Share2, Heart, ShieldCheck } from "lucide-react";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    category: string;
    description: string;
    sizes: string[];
    colors: { name: string; hex: string }[];
    variants?: any[];
  };
  selectedSize: string;
  selectedColor: string;
  onSetSize: (size: string) => void;
  onSetColor: (color: string) => void;
  onAddToCart: (variant: any) => void;
  onBuyNow: (variant: any) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const ProductInfo = ({ 
  product, 
  selectedSize, 
  selectedColor, 
  onSetSize, 
  onSetColor, 
  onAddToCart, 
  onBuyNow 
}: ProductInfoProps) => {

  return (
    <div className="flex flex-col gap-10">
      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-orange-600 font-display font-black text-[10px] uppercase tracking-[0.4em]">MISSION EQUIPMENT</span>
          <div className="h-px flex-1 bg-[#1F1F1F]" />
          <div className="flex items-center gap-4 text-white/40">
             <Share2 className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
             <Heart className="w-4 h-4 hover:text-orange-500 transition-colors cursor-pointer" />
          </div>
        </div>
        
        <div className="space-y-2">
           <p className="text-white/40 font-display font-medium text-xs uppercase tracking-widest">{product.category} ARCHIVE</p>
           <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tighter leading-[0.9]">
             {product.name}
           </h1>
        </div>

        <div className="flex items-baseline gap-4 pt-2">
          <span className="text-4xl font-display font-black text-white tracking-tighter">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xl text-white/20 line-through font-display font-bold">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4 max-w-lg">
        <p className="text-gray-400 text-sm leading-relaxed font-medium">
          {product.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 bg-white/[0.03] border border-white/5 w-fit px-4 py-2 rounded-none">
           <ShieldCheck className="w-4 h-4 text-orange-600" /> GEAR LO DIJAMIN AMAN (LIFETIME PROTECTION)
        </div>
      </div>

      {/* Variants Selection */}
      <div className="space-y-10 py-6 border-y border-[#1F1F1F]">
        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Warna yang cocok buat lo</p>
            <div className="flex gap-4">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onSetColor(c.name)}
                  className={`w-10 h-10 rounded-none border-2 transition-all p-1 ${
                    selectedColor === c.name ? "border-orange-600" : "border-transparent"
                  }`}
                >
                  <div className="w-full h-full rounded-none" style={{ backgroundColor: c.hex }} title={c.name} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
               <p className="text-white/50">Pilih ukuran yang pas buat lo</p>
               <button className="text-orange-600 hover:text-white transition-colors underline underline-offset-4">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => onSetSize(s)}
                  className={`h-14 rounded-none font-display font-black text-sm uppercase tracking-widest transition-all active:scale-95 border ${
                    selectedSize === s 
                      ? "bg-white text-black border-white shadow-xl shadow-white/5" 
                      : "bg-[#111111] border-[#1F1F1F] text-gray-500 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-4 text-white">
        <button
          onClick={() => onAddToCart({ size: selectedSize, colorHex: selectedColor })}
          className="h-16 bg-white text-black font-display font-black text-[12px] uppercase tracking-[0.3em] rounded-none flex items-center justify-center gap-3 hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-orange-600/20 group"
        >
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" /> Masukin ke Tas
        </button>
        <div className="flex gap-4">
            <button 
              onClick={() => onBuyNow({ size: selectedSize, color: selectedColor || product.colors[0]?.name })}
              className="flex-1 h-14 bg-orange-600 text-white border border-transparent rounded-none font-display font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
                Gas Checkout
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
