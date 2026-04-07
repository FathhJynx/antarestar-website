import { motion } from "framer-motion";
import { categories } from "@/data/products";
import heroBg from "@/assets/hero-outdoor.jpg"; // Using a different image for the store header

interface StoreHeroProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const StoreHero = ({ selectedCategory, onCategoryChange }: StoreHeroProps) => {
  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <section className="relative h-[60svh] min-h-[480px] max-h-[650px] w-full bg-[#050505] overflow-hidden flex flex-col justify-end">
      {/* ── Background Image & Overlays ── */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroBg}
          alt="Antarestar Gear Collection"
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* Dark gradients for text legibility and mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      {/* ── Film grain ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 section-padding pb-12 sm:pb-16 w-full">
        <div className="section-container flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 h-full">
          
          {/* Left: Titles */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="mb-6"
            >
              <span className="font-display text-[9px] tracking-[0.5em] font-black uppercase text-accent bg-accent/5 border border-accent/20 px-4 py-2">
                KATALOG RESMI
              </span>
            </motion.div>

            <h1 className="font-display font-black leading-none tracking-tighter uppercase mb-5 text-white drop-shadow-md">
                <motion.span
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.7, delay: 0.2, ease }}
                   className="block text-[clamp(2.25rem,10vw,5.5rem)]"
                >
                  Arsip
                </motion.span>
                <motion.span
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.7, delay: 0.3, ease }}
                   className="block text-[clamp(2.25rem,10vw,5.5rem)] text-white/40"
                >
                  Perlengkapan
                </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
              className="font-display text-white/50 text-xs sm:text-sm leading-relaxed font-black uppercase tracking-[0.2em] max-w-sm border-l-4 border-accent pl-6"
            >
              PERFORMA TANPA BATAS. DIRANCANG UNTUK EKSPLORASI TERJAUH DI MEDAN TERGANAS.
            </motion.p>
          </div>

          {/* Right/Bottom: Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="flex flex-wrap md:justify-end gap-2 sm:gap-3 w-full md:max-w-[450px]"
          >
            {categories.filter((c) => c !== "All").map((cat, i) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(cat)}
                className={`font-display font-bold uppercase tracking-[0.15em] text-[10px] sm:text-[11px] px-5 py-2.5 sm:px-6 sm:py-3 rounded-none border transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                    : "bg-[#111] text-white/70 border-white/10 hover:bg-[#222] hover:border-white/20 hover:text-white"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default StoreHero;
