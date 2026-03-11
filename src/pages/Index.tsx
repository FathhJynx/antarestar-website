import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import LifestyleSection from "@/components/LifestyleSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import CommunityGallery from "@/components/CommunityGallery";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <BrandStory />
        <LifestyleSection />
        <FeaturedCategories />
        <CommunityGallery />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
