import { motion } from "framer-motion";
import campingImg from "@/assets/lifestyle-camping.jpg";
import community2 from "@/assets/community-2.jpg";

const LifestyleSection = () => {
  return (
    <section className="py-20 md:py-28 section-padding">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-2">Live the Adventure</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">Outdoor Lifestyle</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img src={campingImg} alt="Camping in tropical forest" className="img-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 overlay-gradient" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display font-bold text-xl md:text-2xl text-primary-foreground mb-1">Camp Under the Stars</p>
              <p className="font-body text-sm text-primary-foreground/70">Discover our camping essentials collection</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img src={community2} alt="Summit sunrise" className="img-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 overlay-gradient" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-display font-bold text-xl md:text-2xl text-primary-foreground mb-1">Chase the Sunrise</p>
              <p className="font-body text-sm text-primary-foreground/70">Gear built for summit seekers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
