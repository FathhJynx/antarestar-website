import { motion } from "framer-motion";
import lifestyleImg from "@/assets/lifestyle-hiker.jpg";

const BrandStory = () => {
  return (
    <section id="brand-story" className="py-20 md:py-28 section-padding bg-secondary/50">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden">
              <img src={lifestyleImg} alt="Hiker on mountain cliff" className="img-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 md:w-40 md:h-40 bg-accent rounded-2xl flex items-center justify-center">
              <div className="text-center text-accent-foreground">
                <p className="font-display font-black text-3xl md:text-4xl">5+</p>
                <p className="font-body text-xs tracking-wider uppercase">Years of Adventure</p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-3">Our Story</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6 leading-tight">
              Born from the Mountains of Indonesia
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Antarestar was founded with a simple belief: every first step matters. From the volcanic peaks of Java to the
              rainforests of Sumatra, we design gear that empowers Indonesian adventurers to explore boldly and responsibly.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Our products blend functional outdoor performance with urban street style — because adventure doesn't stop when
              you leave the trail. Whether you're summiting Rinjani or navigating the city, Antarestar has you covered.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { num: "100+", label: "Products" },
                { num: "50K+", label: "Adventurers" },
                { num: "34", label: "Provinces" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-2xl md:text-3xl text-foreground">{stat.num}</p>
                  <p className="font-body text-xs text-muted-foreground tracking-wider uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
