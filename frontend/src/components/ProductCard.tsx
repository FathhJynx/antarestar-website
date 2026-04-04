import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, Star, ShoppingCart, ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
  viewMode?: "grid" | "list";
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const StarRow = ({ rating = 0, reviewCount = 0 }: { rating?: number; reviewCount?: number }) => {
  if (reviewCount === 0) {
    return <span className="text-[10px] text-muted-foreground font-body italic italic">Belum ada ulasan</span>;
  }
  const full = Math.floor(rating);
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating.toFixed(1)} bintang`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= full ? "fill-amber-400 text-amber-400" : i - 0.5 <= rating ? "fill-amber-200 text-amber-400" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
      <span className="text-[10px] text-foreground font-black ml-0.5">{rating.toFixed(1)}</span>
      <span className="text-[9px] text-muted-foreground font-body ml-0.5">({reviewCount})</span>
    </div>
  );
};

/* ─── Grid Card ─────────────────────────────────────────── */
const GridCard = ({ product, index = 0 }: { product: Product; index: number }) => {
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
      toast.success(`${product.name} ditambahkan ke keranjang`, {
        description: "Barang sudah siap untuk di-checkout.",
        duration: 2000,
      });
    }, 500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl p-1.5 sm:p-3 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-white mb-3 flex items-center justify-center transition-all duration-500 group">
        <Link to={`/product/${product.id}`} className="w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 ease-out-expo group-hover:scale-[1.1]"
            loading="lazy"
          />
        </Link>

        {/* Badges - Standardized & Compact */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start max-w-[calc(100%-16px)]">
          {product.badge && (
            <span className="bg-accent text-accent-foreground text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-sm font-display uppercase tracking-wide shadow-sm backdrop-blur-[2px] truncate max-w-[80px] sm:max-w-[120px]">
              {product.badge}
            </span>
          )}
          {discountPct > 0 && (
            <span className="bg-red-500 text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-sm font-display shadow-sm backdrop-blur-[2px]">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist - Premium glass pill */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0 transition-all duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full glass-light flex items-center justify-center border border-white/20 shadow-sm hover:bg-white transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-foreground" />
          </motion.button>
        </div>

        {/* Mobile Quick Add Icon - Premium floating action */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="absolute bottom-2 right-2 sm:hidden p-2 bg-accent text-white rounded-xl shadow-lg active:scale-95 transition-all"
        >
          {isAdding ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </button>

        {/* Hover Action Bar (Desktop) - Improved accessibility & UX */}
        <div className="hidden sm:block absolute inset-x-2 bottom-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out-expo">
          <div className="flex gap-2 w-full">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isBuying}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-muted text-foreground border border-border/50 hover:bg-white hover:shadow-lg transition-all duration-300 shadow-sm relative group/btn shrink-0"
              title="Tambah ke Keranjang"
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> 
              )}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isAdding || isBuying}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-foreground text-background font-body text-[10px] font-black tracking-[0.15em] uppercase hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-xl overflow-hidden relative group/buy"
            >
              {isBuying ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/buy:translate-x-1 transition-transform" /> 
                  <span>Beli Sekarang</span>
                </>
              )}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/buy:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex-1 px-1 flex flex-col pb-1 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase font-display font-medium">
            {product.category}
          </p>
          {/* Mobile StarRow */}
          <div className="sm:hidden">
            <StarRow rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>
        
        <h3 className="font-display font-bold text-[13px] sm:text-sm md:text-[15px] text-foreground leading-snug mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2 overflow-hidden min-h-[2.4rem] sm:min-h-[2.6rem]">
          <Link to={`/product/${product.id}`} className="block">{product.name}</Link>
        </h3>

        {/* Rating Row (Desktop Only) */}
        <div className="hidden sm:flex items-center justify-between gap-1 mb-2">
          <StarRow rating={product.rating} reviewCount={product.reviewCount} />
          {product.sold_count && product.sold_count > 0 && (
            <span className="text-[10px] font-black font-display uppercase tracking-wider text-accent drop-shadow-sm">
              {product.sold_count > 1000 ? `${(product.sold_count / 1000).toFixed(1)}k+` : product.sold_count}+ Terjual
            </span>
          )}
        </div>

        {/* Sold info for mobile */}
        {product.sold_count && product.sold_count > 0 && (
          <div className="sm:hidden mb-2">
            <span className="text-[9px] font-black font-display uppercase tracking-widest text-accent/80">
              {product.sold_count}+ Terjual
            </span>
          </div>
        )}

        {/* Price row - Cleaner typography */}
        <div className="mt-auto flex flex-wrap items-baseline gap-1 sm:gap-2">
          <span className="font-display font-black text-foreground text-sm sm:text-base tracking-tight whitespace-nowrap">
            {formatPrice(effectivePrice)}
          </span>
          {product.originalPrice && product.originalPrice !== effectivePrice && (
            <span className="text-muted-foreground/60 text-[10px] sm:text-xs line-through font-medium">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── List Card ─────────────────────────────────────────── */
const ListCard = ({ product, index = 0 }: { product: Product; index: number }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const effectivePrice = product.flashSalePrice || product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      toast.success(`${product.name} ditambahkan ke keranjang`, {
        description: "Lihat keranjang untuk checkout.",
        duration: 2000,
      });
    }, 500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer flex gap-4 sm:gap-6 p-3 sm:p-4 rounded-2xl bg-white border border-border/40 hover:border-border hover:shadow-xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative w-28 sm:w-36 md:w-44 aspect-square rounded-xl overflow-hidden flex-shrink-0 bg-white border border-border/50 group-hover:border-transparent transition-colors">
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
            loading="lazy"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-sm font-display uppercase tracking-wide shadow-sm backdrop-blur-[2px] truncate max-w-[60px] sm:max-w-[100px]">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase font-display font-medium">{product.category}</p>
            <span className="text-[8px] sm:text-[9px] text-muted-foreground font-display font-bold uppercase tracking-wide bg-muted px-2 py-0.5 rounded-sm shrink-0">{product.activity}</span>
          </div>
          <Link to={`/product/${product.id}`} className="block overflow-hidden">
            <h3 className="font-display font-bold text-sm sm:text-base md:text-[18px] text-foreground leading-snug mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2 overflow-hidden">
              {product.name}
            </h3>
          </Link>
          {/* Rating & sold */}
          <div className="flex items-center gap-3 mb-3">
            <StarRow rating={product.rating} reviewCount={product.reviewCount} />
            {product.sold_count && product.sold_count > 0 && (
              <div className="flex items-center gap-2 px-2 py-0.5 bg-accent/5 rounded-full border border-accent/10">
                <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black font-display uppercase tracking-widest text-accent">
                  {product.sold_count}+ Sold
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice !== effectivePrice && (
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-muted-foreground/60 text-xs line-through font-medium">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-red-500 text-[10px] font-black font-display uppercase">
                  -{(product.originalPrice && product.originalPrice > 0) ? Math.round(((product.originalPrice - effectivePrice) / product.originalPrice) * 100) : 0}%
                </span>
              </div>
            )}
            <span className="font-display font-black text-foreground text-lg sm:text-xl tracking-tight">
              {formatPrice(effectivePrice)}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-white hover:shadow-md transition-all font-display"
            >
              <Heart className="w-4 h-4 text-foreground" />
            </motion.button>
            <button
              onClick={handleBuyNow}
              disabled={isAdding || isBuying}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="h-10 px-5 rounded-xl bg-foreground text-background font-body text-[11px] font-black tracking-widest uppercase flex items-center gap-2 hover:bg-accent hover:text-white transition-all shadow-sm"
              >
                {isBuying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Beli</span>
                  </>
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main export ─────────────────────────────────────────── */
const ProductCard = ({ product, index = 0, viewMode = "grid" }: ProductCardProps) => {
  if (viewMode === "list") return <ListCard product={product} index={index} />;
  return <GridCard product={product} index={index} />;
};

export default ProductCard;
