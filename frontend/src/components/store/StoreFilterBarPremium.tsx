import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Search, X, ChevronRight, Zap } from "lucide-react";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileFilter: () => void;
  activeCount: number;
}

const StoreFilterBarPremium = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onOpenMobileFilter,
  activeCount
}: FilterBarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400); // Only stick after hero
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const allCats = ["Semua", ...categories];

  return (
    <div 
      className={`sticky top-0 z-[60] w-full transition-all duration-500 ${
        isScrolled 
          ? "bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 space-y-4">
        
        {/* Top Row: Search & Filters */}
        <div className="flex items-center gap-3 w-full">
           {/* Gojek Style Search Bar */}
           <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-orange-500 transition-colors">
                 <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input 
                 type="text"
                 placeholder="Cari jaket buat naik gunung?"
                 value={searchQuery}
                 onChange={(e) => onSearchChange(e.target.value)}
                 className="w-full h-12 sm:h-14 bg-white/[0.05] border border-white/10 rounded-2xl pl-12 pr-4 text-white font-display font-bold text-xs sm:text-sm tracking-wide focus:outline-none focus:border-orange-500 focus:bg-white/[0.08] transition-all placeholder:text-white/20"
              />
              {searchQuery && (
                 <button 
                    onClick={() => onSearchChange("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                 >
                    <X className="w-4 h-4" />
                 </button>
              )}
           </div>

           {/* Filter Trigger Button */}
           <button 
              onClick={onOpenMobileFilter}
              className="relative h-12 sm:h-14 px-5 bg-white/[0.05] border border-white/10 rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:border-orange-600 transition-all group"
           >
              <SlidersHorizontal className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              {activeCount > 0 && (
                 <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-orange-600 text-white font-black text-[9px] flex items-center justify-center px-1 rounded-full border-2 border-black">
                    {activeCount}
                 </span>
              )}
           </button>
        </div>

        {/* Bottom Row: Category Pills (Horizontal Scroll Like Gojek) */}
        <div className="relative -mx-4 px-4 overflow-hidden">
           <div 
              ref={scrollRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 snap-x"
           >
              {allCats.map((cat, i) => {
                 const isActive = selectedCategory === cat;
                 return (
                    <button
                       key={cat}
                       onClick={() => onCategoryChange(cat)}
                       className={`flex-shrink-0 snap-start px-5 h-9 rounded-full font-display font-black text-[10px] uppercase tracking-wider transition-all border ${
                          isActive 
                             ? "bg-orange-600 border-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.3)]" 
                             : "bg-white/[0.03] border-white/5 text-white/40 hover:text-white hover:bg-white/[0.08]"
                       }`}
                    >
                       {cat}
                    </button>
                 );
              })}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StoreFilterBarPremium;
