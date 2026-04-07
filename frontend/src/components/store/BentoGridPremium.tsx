import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight, Heart, Plus, ShieldCheck } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const GojekStyleListCard = ({ product, index }: { product: Product, index: number }) => {
  const { addToCart } = useCart();
  
  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.flashSalePrice || product.price,
      originalPrice: product.originalPrice,
      qty: 1,
    });
    toast.success(`${product.name} equipped to your arsenal`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-3xl active:scale-[0.98] transition-all group"
    >
      <Link to={`/product/${product.id}`} className="w-28 h-28 flex-shrink-0 bg-black rounded-2xl overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      </Link>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="space-y-1">
           <Link to={`/product/${product.id}`}>
              <h3 className="font-display font-black text-[13px] text-white uppercase line-clamp-2 leading-tight tracking-tight">
                {product.name}
              </h3>
           </Link>
           <p className="font-display font-bold text-[8px] text-white/30 uppercase tracking-[0.2em]">{product.category}</p>
        </div>
        <div className="flex items-end justify-between">
            <div className="flex flex-col">
               <span className="font-display font-black text-base text-white tracking-tighter leading-none mb-1">
                 {formatPrice(product.flashSalePrice || product.price)}
               </span>
            </div>
            <button 
               onClick={onAddToCart}
               className="h-10 w-10 bg-orange-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            >
               <Plus className="w-4 h-4" />
            </button>
        </div>
      </div>
    </motion.div>
  );
};

const TacticalProductCard = ({ product, index }: { product: Product, index: number }) => {
  const { addToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [7, -7]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-7, 7]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.flashSalePrice || product.price,
      qty: 1,
    });
    toast.success("GEAR ADDED TO ARSENAL");
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.05 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group relative hidden md:block aspect-[4/5]"
    >
      <Link to={`/product/${product.id}`} className="block w-full h-full relative overflow-hidden bg-[#080808] border border-white/5 rounded-[2.5rem] p-4 transition-all group-hover:border-white/20 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
         
         {/* Top Image Segment */}
         <div className="relative w-full h-[65%] rounded-[2rem] overflow-hidden bg-black/40">
            <motion.div 
               className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               style={{
                  background: useTransform(
                     [mouseX, mouseY],
                     ([mx, my]) => `radial-gradient(300px circle at ${mx}px ${my}px, rgba(255,255,255,0.05), transparent 80%)`
                  )
               }}
            />
            <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
            />
            {product.badge && (
               <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white text-black px-3 py-1 font-display font-black text-[9px] uppercase tracking-widest">{product.badge}</span>
               </div>
            )}
         </div>

         {/* Info Segment */}
         <div className="flex flex-col justify-between h-[35%] py-6 px-2">
            <div className="space-y-1">
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600/60">{product.category}</span>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-1">
                     <ShieldCheck className="w-3 h-3" /> Certified
                  </span>
               </div>
               <h3 className="font-display font-black text-xl uppercase tracking-tighter leading-none text-white/80 group-hover:text-white transition-colors">
                  {product.name}
               </h3>
            </div>

            <div className="flex items-end justify-between">
               <div className="space-y-1">
                  <p className="font-display font-black text-2xl tracking-tighter text-white">
                     {formatPrice(product.flashSalePrice || product.price)}
                  </p>
                  {product.originalPrice && product.originalPrice > (product.flashSalePrice || product.price) && (
                     <p className="text-[10px] font-bold text-white/20 line-through tracking-widest leading-none capitalize">
                        {formatPrice(product.originalPrice)}
                     </p>
                  )}
               </div>
               
               <button 
                  onClick={onAddToCart}
                  className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
               >
                  <Plus className="w-6 h-6" />
               </button>
            </div>
         </div>
         
         {/* Subtle Edge Glow (Left) */}
         <div className="absolute left-0 bottom-0 w-[1px] h-0 bg-gradient-to-t from-orange-600 to-transparent group-hover:h-full transition-all duration-1000" />
      </Link>
    </motion.div>
  );
};

const BentoGridPremium = ({ products }: { products: Product[] }) => {
  return (
    <>
      {/* Mobile-first List View */}
      <div className="flex flex-col gap-4 md:hidden">
        {products.map((product, i) => (
          <GojekStyleListCard key={product.id} product={product} index={i} />
        ))}
        {products.length === 0 && (
           <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem]">
              <p className="text-white/20 font-display font-black uppercase text-[10px] tracking-widest">Archive Empty</p>
           </div>
        )}
      </div>

      {/* Modern Tactical Grid (Uniform) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <TacticalProductCard 
            key={product.id} 
            product={product} 
            index={i} 
          />
        ))}
      </div>
    </>
  );
};

export default BentoGridPremium;
