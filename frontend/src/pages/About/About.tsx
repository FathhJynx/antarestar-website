import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import { Mountain, Users, Shield, Leaf, ArrowRight, Compass, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

// Assets
import heroBg from "@/assets/community-3.jpg";
import aboutStory1 from "@/assets/hero-outdoor.jpg";
import aboutStory2 from "@/assets/community-2.jpg";

const FRAME_COUNT = 240;

const About = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    // ── Immediate load + First frame warm-up ──
    useEffect(() => {
        const loaded: HTMLImageElement[] = [];
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/image/sequence2/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            if (i === 1) {
                img.onload = () => {
                    if (canvasRef.current && imagesRef.current.length > 0) {
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

    // ── Canvas render loop ──
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
            lastIdx = -1;
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

    const values = [
        {
            icon: <Mountain className="w-8 h-8" />,
            title: "EKsPLORASI TANPA BATAS",
            desc: "Kami diciptakan untuk mereka yang menolak diam. Menjelajah batas alam dan diri sendiri.",
            accent: "bg-orange-600"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "KUALITAS TAKTIKAL",
            desc: "Setiap jahitan diuji di medan tropis ekstrem untuk menjamin ketahanan seumur hidup.",
            accent: "bg-white"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "KOMUNITAS TANGGUH",
            desc: "Bukan sekadar brand, kami adalah wadah bagi ribuan petualang untuk saling menginspirasi.",
            accent: "bg-orange-600"
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "PENJAGA BUMI",
            desc: "Berkomitmen pada praktik berkelanjutan untuk menjaga taman bermain kita tetap hijau.",
            accent: "bg-white"
        },
    ];

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white font-body selection:bg-orange-600 selection:text-white">
            <Navbar />
            
            {/* ── 01. CINEMATIC SCROLL SEQUENCE HERO ── */}
            <section ref={scrollRef} className="relative h-[600vh] bg-black">
                <div className="sticky top-0 w-full h-screen overflow-hidden">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Dark layers for readability */}
                    <motion.div 
                        className="absolute inset-0 bg-black/40"
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 0.3, 0.5, 0.8]) }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

                    {/* Content Layers — Mirroring Home (SequenceScroll) Layout */}
                    <div className="relative h-full container mx-auto px-6">
                        
                        {/* 0% Scroll: CENTER (Intro) */}
                        <motion.div 
                            style={{ 
                                opacity: useTransform(scrollYProgress, [0.01, 0.05, 0.12, 0.18], [0, 1, 1, 0]),
                                y: useTransform(scrollYProgress, [0, 0.15], [50, -50])
                            }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
                        >
                            <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">LOG: KELAHIRAN</p>
                            <h1 className="font-display font-black text-6xl md:text-[7rem] lg:text-[8rem] uppercase tracking-tighter leading-none text-white mb-6 italic">
                                CERITA <br /> <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '2px white' }}>KAMI.</span>
                            </h1>
                            <p className="font-body text-base md:text-lg text-white/50 max-w-lg mx-auto leading-relaxed uppercase font-bold tracking-widest">
                                DARI PUNCAK TERTINGGI HINGGA <span className="text-white">DALAMNYA HUTAN TROPIS.</span> SETIAP GEAR ADALAH CERITA KETANGGUHAN.
                            </p>
                        </motion.div>

                        {/* 30% Scroll: LEFT (Origins) */}
                        <motion.div 
                            style={{ 
                                opacity: useTransform(scrollYProgress, [0.22, 0.30, 0.42, 0.48], [0, 1, 1, 0]),
                                x: useTransform(scrollYProgress, [0.22, 0.3], [-50, 0])
                            }}
                            className="absolute inset-y-0 left-6 md:left-20 flex flex-col items-start justify-center pointer-events-none max-w-2xl"
                        >
                            <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">FILOSOFI KAMI</p>
                            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase leading-none tracking-tighter mb-6 italic">
                                LAHIR DI <br />
                                <span className="text-orange-600 text-transparent stroke-orange-600" style={{ WebkitTextStroke: '1.5px #ea580c' }}>KAKI GUNUNG</span> <br />
                                GEDE.
                            </h2>
                            <p className="font-body text-sm md:text-lg text-white/50 max-w-md leading-relaxed uppercase font-bold tracking-widest">
                                KAMI TIDAK MEMBUAT GEAR DI ATAS MEJA KERJA. KAMI MENEMPANNYA DI TERJALNYA ALAM TROMIS ASLI SEJAK 2019.
                            </p>
                        </motion.div>

                        {/* 60% Scroll: RIGHT (Innovation) */}
                        <motion.div 
                            style={{ 
                                opacity: useTransform(scrollYProgress, [0.48, 0.56, 0.68, 0.74], [0, 1, 1, 0]),
                                x: useTransform(scrollYProgress, [0.48, 0.56], [50, 0])
                            }}
                            className="absolute inset-y-0 right-6 md:right-20 flex flex-col items-end justify-center text-right pointer-events-none max-w-2xl"
                        >
                            <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">MANIFESTO</p>
                            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase leading-none tracking-tighter mb-6 italic">
                                JAHITAN <br />
                                ADALAH <br />
                                <span className="text-orange-600">KEAMANAN.</span>
                            </h2>
                            <p className="font-body text-sm md:text-lg text-white/50 max-w-md leading-relaxed uppercase font-bold tracking-widest ml-auto">
                                SETIAP JAHITAN DIUJI OLEH RIUHAN HUJAN DAN TERIKNYA MATAHARI — UNTUK MEMASTIKAN LO SELALU SIAP HADAPI APAPUN.
                            </p>
                        </motion.div>

                        {/* 90% Scroll: CENTER (CTA) */}
                        <motion.div 
                            style={{ 
                                opacity: useTransform(scrollYProgress, [0.76, 0.85, 1, 1], [0, 1, 1, 1]),
                                scale: useTransform(scrollYProgress, [0.76, 1], [0.95, 1])
                            }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
                        >
                             <p className="font-body text-xs font-black uppercase tracking-[0.4em] text-orange-600 mb-4">MISI TERAKHIR</p>
                             <h2 className="font-display font-black text-5xl md:text-8xl text-white uppercase leading-none tracking-tighter mb-10 italic">
                                READY TO <br />
                                <span className="text-orange-600 text-transparent stroke-orange-600" style={{ WebkitTextStroke: '2px #ea580c' }}>CONQUER?</span>
                             </h2>
                             <div className="pointer-events-auto">
                                <button className="bg-orange-600 text-white px-12 py-5 font-display font-black uppercase tracking-[0.2em] italic hover:bg-white hover:text-black transition-all rounded-none group flex items-center gap-4 text-sm">
                                    PELAJARI KOLEKSI <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                             </div>
                        </motion.div>

                    </div>

                    {/* Scroll Indicator */}
                    <motion.div 
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.03], [1, 0]) }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30"
                    >
                        <span className="text-[10px] uppercase font-black tracking-widest italic animate-pulse">SCROLL TO START LOG</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-orange-600 to-transparent" />
                    </motion.div>
                </div>
            </section>

            {/* ── 02. STATS OVERLAY ── */}
            <div className="bg-white/5 backdrop-blur-3xl border-y border-white/5 relative z-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
                    {[
                        { val: "2019", label: "TAHUN BERDIRI" },
                        { val: "100K+", label: "EKSPLORER" },
                        { val: "50+", label: "EKSPEDISI" },
                        { val: "128", label: "PRODUK INOVASI" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <h4 className="font-display font-black text-2xl text-orange-600 italic">{stat.val}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── 02. THE MANIFESTO ── */}
            <section className="py-24 md:py-48 bg-[#0B0B0B] relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    
                    {/* Left Detail Image */}
                    <div className="lg:col-span-5 space-y-12">
                        <Reveal direction="left">
                            <div className="relative aspect-[4/5] overflow-hidden group">
                               <img 
                                src={aboutStory1} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                                alt="Outdoor Expedition" 
                               />
                               <div className="absolute inset-0 bg-orange-600/10 mix-blend-overlay" />
                               <div className="absolute top-8 left-8 bg-orange-600 text-white p-6 font-display font-black italic text-xl tracking-tighter">
                                  "READY FOR <br /> ANYTHING"
                               </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Right Narrative Text */}
                    <div className="lg:col-span-7 space-y-16">
                        <Reveal>
                            <h2 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter italic leading-[0.85] mb-12">
                                DARI <span className="text-orange-600 text-transparent stroke-orange-600 stroke-1" style={{ WebkitTextStroke: '1px #ea580c' }}>FRUSTRASI</span> <br /> KE PUNCAK DUNIA.
                            </h2>
                            <div className="space-y-8 text-white/50 font-body text-lg md:text-xl leading-relaxed max-w-2xl">
                                <p className="first-letter:text-7xl first-letter:font-black first-letter:text-orange-600 first-letter:mr-4 first-letter:float-left drop-shadow-2xl">
                                    Antarestar lahir di tahun 2019 bukan sebagai sekadar bisnis, tapi sebuah jawaban. Di kaki Gede Pangrango, kami merasa sulitnya mencari perlengkapan taktis yang tahan banting namun tetap memiliki estetika modern.
                                </p>
                                <div className="p-8 border-l-2 border-orange-600 bg-white/5 backdrop-blur-md text-white font-bold italic text-xl">
                                    "Bukan cuma soal naik gunung, ini soal mentalitas penjelajah dalam menghadapi segala tantangan."
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ── 03. VALUES GRID ── */}
            <section className="py-20 md:py-48 bg-white text-black overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Reveal className="mb-12 md:mb-24">
                        <h2 className="font-display font-black text-5xl md:text-9xl uppercase tracking-tighter italic leading-none">
                            FUNDAMENTAL <br /> <span className="text-orange-600">EXPLORERS.</span>
                        </h2>
                    </Reveal>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-black/5 p-0.5 md:p-1 border border-black/10">
                        {values.map((v, i) => (
                            <StaggerItem key={i} className="bg-white p-8 md:p-12 space-y-6 md:space-y-8 group hover:bg-orange-600 transition-all duration-500 cursor-default border border-black/5">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white flex items-center justify-center p-3 md:p-4 group-hover:bg-white group-hover:text-orange-600 transition-all">
                                        {v.icon}
                                    </div>
                                    <span className="font-display font-black text-4xl md:text-6xl italic text-black/5 group-hover:text-white/20 transition-all">0{i+1}</span>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight group-hover:text-white transition-all">{v.title}</h3>
                                    <p className="text-base md:text-lg font-bold text-black/50 leading-relaxed group-hover:text-white transition-all italic">
                                        {v.desc}
                                    </p>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* ── 04. JOIN CTA ── */}
            <section className="relative py-24 md:py-48 bg-[#0B0B0B] overflow-hidden flex items-center justify-center">
                 <div className="relative z-10 text-center max-w-4xl mx-auto px-6 space-y-12 md:space-y-16">
                    <Reveal direction="scale">
                        <h2 className="font-display font-black text-5xl md:text-8xl uppercase tracking-tighter italic leading-[0.85]">
                            SIAP TULIS <br /> SEJARAH LO?
                        </h2>
                    </Reveal>
                    <Reveal delay={0.2}>
                         <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
                            <Button className="bg-orange-600 text-white px-8 md:px-12 h-14 md:h-16 text-base md:text-lg font-display font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all rounded-none w-full md:w-auto">
                                GABUNG KOMUNITAS
                            </Button>
                         </div>
                    </Reveal>
                 </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
