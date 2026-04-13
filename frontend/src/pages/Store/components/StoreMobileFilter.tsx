import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories as defaultCategories, activities, sortOptions } from "@/data/products";

interface StoreMobileFilterProps {
  open: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedActivity: string;
  selectedSort: string;
  priceMin: number;
  priceMax: number;
  filteredCount: number;
  activeFilterCount: number;
  onCategoryChange: (v: string) => void;
  onActivityChange: (v: string) => void;
  onSortChange: (v: string) => void;
  onPriceMinChange: (v: number) => void;
  onPriceMaxChange: (v: number) => void;
  onReset: () => void;
  categories?: string[];
}

const StoreMobileFilter = ({
  open, onClose,
  selectedCategory, selectedActivity, selectedSort,
  priceMin, priceMax, filteredCount, activeFilterCount,
  onCategoryChange, onActivityChange, onSortChange,
  onPriceMinChange, onPriceMaxChange, onReset,
  categories = defaultCategories,
}: StoreMobileFilterProps) => {
  const allCategories = ["Semua Gear", ...categories.filter(c => c !== "Semua Gear")];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#050505] border-t border-white/10 shadow-2xl max-h-[88dvh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-12 h-1 bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-black text-xl text-white uppercase tracking-tighter">Filter</h2>
                {activeFilterCount > 0 && (
                  <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-widest">
                    {activeFilterCount} AKTIF
                  </span>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-6 py-6">

               {/* Sort */}
               <div className="mb-10">
                <p className="font-display font-black text-xs tracking-[0.3em] uppercase text-white/40 mb-4 border-b border-white/10 pb-3">Urutin</p>
                <div className="flex flex-col">
                  {sortOptions.map((opt) => (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSortChange(opt)}
                      className={`flex items-center justify-between font-display font-black text-[11px] uppercase tracking-[0.2em] py-4 border-b border-white/5 transition-all duration-200 ${
                        selectedSort === opt
                          ? "text-orange-500"
                          : "text-white/60"
                      }`}
                    >
                      {opt}
                      {selectedSort === opt && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="mb-10">
                <p className="font-display font-black text-xs tracking-[0.3em] uppercase text-white/40 mb-4 border-b border-white/10 pb-3">Kategori</p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onCategoryChange(cat)}
                      className={`inline-flex items-center gap-1.5 font-display font-black uppercase text-[10px] tracking-[0.1em] py-2.5 px-5 transition-all duration-200 border ${
                        selectedCategory === cat
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-transparent text-white/70 border-white/10"
                      }`}
                    >
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="mb-10">
                <p className="font-display font-black text-xs tracking-[0.3em] uppercase text-white/40 mb-4 border-b border-white/10 pb-3">Kegiatan</p>
                <div className="flex flex-wrap gap-2">
                  {activities.map((act) => (
                    <motion.button
                      key={act}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onActivityChange(act)}
                      className={`inline-flex items-center gap-1.5 font-display font-black uppercase text-[10px] tracking-[0.1em] py-2.5 px-5 transition-all duration-200 border ${
                        selectedActivity === act
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-transparent text-white/70 border-white/10"
                      }`}
                    >
                      {selectedActivity === act && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {act}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <p className="font-display font-black text-xs tracking-[0.3em] uppercase text-white/40 mb-4 border-b border-white/10 pb-3">Budget</p>
                <div className="flex items-center justify-between font-display font-black tracking-widest text-[10px] text-white/60 mb-5">
                  <span className="bg-[#111111] border border-white/10 px-3 py-1.5">RP {fmtK(priceMin)}</span>
                  <span className="text-white/20">—</span>
                  <span className="bg-[#111111] border border-white/10 px-3 py-1.5">RP {fmtK(priceMax)}</span>
                </div>
                <div className="space-y-4">
                  <div className="relative h-1 bg-white/10">
                     <input
                      type="range" min={MIN_PRICE} max={MAX_PRICE} step={5000}
                      value={priceMin}
                      onChange={(e) => { const v = Number(e.target.value); if (v < priceMax) onPriceMinChange(v); }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                     />
                     <div className="absolute left-0 h-full bg-orange-500 pointer-events-none" style={{ width: `${(priceMin / MAX_PRICE) * 100}%` }} />
                  </div>
                  <div className="relative h-1 bg-white/10">
                     <input
                      type="range" min={MIN_PRICE} max={MAX_PRICE} step={5000}
                      value={priceMax}
                      onChange={(e) => { const v = Number(e.target.value); if (v > priceMin) onPriceMaxChange(v); }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                     />
                     <div className="absolute left-0 h-full bg-orange-500 pointer-events-none" style={{ width: `${(priceMax / MAX_PRICE) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/10 shrink-0 flex gap-3 bg-[#0a0a0a]">
              <button
                onClick={onReset}
                className="flex-1 font-display font-black uppercase text-[10px] tracking-widest text-white/40 border border-white/10 hover:text-white transition-colors"
              >
                Mulai Ulang
              </button>
              <button className="flex-[2] font-display font-black uppercase text-xs tracking-widest px-4 py-4 bg-orange-500 text-white" onClick={onClose}>
                Pasang {filteredCount} Barang
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoreMobileFilter;
