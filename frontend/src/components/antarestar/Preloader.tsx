import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onLoaded: () => void;
  imageCount: number;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoaded, imageCount }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    document.body.style.overflow = 'hidden';

    for (let i = 1; i <= imageCount; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = `/image/sequence/ezgif-frame-${num}.jpg`;

      const handleLoad = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / imageCount) * 100);
        setProgress(pct);
        if (loadedCount === imageCount) {
          setIsDone(true);
          setTimeout(() => {
            document.body.style.overflow = '';
            onLoaded();
          }, 1200);
        }
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
      images.push(img);
    }

    const timeout = setTimeout(() => {
      document.body.style.overflow = '';
      onLoaded();
    }, 15000);

    return () => clearTimeout(timeout);
  }, [imageCount, onLoaded]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black"
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Central content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
            >
              <img
                src="/logo.webp"
                alt="Antarestar"
                className="h-16 md:h-20 w-auto object-contain invert brightness-200"
                draggable={false}
              />
            </motion.div>

            {/* Counter */}
            <div className="relative mb-8">
              <motion.span
                ref={counterRef}
                className="font-display font-black text-[120px] md:text-[180px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/20 tabular-nums"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {progress}
              </motion.span>
              <span className="absolute -right-8 top-4 font-display font-black text-2xl text-white/30">%</span>
            </div>

            {/* Progress track */}
            <div className="w-[280px] md:w-[360px] relative">
              <div className="h-[1px] w-full bg-white/10" />
              <motion.div
                className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-orange-500 to-orange-400"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
              <div className="flex justify-between mt-4">
                <span className="font-body text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium">Loading Experience</span>
                <span className="font-body text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium">{imageCount} Frames</span>
              </div>
            </div>
          </div>

          {/* Corner branding */}
          <div className="absolute bottom-8 left-8 hidden md:block">
            <p className="font-body text-[9px] text-white/20 uppercase tracking-[0.3em]">Where Every Step Matters</p>
          </div>
          <div className="absolute bottom-8 right-8 hidden md:block">
            <p className="font-body text-[9px] text-white/20 uppercase tracking-[0.3em]">© 2026</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
