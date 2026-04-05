import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  SlidersHorizontal, X, ChevronDown, Search, Tag, LayoutList, LayoutGrid,
  Zap, Flame, ShoppingBag, ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Button } from "@/components/ui/button";
import { sortOptions } from "@/data/products";

import StoreHero         from "@/components/StoreHero";
import StoreFilterSidebar, { MIN_PRICE, MAX_PRICE, fmtK } from "@/components/StoreFilterSidebar";
import StoreMobileFilter  from "@/components/StoreMobileFilter";
import QuickAddModal from "@/components/QuickAddModal";



/* ────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────── */
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchProducts = async () => {
  const res = await api.get("/products", { params: { per_page: 100 } });
  const rawProducts = res.data?.data?.data || [];
  return rawProducts.map((p: any) => {
    const primaryImage = p.images?.find((img: any) => img.is_primary)?.image_url 
                    || p.images?.[0]?.image_url
                    || 'https://via.placeholder.com/300';
    
    // Check for active flash sale in variants
    const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
    const isOnFlashSale = activeVariant?.is_on_flash_sale;
    
    return {
      id: String(p.id),
      name: String(p.name),
      description: String(p.description),
      category: p.category?.name || "Perlengkapan",
      activity: "Aktivitas Outdoor",
      badge: isOnFlashSale ? "Flash Sale" : null,
      image: primaryImage,
      images: p.images?.map((i: any) => i.image_url) || [primaryImage],
      price: Number(activeVariant?.price || 0),
      originalPrice: isOnFlashSale ? Number(activeVariant.price) : null,
      flashSalePrice: isOnFlashSale ? Number(activeVariant.flash_sale_price) : undefined,
      rating: p.reviews?.length > 0 
        ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
        : 0,
      reviewCount: p.reviews?.length || 0,
      sizes: [...new Set(p.variants?.map((v: any) => v.size).filter(Boolean))] as string[],
      colors: Object.values((p.variants || []).reduce((acc: any, v: any) => {
        if (v.color_code && !acc[v.color_code]) {
          acc[v.color_code] = { name: v.color_name, hex: v.color_code };
        }
        return acc;
      }, {})),
      variants: p.variants || [],
      stock: p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || Number(p.stock || 0),
    };
  });
};

/* ────────────────────────────────────────────────
   MAIN COMPONENT
   ──────────────────────────────────────────────── */
