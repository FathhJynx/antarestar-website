import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [label, setLabel] = useState('');

  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleEnter = () => setIsHidden(false);
    const handleLeave = () => setIsHidden(true);

    const handleHoverStart = (e: Event) => {
      const target = e.target as HTMLElement;
      const el = target.closest('a, button, [data-cursor]');
      if (el) {
        setIsHovering(true);
        const l = el.getAttribute('data-cursor') || '';
        setLabel(l);
      }
    };

    const handleHoverEnd = () => {
      setIsHovering(false);
      setLabel('');
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseover', handleHoverStart);
    document.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseover', handleHoverStart);
      document.removeEventListener('mouseout', handleHoverEnd);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  // Disable custom cursor on admin panel — restore native cursor
  if (window.location.pathname.startsWith('/admin')) return null;

  return (
    <motion.div
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovering ? 80 : 12,
        height: isHovering ? 80 : 12,
        opacity: isHidden ? 0 : 1,
      }}
      transition={{
        width: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.2 },
      }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference rounded-full bg-white flex items-center justify-center"
    >
      {label && isHovering && (
        <span className="font-display font-bold text-[8px] uppercase tracking-[0.15em] text-black">
          {label}
        </span>
      )}
    </motion.div>
  );
};

export default CustomCursor;
