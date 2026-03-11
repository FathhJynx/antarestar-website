import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero-outdoor.jpg";

const HeroSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  const textVariants = {
    hidden: { y: "110%" },
    visible: (i: number) => ({
      y: 0,
      transition: { duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  return (
    <section ref={containerRef} className="relative h-[100svh] min-h-[650px] overflow-hidden grain">
      {/* Parallax Background */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={heroImg}
          alt="Hikers on a mountain ridge at golden hour with misty valleys"
          className="img-cover"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 overlay-gradient-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-foreground/30" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex items-center section-padding"
      >
        <div className="section-container w-full">
          <div className="max-w-2xl">
            {/* Subtitle with line */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-8 h-px bg-accent" />
              <p className="font-body text-xs md:text-sm tracking-[0.35em] uppercase text-accent/90">
                Where First Step Matter
              </p>
            </motion.div>

            {/* Title - staggered text reveal */}
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.9] mb-8">
              <span className="overflow-hidden block">
                <motion.span
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="block"
                >
                  Be Bold,
                </motion.span>
              </span>
              <span className="overflow-hidden block">
                <motion.span
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="block text-gradient"
                >
                  Go Far
                </motion.span>
              </span>
            </h1>

            {/* Description with blur-in */}
            <motion.p
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-body text-primary-foreground/75 text-base md:text-lg max-w-lg mb-10 leading-relaxed"
            >
              Premium outdoor gear designed for Indonesian adventurers. From mountain peaks to urban trails — start your journey now.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/store" className="group">
                  Explore Gear
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a href="#brand-story">Our Story</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-primary-foreground/40">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-primary-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
