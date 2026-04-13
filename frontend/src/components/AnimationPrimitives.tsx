import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  light?: boolean;
  center?: boolean;
}

export const SectionHeading = ({ subtitle, title, light, center }: SectionHeadingProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={`mb-14 md:mb-16 ${center ? "text-center" : ""}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`section-divider origin-left mb-4 ${center ? "mx-auto" : ""}`}
      />
      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "100%" }}
          animate={isInView ? { y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`font-body text-sm tracking-[0.25em] uppercase mb-3 ${
            light ? "text-accent" : "text-accent"
          }`}
        >
          {subtitle}
        </motion.p>
      </div>
      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: "100%" }}
          animate={isInView ? { y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={`font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight text-balance ${
            light ? "text-primary-foreground" : "text-foreground"
          }`}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
}

export const Reveal = ({ children, delay = 0, direction = "up", className = "" }: RevealProps) => {
  const initial = {
    up: { opacity: 0, y: 50 },
    left: { opacity: 0, x: -50 },
    right: { opacity: 0, x: 50 },
    scale: { opacity: 0, scale: 0.9 },
  };

  const animate = {
    up: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    scale: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial={initial[direction]}
      whileInView={animate[direction]}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ children, className = "", staggerDelay = 0.08 }: StaggerContainerProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
