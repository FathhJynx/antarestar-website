import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import api from "@/lib/api";

// Asset Imports
import heroImg from "@/assets/hero-outdoor.jpg";
import lifestyleCamp from "@/assets/lifestyle-camping.jpg";
import lifestyleHike from "@/assets/lifestyle-hiker.jpg";
import community1 from "@/assets/community-1.jpg";
import community2 from "@/assets/community-2.jpg";

const DEFAULT_IMAGES = [heroImg, lifestyleHike, community2, community1, lifestyleCamp];

const ease = [0.16, 1, 0.3, 1] as const;

interface CatCardProps {
  cat: any;
  big?: boolean;
  desktopFill?: boolean;
}

const CategoryCardUI = ({ cat, big = false, desktopFill = false }: CatCardProps) => (
  <Link
    to={`/store?category=${cat.slug}`}
    className={`group relative flex flex-col justify-end rounded-none overflow-hidden w-full border border-white/5 bg-[#111111]
      ${desktopFill ? "h-full" : big ? "aspect-[16/9]" : "aspect-square"}`}
  >
    <img src={cat.img} alt={cat.name} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 group-hover:scale-[1.05]" />
    
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-80" />
    
    <div className="absolute top-4 right-4 w-10 h-10 bg-orange-500 rounded-none flex items-center justify-center
                    opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
      <ArrowRight className="w-5 h-5 text-white" />
    </div>

    <div className="relative p-6 md:p-8">
      <h3 className={`font-display font-black text-white uppercase leading-[0.9] tracking-tighter
        ${big ? "text-4xl sm:text-5xl md:text-6xl" : "text-2xl sm:text-3xl"}`}>
        {cat.name}
      </h3>
      <div className="w-0 h-1 bg-orange-500 mt-4 transition-all duration-500 group-hover:w-16" />
    </div>
  </Link>
);

const ShopCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        const data = res.data?.data || [];
        const mapped = data.map((c: any, i: number) => ({
          ...c,
          img: DEFAULT_IMAGES[i % DEFAULT_IMAGES.length],
          big: i === 0
        }));
        setCategories(mapped);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return null;
  if (!categories.length) return null;

  return (
    <section className="py-16 md:py-24 bg-[#050505] border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-2 h-16 bg-orange-500 hidden md:block" />
              <div>
                <p className="font-display text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Koleksi Lengkap</p>
                <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none tracking-tighter">
                  Direktori<br />Kategori
                </h2>
              </div>
            </div>
            <Link to="/store" className="flex items-center gap-3 font-display font-black text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors shrink-0 border border-white/10 hover:border-white/30 px-6 py-4">
              Jelajahi Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        {/* Mobile Case */}
        <div className="md:hidden space-y-4">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.65, ease }}>
            <CategoryCardUI cat={categories[0]} big />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {categories.slice(1).map((c, i) => (
               <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.65, delay: (i + 1) * 0.08, ease }}>
                <CategoryCardUI cat={c} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Case */}
        <div className="hidden md:grid md:grid-cols-4 gap-4" style={{ gridTemplateRows: "300px 300px" }}>
          {categories.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.1, ease }} className={c.big ? "md:col-span-2 md:row-span-2" : ""}>
              <CategoryCardUI cat={c} big={c.big} desktopFill />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCategories;
