import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, ShoppingCart, ArrowRight, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: "grid" | "list";
  onQuickAdd?: (product: Product) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const StarRow = ({ rating = 0, reviewCount = 0 }: { rating?: number; reviewCount?: number }) => {
  if (reviewCount === 0) {
    return <span className="text-[10px] text-muted-foreground font-display font-black uppercase tracking-widest italic">New Arrival</span>;
  }
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating ${rating.toFixed(1)} bintang`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-2.5 h-2.5 ${i <= full ? "fill-white text-white" : "text-white/10"}`}
          />
        ))}
      </div>
      <span className="text-[10px] text-white font-black font-display tracking-widest ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

/* ─── Grid Card ─────────────────────────────────────────── */
const GridCard = ({ product, index = 0, onQuickAdd }: { product: Product; index: number; onQuickAdd?: (product: Product) => void }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const effectivePrice = product.flashSalePrice || product.price;
  const originalPrice = product.originalPrice;
  const discountPct = (originalPrice && originalPrice > 0 && effectivePrice)
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.variants && product.variants.length > 0 && onQuickAdd) {
      onQuickAdd(product);
      return;
    }

    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: effectivePrice,
      originalPrice: product.originalPrice,
      qty: 1,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${product.name} ditambahkan ke keranjang`);
    }, 500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 0 && onQuickAdd) {
      onQuickAdd(product);
      return;
    }

    setIsBuying(true);
    const buyNowItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: effectivePrice,
      originalPrice: product.originalPrice,
      qty: 1,
    };
    
    setTimeout(() => {
      setIsBuying(false);
      navigate("/checkout", { state: { buyNowItem } });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex flex-col h-full bg-transparent rounded-none"
    >
      <div className="relative aspect-[3/4] bg-muted/5 dark:bg-white/[0.02] rounded-none overflow-hidden mb-4 transition-all duration-700">
        <Link to={`/product/${product.id}`} className="absolute inset-0 block">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain grayscale-[15%] group-hover:grayscale-0 transition-all duration-[1s] ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="bg-white text-black font-display text-[9px] font-black px-2.5 py-1 uppercase tracking-[0.2em] rounded-none">
              {product.badge}
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-orange-500 text-white font-display text-[9px] font-black px-2.5 py-1 uppercase tracking-[0.2em] rounded-none">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Actions Hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out-expo flex flex-col gap-1 z-20 pointer-events-none">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <button
              onClick={handleBuyNow}
              className="w-full h-12 bg-black dark:bg-white text-white dark:text-black font-display text-[10px] font-black tracking-[0.3em] uppercase hover:bg-orange-600 hover:text-white transition-colors duration-500 flex items-center justify-center gap-2 rounded-none"
            >
               <Zap className="w-4 h-4" /> Instant Buy
            </button>
            <button
              onClick={handleAddToCart}
              className="w-full h-12 bg-white/10 backdrop-blur-md text-white font-display text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors duration-500 flex items-center justify-center gap-2 rounded-none"
            >
               <ShoppingBag className="w-4 h-4" /> Add to Arsenal
            </button>
          </div>
        </div>

        <button className="absolute top-4 right-4 text-white/20 hover:text-orange-500 transition-colors z-30">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col flex-1 px-1">
        <p className="font-display text-[8px] text-white/40 uppercase tracking-[0.4em] font-black mb-1">
          {product.category}
        </p>
        
        <h3 className="font-display font-black text-sm text-white uppercase leading-tight tracking-tighter mb-3 group-hover:text-orange-500 transition-colors duration-500 line-clamp-2">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="mt-auto pt-4 flex items-baseline gap-4 border-t border-white/5">
          <span className="font-display font-black text-white text-base tracking-tighter">
            {formatPrice(effectivePrice)}
          </span>
          {product.originalPrice && product.originalPrice > effectivePrice && (
            <span className="font-display text-white/20 text-[10px] line-through tracking-widest">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── List Card ─────────────────────────────────────────── */
const ListCard = ({ product, index = 0, onQuickAdd }: { product: Product; index: number; onQuickAdd?: (product: Product) => void }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const effectivePrice = product.flashSalePrice || product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 0 && onQuickAdd) {
      onQuickAdd(product);
      return;
    }

    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: effectivePrice,
      originalPrice: product.originalPrice,
      qty: 1,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      toast.success(`${product.name} ditambahkan ke keranjang`);
    }, 500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 0 && onQuickAdd) {
      onQuickAdd(product);
      return;
    }

    setIsBuying(true);
    const buyNowItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: effectivePrice,
      originalPrice: product.originalPrice,
      qty: 1,
    };
    
    setTimeout(() => {
      setIsBuying(false);
      navigate("/checkout", { state: { buyNowItem } });
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex gap-10 p-8 rounded-none bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
    >
      <div className="relative w-48 aspect-square rounded-none overflow-hidden flex-shrink-0 bg-white/[0.03]">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-[1.1]"
            loading="lazy"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-0 left-0 bg-white text-black font-display text-[9px] font-black px-2 py-1 uppercase tracking-widest rounded-none">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1 py-1">
        <div className="space-y-4">
          <p className="font-display text-[10px] text-white/40 tracking-[0.4em] uppercase font-black">{product.category}</p>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-display font-black text-3xl text-white leading-none uppercase tracking-tighter group-hover:text-orange-500 transition-colors duration-500">
              {product.name}
            </h3>
          </Link>
          <StarRow rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className="flex items-end justify-between gap-6 pt-10 border-t border-white/5">
          <div className="flex flex-col gap-1">
            {product.originalPrice && product.originalPrice !== effectivePrice && (
              <span className="text-white/20 text-[12px] line-through font-display font-black uppercase tracking-widest">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="font-display font-black text-white text-3xl tracking-tighter">
              {formatPrice(effectivePrice)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
               onClick={handleAddToCart}
               className="h-16 px-10 bg-white text-black font-display text-[11px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all rounded-none"
            >
               Add to Arsenal
            </button>
            <button className="w-16 h-16 bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all rounded-none">
              <Heart className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductCard = ({ product, index = 0, viewMode = "grid", onQuickAdd }: ProductCardProps) => {
  if (viewMode === "list") return <ListCard product={product} index={index} onQuickAdd={onQuickAdd} />;
  return <GridCard product={product} index={index} onQuickAdd={onQuickAdd} />;
};

export default ProductCard;
