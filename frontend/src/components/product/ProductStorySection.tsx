import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Shield, Zap, Wind, Droplets } from "lucide-react";

interface StorySceneProps {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    icon: React.ReactNode;
    index: number;
}

const StoryScene = ({ title, subtitle, description, image, icon, index }: StorySceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 1.1]);

    const isEven = index % 2 === 0;

    return (
        <section 
            ref={containerRef}
            className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black py-40 border-t border-white/5"
        >
            {/* Background Parallax Layer */}
            <motion.div 
                style={{ y, scale, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover grayscale brightness-50"
                />
            </motion.div>

            {/* Content Stage */}
            <div className="section-container relative z-20">
                <div className={`grid lg:grid-cols-2 gap-24 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}>
                    <motion.div 
                        initial={{ opacity: 0, x: isEven ? -60 : 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-12"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <div className="p-4 bg-orange-600 text-white rounded-none group-hover:scale-110 transition-transform duration-500">
                                    {icon}
                                </div>
                                <p className="font-display font-black text-[11px] text-orange-600 uppercase tracking-[0.6em]">{subtitle}</p>
                            </div>
                            <h2 className="font-display font-black text-6xl sm:text-7xl md:text-8xl text-white uppercase leading-[0.8] tracking-tighter">
                                {title}
                            </h2>
                        </div>
                        
                        <div className="w-1/2 h-1 bg-white/10" />
                        
                        <p className="font-display font-black text-lg sm:text-xl md:text-2xl text-white/50 uppercase leading-snug tracking-tight max-w-xl">
                            {description}
                        </p>

                        <div className="pt-10 flex items-center gap-3">
                             <div className="w-2 h-16 bg-orange-600" />
                             <p className="font-display font-black text-[9px] text-white/30 uppercase tracking-[0.4em] leading-relaxed">
                                Tested in extreme conditions.<br />Verified by Explorers.
                             </p>
                        </div>
                    </motion.div>

                    {/* Visual Focus Element */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:block relative aspect-square bg-white/[0.02] border border-white/5 overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="p-20 w-full h-full flex items-center justify-center opacity-30 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110">
                            {icon}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Depth Decals */}
            <div className="absolute top-20 right-20 text-white/[0.02] font-display font-black text-[15vw] leading-none uppercase select-none z-0">
               {subtitle.split(' ')[0]}
            </div>
        </section>
    );
};

const ProductStorySection = () => {
    const scenes = [
        {
            title: "SHIELD THE STORM",
            subtitle: "WEATHER RESISTANCE",
            description: "Engineered with tri-layer membrane technology to repel water while maintaining perfect breathability for extreme ascents.",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
            icon: <Droplets className="w-12 h-12" />
        },
        {
            title: "IGNITE THE HEAT",
            subtitle: "THERMAL DEFENSE",
            description: "Aerogel insulation core locks in body temperature without adding bulk, optimized for high-intensity movement in sub-zero terrain.",
            image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80",
            icon: <Zap className="w-12 h-12" />
        },
        {
            title: "BREACH THE WIND",
            subtitle: "AERODYNAMIC ARMOR",
            description: "High-density weave construction creates an impenetrable barrier against arctic gusts, reducing drag and thermal leakage.",
            image: "https://images.unsplash.com/photo-1519904981063-b0cfb7bd3b25?auto=format&fit=crop&q=80",
            icon: <Wind className="w-12 h-12" />
        }
    ];

    return (
        <div className="bg-black">
            {scenes.map((scene, i) => (
                <StoryScene 
                    key={i} 
                    index={i} 
                    {...scene} 
                />
            ))}
        </div>
    );
};

export default ProductStorySection;
