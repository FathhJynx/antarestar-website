import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreHeroPremium from "@/pages/Store/components/StoreHeroPremium";
import StoreMobileFilter from "@/pages/Store/components/StoreMobileFilter";
import QuickAddModal from "@/components/QuickAddModal";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

/* Pure Refactor Components */
import SearchBar from "@/pages/Store/components/SearchBar";
import FilterBar from "@/pages/Store/components/FilterBar";
import StoreLayout from "@/pages/Store/components/StoreLayout";
import StoreHeroSlider from "./components/hero/StoreHeroSlider";
import PromoCards from "./components/promo/PromoCards";
import StoreMarquee from "./components/StoreMarquee";

const MIN_PRICE = 0;
const MAX_PRICE = 5000000;

const fetchProducts = async () => {
  const res = await api.get("/products", { params: { per_page: 100 } });
  const rawProducts = res.data?.data?.data || [];
  return rawProducts.map((p: any) => {
    const primaryImage = p.images?.find((img: any) => img.is_primary)?.image_url 
                    || p.images?.[0]?.image_url
                    || 'https://via.placeholder.com/300';
    
    const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
    const isOnFlashSale = activeVariant?.is_on_flash_sale;
    
    return {
      id: String(p.id),
      name: String(p.name),
      category: p.category?.name || "Equipment",
      badge: isOnFlashSale ? "Flash Sale" : null,
      image: primaryImage,
      price: Number(activeVariant?.price || 0),
      originalPrice: isOnFlashSale ? Number(activeVariant.price) : (activeVariant?.original_price || null),
      flashSalePrice: isOnFlashSale ? Number(activeVariant.flash_sale_price) : undefined,
      rating: p.reviews_avg_rating || p.rating || (p.reviews?.length > 0 ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length : 0),
      reviewCount: p.reviews_count || p.reviewCount || p.reviews?.length || 0,
      sold_count: p.sold_count || 0,
    };
  });
};

const Store = () => {
  const [searchParams] = useSearchParams();
  const rawCategory = searchParams.get("category");
  const initialCategory = (rawCategory === "Semua" || !rawCategory) ? "Semua Gear" : rawCategory;
  const initialSort     = searchParams.get("sort")     || "Terbaru";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedActivity,  setSelectedActivity]  = useState("Semua");
  const [selectedSort,      setSelectedSort]      = useState(initialSort);
  const [mobileFilters,     setMobileFilters]     = useState(false);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [priceMin,          setPriceMin]          = useState(MIN_PRICE);
  const [priceMax,          setPriceMax]          = useState(MAX_PRICE);
  const [quickAddProduct,   setQuickAddProduct]   = useState<any>(null);

  const { data: products = [], isLoading: isFetchingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const filtered = useMemo(() => {
    let result = [...products];
    
    // Category Filter
    if (selectedCategory !== "Semua Gear") {
      result = result.filter((p: any) => p.category === selectedCategory);
    }
    
    // Activity Filter
    if (selectedActivity !== "Semua") {
      result = result.filter((p: any) => p.activity === selectedActivity);
    }
    
    // Price Filter
    result = result.filter((p: any) => p.price >= priceMin && p.price <= priceMax);
    
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p: any) => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    
    // Sorting
    switch (selectedSort) {
      case "Terbaru":
        // Assuming products are already sorted by latest, or adding an ID-based sort
        result = result.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "Terpopuler":
        result = result.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0));
        break;
      case "Harga: Rendah ke Tinggi":
        result = result.sort((a, b) => a.price - b.price);
        break;
      case "Harga: Tinggi ke Rendah":
        result = result.sort((a, b) => b.price - a.price);
        break;
    }
    
    return result;
  }, [products, selectedCategory, selectedActivity, selectedSort, searchQuery, priceMin, priceMax]);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))) as string[], [products]);

  const activeFilterCount = (selectedCategory !== "Semua Gear" ? 1 : 0) + (priceMin > MIN_PRICE || priceMax < MAX_PRICE ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white selection:bg-orange-600/30 overflow-x-hidden">
      <Navbar />

      <main className="pb-32">
        {/* Editorial Hero Slider */}
        <StoreHeroSlider />

        {/* Awwwards Typography Marquee */}
        <StoreMarquee />

        {/* Nike/Adidas Style Promo Campaigns */}
        <PromoCards />

        {/* Dynamic Search Segment */}
        <section className="section-container section-padding pt-6 pb-6">
           <SearchBar 
             value={searchQuery} 
             onChange={setSearchQuery} 
             onOpenFilter={() => setMobileFilters(true)}
             activeFilterCount={activeFilterCount}
           />
        </section>

        {/* Global Hub Navigation (Filters) */}
        <section className="border-y border-[#1F1F1F] bg-[#111111]/30 backdrop-blur-sm sticky top-[88px] z-40">
           <FilterBar 
             categories={categories} 
             selectedCategory={selectedCategory} 
             onCategoryChange={setSelectedCategory} 
           />
        </section>

        {/* Main Production Floor */}
        <StoreLayout 
          products={filtered} 
          isLoading={isFetchingProducts} 
        />
      </main>

      <StoreMobileFilter
        open={mobileFilters}
        onClose={() => setMobileFilters(false)}
        selectedCategory={selectedCategory}
        selectedActivity={selectedActivity}
        selectedSort={selectedSort}
        priceMin={priceMin}
        priceMax={priceMax}
        filteredCount={filtered.length}
        activeFilterCount={activeFilterCount}
        onCategoryChange={setSelectedCategory}
        onActivityChange={setSelectedActivity}
        onSortChange={setSelectedSort}
        onPriceMinChange={setPriceMin}
        onPriceMaxChange={setPriceMax}
        onReset={() => { setSelectedCategory("Semua Gear"); setSelectedActivity("Semua"); setSearchQuery(""); }}
        categories={categories}
      />

       <QuickAddModal 
        product={quickAddProduct}
        isOpen={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />

      <Footer />
    </div>
  );
};

export default Store;
