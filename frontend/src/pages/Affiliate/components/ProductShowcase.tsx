import React from "react";
import ProductCard from "@/pages/Store/components/ProductCard";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data to match EXACT product card in store
interface ShowcaseProps {
  products: any[];
}

const ProductShowcase = ({ products }: ShowcaseProps) => {
  // If no products available from API, we can fallback or show loading
  const displayProducts = products?.length > 0 ? products : [];

  return (
    <section className="py-12 md:py-24 bg-black overflow-hidden">
       <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12 md:mb-16">
             <Reveal className="space-y-4">
                <p className="font-bold text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none italic">PILIHAN GEAR TERBAIK</p>
                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-7xl uppercase text-white leading-tight italic tracking-tighter">
                   MODAL JADI <br /> <span className="text-white/10 italic">CUAN LO.</span>
                </h2>
             </Reveal>
             <Link to="/store" className="flex items-center gap-4 text-white/40 hover:text-white font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all group">
                LIHAT SEMUA GEAR <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
             {displayProducts.map((p, i) => (
                <div key={p.id} className="group relative">
                   <ProductCard product={p} index={i} />
                </div>
             ))}
          </StaggerContainer>
       </div>
    </section>
  );
};

export default ProductShowcase;
