import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/AnimationPrimitives";
import campingImg from "@/assets/lifestyle-camping.jpg";
import community2 from "@/assets/community-2.jpg";

const cards = [
  {
    image: campingImg,
    title: "Camp Under the Stars",
    subtitle: "Discover our camping essentials collection",
    tag: "Camping",
  },
  {
    image: community2,
    title: "Chase the Sunrise",
    subtitle: "Gear built for summit seekers",
    tag: "Hiking",
  },
];

const LifestyleSection = () => {
  return (
    <section className="py-24 md:py-32 section-padding">
      <div className="section-container">
        <SectionHeading subtitle="Live the Adventure" title="Outdoor Lifestyle" center />

        <div className="grid md:grid-cols-2 gap-5 md:gap-7">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.15}>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer">
                <motion.img
                  src={card.image}
                  alt={card.title}
                  className="img-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.08]"
                  loading="lazy"
                />
                <div className="absolute inset-0 overlay-gradient opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {/* Tag */}
                <span className="absolute top-5 left-5 bg-accent/20 backdrop-blur-sm text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full font-body uppercase tracking-widest border border-accent-foreground/10">
                  {card.tag}
                </span>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xl md:text-2xl lg:text-3xl text-primary-foreground mb-1 leading-tight">{card.title}</h3>
                      <p className="font-body text-sm text-primary-foreground/60 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">{card.subtitle}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 rounded-full bg-accent/80 backdrop-blur-sm flex items-center justify-center flex-shrink-0 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                    >
                      <ArrowUpRight className="w-5 h-5 text-accent-foreground" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
