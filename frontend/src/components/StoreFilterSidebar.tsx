import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { categories, activities } from "@/data/products";
import heroImg from "@/assets/hero-outdoor.jpg";

const MIN_PRICE = 0;
const MAX_PRICE = 2000000;

export const fmtK = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);

interface StoreFilterSidebarProps {
  selectedCategory: string;
  selectedActivity: string;
  priceMin: number;
  priceMax: number;
  onCategoryChange: (v: string) => void;
  onActivityChange: (v: string) => void;
  onPriceMinChange: (v: number) => void;
  onPriceMaxChange: (v: number) => void;
}

const StoreFilterSidebar = ({
  selectedCategory,
  selectedActivity,
  priceMin,
  priceMax,
  onCategoryChange,
  onActivityChange,
  onPriceMinChange,
  onPriceMaxChange,
}: StoreFilterSidebarProps) => {
  return (
    <div className="flex flex-col gap-12 pr-6">
      {/* ── Category ── */}
      <div>
        <h3 className="font-display font-black text-xs tracking-[0.3em] uppercase mb-6 text-white/40 border-b border-white/10 pb-4">
          Label Kategori
        </h3>
        <div className="flex flex-col">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(cat)}
              className={`text-left font-display text-[11px] py-4 border-b border-white/5 uppercase tracking-[0.2em] font-black transition-all duration-300 flex items-center justify-between group ${
                selectedCategory === cat
                  ? "text-orange-500"
                  : "text-white/60 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {cat}
              <div className={`w-1.5 h-1.5 rounded-none transition-all ${
                selectedCategory === cat ? "bg-orange-500" : "bg-transparent group-hover:bg-white/20"
              }`} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Activity ── */}
      <div>
        <h3 className="font-display font-black text-xs tracking-[0.3em] uppercase mb-6 text-white/40 border-b border-white/10 pb-4">
          Medan Aktivitas
        </h3>
        <div className="flex flex-col">
          {activities.map((act) => (
            <motion.button
              key={act}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActivityChange(act)}
              className={`text-left font-display text-[11px] py-4 border-b border-white/5 uppercase tracking-[0.2em] font-black transition-all duration-300 flex items-center justify-between group ${
                selectedCategory === act || selectedActivity === act
                  ? "text-orange-500"
                  : "text-white/60 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {act}
              <div className={`w-1.5 h-1.5 rounded-none transition-all ${
                selectedActivity === act ? "bg-orange-500" : "bg-transparent group-hover:bg-white/20"
              }`} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div>
        <h3 className="font-display font-black text-xs tracking-[0.3em] uppercase mb-6 text-white/40 border-b border-white/10 pb-4">
          Rentang Harga
        </h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between font-display font-black text-[10px] tracking-widest text-white/60">
            <span className="bg-[#111111] border border-white/10 px-3 py-1.5">RP {fmtK(priceMin)}</span>
            <span className="text-white/20">—</span>
            <span className="bg-[#111111] border border-white/10 px-3 py-1.5">RP {fmtK(priceMax)}</span>
          </div>
          <div className="space-y-4">
            <div className="group relative h-2 bg-white/10 rounded-none cursor-pointer flex items-center">
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={5000}
                value={priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v < priceMax) onPriceMinChange(v);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="absolute left-0 h-full bg-orange-500 pointer-events-none" style={{ width: `${(priceMin / MAX_PRICE) * 100}%` }} />
            </div>
            
            <div className="group relative h-2 bg-white/10 rounded-none cursor-pointer flex items-center">
              <input
                type="range"
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={5000}
                value={priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (v > priceMin) onPriceMaxChange(v);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="absolute left-0 h-full bg-orange-500 pointer-events-none" style={{ width: `${(priceMax / MAX_PRICE) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Promo banner ── */}
      <div className="relative overflow-hidden aspect-[4/5] hidden lg:block group bg-[#111111] border border-white/5">
        <img
          src={heroImg}
          alt="Adventure promo"
          className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40 transition-transform duration-[1.5s] group-hover:scale-105 group-hover:opacity-60 group-hover:mix-blend-normal"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="font-display font-black text-xs uppercase tracking-[0.3em] text-orange-500 mb-2">Terlaris Musim Ini</p>
          <p className="font-display font-black text-2xl uppercase tracking-tight text-white leading-[1.1]">Eksplorasi<br/>Tanpa Batas</p>
        </div>
      </div>
    </div>
  );
};

export { MIN_PRICE, MAX_PRICE };
export default StoreFilterSidebar;
