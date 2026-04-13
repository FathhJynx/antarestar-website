import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { SectionHeading, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import c1 from "@/assets/community-1.jpg";
import c2 from "@/assets/community-2.jpg";
import c3 from "@/assets/community-3.jpg";
import c4 from "@/assets/community-4.jpg";

const images = [
  { src: c1, label: "Penjelajah Air Terjun", aspect: "aspect-square" },
  { src: c2, label: "Pengejar Puncak", aspect: "aspect-[3/4]" },
  { src: c3, label: "Camp Malam", aspect: "aspect-square" },
  { src: c4, label: "Adventure di Kota", aspect: "aspect-[3/4]" },
];

const CommunityGallery = () => {
  return (
    <section className="py-24 md:py-32 section-padding">
      <div className="section-container">
        <SectionHeading subtitle="#AntarestarAdventure" title="Inspirasi Bareng Komunitas" center />

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" staggerDelay={0.1}>
          {images.map((img, i) => (
            <StaggerItem key={img.label}>
              <div className={`relative ${i % 2 === 1 ? 'aspect-[3/4]' : 'aspect-square'} rounded-xl overflow-hidden group cursor-pointer`}>
                <img
                  src={img.src}
                  alt={img.label}
                  className="img-cover transition-all duration-700 ease-out-expo group-hover:scale-[1.1] group-hover:brightness-75"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 rounded-full border-2 border-primary-foreground/50 flex items-center justify-center mb-3"
                  >
                    <Instagram className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <p className="font-display font-semibold text-primary-foreground text-sm tracking-wide">
                    {img.label}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-accent transition-colors reveal-line pb-1"
          >
            <Instagram className="w-4 h-4" />
            Ikuti keseruan kita di Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityGallery;
