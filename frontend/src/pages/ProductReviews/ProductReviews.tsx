import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Star, Heart, MessageSquare, Image as ImageIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ProductReviews = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: productData, isLoading } = useQuery({
    queryKey: ['product-reviews-full', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      const p = res.data?.data;
      if (!p) return null;

      const reviews = (p.reviews || []).map((r: any) => ({
        id: r.id,
        user: r.user?.name || "Penjelajah Anonim",
        rating: r.rating,
        comment: r.comment || "",
        date: r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-",
        variant: r.order?.items?.[0]?.product_variant?.name || r.order?.items?.[0]?.product_variant?.color_name || "-",
        images: r.images || null,
        hasImage: !!(r.images && r.images.length > 0),
        likes: r.likes || 0
      }));

      const totalRating = reviews.length > 0
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
        : 0;

      // Calculate star distribution
      const starCounts = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 stars
      reviews.forEach((r: any) => {
        if (r.rating >= 1 && r.rating <= 5) {
          starCounts[r.rating - 1]++;
        }
      });
      const starPercentages = starCounts.map(count => 
        reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0
      );

      return {
        product: {
          id: String(p.id),
          name: String(p.name),
          image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/300',
          price: p.variants?.[0]?.price || 0,
          rating: Math.round(totalRating * 10) / 10,
          reviewCount: reviews.length,
        },
        reviews,
        starPercentages
      };
    },
    enabled: !!id
  });

  const product = productData?.product;
  const allReviews = productData?.reviews || [];
  const starPercentages = productData?.starPercentages || [0, 0, 0, 0, 0];

  const [activeFilter, setActiveFilter] = useState("Semua");
  const [likedReviews, setLikedReviews] = useState<number[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-display font-bold text-muted-foreground uppercase">Memuat Ulasan...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-black uppercase">Produk Tidak Ditemukan</h1>
        <Button onClick={() => navigate("/")} className="mt-4">Kembali Ke Beranda</Button>
      </div>
    );
  }

  const filteredReviews = allReviews.filter((r: any) => {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 section-padding pt-24 md:pt-32">
        <div className="section-container max-w-4xl">
          <Link to={`/product/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-display text-xs font-bold uppercase tracking-widest">Kembali ke Produk</span>
          </Link>

          <header className="mb-12">
            <h1 className="font-display font-black text-3xl md:text-4xl uppercase mb-6 tracking-tight">Semua Penilaian</h1>
            
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                  <span className="text-5xl md:text-7xl font-display font-black text-foreground">
                    {product.reviewCount > 0 ? product.rating : "-"}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-5 h-5 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-body mt-1">
                      {product.reviewCount > 0 ? `Dari ${product.reviewCount} ulasan` : "Belum ada ulasan"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-8">
                      <span className="text-xs font-bold font-display">{star}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${starPercentages[star - 1]}%` }}
                        className="h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right font-medium">
                      {starPercentages[star - 1]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md py-4 border-b border-border mb-10">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-border shrink-0">
                <Filter className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Filter:</span>
              </div>
              {["Semua", "Dengan Foto", "Dengan Komentar", "Bintang 5", "Bintang 4"].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold font-display transition-all border-2 shrink-0 ${
                    activeFilter === filter
                    ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20" 
                    : "bg-background border-border text-muted-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12 min-h-[600px]">
            <AnimatePresence mode="popLayout">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review: any) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={review.id} 
                    className="flex flex-col sm:flex-row gap-6 pb-12 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center sm:items-start gap-4 sm:w-48 shrink-0">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-display font-black text-sm uppercase shadow-lg shadow-accent/20">
                        {review.user[0]}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-foreground">{review.user}</h4>
                        <p className="text-[10px] text-muted-foreground font-body">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                        ))}
                      </div>
                      
                      <div className="inline-flex items-center px-3 py-1 bg-muted rounded-lg border border-border">
                        <span className="text-[10px] font-bold font-display uppercase tracking-wider text-muted-foreground">
                          Variant: <span className="text-foreground">{review.variant}</span>
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-base text-foreground/80 font-body leading-relaxed">
                          {review.comment}
                        </p>
                      )}

                      {review.images && (
                        <div className="flex flex-wrap gap-4 pt-4">
                          {review.images.map((img: string, i: number) => (
                            <div key={i} className="relative w-32 h-32 rounded-2xl overflow-hidden border border-border bg-muted cursor-zoom-in group shadow-md">
                              <img src={img} alt="Review" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImageIcon className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-6 pt-4">
                        <button 
                          onClick={() => toggleLike(review.id)}
                          className={`flex items-center gap-2 group transition-colors ${
                            likedReviews.includes(review.id) ? "text-red-500" : "text-muted-foreground hover:text-accent"
                          }`}
                        >
                          <div className={`p-2 rounded-full transition-colors ${
                            likedReviews.includes(review.id) ? "bg-red-50" : "group-hover:bg-accent/10"
                          }`}>
                            <Heart className={`w-4 h-4 ${likedReviews.includes(review.id) ? "fill-current" : ""}`} />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest font-display">
                            Membantu ({review.likes + (likedReviews.includes(review.id) ? 1 : 0)})
                          </span>
                        </button>
                        
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                          <div className="p-2 rounded-full group-hover:bg-muted/80 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-black uppercase tracking-widest font-display">Balas</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground/20 mb-4" />
                  <p className="text-lg font-display font-bold text-muted-foreground uppercase opacity-50">
                    {allReviews.length === 0 ? "Belum ada ulasan untuk produk ini" : "Tidak ada ulasan ditemukan"}
                  </p>
                  {allReviews.length > 0 && (
                    <Button variant="link" onClick={() => setActiveFilter("Semua")} className="text-accent underline-offset-4 decoration-2 font-bold uppercase tracking-widest text-xs mt-2">
                      Tampilkan Semua Ulasan
                    </Button>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductReviews;
