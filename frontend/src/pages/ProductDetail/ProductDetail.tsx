import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Heart, Star, ChevronRight, Shield, Truck, RefreshCw,
  Share2, ChevronLeft, Check, Minus, Plus, Package, Zap
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import ProductDetailSkeleton from "@/components/ProductDetailSkeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

// Determine sizes based on category
const getCategorySizes = (category: string, productSizes?: string[]) => {
  if (productSizes && productSizes.length > 0) return productSizes;
  if (category === "Pakaian" || category === "Jaket" || category === "Apparel" || category === "Jackets") return ["S", "M", "L", "XL", "XXL"];
  if (category === "Alas Kaki" || category === "Footwear") return ["36", "37", "38", "39", "40", "41", "42", "43"];
  return [];
};

const StarRating = ({ rating = 0, count = 0, size = "sm" }: { rating?: number; count?: number; size?: "sm" | "md" | "lg" }) => {
  const iconSize = size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  
  if (count === 0) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={`${iconSize} text-muted-foreground/20`} />
          ))}
        </div>
        <span className="font-body text-sm text-muted-foreground italic">Belum ada ulasan</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${iconSize} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`}
          />
        ))}
      </div>
      <span className={`font-display font-black text-foreground ${size === "lg" ? "text-3xl" : size === "md" ? "text-xl" : "text-sm"}`}>
        {rating.toFixed(1)}
      </span>
      {count && <span className="font-body text-sm text-muted-foreground">({count.toLocaleString("id-ID")} ulasan)</span>}
    </div>
  );
};

// Mock Reviews removed following requirements to not use dummy data
// Reviews logic will use product.reviews directly

// Review State removed mockup tags


const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: remoteProduct, isLoading: isFetchingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.data;
        const primaryImage = p.images?.find((img: any) => img.is_primary)?.image_url 
                        || p.images?.[0]?.image_url
                        || 'https://via.placeholder.com/300';
        
        // Find active flash sale for variants
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
          originalPrice: isOnFlashSale ? Number(activeVariant.price) : undefined,
          flashSalePrice: isOnFlashSale ? Number(activeVariant.flash_sale_price) : undefined,
          rating: p.reviews?.length > 0 
            ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
            : 0,
          reviewCount: p.reviews?.length || 0,
          reviews: p.reviews?.map((r: any) => ({
             id: r.id,
             user: r.user?.name || "Pembeli Antarestar",
             rating: r.rating,
             comment: r.comment || "",
             date: new Date(r.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
             variant: r.order?.items?.find((item: any) => item.product_variant_id && item.product_variant?.product_id === p.id)?.product_variant?.name 
                      || r.order?.items?.[0]?.product_variant?.name 
                      || "Default",
             likes: 0,
             hasImage: false
          })) || [],
          sizes: [...new Set(p.variants?.map((v: any) => v.size).filter(Boolean))] as string[],
          colors: Object.values((p.variants || []).reduce((acc: any, v: any) => {
            if (v.color_code && !acc[v.color_code]) {
              acc[v.color_code] = { name: v.color_name, hex: v.color_code };
            }
            return acc;
          }, {})),
          variants: p.variants || [],
          stock: p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0,
          features: []
        } as any;
      } catch (e) {
        return null; // Let fallback kick in if item not in DB
      }
    },
  });
  
  const { data: similarProducts = [], isLoading: isFetchingSimilar } = useQuery({
    queryKey: ['similar-products', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/products/${id}/similar`);
        const raw = res.data.data || [];
        return raw.map((p: any) => {
          const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
          const isOnFlashSale = activeVariant?.is_on_flash_sale;
          
          return {
            id: String(p.id),
            name: String(p.name),
            image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
            price: Number(activeVariant?.price || 0),
            originalPrice: isOnFlashSale ? Number(activeVariant.price) : undefined,
            flashSalePrice: isOnFlashSale ? Number(activeVariant.flash_sale_price) : undefined,
            rating: p.reviews?.length > 0 
              ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length 
              : 0,
            reviewCount: p.reviews?.length || 0,
            category: p.category?.name || "Perlengkapan"
          };
        });
      } catch (e) {
        return [];
      }
    },
    enabled: !!id
  });

  const product: any = remoteProduct;
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Review State
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  const availableColors = product?.colors || [];
  
  // Available sizes depends on selected color (if any)
  const availableSizes = product ? (
    selectedColor 
    ? [...new Set(product.variants.filter((v: any) => v.color_name === selectedColor).map((v: any) => v.size).filter(Boolean))]
    : product.sizes
  ) : [];

  // Find selected variant for price/stock
  const selectedVariant = product?.variants?.find((v: any) => 
    (!selectedColor || v.color_name === selectedColor) && 
    (!selectedSize || v.size === selectedSize)
  );

  const displayPrice = selectedVariant?.is_on_flash_sale ? Number(selectedVariant.flash_sale_price) : Number(selectedVariant?.price || product?.price || 0);
  const displayStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;
  const originalPrice = selectedVariant?.is_on_flash_sale ? Number(selectedVariant.price) : (selectedVariant?.price || product?.originalPrice);

  const filteredReviews = (product?.reviews || []).filter((r: any) => {
    if (activeFilter === "Semua") return true;
    if (activeFilter === "Dengan Foto") return r.hasImage;
    if (activeFilter === "Dengan Komentar") return r.comment.length > 0;
    if (activeFilter === "Bintang 5") return r.rating === 5;
    if (activeFilter === "Bintang 4") return r.rating === 4;
    return true;
  });

  const toggleLike = (reviewId: number) => {
    setLikedReviews(prev => 
      prev.includes(reviewId) ? prev.filter(id => id !== reviewId) : [...prev, reviewId]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedSize("");
    setSelectedColor("");
    setQty(1);
  }, [id]);

  const effectivePrice = displayPrice;
  const discountPct = (originalPrice && originalPrice > 0 && effectivePrice)
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : 0;

  const relatedProducts = similarProducts;

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu.");
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Pilih warna terlebih dahulu.");
      return;
    }
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: product.image,
      price: effectivePrice,
      originalPrice: originalPrice,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      qty,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu.");
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Pilih warna terlebih dahulu.");
      return;
    }
    
    const buyNowItem = {
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: product.image,
      price: effectivePrice,
      originalPrice: originalPrice,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      qty,
    };

    navigate("/checkout", { state: { buyNowItem } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isFetchingProduct ? (
        <ProductDetailSkeleton />
      ) : !product ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-2xl font-display font-bold text-foreground mt-32">Produk tidak ditemukan.</p>
          <Link to="/store" className="mt-4 text-accent underline font-body">Kembali ke toko</Link>
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
      <div className="pt-24 pb-2 section-padding">
        <div className="section-container">
          <nav className="flex items-center gap-2 font-body text-xs text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/store" className="hover:text-accent transition-colors">Toko</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/store?category=${product.category}`} className="hover:text-accent transition-colors">{product.category}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-padding py-6 md:py-10">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

            {/* Left: Image */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-muted group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 shadow-inner"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full font-body uppercase tracking-wider">
                    {product.badge}
                  </span>
                )}
                {discountPct > 0 && (
                  <span className="absolute top-4 right-4 bg-red-600 text-white text-sm font-black px-3 py-1.5 rounded-full font-display">
                    -{discountPct}%
                  </span>
                )}
                {product.flashSalePrice && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse">
                    <Zap className="w-3 h-3 fill-current" />
                    PROMO KILAT
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              {/* Name */}
              <div>
                <p className="font-body text-xs text-accent font-bold tracking-widest uppercase mb-2">{product.category}</p>
                <h1 className="font-display font-black text-2xl md:text-3xl leading-snug text-foreground">{product.name}</h1>
              </div>

              {/* Rating */}
              <StarRating rating={product.rating} count={product.reviewCount} />

              {/* Price */}
              <div className="flex items-end gap-4 bg-muted/50 rounded-2xl p-4">
                <span className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-accent">
                  {formatPrice(effectivePrice)}
                </span>
                 {originalPrice && originalPrice !== effectivePrice && (
                  <div className="flex flex-col">
                    <span className="font-body text-sm text-muted-foreground line-through">
                      {formatPrice(originalPrice)}
                    </span>
                    <span className="font-body text-xs font-bold text-red-600">Hemat {formatPrice(originalPrice - effectivePrice)}</span>
                  </div>
                )}
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="font-display font-bold text-sm mb-3">
                    Warna: <span className="text-accent font-black">{selectedColor || "Pilih Warna"}</span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`w-9 h-9 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === c.name
                            ? "border-accent scale-110 ring-2 ring-accent/30"
                            : "border-transparent hover:border-muted-foreground scale-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {availableSizes.length > 0 && (
                <div>
                  <p className="font-display font-bold text-sm mb-3">
                    Ukuran: <span className="text-accent font-black">{selectedSize || "Pilih Ukuran"}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-10 px-3 rounded-xl border-2 font-display font-bold text-sm transition-all duration-200 ${
                          selectedSize === size
                            ? "border-accent bg-accent text-accent-foreground scale-105"
                            : "border-border bg-background text-foreground hover:border-accent hover:text-accent"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {(product.category === "Pakaian" || product.category === "Pakaian/Celana" || product.category === "Jaket") && (
                    <button className="text-[10px] font-bold text-accent underline mt-2 hover:text-accent/80 transition-colors uppercase tracking-widest">
                       Lihat Panduan Ukuran
                    </button>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="font-display font-bold text-sm mb-3">Jumlah:</p>
                <div className="flex items-center gap-0 w-fit border-2 border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-display font-bold text-base">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {displayStock < 20 && displayStock > 0 && (
                  <p className="text-xs text-red-600 font-bold font-body mt-2">⚠️ Sisa {displayStock} item tersedia</p>
                )}
                {displayStock === 0 && product && (
                  <p className="text-xs text-red-600 font-bold font-body mt-2">🚫 Stok Habis untuk kombinasi ini</p>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 h-12 font-display font-bold uppercase tracking-wider border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Ditambahkan!
                      </motion.div>
                    ) : (
                      <motion.div key="bag" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Keranjang
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="default"
                  className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold uppercase tracking-wider"
                >
                  <Zap className="w-4 h-4 mr-2" /> Beli Sekarang
                </Button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                    isWishlisted ? "border-red-500 bg-red-50 text-red-500" : "border-border text-foreground hover:border-red-400"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Secondary CTA */}
              <div className="pt-2">
                 <a 
                   href={`https://wa.me/6281234567890?text=Halo%20Antarestar,%20saya%20ingin%20tanya%20tentang%20produk%20${encodeURIComponent(product.name)}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 font-display font-bold text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                 >
                    Tanya Admin via WhatsApp
                 </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                {[
                  { icon: Shield, label: "Garansi Resmi", sub: "1 Tahun" },
                  { icon: Truck, label: "Gratis Ongkir", sub: "Min. Rp 100rb" },
                  { icon: RefreshCw, label: "Retur Mudah", sub: "7 Hari" },
                ].map((badge) => (
                  <div key={badge.label} className="flex flex-col items-center text-center gap-1 p-2 sm:p-3 bg-muted/40 rounded-xl">
                    <badge.icon className="w-5 h-5 text-accent" />
                    <p className="font-display font-bold text-[11px] text-foreground">{badge.label}</p>
                    <p className="font-body text-[10px] text-muted-foreground">{badge.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Description & Features */}
          <div className="mt-14 grid md:grid-cols-2 gap-8 border-t border-border pt-10">
            {/* Description */}
            <div>
              <h2 className="font-display font-black text-xl uppercase mb-4">Deskripsi Produk</h2>
              <p className="font-body text-muted-foreground leading-relaxed text-sm md:text-base">
                {product.description || "Produk outdoor berkualitas tinggi dari Antarestar. Dirancang untuk membantu Anda menjelajahi alam dengan lebih nyaman dan percaya diri."}
              </p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="font-display font-black text-xl uppercase mb-4">Spesifikasi & Fitur</h2>
                <ul className="space-y-2.5">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 font-body text-sm text-foreground">
                      <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* Product Reviews Section (Marketplace Style) */}
          <div className="mt-16 border-t border-border pt-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="font-display font-black text-2xl uppercase mb-2">Penilaian Produk</h2>
                <div className="flex items-center gap-4">
                  <StarRating rating={product.rating || 0} count={product.reviewCount} size="lg" />
                  {product.reviewCount > 0 && (
                    <>
                      <div className="h-8 w-px bg-border hidden sm:block" />
                      <p className="text-sm text-muted-foreground font-body">
                        <span className="font-bold text-foreground">{product.reviewCount}</span> ulasan dari pembeli terverifikasi
                      </p>
                    </>
                  )}
                </div>
              </div>
              {product.reviewCount > 0 && (
                <div className="bg-muted/30 p-4 md:p-6 rounded-2xl border border-border/50 flex flex-col gap-2 min-w-[280px]">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const starReviews = (product.reviews || []).filter((r: any) => r.rating === star);
                    const starPercentage = product.reviewCount > 0 ? (starReviews.length / product.reviewCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-10">
                          <span className="text-xs font-bold text-foreground">{star}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        </div>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${starPercentage}%` }}
                            className="h-full bg-amber-400 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground w-8 text-right font-medium">
                          {Math.round(starPercentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Review Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["Semua", "Dengan Foto", "Dengan Komentar", "Bintang 5", "Bintang 4"].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition-all border-2 ${
                    activeFilter === filter
                    ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20" 
                    : "bg-background border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {filter} 
                  {(() => {
                    const count = (product.reviews || []).filter((r: any) => {
                      if (filter === "Dengan Foto") return r.hasImage;
                      if (filter === "Dengan Komentar") return r.comment && r.comment.length > 0;
                      if (filter.includes("Bintang")) return r.rating === parseInt(filter.split(" ")[1]);
                      return true;
                    }).length;
                    return filter === "Semua" ? "" : count > 0 ? ` (${count})` : "";
                  })()}
                </button>
              ))}
            </div>

            {/* Review List */}
            <div className="space-y-8 min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={review.id} 
                      className="flex gap-4 pb-8 border-b border-border/50 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-display font-black text-xs text-accent uppercase shrink-0">
                        {review.user[0]}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-sm text-foreground">{review.user}</h4>
                          <span className="text-[10px] text-muted-foreground font-body">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-body">
                          Varian: <span className="font-bold">{review.variant}</span>
                        </p>
                        <p className="text-sm text-foreground/80 font-body leading-relaxed max-w-2xl">
                          {review.comment}
                        </p>
                        {review.images && (
                          <div className="flex gap-2 pt-2">
                            {review.images.map((img, i) => (
                              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted cursor-zoom-in group">
                                <img src={img} alt="Review" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                              </div>
                            ))}
                          </div>
                        )}
                        <button 
                          onClick={() => toggleLike(review.id)}
                          className={`flex items-center gap-2 pt-2 transition-colors ${
                            likedReviews.includes(review.id) ? "text-red-500" : "text-muted-foreground hover:text-accent"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedReviews.includes(review.id) ? "fill-current" : ""}`} />
                          <span className="text-[10px] font-bold font-display uppercase tracking-wider">
                            Membantu { (review.likes + (likedReviews.includes(review.id) ? 1 : 0)) > 0 ? `(${review.likes + (likedReviews.includes(review.id) ? 1 : 0)})` : "" }
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <p className="text-muted-foreground font-body">Tidak ada ulasan untuk kriteria ini.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center mt-10">
              <Button asChild variant="outline" className="font-display font-bold uppercase tracking-widest text-xs border-2 hover:bg-accent hover:text-white transition-all"><Link to={`/product/${product.id}/reviews`}>Lihat Semua Ulasan</Link></Button>
            </div>
          </div>

          {/* Related Products */}
          {(relatedProducts.length > 0 || isFetchingSimilar) && (
            <div className="mt-16 border-t border-border pt-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display font-black text-2xl uppercase">Produk Serupa</h2>
                <Link to={`/store?category=${product.category}`} className="font-display text-sm font-bold text-accent hover:underline flex items-center gap-1">
                  Lihat Semua <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {isFetchingSimilar ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-2xl" />
                  ))
                ) : (
                  relatedProducts.map((p, i) => (
                    <ProductCard key={p.id} product={p as any} index={i} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )}

  <Footer />
</div>
);
};

export default ProductDetail;
