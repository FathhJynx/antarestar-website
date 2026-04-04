import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

const ExclusiveRelease = () => {
  const { data: exclusiveProducts = [], isLoading } = useQuery({
    queryKey: ['exclusive-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { is_exclusive: true, limit: 4 } });
      const raw = res.data?.data?.data || res.data?.data || [];
      return raw.slice(0,4).map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
        description: String(p.description),
        image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
        price: p.variants?.[0]?.price || 0,
        originalPrice: p.variants?.[0]?.price ? p.variants?.[0]?.price * 1.2 : null,
        rating: 4.8,
        reviewCount: 154,
      }));
    }
  });

  if (!isLoading && exclusiveProducts.length === 0) return null;

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden text-white">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <div className="section-container relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-body text-[11px] tracking-[0.3em] font-bold uppercase text-accent">
                Web Exclusive
              </span>
              <div className="w-8 h-px bg-accent/50" />
            </div>
            
            <h2 className="font-display font-black text-[clamp(2.5rem,10vw,4.5rem)] uppercase tracking-tight leading-[1.1] text-white">
              Limited <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                Releases.
              </span>
            </h2>
            <p className="mt-8 text-white/60 font-body text-sm md:text-base max-w-md leading-relaxed">
              Koleksi eksklusif yang hanya tersedia di official website Antarestar. Dirancang dengan material premium untuk performa maksimal.
            </p>
          </div>
          
          <Link 
            to="/store" 
            className="group flex flex-col items-start md:items-end gap-2 text-left md:text-right transition-transform hover:-translate-y-1"
          >
            <span className="font-display font-black text-3xl uppercase text-white group-hover:text-accent transition-colors">
              Explore All
            </span>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
              See Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-full">
                <ProductSkeleton />
              </div>
            ))
          ) : (
            exclusiveProducts.map((product: any, idx: number) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="h-full"
              >
                <div className="dark h-full"> {/* Force dark mode for ProductCard */}
                  <ProductCard product={product} />
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default ExclusiveRelease;
