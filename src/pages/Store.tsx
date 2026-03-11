import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/AnimationPrimitives";
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
    }
    return result;
  }, [selectedCategory, selectedActivity, selectedSort]);

  const FilterPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`font-body text-sm py-2 px-4 rounded-full transition-all duration-300 ${
        active
          ? "bg-accent text-accent-foreground shadow-md shadow-accent/20"
          : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border"
      }`}
    >
      {label}
    </motion.button>
  );

  const FilterSection = ({ className = "" }: { className?: string }) => (
    <div className={className}>
      {/* Category */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">Category</h3>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat)}
              className={`text-left font-body text-sm py-2 px-3.5 rounded-lg transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {cat}
              {selectedCategory === cat && (
                <motion.span
                  layoutId="cat-indicator"
                  className="absolute"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="mb-8">
        <h3 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-4 text-muted-foreground">Activity</h3>
        <div className="flex flex-col gap-1">
          {activities.map((act) => (
            <motion.button
              key={act}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedActivity(act)}
              className={`text-left font-body text-sm py-2 px-3.5 rounded-lg transition-all duration-300 ${
                selectedActivity === act
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              {act}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Promo Banner */}
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] hidden lg:block group">
        <img src={heroImg} alt="Adventure promo" className="img-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-display font-bold text-primary-foreground text-sm mb-0.5">New Season</p>
          <p className="font-body text-[11px] text-primary-foreground/60">Explore the latest drops</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Store Header */}
      <section className="pt-28 md:pt-32 pb-8 section-padding">
        <div className="section-container">
          <Reveal>
            <div className="max-w-xl">
              <SectionHeading subtitle="Browse Collection" title="Explore Gear" />
              <p className="font-body text-muted-foreground text-[15px] leading-relaxed -mt-8">
                Premium outdoor gear designed for every adventure. Filter by category, activity, and find your perfect companion.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Category pills (mobile & desktop) */}
      <section className="section-padding pb-6 lg:hidden">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-4 md:py-8 section-padding">
        <div className="section-container">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 font-body text-sm text-foreground bg-card border border-border rounded-xl px-4 py-2.5 hover:border-accent/30 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-sm text-muted-foreground hidden sm:block"
              >
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </motion.span>
            </div>

            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none font-body text-sm bg-card border border-border rounded-xl px-4 py-2.5 pr-9 text-foreground focus:outline-none focus:border-accent/30 cursor-pointer transition-colors"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-10 lg:gap-14">
            {/* Desktop Sidebar */}
            <LayoutGroup>
              <FilterSection className="hidden lg:block w-52 flex-shrink-0 sticky top-28 self-start" />
            </LayoutGroup>

            {/* Product Grid */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${selectedActivity}-${selectedSort}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7"
                >
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Grid3X3 className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="font-display text-xl text-foreground mb-2">No products found</p>
                  <p className="font-body text-sm text-muted-foreground">Try adjusting your filters</p>
                </motion.div>
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
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-background z-50 lg:hidden overflow-y-auto shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-10">
                  <h2 className="font-display font-bold text-lg tracking-wide">Filters</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileFilters(false)}
                    className="w-9 h-9 rounded-full bg-card flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
                <FilterSection />
                <Button variant="hero" className="w-full mt-8 rounded-xl" onClick={() => setMobileFilters(false)}>
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