const Store = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "Semua";
  const initialSort     = searchParams.get("sort")     || "Terbaru";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedActivity,  setSelectedActivity]  = useState("Semua");
  const [selectedSort,      setSelectedSort]      = useState(initialSort);
  const [mobileFilters,     setMobileFilters]     = useState(false);
  const [viewMode,          setViewMode]          = useState<"grid" | "list">("grid");
  const [searchQuery,       setSearchQuery]       = useState("");
  const [showSearch,        setShowSearch]        = useState(false);
  const [priceMin,          setPriceMin]          = useState(MIN_PRICE);
  const [priceMax,          setPriceMax]          = useState(MAX_PRICE);
  const [isLoading,         setIsLoading]         = useState(false);
  const [quickAddProduct,   setQuickAddProduct]   = useState<any>(null);

  const { data: remoteProducts = [], isLoading: isFetchingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const displayProducts = remoteProducts; // Removed mock fallback

  /* Lock body scroll when bottom sheet open */
  useEffect(() => {
    document.body.style.overflow = mobileFilters ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFilters]);

  /* Skeleton flash on filter change */
  const triggerLoading = useCallback((fn: () => void) => {
    setIsLoading(true);
    setTimeout(() => { fn(); setIsLoading(false); }, 350);
  }, []);

  /* Filtered + sorted products */
  const filtered = useMemo(() => {
    let result = [...displayProducts];
    if (selectedCategory !== "Semua") result = result.filter((p: any) => p.category === selectedCategory);
    if (selectedActivity  !== "Semua") result = result.filter((p: any) => p.activity  === selectedActivity);
    result = result.filter((p: any) => {
      const effectivePrice = p.flashSalePrice || p.price;
      return effectivePrice >= priceMin && effectivePrice <= priceMax;
    });
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p: any) => p.name.toLowerCase().includes(q));
    }
    const getEffPrice = (p: any) => p.flashSalePrice || p.price;
    switch (selectedSort) {
      case "Harga: Rendah ke Tinggi":  result.sort((a, b) => getEffPrice(a) - getEffPrice(b)); break;
      case "Harga: Tinggi ke Rendah":  result.sort((a, b) => getEffPrice(b) - getEffPrice(a)); break;
      case "Terpopuler": result.sort((a) => (a.badge === "Best Seller" ? -1 : 1)); break;
    }
    return result;
  }, [displayProducts, selectedCategory, selectedActivity, selectedSort, priceMin, priceMax, searchQuery]);


  /* Active filter count */
  const activeFilterCount =
    (selectedCategory !== "Semua" ? 1 : 0) +
    (selectedActivity  !== "Semua" ? 1 : 0) +
    (priceMin > MIN_PRICE || priceMax < MAX_PRICE ? 1 : 0);

  /* Reset all */
  const resetFilters = () => {
    setSelectedCategory("Semua");
    setSelectedActivity("Semua");
    setSelectedSort("Terbaru");
    setPriceMin(MIN_PRICE);
    setPriceMax(MAX_PRICE);
    setSearchQuery("");
  };

  /* Active chips */
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (selectedCategory !== "Semua") activeChips.push({ label: selectedCategory, onRemove: () => setSelectedCategory("Semua") });
  if (selectedActivity  !== "Semua") activeChips.push({ label: selectedActivity,  onRemove: () => setSelectedActivity("Semua") });
  if (priceMin > MIN_PRICE || priceMax < MAX_PRICE)
    activeChips.push({ label: `Rp ${fmtK(priceMin)}–${fmtK(priceMax)}`, onRemove: () => { setPriceMin(MIN_PRICE); setPriceMax(MAX_PRICE); } });
  if (searchQuery.trim()) activeChips.push({ label: `"${searchQuery}"`, onRemove: () => setSearchQuery("") });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ══ HERO BANNER ══ */}
      <StoreHero
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => triggerLoading(() => setSelectedCategory(cat))}
      />

      {/* ══ FLASH SALE STRIP ══ */}
      {(() => {
        const flashItems = displayProducts.filter((p: any) => p.flashSalePrice && p.price > 0);
        if (!flashItems.length) return null;

        // Simple countdown hook inline
        const pad = (n: number) => String(n).padStart(2, "0");
        const now = new Date();
        const endOfDay = new Date(now); endOfDay.setHours(23, 59, 59, 0);
        const diffSec = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
        const h = pad(Math.floor(diffSec / 3600));
        const m = pad(Math.floor((diffSec % 3600) / 60));
        const s = pad(diffSec % 60);

        const rp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

        return (
          <section className="py-8 md:py-12 bg-primary relative overflow-hidden">
            {/* glow */}
            <div className="absolute top-0 left-1/3 w-[400px] h-[150px] bg-red-600/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                    className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    <Zap className="w-5 h-5 text-white fill-current" />
                  </motion.div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
                      <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">Stok Terbatas</span>
                    </div>
                    <h2 className="font-display font-black text-xl sm:text-2xl uppercase text-white tracking-tight">Flash Sale</h2>
                  </div>
                </div>
                {/* Timer */}
                <div className="flex items-center gap-1.5 font-display font-black text-lg sm:text-xl">
                  {[h, m, s].map((u, i) => (
                    <React.Fragment key={i}>
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded-lg min-w-[38px] text-center shadow">{u}</span>
                      {i < 2 && <span className="text-red-500 text-base">:</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Horizontal scroll */}
              <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-6 sm:px-0">
                {flashItems.map((p) => {
                  const orig = p.originalPrice || p.price;
                  const flash = p.flashSalePrice!;
                  const pct = Math.round(((orig - flash) / orig) * 100);
                  const stock = p.stockLevel || 60;
                  return (
                    <Link key={p.id} to={`/product/${p.id}`}
                      className="group flex-shrink-0 w-[240px] sm:w-[260px] bg-white rounded-2xl overflow-hidden snap-start">
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <img src={p.image} alt={p.name} loading="lazy"
                          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute top-2 left-2 bg-red-600 text-white font-display font-black text-sm px-2 py-0.5 rounded-lg" style={{ transform: "rotate(-3deg)" }}>
                          -{pct}%
                        </span>
                        {stock > 70 && (
                          <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            <Flame className="w-2.5 h-2.5" /> Hampir Habis
                          </span>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-3">
                        <h3 className="font-display font-bold text-xs leading-snug line-clamp-2 mb-1.5 group-hover:text-red-600 transition-colors">{p.name}</h3>
                        <div className="flex items-end gap-1.5 mb-2">
                          <span className="font-display font-black text-base text-red-600">{rp(flash)}</span>
                          <span className="font-body text-[10px] text-gray-400 line-through pb-0.5">{rp(orig)}</span>
                        </div>
                        {/* Stock bar */}
                        <div className="space-y-0.5">
                          <div className="flex justify-between text-[9px] font-bold font-body text-gray-500">
                            <span>Terjual {stock}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${stock}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══ DISCOUNTED PRODUCTS STRIP ══ */}
      {(() => {
        const discountItems = displayProducts.filter((p: any) => p.originalPrice && p.originalPrice > p.price && !p.flashSalePrice);
        if (!discountItems.length) return null;

        const rp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

        return (
          <section className="py-8 md:py-10 bg-background border-b border-border">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
                    <Tag className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="font-display font-black text-lg sm:text-xl uppercase text-foreground tracking-tight">Sedang Diskon</h2>
                </div>
                <span className="font-body text-xs text-muted-foreground">{discountItems.length} produk</span>
              </div>

              {/* Horizontal scroll */}
              <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none px-6 sm:px-0">
                {discountItems.map((p) => {
                  const pct = Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100);
                  return (
                    <Link key={p.id} to={`/product/${p.id}`}
                      className="group flex-shrink-0 w-[200px] sm:w-[220px] snap-start">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border mb-2.5">
                        <img src={p.image} alt={p.name} loading="lazy"
                          className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute top-2 right-2 bg-accent text-white font-display font-black text-[11px] px-2 py-0.5 rounded-full">
                          -{pct}%
                        </span>
                      </div>
                      <p className="font-body text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-0.5">{p.category}</p>
                      <h3 className="font-display font-bold text-xs line-clamp-2 group-hover:text-accent transition-colors mb-1">{p.name}</h3>
                      <div className="flex items-end gap-1.5">
                        <span className="font-display font-black text-sm text-foreground">{rp(p.price)}</span>
                        <span className="font-body text-[10px] text-muted-foreground line-through">{rp(p.originalPrice!)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ══ PRODUCT SECTION ══ */}
      <section className="py-6 md:py-10 section-padding">
        <div className="section-container">

          {/* ── Toolbar ── */}
          <div className="flex flex-wrap items-center gap-3 mb-4">

            {/* Left: search + mobile filter + count */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch((s) => !s)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                  showSearch ? "bg-accent text-accent-foreground border-accent" : "bg-card border-border hover:border-accent/40"
                }`}
              >
                <Search className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="Cari produk..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full font-body text-sm bg-card border border-border rounded-xl px-3.5 py-2 text-foreground focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden relative inline-flex items-center gap-1.5 font-body text-sm text-foreground bg-card border border-border rounded-xl px-3 py-2 hover:border-accent/40 transition-colors shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-sm text-muted-foreground shrink-0 hidden sm:block"
              >
                {filtered.length} produk
              </motion.span>
            </div>

            {/* Right: view toggle + sort */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1 bg-card border border-border rounded-xl p-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("grid")}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("list")}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => triggerLoading(() => setSelectedSort(e.target.value))}
                  className="appearance-none font-body text-sm bg-card border border-border rounded-xl px-3 py-2 pr-8 text-foreground focus:outline-none focus:border-accent/40 cursor-pointer transition-colors"
                >
                  {["Terbaru", "Terpopuler", "Harga: Rendah ke Tinggi", "Harga: Tinggi ke Rendah"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── Active filter chips ── */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-5"
              >
                <div className="flex flex-wrap items-center gap-2 py-1">
                  <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Filter aktif:
                  </span>
                  {activeChips.map((chip) => (
                    <motion.button
                      key={chip.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={chip.onRemove}
                      className="inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/25 hover:bg-accent/20 transition-colors"
                    >
                      {chip.label}
                      <X className="w-3 h-3" />
                    </motion.button>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="font-body text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                  >
                    Reset semua
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Sidebar + Grid layout ── */}
          <div className="flex gap-10 lg:gap-14">
            {/* Desktop Sidebar */}
            <LayoutGroup>
              <div className="hidden lg:block w-52 flex-shrink-0 sticky top-28 self-start">
                <StoreFilterSidebar
                  selectedCategory={selectedCategory}
                  selectedActivity={selectedActivity}
                  priceMin={priceMin}
                  priceMax={priceMax}
                  onCategoryChange={(cat) => triggerLoading(() => setSelectedCategory(cat))}
                  onActivityChange={(act) => triggerLoading(() => setSelectedActivity(act))}
                  onPriceMinChange={setPriceMin}
                  onPriceMaxChange={setPriceMax}
                />
              </div>
            </LayoutGroup>

            {/* Product area */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-7"}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))}
                  </motion.div>
                ) : filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-24"
                  >
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-display text-xl text-foreground mb-2">Produk tidak ditemukan</p>
                    <p className="font-body text-sm text-muted-foreground mb-6">Coba ubah filter atau kata kunci pencarian</p>
                    <Button variant="outline" onClick={resetFilters} className="font-body">
                      Reset Filter
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${selectedCategory}-${selectedActivity}-${selectedSort}-${priceMin}-${priceMax}-${searchQuery}-${viewMode}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-7"}
                  >
                    {filtered.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} viewMode={viewMode} onQuickAdd={setQuickAddProduct} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ══ MOBILE BOTTOM SHEET ══ */}
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
        onReset={resetFilters}
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
