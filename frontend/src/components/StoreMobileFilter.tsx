import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categories, activities, sortOptions } from "@/data/products";
import { fmtK, MIN_PRICE, MAX_PRICE } from "@/components/StoreFilterSidebar";

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
}

const StoreMobileFilter = ({
  open, onClose,
  selectedCategory, selectedActivity, selectedSort,
  priceMin, priceMax, filteredCount, activeFilterCount,
  onCategoryChange, onActivityChange, onSortChange,
  onPriceMinChange, onPriceMaxChange, onReset,
}: StoreMobileFilterProps) => {
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
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background rounded-t-3xl shadow-2xl max-h-[88dvh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-base">Filter Produk</h2>
                {activeFilterCount > 0 && (
                  <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-body">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-5 py-4">

              {/* Category */}
              <div className="mb-6">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Kategori</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onCategoryChange(cat)}
                      className={`inline-flex items-center gap-1.5 font-body text-sm py-2 px-4 rounded-full border transition-all duration-200 ${
                        selectedCategory === cat
                          ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      {selectedCategory === cat && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div className="mb-6">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Aktivitas</p>
                <div className="flex flex-wrap gap-2">
                  {activities.map((act) => (
                    <motion.button
                      key={act}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onActivityChange(act)}
                      className={`inline-flex items-center gap-1.5 font-body text-sm py-2 px-4 rounded-full border transition-all duration-200 ${
                        selectedActivity === act
                          ? "bg-accent text-white border-accent shadow-sm shadow-accent/20"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      {selectedActivity === act && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {act}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Rentang Harga</p>
                <div className="flex items-center justify-between font-body text-sm font-semibold text-foreground mb-3">
                  <span className="bg-card border border-border rounded-xl px-3 py-1.5">Rp {fmtK(priceMin)}</span>
                  <span className="text-muted-foreground">—</span>
                  <span className="bg-card border border-border rounded-xl px-3 py-1.5">Rp {fmtK(priceMax)}</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="range" min={MIN_PRICE} max={MAX_PRICE} step={5000}
                    value={priceMin}
                    onChange={(e) => { const v = Number(e.target.value); if (v < priceMax) onPriceMinChange(v); }}
                    className="w-full h-2 rounded-full accent-[hsl(var(--accent))] cursor-pointer"
                  />
                  <input
                    type="range" min={MIN_PRICE} max={MAX_PRICE} step={5000}
                    value={priceMax}
                    onChange={(e) => { const v = Number(e.target.value); if (v > priceMin) onPriceMaxChange(v); }}
                    className="w-full h-2 rounded-full accent-[hsl(var(--accent))] cursor-pointer"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-3">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">Urutkan</p>
                <div className="flex flex-col gap-1.5">
                  {sortOptions.map((opt) => (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSortChange(opt)}
                      className={`flex items-center justify-between font-body text-sm py-2.5 px-4 rounded-xl border transition-all duration-200 ${
                        selectedSort === opt
                          ? "bg-accent/10 text-accent border-accent/30 font-medium"
                          : "bg-card text-foreground border-border"
                      }`}
                    >
                      {opt}
                      {selectedSort === opt && <Check className="w-4 h-4 text-accent shrink-0" />}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-border shrink-0 flex gap-3">
              <button
                onClick={onReset}
                className="flex-1 font-body text-sm font-semibold text-muted-foreground border border-border rounded-xl py-3 hover:border-foreground/30 transition-colors"
              >
                Reset
              </button>
              <Button variant="hero" className="flex-1 rounded-xl" onClick={onClose}>
                Tampilkan {filteredCount} Produk
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoreMobileFilter;
