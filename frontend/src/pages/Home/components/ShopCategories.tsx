import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { CategoryCardUI } from "./CategoryCardUI";

// Assets
import heroImg from "@/assets/hero-outdoor.jpg";
import lifestyleCamp from "@/assets/lifestyle-camping.jpg";
import lifestyleHike from "@/assets/lifestyle-hiker.jpg";
import community1 from "@/assets/community-1.jpg";
import community2 from "@/assets/community-2.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const InView = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}
    transition={{ duration: 0.7, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

const ShopCategories = () => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      const raw = res.data.data || [];
      return raw.map((c: any, i: number) => ({
        name: c.name,
        img: c.image_url || [heroImg, lifestyleHike, community2, community1, lifestyleCamp][i % 5],
        href: `/store?category=${encodeURIComponent(c.name)}`,
        count: c.products_count || 0,
        big: i === 0
      }));
    }
  });

  const CATS = categories.length > 0 ? categories : [
    { name: "Jaket",       img: heroImg,        href: "/store?category=Jackets",     count: 0, big: true  },
    { name: "Tas",         img: lifestyleHike,  href: "/store?category=Bags",        count: 0, big: false },
    { name: "Aksesoris",   img: community2,     href: "/store?category=Accessories", count: 0, big: false },
    { name: "Alas Kaki",   img: community1,     href: "/store?category=Footwear",    count: 0, big: false },
    { name: "Pakaian",     img: lifestyleCamp,  href: "/store?category=Apparel",     count: 0,  big: false },
  ];

  return (
    <section className="py-16 md:py-24 bg-transparent border-t border-white/5 relative z-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <InView className="mb-10 md:mb-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-2">Pilih Gear Sesuai Kebutuhan Lo</p>
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-none tracking-tight">
                Pilih Sesuai Misi Lo
              </h2>
            </div>
            <Link to="/store" className="inline-flex items-center gap-2 h-11 px-6 border border-white/20 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors shrink-0">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </InView>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[440px]">
             <div className="md:col-span-2 md:row-span-2 bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
             <div className="bg-muted animate-pulse rounded-2xl" />
          </div>
        ) : (
          <>
            {/* ── Mobile layout ────────────────────────────────── */}
            <div className="md:hidden space-y-3">
              {/* Hero card: First Category */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, ease }}
              >
                <CategoryCardUI cat={CATS[0]} big />
              </motion.div>
              {/* 2×2 grid for rest */}
              <div className="grid grid-cols-2 gap-3">
                {CATS.slice(1, 5).map((c: any, i: number) => (
                  <motion.div key={c.name}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.65, delay: (i + 1) * 0.08, ease }}
                  >
                    <CategoryCardUI cat={c} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Desktop layout ───────────────────────────────── */}
            <div
              className="hidden md:grid md:grid-cols-4 gap-4"
              style={{ gridTemplateRows: "220px 220px" }}
            >
              {CATS.slice(0, 5).map((c: any, i: number) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, delay: i * 0.08, ease }}
                  className={c.big ? "md:col-span-2 md:row-span-2" : ""}
                >
                  <CategoryCardUI cat={c} big={c.big} desktopFill />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ShopCategories;
