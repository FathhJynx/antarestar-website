import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/pages/Home/components/HeroSection";
import MarqueeBanner from "@/pages/Home/components/MarqueeBanner";
import CommunityGallery from "@/pages/Home/components/CommunityGallery";
import BrandStory from "@/pages/Home/components/BrandStory";
import FlashSaleSection from "@/pages/Home/components/FlashSaleSection";
import ShopCategories from "@/pages/Home/components/ShopCategories";
import BestSellers from "@/pages/Home/components/BestSellers";
import BizStrip from "@/pages/Home/components/BizStrip";
import SequenceScroll from "@/components/antarestar/SequenceScroll";
import TextReveal from "@/components/antarestar/TextReveal";
import BentoGrid from "@/components/antarestar/BentoGrid";
import Stats from "@/components/antarestar/Stats";
import TestimonialSlider from "@/components/antarestar/TestimonialSlider";
import MegaSaleCTA from "@/pages/Home/components/MegaSaleCTA";
import CTASection from "@/components/antarestar/CTASection";
import StatsStrip from "@/pages/Home/components/StatsStrip";

const HomePage = () => {
  return (
    <div className="dark bg-black text-white min-h-screen selection:bg-orange-500/30 selection:text-orange-200 cursor-none" style={{ overflowX: 'clip' }}>
      <Navbar />
      <main>
        {/* Cinematic Hero — 500vh scroll-driven canvas sequence */}
        <SequenceScroll />

        {/* About — Word-by-word text reveal */}
        <TextReveal />

        {/* Product DNA — Bento grid showcase */}
        <BentoGrid />

        {/* By The Numbers — Animated stats */}
        <Stats />

        {/* 1. Stats Strip — Dynamic Numbers */}
        <StatsStrip />

        {/* 2. Shop by Category — Grid layout */}
        <ShopCategories />

        {/* 3. Bestsellers — Featured Products */}
        <BestSellers />

        {/* 4. Flash Sale — Urgency section */}
        <FlashSaleSection />

        {/* Social Proof — Testimonial slider */}
        <TestimonialSlider />

        {/* Mega Sale CTA */}
        <MegaSaleCTA />

        {/* Ecosystem — Corporate / Affiliate / Member */}
        <BizStrip />

        {/* Community Gallery */}
        <CommunityGallery />

        {/* Final CTA — conversion close */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
