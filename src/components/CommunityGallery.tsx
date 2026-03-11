import { motion } from "framer-motion";
import c1 from "@/assets/community-1.jpg";
import c2 from "@/assets/community-2.jpg";
import c3 from "@/assets/community-3.jpg";
import c4 from "@/assets/community-4.jpg";

const images = [
  { src: c1, label: "Waterfall Explorer" },
  { src: c2, label: "Summit Chaser" },
  { src: c3, label: "Night Camper" },
  { src: c4, label: "Urban Adventurer" },
];

const CommunityGallery = () => {
  return (
    <section className="py-20 md:py-28 section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-2">#AntarestarAdventure</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Community Inspiration</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <img src={img.src} alt={img.label} className="img-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-300 flex items-center justify-center">
                <p className="font-display font-semibold text-primary-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGallery;
