import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

// Components
import HeroSection from "./components/HeroSection";
import TrustMarquee from "./components/TrustMarquee";
import AboutService from "./components/AboutService";
import ProcessSteps from "./components/ProcessSteps";
import ProductShowcase from "./components/ProductShowcase";
import BenefitSection from "./components/BenefitSection";
import TestimonialSlider from "./components/TestimonialSlider";
import CTASection from "./components/CTASection";
import ContactForm from "./components/ContactForm";
import CorporateFooter from "./components/CorporateFooter";
import Stats from "@/components/antarestar/Stats";

const Corporate = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Smooth scroll logic
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-600 font-body overflow-x-hidden">
      {/* High-End Navigation */}
      <Navbar />

      <main className="relative">
        {/* 1. Hero Impression - Text Reveal + Video Parallax */}
        <HeroSection />

        {/* 2. Professional Trust - Infinite Logo Marquee */}
        <TrustMarquee />

        {/* 2.1 Mission Benchmarks - Success Rate Stats */}
        <Stats />

        {/* 3. Competitive Advantage - Premium Outdoor Focus */}
        <div id="service">
          <AboutService />
        </div>

        {/* 4. Strategic Flow - How to Start Inquiry */}
        <ProcessSteps />

        {/* 5. Production Benchmark - Bento Showcase Portfolio */}
        <ProductShowcase />

        {/* 6. Partner Segmentation - Who benefits? */}
        <BenefitSection />

        {/* 7. Social Proof Protocol - Real Client Reviews */}
        <TestimonialSlider />

        {/* 8. Conversion Point - Tactical Inquiry Card */}
        <div id="contact">
          <ContactForm />
        </div>

        {/* 9. Direct Link - WhatsApp High Speed Access */}
        <CTASection />
      </main>

      {/* 10. Brutalist Authority - Huge Typography Reveal */}
      <CorporateFooter />
    </div>
  );
};

export default Corporate;
