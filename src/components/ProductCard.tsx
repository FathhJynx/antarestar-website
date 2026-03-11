import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="img-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full font-body">
            {product.badge}
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1 font-body">{product.category}</p>
        <h3 className="font-display font-semibold text-sm md:text-base text-foreground leading-tight mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground text-sm line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
