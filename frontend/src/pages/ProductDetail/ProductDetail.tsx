import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ShoppingBag, Star, ChevronRight, Share2, Zap, User, ShieldCheck, 
  ArrowDown, Heart, Shield, Droplets, Wind, Zap as ZapIcon, Sun, Eye
} from "lucide-react";

/* Shared Components */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import ProductDetailSkeleton from "@/pages/ProductDetail/components/ProductDetailSkeleton";
import EpicStoreCTA from "@/pages/ProductDetail/components/EpicStoreCTA";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

/* Product Components */
import ProductGallery from "@/pages/ProductDetail/components/ProductGallery";
import ProductInfo from "@/pages/ProductDetail/components/ProductInfo";
import FeatureBento from "@/pages/ProductDetail/components/FeatureBento";
import SuggestedProducts from "@/pages/ProductDetail/components/SuggestedProducts";
import StickyBuyBarPremium from "@/pages/ProductDetail/components/StickyBuyBarPremium";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const { data: product, isLoading: isFetchingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
        const res = await api.get(`/products/${id}`);
        const p = res.data.data;
        const primaryImage = p.images?.find((img: any) => img.is_primary)?.image_url 
                        || p.images?.[0]?.image_url
                        || 'https://via.placeholder.com/300';
        
        const activeVariant = p.variants?.find((v: any) => v.is_on_flash_sale) || p.variants?.[0];
        const isOnFlashSale = activeVariant?.is_on_flash_sale;

        return {
          id: String(p.id),
          name: String(p.name),
          description: String(p.description),
          category: p.category?.name || "Equipment",
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
             user: r.user?.name || "Antarestar Explorer",
             rating: r.rating,
             comment: r.comment || "",
             date: new Date(r.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
             level: "Experienced Explorer",
             isVerified: true,
             variant: r.order?.items?.find((item: any) => item.product_variant_id && item.product_variant?.product_id === p.id)?.product_variant?.name 
                      || r.order?.items?.[0]?.product_variant?.name 
                      || "Default",
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
          features: [
            { icon: "Shield", title: "Waterproof Shield", description: "Durable water repellent finish protects you from heavy mountain rain." },
            { icon: "Wind", title: "Gale Blocker", description: "Engineered to withstand extreme wind speeds during peak climbs." },
            { icon: "Zap", title: "Rapid Dry", description: "Moisture-wicking fabric scales with your body temperature." }
          ]
        } as any;
    },
  });

  const { data: similarProducts = [] } = useQuery({
    queryKey: ['similar-products', id],
    queryFn: async () => {
        const res = await api.get(`/products/${id}/similar`);
        return (res.data.data || []).map((p: any) => ({
            id: String(p.id),
            name: String(p.name),
            image: p.images?.find((img: any) => img.is_primary)?.image_url || p.images?.[0]?.image_url,
            price: Number(p.variants?.[0]?.price || 0),
            originalPrice: p.variants?.[0]?.original_price, // Assuming this field exists or similar
            category: p.category?.name || "Equipment",
            rating: p.reviews_avg_rating || p.rating || (p.reviews?.length > 0 ? p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length : 0),
            reviewCount: p.reviews_count || p.reviewCount || p.reviews?.length || 0,
            sold_count: p.sold_count || 0
        }));
    },
    enabled: !!id
  });

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => { 
    window.scrollTo(0, 0); 
    if (product) {
      setSelectedSize(product.sizes?.[0] || "");
      setSelectedColor(product.colors?.[0]?.name || "");
    }
  }, [id, product]);

  const handleAddToCart = (variantInfo: any) => {
    const variantId = product.variants?.find((v: any) => 
        (!variantInfo.size || v.size === variantInfo.size) && 
        (!variantInfo.color || v.color_name === variantInfo.color)
    )?.id;

    addToCart({
      productId: product.id,
      variantId,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      ...variantInfo
    });
    toast.success("Mantap! Udah masuk tas lo 👌");
  };

  const handleBuyNow = (variantInfo: any) => {
    const variantId = product.variants?.find((v: any) => 
        (!variantInfo.size || v.size === variantInfo.size) && 
        (!variantInfo.color || v.color_name === variantInfo.color)
    )?.id;

    const buyNowItem = {
      productId: product.id,
      variantId,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      ...variantInfo
    };
    navigate("/checkout", { state: { buyNowItem } });
  };

  if (isFetchingProduct) return <ProductDetailSkeleton />;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white selection:bg-orange-600">
      <Navbar />

      <StickyBuyBarPremium 
        product={product}
        onAddToCart={() => handleAddToCart({ size: selectedSize, color: selectedColor })}
        onBuyNow={() => handleBuyNow({ size: selectedSize, color: selectedColor })}
      />

      <main className="max-w-screen-xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
        {/* SECTION 1: HERO PRODUCT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
           {/* LEFT: GALLERY */}
           <ProductGallery images={product.images} />

           {/* RIGHT: INFO */}
           <ProductInfo 
             product={product} 
             selectedSize={selectedSize}
             selectedColor={selectedColor}
             onSetSize={setSelectedSize}
             onSetColor={setSelectedColor}
             onAddToCart={handleAddToCart} 
             onBuyNow={handleBuyNow} 
           />
        </div>

        {/* SECTION 2: STORY SECTION (Cinematic) */}
        <section className="py-32 lg:py-48 flex flex-col items-center text-center space-y-12">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="max-w-3xl space-y-6"
            >
               <span className="text-orange-600 font-display font-black text-[10px] uppercase tracking-[0.5em]">Cerita Gear Ini</span>
               <h2 className="text-5xl lg:text-7xl font-display font-black text-white uppercase tracking-tighter leading-none italic">
                  SIAP KE MANA AJA, HADAPI APA AJA.
               </h2>
               <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  Dingin, angin, hujan? Tenang, gear ini udah siap duluan. Dibuat buat lo yang ga mau ribet mikirin cuaca pas lagi di luar. Karena petualangan lo ga nunggu cuaca cerah.
               </p>
            </motion.div>
            
            <div className="w-full aspect-video rounded-none overflow-hidden relative group">
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700 z-10" />
               <img 
                 src={product.image} 
                 className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" 
                 alt="Cinematic Story" 
               />
               <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-20 h-20 rounded-none bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group/play">
                     <Zap className="w-8 h-8 text-white fill-white group-hover/play:text-orange-600 group-hover/play:fill-orange-600 transition-colors" />
                  </div>
               </div>
            </div>
        </section>

        {/* SECTION 3: BENTO FEATURES */}
        <section className="py-20 lg:py-32 border-t border-white/5 space-y-20">
           <div className="max-w-xl">
             <span className="text-orange-600 font-display font-black text-[10px] uppercase tracking-[0.4em]">KENAPA LO BUTUH INI?</span>
             <h2 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter mt-4 leading-none">
                FITUR TACTICAL YANG SIAP NEMENIN LO
             </h2>
           </div>
           
           <FeatureBento features={product.features} />
        </section>

        {/* SECTION 4: MISSION REPORTS (REVIEWS) */}
        <section className="py-20 lg:py-32 border-t border-white/5 space-y-20">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10">
             <div className="space-y-4">
                <span className="text-orange-600 font-display font-black text-[10px] uppercase tracking-[0.4em]">APA KATA MEREKA?</span>
                <h2 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none">Review Dari Para Explorer</h2>
             </div>
             <div className="flex items-center gap-8 bg-white/[0.03] border border-white/5 p-6 rounded-none">
                <div className="text-center">
                   <p className="text-4xl font-display font-black tracking-tighter">{product.rating.toFixed(1)}</p>
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Rating Rata-rata</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                   <p className="text-4xl font-display font-black tracking-tighter">{product.reviewCount}</p>
                   <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Review Masuk</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {product.reviews.map((r: any) => (
                <div key={r.id} className="p-10 bg-[#111111] border border-[#1F1F1F] rounded-none group hover:border-orange-500/20 transition-all">
                   <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5 text-white">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-none bg-white/5 flex items-center justify-center text-white/20"><User className="w-6 h-6" /></div>
                         <div>
                            <p className="text-lg font-display font-black uppercase tracking-tighter leading-none">{r.user}</p>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">{r.date}</p>
                         </div>
                      </div>
                      <div className="flex gap-1">
                         {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-orange-600 text-orange-600" : "text-white/5"}`} />)}
                      </div>
                   </div>
                   <p className="text-xl font-display font-black italic text-gray-400 group-hover:text-white transition-colors tracking-tighter leading-tight uppercase">
                      "{r.comment}"
                   </p>
                </div>
             ))}
          </div>
        </section>

        {/* SECTION 5: SUGGESTED PRODUCTS */}
        {similarProducts.length > 0 && (
          <section className="py-20 lg:py-32 border-t border-white/5">
            <SuggestedProducts products={similarProducts} />
          </section>
        )}
      </main>

      <EpicStoreCTA />
      <Footer />
    </div>
  );
};

export default ProductDetail;
