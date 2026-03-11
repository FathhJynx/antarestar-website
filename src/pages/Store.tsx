import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { products, categories, activities, sortOptions } from "@/data/products";
import heroImg from "@/assets/hero-outdoor.jpg";

const Store = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") result = result.filter((p) => p.category === selectedCategory);
    if (selectedActivity !== "All") result = result.filter((p) => p.activity === selectedActivity);

    switch (selectedSort) {
      case "Price: Low to High":
        result.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [selectedCategory, selectedActivity, selectedSort]);

  const FilterSection = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      {/* Category */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">Category</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left font-body text-sm py-1.5 px-3 rounded-md transition-colors ${
                selectedCategory === cat
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 text-foreground">Activity</h3>
        <div className="flex flex-col gap-2">
          {activities.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActivity(act)}
              className={`text-left font-body text-sm py-1.5 px-3 rounded-md transition-colors ${
                selectedActivity === act
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="relative rounded-xl overflow-hidden aspect-[3/4] hidden lg:block">
        <img src={heroImg} alt="Adventure promo" className="img-cover" />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-display font-bold text-sm text-primary-foreground">New Season Collection</p>
          <p className="font-body text-xs text-primary-foreground/70">Explore the latest drops</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Store Header */}
      <section className="pt-24 md:pt-28 pb-10 section-padding bg-secondary/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-2">Browse Collection</p>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-3">Explore Gear</h1>
            <p className="font-body text-muted-foreground max-w-lg">
              Premium outdoor gear designed for every adventure. Filter by category, activity, and find your perfect companion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 section-padding">
        <div className="section-container">
          {/* Mobile filter toggle + sort */}
          <div className="flex items-center justify-between mb-6 lg:mb-0">
            <button
              onClick={() => setMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 font-body text-sm text-foreground border border-border rounded-lg px-4 py-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-muted-foreground hidden sm:block">{filtered.length} products</span>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="appearance-none font-body text-sm bg-background border border-border rounded-lg px-4 py-2 pr-8 text-foreground focus:outline-none focus:border-accent cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12">
            {/* Desktop Sidebar */}
            <FilterSection className="hidden lg:block w-56 flex-shrink-0 pt-6" />

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-display text-xl text-muted-foreground">No products found</p>
                  <p className="font-body text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-50 lg:hidden"
              onClick={() => setMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display font-bold text-lg">Filters</h2>
                  <button onClick={() => setMobileFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSection />
                <Button variant="hero" className="w-full mt-6" onClick={() => setMobileFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Store;
