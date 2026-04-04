import React from "react";
import { motion } from "framer-motion";

const fade = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };
const ease = [0.16, 1, 0.3, 1] as const;

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  viewportMargin?: string;
}

/**
 * A reusable container for entrance animations.
 * Wrapped children will fade in and slide up when they enter the viewport.
 * Uses framer-motion for smooth transitions.
 */
const FadeIn = ({ children, delay = 0, className = "", viewportMargin = "-60px" }: FadeInProps) => (
  <motion.div
    variants={fade}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: viewportMargin }}
    transition={{ duration: 0.7, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

export default FadeIn;
