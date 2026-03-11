import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const FeaturedProducts = () => {
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <section className="py-24 md:py-32 section-padding relative">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <SectionHeading subtitle="Curated Selection" title="Featured Gear" />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-14 md:mb-16"
          >
            <Button variant="ghost" asChild className="text-accent hover:text-accent group">
              <Link to="/store">
                View All Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {featured.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturedProducts;
