import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
const FRAME_COUNT = 240;

/* ── Text overlay config ──
   Each overlay defines:
     range: [fadeIn-start, fadeIn-end, fadeOut-start, fadeOut-end]  (0-1 scroll progress)
     position: 'center' | 'left' | 'right'
*/
const overlays = [
  /* Section 1 — 5% scroll: Center */
  {
    id: 'intro',
    range: [0.01, 0.05, 0.15, 0.22] as const,
    position: 'center' as const,
    content: (
      <>
        <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">TENTANG KAMI</p>
        <h1 className="font-display font-black text-5xl md:text-[6rem] lg:text-[7rem] uppercase tracking-tight leading-none text-white mb-6">
          ANTARESTAR
        </h1>
        <p className="font-body text-base md:text-lg text-white/50 max-w-lg mx-auto leading-relaxed">
          <span className="text-white font-bold">Premium Outdoor Gear.</span> Dirancang khusus menghadapi iklim tropis Indonesia—dari lebatnya hutan hingga puncak berbatu.
        </p>
      </>
    ),
  },

  /* Section 2 — 30% scroll: Description — Left aligned */
  {
    id: 'description',
    range: [0.22, 0.30, 0.42, 0.48] as const,
    position: 'left' as const,
    content: (
      <>
        <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">Filosofi Kami</p>
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none tracking-tight mb-5">
          Lahir dari<br />
          <span className="text-accent">Pegunungan</span><br />
          Nusantara
        </h2>
        <p className="font-body text-sm md:text-base text-white/50 max-w-md leading-relaxed">
          Setiap produk kami diuji oleh alam tropis yang keras — memastikan ketahanan dan kenyamanan maksimal di setiap kondisi perjalanan.
        </p>
      </>
    ),
  },

  /* Section 3 — 60% scroll: Motto — Right aligned */
  {
    id: 'motto',
    range: [0.48, 0.56, 0.68, 0.74] as const,
    position: 'right' as const,
    content: (
      <div className="flex flex-col items-end text-right">
        <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">Manifesto</p>
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-none tracking-tight mb-5">
          Setiap<br />
          Langkah<br />
          <span className="text-accent">Berarti</span>
        </h2>
        <p className="font-body text-sm md:text-base text-white/50 max-w-md leading-relaxed">
          Petualangan bukan sekadar tempat tujuan akhir, namun tentang setiap jejak yang kamu tinggalkan dan perlengkapan yang bisa kamu andalkan.
        </p>
      </div>
    ),
  },

  /* Section 4 — 90% scroll: CTA — Center */
  {
    id: 'cta',
    range: [0.76, 0.85, 1, 1] as const,
    position: 'center' as const,
    content: (
      <>
        <p className="font-body text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">Mulai Petualanganmu</p>
        <h2 className="font-display font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase leading-none tracking-tight mb-6">
          Ready to<br />
          <span className="text-accent">Conquer?</span>
        </h2>
        <p className="font-body text-sm md:text-base text-white/50 mb-10 max-w-lg mx-auto leading-relaxed">
          Ribuan penjelajah telah menemukan perlengkapan terbaik mereka. Sekarang giliranmu untuk memulai cerita baru.
        </p>
        <div className="pointer-events-auto mt-2">
          <Link
            to="/store"
            className="group inline-flex items-center gap-3 h-14 px-8 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_28px_rgba(234,88,12,0.35)]"
          >
            Eksplor Koleksi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </>
    ),
  },
];

