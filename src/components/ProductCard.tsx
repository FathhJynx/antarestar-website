import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-card mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="img-cover transition-all duration-700 ease-out-expo group-hover:scale-[1.08]"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1.5 rounded-full font-body uppercase tracking-wider"
          >
            {product.badge}
          </motion.span>
        )}

        {/* Wishlist button - always visible on corner */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full glass-light flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
        >
          <Heart className="w-4 h-4" />
        </motion.button>

        {/* Hover overlay with actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 h-10 rounded-lg glass-light font-body text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-10 w-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-1.5 font-body">{product.category}</p>
        <h3 className="font-display font-semibold text-sm md:text-[15px] text-foreground leading-snug mb-2 group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2.5">
          <span className="font-display font-bold text-foreground text-sm">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground text-xs line-through">{formatPrice(product.originalPrice)}</span>
          )}
          {product.originalPrice && (
            <span className="text-accent text-[10px] font-bold font-body">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
