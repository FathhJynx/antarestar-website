import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const FeaturedProducts = () => {
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <section className="py-20 md:py-28 section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-2">Curated Selection</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Featured Gear</h2>
          </div>
          <Button variant="ghost" asChild className="mt-4 md:mt-0 text-accent hover:text-accent">
            <Link to="/store">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