const SequenceScroll = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // ── Immediate load ──
  useEffect(() => {
    const loaded: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `/image/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
        if (i === 1) {
            img.onload = () => {
                if (canvasRef.current) {
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const iw = img.naturalWidth;
                        const ih = img.naturalHeight;
                        const cw = window.innerWidth;
                        const ch = window.innerHeight;
                        canvas.width = cw;
                        canvas.height = ch;
                        const scale = Math.max(cw / iw, ch / ih);
                        const dw = iw * scale;
                        const dh = ih * scale;
                        const dx = (cw - dw) / 2;
                        const dy = (ch - dh) / 2;
                        ctx.clearRect(0, 0, cw, ch);
                        ctx.drawImage(img, dx, dy, dw, dh);
                    }
                }
            };
        }
        loaded.push(img);
    }
    imagesRef.current = loaded;
  }, []);

  // ── Canvas render loop — maps scroll progress → frame index ──
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let lastIdx = -1;

    const render = (idxOverride?: number) => {
      const progress = scrollYProgress.get();
      const idx = idxOverride !== undefined ? idxOverride : Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.floor(progress * (FRAME_COUNT - 1)))
      );

      if (idx !== lastIdx || idxOverride !== undefined) {
        const img = imagesRef.current[idx];
        if (img && (img.complete || idx === 0) && img.naturalWidth > 0) {
          // Cover-fit calculation
          const cw = canvas.width;
          const ch = canvas.height;
          const iw = img.naturalWidth;
          const ih = img.naturalHeight;
          const scale = Math.max(cw / iw, ch / ih);
          const dw = iw * scale;
          const dh = ih * scale;
          const dx = (cw - dw) / 2;
          const dy = (ch - dh) / 2;
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(img, dx, dy, dw, dh);
        }
        lastIdx = idx;
      }
      if (idxOverride === undefined) {
        raf = requestAnimationFrame(() => render());
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      lastIdx = -1; // force re-draw
      render(Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(scrollYProgress.get() * (FRAME_COUNT - 1)))));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollYProgress]);

  // ── Build motion values for each overlay (opacity, y, blur) ──
  const overlayMotions = overlays.map((o) => {
    const opacity = useTransform(scrollYProgress, [...o.range], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [o.range[0], o.range[1]], [60, 0]);
    const blur = useTransform(
      scrollYProgress,
      [o.range[0], o.range[1], o.range[2], o.range[3]],
      [8, 0, 0, 8]
    );
    return { ...o, opacity, y, blur };
  });

  // ── Scroll progress bar ──
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // ── Dynamic dark overlay that lightens mid-scroll for text readability ──
  const overlayDarken = useTransform(
    scrollYProgress,
    [0, 0.03, 0.15, 0.5, 0.85, 1],
    [0.7, 0.5, 0.35, 0.35, 0.5, 0.6]
  );

  return (
    <>
      <section ref={scrollRef} className="relative h-[500vh] bg-black">
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          {/* ── Canvas — always rendered, drawn only when images are loaded ── */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ display: 'block' }} />

          {/* ── Dynamic dark overlay ── */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: useTransform(overlayDarken, (v) => `rgba(0,0,0,${v})`),
            }}
          />

          {/* ── Cinematic vignette ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
            }}
          />

          {/* ── Film grain texture ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* ── Text Overlays ── */}
          <div className="absolute inset-0 pointer-events-none">
            {overlayMotions.map((o) => (
              <motion.div
                key={o.id}
                style={{
                  opacity: o.opacity,
                  y: o.y,
                  filter: useTransform(o.blur, (v) => `blur(${v}px)`),
                }}
                className={`absolute inset-0 flex flex-col justify-center px-8 md:px-20 lg:px-32 ${
                  o.position === 'center'
                    ? 'items-center text-center'
                    : o.position === 'left'
                    ? 'items-start text-left'
                    : 'items-end text-right'
                }`}
              >
                {o.content}
              </motion.div>
            ))}
          </div>

          {/* ── Bottom progress bar ── */}
          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-20 lg:px-32 pb-8 z-50 flex items-center gap-6">
            <span className="font-body text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium hidden md:block">
              Scroll
            </span>
            <div className="h-[1px] flex-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                style={{ width: progressWidth }}
                className="h-full bg-gradient-to-r from-orange-500/80 to-orange-400/60"
              />
            </div>
            <span className="font-body text-[9px] text-white/30 uppercase tracking-[0.3em] font-medium hidden md:block">
              {FRAME_COUNT} Frames
            </span>
          </div>

          {/* ── Mobile scroll indicator (fades on scroll) ── */}
          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0, 0.04], [1, 0]),
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:hidden"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 bg-white/60 rounded-full" />
            </motion.div>
            <span className="font-body text-[8px] text-white/30 uppercase tracking-[0.3em]">
              Scroll
            </span>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SequenceScroll;
