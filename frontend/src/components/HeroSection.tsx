import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, MapPin, Zap } from "lucide-react";
import heroImg from "@/assets/hero-outdoor.jpg";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  const { data: activeCampaign } = useQuery({
    queryKey: ['active-flash-sale-hero'],
    queryFn: async () => {
      const res = await api.get('/promotions/flash-sales');
      const campaigns = res.data.data || [];
      return campaigns[0] || null;
    }
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Raw transform values
  // imageY moves DOWN as user scrolls — creates depth/parallax effect
  // The image wrapper is taller than the section so there's no whitespace
  const rawImageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const rawImageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const rawContentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const rawContentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  // Physics-based spring for ultra-smooth feel
  const imageY = useSpring(rawImageY, { stiffness: 55, damping: 22, mass: 0.9 });
  const imageScale = useSpring(rawImageScale, { stiffness: 45, damping: 22, mass: 1 });
  const contentOpacity = useSpring(rawContentOpacity, { stiffness: 80, damping: 30 });
  const contentY = useSpring(rawContentY, { stiffness: 55, damping: 22, mass: 0.9 });

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] min-h-[680px] overflow-hidden"
    >
      {/* ── Parallax Background ── */}
      {/* Extra height on wrapper (-15% top, 130% h) ensures no white gap when image translates */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
        initial={false}
      >
        <img
          src={heroImg}
          alt="Indonesian adventurers hiking in the mountains at golden hour"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </motion.div>

      {/* ── Multi-layer Overlays ── */}
      {/* Dark vignette from all edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.55)_100%)]" />
      {/* Strong bottom-to-top dark fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
      {/* Left-side fade for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* ── Film grain texture ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ── Hero Content ── */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 h-full flex flex-col justify-end section-padding pb-24 md:pb-28"
      >
        <div className="section-container w-full">

          {/* Location badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5 text-white/80 font-body text-[11px] tracking-[0.2em] uppercase">
              <MapPin className="w-3 h-3 text-accent" />
              Indonesia's Premier Outdoor Brand
            </span>
            {activeCampaign && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-red-600 rounded-full px-3.5 py-1.5 shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              >
                <Zap className="w-3 h-3 text-white fill-current animate-pulse" />
                <span className="text-white font-display font-black text-[9px] tracking-widest uppercase">Promo Kilat Aktif</span>
              </motion.div>
            )}
          </motion.div>

          {/* ── Main Title ── */}
          <h1 className="font-display font-black leading-none tracking-tight mb-8 overflow-hidden uppercase">
            {/* Line 1 */}
            <span className="block overflow-hidden pb-1 md:pb-2">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.05, delay: 0.25, ease }}
                className="block text-white text-[clamp(2.5rem,12vw,9rem)] drop-shadow-md"
              >
                Explore
              </motion.span>
            </span>
            
            {/* Line 2 */}
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.05, delay: 0.35, ease }}
                className="block text-[clamp(2.5rem,12vw,9rem)] drop-shadow-md"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/40">The</span>
                <span className="text-accent ml-3 md:ml-6">Wild</span>
              </motion.span>
            </span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 w-full border-t border-white/20 pt-8 mt-4">
            {/* ── Description ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease }}
              className="max-w-md"
            >
              <p className="font-body text-white/80 text-sm md:text-base leading-relaxed font-medium">
                Koleksi perlengkapan outdoor premium untuk ketahanan maksimal. Didesain khusus menghadapi iklim tropis Indonesia—dari lebatnya hutan hingga puncak berbatu.
              </p>
            </motion.div>

            {/* ── CTA Buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease }}
              className="flex gap-4 shrink-0"
            >
              {activeCampaign && (
                <Button variant="hero" size="xl" className="rounded-none bg-red-600 hover:bg-red-700 border-red-600 uppercase tracking-widest font-bold text-xs px-8" asChild>
                  <a href="#flash-sale" className="group">
                    <Zap className="w-4 h-4 mr-2" />
                    Ambil Promo
                  </a>
                </Button>
              )}
              <Button variant="hero" size="xl" className="rounded-none uppercase tracking-widest font-bold text-xs px-8" asChild><Link to="/store" className="group">
                  Shop Arrival
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link></Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-body text-[9px] tracking-[0.35em] uppercase text-white/35">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 text-white/35" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
