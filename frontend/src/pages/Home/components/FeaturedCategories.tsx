import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import productJacket from "@/assets/product-jacket.jpg";
import productBag from "@/assets/product-bag.jpg";
import productBoots from "@/assets/product-boots.jpg";
import productCap from "@/assets/product-cap.jpg";

const cats = [
  { name: "Jackets", label: "Jaket", image: productJacket, count: 24, color: "from-olive/80 to-olive/40" },
  { name: "Bags", label: "Tas & Carrier", image: productBag, count: 18, color: "from-primary/80 to-primary/40" },
  { name: "Footwear", label: "Alas Kaki", image: productBoots, count: 12, color: "from-earth/80 to-earth/40" },
  { name: "Accessories", label: "Aksesoris", image: productCap, count: 30, color: "from-accent/60 to-accent/20" },
];

const FeaturedCategories = () => {
  return (
    <section className="py-24 md:py-32 section-padding bg-primary relative grain overflow-hidden">
      {/* Decorative blurred orbs */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

      <div className="section-container relative z-10">
        <SectionHeading subtitle="Cek Sesuai Kebutuhan" title="Cari Gear Lo" center light />

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.1}>
          {cats.map((cat) => (
            <StaggerItem key={cat.name}>
              <Link
                to={`/store?category=${cat.name}`}
                className="block group relative aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <motion.img
                  src={cat.image}
                  alt={cat.label}
                  className="img-cover transition-all duration-[1s] ease-out-expo group-hover:scale-[1.1]"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100 transition-opacity duration-500`} />
                
                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                  <ArrowUpRight className="w-4 h-4 text-primary-foreground" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="font-display font-bold text-lg md:text-2xl text-primary-foreground mb-0.5 drop-shadow-2xl leading-tight">{cat.label}</h3>
                  <p className="font-body text-[10px] md:text-[11px] text-primary-foreground/90 tracking-wider drop-shadow-md">{cat.count} Barang</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturedCategories;
