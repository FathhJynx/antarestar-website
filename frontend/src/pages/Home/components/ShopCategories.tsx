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
    className={`group relative flex flex-col justify-end rounded-2xl overflow-hidden w-full
      ${desktopFill ? "h-full" : big ? "aspect-[16/7]" : "aspect-[4/3]"}`}
  >
    <img src={cat.img} alt={cat.name} loading="lazy"
      className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
    <div className="absolute top-3 right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
      <ArrowRight className="w-4 h-4 text-white" />
    </div>
    <div className="relative p-4 md:p-5">
      <h3 className={`font-display font-black text-white uppercase leading-none
        ${big ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl md:text-2xl"}`}>
        {cat.name}
      </h3>
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
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="mb-10 md:mb-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-2">Koleksi Lengkap</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-foreground uppercase leading-none tracking-tight">
                Shop by Category
              </h2>
            </div>
            <Link to="/store" className="flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors shrink-0">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>

        {/* Mobile Case */}
        <div className="md:hidden space-y-3">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.65, ease }}>
            <CategoryCardUI cat={categories[0]} big />
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(1).map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.65, delay: (i + 1) * 0.08, ease }}>
                <CategoryCardUI cat={c} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Case */}
        <div className="hidden md:grid md:grid-cols-4 gap-4" style={{ gridTemplateRows: "220px 220px" }}>
          {categories.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.65, delay: i * 0.08, ease }} className={c.big ? "md:col-span-2 md:row-span-2" : ""}>
              <CategoryCardUI cat={c} big={c.big} desktopFill />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopCategories;
