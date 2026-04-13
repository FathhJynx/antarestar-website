import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
}

const SearchBar = ({ value, onChange, onOpenFilter, activeFilterCount }: SearchBarProps) => {
  return (
    <div className="w-full max-w-[700px] mx-auto px-4">
      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Mau cari gear apa nih buat muncak?"
          className="w-full h-14 pl-14 pr-16 bg-[#111111] border border-[#1F1F1F] rounded-none text-white placeholder:text-gray-400/50 focus:outline-none focus:border-orange-600 transition-all text-sm font-medium"
        />

        <div className="absolute inset-y-2 right-2">
          <button
            onClick={onOpenFilter}
            className="h-10 px-4 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white rounded-none flex items-center gap-2 transition-all active:scale-95 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[9px] font-black flex items-center justify-center rounded-none border-2 border-black">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
