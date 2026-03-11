import { motion } from "framer-motion";
import { Mountain, Compass, Tent, ShoppingBag } from "lucide-react";
import { SectionHeading } from "@/components/AnimationPrimitives";

const marqueeItems = [
  "JACKETS", "BAGS", "FOOTWEAR", "ACCESSORIES", "APPAREL", "CAMPING",
  "JACKETS", "BAGS", "FOOTWEAR", "ACCESSORIES", "APPAREL", "CAMPING",
];

const MarqueeBanner = () => {
  return (
    <section className="py-6 bg-accent overflow-hidden">
      <div className="marquee-track">
        {marqueeItems.map((item, i) => (
          <span key={i} className="flex items-center gap-4 px-8 font-display font-bold text-sm tracking-[0.3em] text-accent-foreground/80 whitespace-nowrap">
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-accent-foreground/40" />
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeBanner;
