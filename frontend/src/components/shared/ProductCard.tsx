import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Star, Users } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    category: string;
    badge?: string;
    rating?: number;
    reviewCount?: number;
    sold_count?: number;
  };
  index: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const ProductCard = ({ product, index }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
    });
    toast.success(`${product.name} equipped to your arsenal`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full flex flex-col bg-[#111111] border border-[#1F1F1F] rounded-none overflow-hidden hover:border-orange-500/20 hover:-translate-y-1 transition-all active:scale-[0.98]"
    >
      <Link to={`/product/${product.id}`} className="block relative w-full aspect-[4/5] overflow-hidden bg-black/50 rounded-none">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 transform-gpu"
        />

        {product.badge && (
          <div className="absolute top-4 left-4 z-10 transition-transform duration-500 group-hover:translate-x-1">
            <span className="bg-white text-black px-3 py-1 font-display font-black text-[9px] uppercase tracking-[0.2em] leading-none block border border-black/10">
              {product.badge}
            </span>
          </div>
        )}
        
        {/* Rapid Deployment Button (Hidden Overlay) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
           <button 
             onClick={handleAddToCart}
             className="w-full h-12 bg-white text-black font-display font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl rounded-none"
           >
              <ShoppingBag className="w-4 h-4" /> AMBIL GEAR
           </button>
        </div>
      </Link>

      <div className="flex-1 p-6 flex flex-col justify-between gap-4">
        <div className="space-y-2">
             <div className="flex items-center gap-2">
                <p className="font-display font-black text-[9px] text-gray-500 uppercase tracking-[0.2em]">{product.category}</p>
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Gear Terverifikasi</span>
             </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-display font-black text-[18px] text-white uppercase leading-[1.2] tracking-tighter hover:text-orange-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-[11px] font-black text-white italic">{product.rating || 0}</span>
                <span className="text-[10px] font-bold text-white/20 ml-0.5">({product.reviewCount || 0})</span>
             </div>
             <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-white/30" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">
                   Terjual {product.sold_count || 0}
                </span>
             </div>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-white/5 pt-4">
          <div className="space-y-1">
             <p className="font-display font-black text-2xl tracking-tighter text-white">
                {formatPrice(product.price)}
             </p>
             {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-[10px] font-bold text-gray-500 line-through tracking-widest">
                   {formatPrice(product.originalPrice)}
                </p>
             )}
          </div>
          <button className="w-10 h-10 border border-white/10 rounded-none flex items-center justify-center text-white/30 hover:text-white hover:border-orange-500/50 hover:bg-orange-600/10 transition-all active:scale-90">
             <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
