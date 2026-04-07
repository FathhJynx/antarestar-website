import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Components
import HeroAffiliate from "./components/HeroAffiliate";
import HowItWorks from "./components/HowItWorks";
import BenefitGrid from "./components/BenefitGrid";
import CommissionSection from "./components/CommissionSection";
import ProductShowcase from "./components/ProductShowcase";
import TestimonialSection from "./components/TestimonialSection";
import CTASection from "./components/CTASection";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchProducts = async () => {
  const res = await api.get("/products", { params: { per_page: 8 } });
  const rawProducts = res.data?.data?.data || [];
  return rawProducts.map((p: any) => {
    const primaryImage = p.images?.find((img: any) => img.is_primary)?.image_url 
                    || p.images?.[0]?.image_url
                    || 'https://via.placeholder.com/300';
    const activeVariant = p.variants?.[0];
    return {
      id: String(p.id),
      name: String(p.name),
      category: p.category?.name || "Equipment",
      badge: p.badge || null,
      image: primaryImage,
      price: Number(activeVariant?.price || 0),
      originalPrice: activeVariant?.original_price || null,
    };
  });
};

const Affiliate = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ['affiliate-products'],
    queryFn: fetchProducts,
  });

  // Smooth scroll logic
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleJoin = () => {
    if (!isAuthenticated) {
      toast("Login Diperlukan", {
        description: "Silakan masuk untuk mengakses dashboard affiliate Anda.",
      });
      navigate("/login", { state: { from: { pathname: "/affiliate/dashboard" } } });
      return;
    }
    navigate("/affiliate/dashboard");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-600 font-body overflow-x-hidden">
      {/* High-End Navigation */}
      <Navbar />

      <main className="relative">
        {/* 1. Hero Impression - Modular Boxed Layout */}
        <HeroAffiliate onJoin={handleJoin} />

        {/* 2. Strategic Flow - Rigid 4-Step Grid */}
        <HowItWorks />

        {/* 3. Competitive Advantage - Symmetrical Grid */}
        <div id="benefits">
          <BenefitGrid />
        </div>

        {/* 4. Reward Architecture - Big Text x Detail Box */}
        <CommissionSection onJoin={handleJoin} />

        {/* 5. Asset Library - Standard Product Grid */}
        <ProductShowcase products={products} />

        {/* 6. Partner Validation - Boxed Testimonial Slider */}
        <TestimonialSection />

        {/* 7. Final Conversion - Centered Boxed CTA */}
        <div id="join">
          <CTASection onJoin={handleJoin} />
        </div>
      </main>

      {/* Primary Footer - Consistent Branding */}
      <Footer />
    </div>
  );
};

export default Affiliate;
