import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const testimonials = [
  {
    text: "Peralatan Antarestar dirancang seperti zirah—sangat ringan tetapi kokoh meredam cuaca paling ekstrem.",
    author: "Samirah Putri",
    role: "Explorer • Jakarta",
    rating: 5,
  },
  {
    text: "Jaket paling andal yang pernah saya miliki. Bertahan di Everest Base Camp tanpa cela sedikitpun.",
    author: "Alex Hartono",
    role: "Alpinist • Bandung",
    rating: 5,
  },
  {
    text: "Dari Rinjani hingga Semeru, tak pernah gagal. Pendamping sejati untuk medan berat.",
    author: "David Gunawan",
    role: "Mountain Guide • Malang",
    rating: 5,
  },
];

const ease = [0.76, 0, 0.24, 1] as const;

const TestimonialSlider = () => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -800]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-800, 0]);
  const yContent = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const current = testimonials[index];

  return (
    <section ref={containerRef} className="relative py-32 md:py-48 bg-[#0a0a0a] overflow-hidden border-t border-white/[0.04]">
      
      {/* Massive Parallax Marquee Background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200vw] flex flex-col gap-4 pointer-events-none opacity-[0.03] transform -rotate-3 z-0">
        <motion.div style={{ x: x1 }} className="whitespace-nowrap font-display font-black text-[clamp(10rem,15vw,20rem)] uppercase leading-none tracking-tighter">
          INSPIRASI KOMUNITAS JELAJAH TANPA BATAS
        </motion.div>
        <motion.div style={{ WebkitTextStroke: "2px white", x: x2 }} className="whitespace-nowrap font-display font-black text-[clamp(10rem,15vw,20rem)] uppercase leading-none tracking-tighter text-transparent">
          ANTARESTAR EXPLORER HUB INDONESIA
        </motion.div>
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-12">
        
        {/* Animated Label */}
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }} className="flex items-center gap-4 mb-16 md:mb-24">
          <div className="w-12 h-1 bg-orange-500" />
          <p className="font-display text-[10px] sm:text-xs uppercase tracking-[0.4em] text-orange-500 font-black">Suara Komunitas</p>
        </motion.div>

        {/* Parallax Content Box */}
        <motion.div style={{ y: yContent }} className="relative min-h-[350px] md:min-h-[400px] flex items-center">
          <div className="absolute inset-y-0 left-0 w-1 bg-white/10" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
              transition={{ duration: 0.8, ease }}
              className="w-full pl-8 md:pl-16"
            >
              <div className="flex gap-2 mb-8">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-orange-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] text-white uppercase leading-[1.1] tracking-tighter mb-12 max-w-4xl mix-blend-difference">
                "{current.text}"
              </blockquote>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white flex items-center justify-center font-display font-black text-xl text-black">
                  {current.author.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-black text-white text-lg tracking-wide uppercase">{current.author}</p>
                  <p className="font-body text-white/40 text-xs tracking-[0.2em] uppercase font-bold">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Minimal Navigation */}
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }} className="flex items-center justify-between mt-20 pt-8 border-t border-white/[0.08]">
          <div className="flex gap-3">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-none transition-all duration-700 ${
                  i === index ? 'w-16 bg-white' : 'w-6 bg-white/10 hover:bg-white/30'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
          <span className="font-display font-black text-xl md:text-2xl text-white/20 tracking-widest">
            {String(index + 1).padStart(2, '0')}<span className="text-white/10 ml-2">/ {String(testimonials.length).padStart(2, '0')}</span>
          </span>
        </motion.div>

      </div>
    </section>
  );
};

export default TestimonialSlider;
