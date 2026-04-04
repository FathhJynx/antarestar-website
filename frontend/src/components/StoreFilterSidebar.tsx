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
    <div>
      {/* ── Category ── */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
          Kategori
        </h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(cat)}
              className={`text-left font-body text-sm py-2 px-3.5 rounded-lg transition-all duration-300 flex items-center justify-between group ${
                selectedCategory === cat
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {cat}
              <span
                className={`text-[10px] font-bold rounded-full transition-all ${
                  selectedCategory === cat
                    ? "bg-accent-foreground/20 text-accent-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-card"
                }`}
              >
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Activity ── */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
          Aktivitas
        </h3>
        <div className="flex flex-col gap-1">
          {activities.map((act) => (
            <motion.button
              key={act}
              whileTap={{ scale: 0.98 }}
              onClick={() => onActivityChange(act)}
              className={`text-left font-body text-sm py-2 px-3.5 rounded-lg transition-all duration-300 ${
                selectedActivity === act
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {act}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Price Range ── */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">
          Harga
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-body text-muted-foreground">
            <span className="bg-card border border-border rounded-lg px-2 py-1">Rp {fmtK(priceMin)}</span>
            <span className="text-muted-foreground/40">—</span>
            <span className="bg-card border border-border rounded-lg px-2 py-1">Rp {fmtK(priceMax)}</span>
          </div>
          <div className="space-y-2">
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
              className="w-full h-1.5 rounded-full accent-[hsl(var(--accent))] cursor-pointer"
            />
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
              className="w-full h-1.5 rounded-full accent-[hsl(var(--accent))] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ── Promo banner ── */}
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] hidden lg:block group">
        <img
          src={heroImg}
          alt="Adventure promo"
          className="img-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-accent" />
            <p className="font-body text-[10px] tracking-widest uppercase text-accent">Terlaris</p>
          </div>
          <p className="font-display font-bold text-primary-foreground text-sm mb-0.5">Musim Baru</p>
          <p className="font-body text-[11px] text-primary-foreground/60">Jelajahi koleksi terbaru</p>
        </div>
      </div>
    </div>
  );
};

export { MIN_PRICE, MAX_PRICE };
export default StoreFilterSidebar;
