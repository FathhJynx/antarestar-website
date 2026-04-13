import { useScroll } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSequence from "./components/HeroSequence";
import StatsOverlay from "./components/StatsOverlay";
import TheManifesto from "./components/TheManifesto";
import ValuesGrid from "./components/ValuesGrid";
import JoinCTA from "./components/JoinCTA";

const About = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white font-body selection:bg-orange-600 selection:text-white">
            <Navbar />
            
            <HeroSequence scrollRef={scrollRef} scrollYProgress={scrollYProgress} />

            <StatsOverlay />

            <TheManifesto />

            <ValuesGrid />

            <JoinCTA />

            <Footer />
        </div>
    );
};

export default About;
