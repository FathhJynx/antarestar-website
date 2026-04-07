import React from "react";
import { motion } from "framer-motion";

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const FilterBar = ({ categories, selectedCategory, onCategoryChange }: FilterBarProps) => {
  const allCategories = ["Semua Gear", ...categories];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-3 min-w-max mx-auto justify-center">
        {allCategories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`h-10 px-6 rounded-none font-display font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border ${
                isActive 
                  ? "bg-orange-600 border-orange-600 text-white" 
                  : "bg-[#111111] border-[#1F1F1F] text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
