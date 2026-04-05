import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Minus, Plus, ShoppingCart, Zap, Check,
  Star, Package, ChevronRight, Shield, Truck, AlertTriangle
} from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface QuickAddModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

const QuickAddModal: React.FC<QuickAddModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /* ── Reset on open ── */
  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize("");
      setSelectedColor("");
      setQty(1);
      setAddedToCart(false);
      setActiveImg(0);
    }
  }, [isOpen, product]);

  if (!product) return null;

  /* ── Derived data ── */
  const images: string[] = (product as any).images?.length
    ? (product as any).images
    : [product.image];

  const availableColors = product.colors || [];

  const availableSizes: string[] = selectedColor && product.variants
    ? ([...new Set(
        product.variants
          .filter((v: any) => v.color_name === selectedColor)
          .map((v: any) => v.size)
          .filter(Boolean)
      )] as string[])
    : (product.sizes || []);

  const selectedVariant = product.variants?.find(
    (v: any) =>
      (!selectedColor || v.color_name === selectedColor) &&
      (!selectedSize || v.size === selectedSize)
  );

  const displayPrice = selectedVariant?.is_on_flash_sale
    ? Number(selectedVariant.flash_sale_price)
    : Number(selectedVariant?.price || product.price || 0);

  const originalPrice = selectedVariant?.is_on_flash_sale
    ? Number(selectedVariant.price)
    : Number(selectedVariant?.price || product.originalPrice || 0);

  const isFlashSale = !!selectedVariant?.is_on_flash_sale || !!(product as any).flashSalePrice;
  const discountPct =
    originalPrice > 0 && displayPrice < originalPrice
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

  const displayStock = selectedVariant?.stock ?? (product.stock ?? 0);
  const stockLow = displayStock > 0 && displayStock <= 10;

  /* ── Validate helper ── */
  const validate = () => {
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Pilih warna terlebih dahulu");
      return false;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Pilih ukuran terlebih dahulu");
      return false;
    }
    return true;
  };

  /* ── Handlers ── */
  const handleAddToCart = () => {
    if (!validate()) return;
    setIsAdding(true);
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: product.image,
      price: displayPrice,
      originalPrice,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      qty,
    });
    setTimeout(() => {
      setIsAdding(false);
      setAddedToCart(true);
      toast.success(`${product.name} (x${qty}) masuk keranjang`, { duration: 2500 });
      setTimeout(() => {
        setAddedToCart(false);
        onClose();
      }, 900);
    }, 500);
  };

  const handleBuyNow = () => {
    if (!validate()) return;
    const buyNowItem = {
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      image: product.image,
      price: displayPrice,
      originalPrice,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      qty,
    };
    onClose();
    navigate("/checkout", { state: { buyNowItem } });
  };

  const hasOptions = availableColors.length > 0 || availableSizes.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* ── Bottom Sheet — always full-width, 50-65% height ── */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-[60] w-full max-h-[88vh]"
          >
            <div className="w-full max-h-[88vh] bg-white dark:bg-zinc-900 rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden">

              {/* ── Sheet Header ── */}
              <div className="flex-none px-4 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                {/* Drag handle + close button in same row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto absolute left-1/2 -translate-x-1/2 top-4" />
                  {/* Spacer left */}
                  <div className="w-8" />
                  {/* Close button — always visible INSIDE the sheet */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-600 dark:text-zinc-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Product summary row */}
                <div className="flex gap-3 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    <img
                      src={images[activeImg] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Flash badge */}
                    {isFlashSale && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 rounded-sm mb-1.5">
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        Flash Sale
                      </span>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`font-display font-black text-xl ${isFlashSale ? "text-red-600" : "text-accent"}`}>
                        {formatPrice(displayPrice)}
                      </span>
                      {discountPct > 0 && (
                        <span className="text-[10px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-display">
                          -{discountPct}%
                        </span>
                      )}
                      {discountPct > 0 && (
                        <span className="text-xs text-zinc-400 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 line-clamp-2 leading-snug mb-1">
                      {product.name}
                    </p>

                    {/* Stock status */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Package className="w-3 h-3 text-zinc-400" />
                      {displayStock === 0 ? (
                        <span className="text-red-600 font-bold">Stok Habis</span>
                      ) : stockLow ? (
                        <span className="text-orange-500 font-bold">Sisa {displayStock}!</span>
                      ) : (
                        <span className="text-zinc-500">Stok {displayStock}</span>
                      )}
                      {(product.rating ?? 0) > 0 && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-zinc-600 dark:text-zinc-400">{product.rating?.toFixed(1)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Scrollable Options ── */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-5">

                {/* Image mini thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                          activeImg === i
                            ? "border-accent ring-1 ring-accent/30"
                            : "border-zinc-200 dark:border-zinc-700 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Color */}
                {availableColors.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">
                      Warna{" "}
                      {selectedColor && (
                        <span className="text-accent">— {selectedColor}</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => { setSelectedColor(c.name); setSelectedSize(""); }}
                          className={`
                            w-9 h-9 rounded-full border-2 transition-all duration-200
                            ${selectedColor === c.name
                              ? "border-accent scale-110 ring-2 ring-accent/30 ring-offset-1"
                              : "border-zinc-200 dark:border-zinc-600 hover:border-zinc-400 scale-100"}
                          `}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {availableSizes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                        Ukuran{" "}
                        {selectedSize && (
                          <span className="text-accent">— {selectedSize}</span>
                        )}
                      </p>
                      <Link
                        to={`/product/${product.id}`}
                        onClick={onClose}
                        className="flex items-center gap-0.5 text-[11px] font-semibold text-accent hover:underline"
                      >
                        Panduan ukuran <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`
                            min-w-[46px] h-10 px-3 rounded-xl border-2 font-display font-bold text-sm transition-all duration-200
                            ${selectedSize === size
                              ? "border-accent bg-accent text-white scale-105 shadow-md shadow-accent/20"
                              : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-accent/60"}
                          `}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* No options — just show a note */}
                {!hasOptions && (
                  <p className="text-sm text-zinc-500 italic">Tidak ada pilihan varian untuk produk ini.</p>
                )}

                {/* Quantity */}
                <div>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-3">Jumlah</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        className="w-11 h-11 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-14 text-center font-display font-black text-base text-zinc-900 dark:text-zinc-100 select-none">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((q) => Math.min(displayStock || 99, q + 1))}
                        disabled={qty >= (displayStock || 99)}
                        className="w-11 h-11 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {qty > 1 && (
                      <span className="text-sm text-zinc-500">
                        Subtotal: <strong className="text-zinc-800 dark:text-zinc-200 font-display">{formatPrice(displayPrice * qty)}</strong>
                      </span>
                    )}
                  </div>

                  {stockLow && displayStock > 0 && (
                    <p className="flex items-center gap-1.5 mt-2 text-xs text-orange-500 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      Hanya tersisa {displayStock} item!
                    </p>
                  )}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 pb-1">
                  {[
                    { icon: Shield, label: "Garansi Resmi" },
                    { icon: Truck, label: "Gratis Ongkir" },
                    { icon: Check, label: "Retur 7 Hari" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium">
                      <Icon className="w-3 h-3 text-accent flex-shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Sticky CTA Footer ── */}
              <div className="flex-none border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
                {displayStock === 0 ? (
                  <button disabled className="w-full h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 text-zinc-400 font-display font-bold text-sm uppercase tracking-widest cursor-not-allowed">
                    Stok Habis
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding || addedToCart}
                      className={`
                        flex-1 h-14 rounded-2xl font-display font-bold text-sm uppercase tracking-wide
                        flex items-center justify-center gap-2 transition-all duration-300
                        border-2 border-accent text-accent
                        hover:bg-accent/5 active:scale-95 disabled:opacity-70
                        ${addedToCart ? "border-green-500 text-green-600 bg-green-50" : ""}
                      `}
                    >
                      {addedToCart ? (
                        <><Check className="w-4 h-4" /><span>Ditambahkan!</span></>
                      ) : isAdding ? (
                        <span className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      ) : (
                        <><ShoppingCart className="w-4 h-4" /><span>+ Keranjang</span></>
                      )}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={isAdding || addedToCart}
                      className="
                        flex-1 h-14 rounded-2xl font-display font-bold text-sm uppercase tracking-wide
                        flex items-center justify-center gap-2 transition-all duration-300
                        bg-accent hover:bg-accent/90 text-white
                        shadow-lg shadow-accent/25 active:scale-95 disabled:opacity-70
                      "
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Beli Sekarang</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;
