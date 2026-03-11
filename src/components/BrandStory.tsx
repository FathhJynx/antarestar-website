import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, SectionHeading } from "@/components/AnimationPrimitives";
import lifestyleImg from "@/assets/lifestyle-hiker.jpg";

const BrandStory = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const stats = [
    { num: "100+", label: "Products" },
    { num: "50K+", label: "Adventurers" },
    { num: "34", label: "Provinces Reached" },
  ];

  return (
    <section id="brand-story" ref={sectionRef} className="py-24 md:py-36 section-padding bg-card relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '24px 24px'
      }} />

      <div className="section-container relative">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image with parallax */}
          <Reveal direction="left">
            <div className="relative">
              <motion.div
                style={{ y: imgY }}
                className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10"
              >
                <img src={lifestyleImg} alt="Hiker on mountain cliff overlooking tropical landscape" className="img-cover" />
              </motion.div>
              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-6 -right-4 md:-right-8 glass-light rounded-2xl p-6 shadow-xl border border-border/50"
              >
                <p className="font-display font-black text-4xl md:text-5xl text-accent">5+</p>
                <p className="font-body text-xs tracking-wider uppercase text-muted-foreground mt-1">Years of<br/>Adventure</p>
              </motion.div>
              {/* Decorative accent */}
              <div className="absolute -top-3 -left-3 w-20 h-20 border-l-2 border-t-2 border-accent/30 rounded-tl-2xl" />
            </div>
          </Reveal>

          {/* Text */}
          <div>
            <SectionHeading subtitle="Our Story" title="Born from the Mountains of Indonesia" />
            <Reveal delay={0.2}>
              <p className="font-body text-muted-foreground leading-[1.8] mb-5 text-[15px]">
                Antarestar was founded with a simple belief: every first step matters. From the volcanic peaks of Java to the
                rainforests of Sumatra, we design gear that empowers Indonesian adventurers to explore boldly and responsibly.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="font-body text-muted-foreground leading-[1.8] mb-10 text-[15px]">
                Our products blend functional outdoor performance with urban street style — because adventure doesn't stop when
                you leave the trail. Whether you're summiting Rinjani or navigating the city, Antarestar has you covered.
              </p>
            </Reveal>

            {/* Stats with count animation */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={0.4 + i * 0.1}>
                  <div className="relative">
                    <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-accent/20 rounded-full" />
                    <p className="font-display font-bold text-2xl md:text-3xl text-foreground mb-1">{stat.num}</p>
                    <p className="font-body text-[10px] text-muted-foreground tracking-[0.15em] uppercase">{stat.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
