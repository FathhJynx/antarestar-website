import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import productJacket from "@/assets/product-jacket.jpg";
import productBag from "@/assets/product-bag.jpg";
import productBoots from "@/assets/product-boots.jpg";
import productCap from "@/assets/product-cap.jpg";

const cats = [
  { name: "Jackets", image: productJacket, count: 24 },
  { name: "Bags", image: productBag, count: 18 },
  { name: "Footwear", image: productBoots, count: 12 },
  { name: "Accessories", image: productCap, count: 30 },
];

const FeaturedCategories = () => {
  return (
    <section className="py-20 md:py-28 section-padding bg-primary">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-2">Shop by Category</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground">Find Your Gear</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cats.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/store?category=${cat.name}`}
                className="block group relative aspect-[3/4] rounded-xl overflow-hidden hover-lift"
              >
                <img src={cat.image} alt={cat.name} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 overlay-gradient" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display font-bold text-lg md:text-xl text-primary-foreground">{cat.name}</h3>
                  <p className="font-body text-xs text-primary-foreground/60">{cat.count} Products</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
