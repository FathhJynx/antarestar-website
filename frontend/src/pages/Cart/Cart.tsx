import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Package, Truck, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const SHIPPING_THRESHOLD = 100000;
const SHIPPING_COST = 15000;

const Cart = () => {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; discount: number }>(null);
  const [promoError, setPromoError] = useState("");

  const PROMO_CODES: Record<string, number> = {
    "ANTARESTAR10": 0.10,
    "EXPLORER15": 0.15,
    "NEWMEMBER20": 0.20,
  };

  const handleApplyPromo = () => {
    const upper = promoCode.toUpperCase().trim();
    if (PROMO_CODES[upper]) {
      setAppliedPromo({ code: upper, discount: PROMO_CODES[upper] });
      setPromoError("");
    } else {
      setPromoError("Kode promo tidak valid atau sudah kadaluarsa.");
      setAppliedPromo(null);
    }
  };

  const shippingFee = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discountAmount = appliedPromo ? Math.round(totalPrice * appliedPromo.discount) : 0;
  const grandTotal = totalPrice - discountAmount + shippingFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-20 section-padding">
        <div className="section-container">
          <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight mb-8">
            Keranjang <span className="text-accent">Belanja</span>
            {totalItems > 0 && (
              <span className="ml-3 text-base font-body font-normal text-muted-foreground">({totalItems} item)</span>
            )}
          </h1>

          {items.length === 0 ? (
            /* ── Empty State ── */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <h2 className="font-display font-black text-2xl mb-2">Keranjang Kosong</h2>
                <p className="font-body text-muted-foreground text-sm max-w-sm">
                  Yuk, temukan perlengkapan outdoor terbaik untuk petualangan berikutnya!
                </p>
              </div>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold uppercase tracking-wider px-8"><Link to="/store">Mulai Belanja <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── Cart Items ── */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card rounded-2xl border border-border p-4 md:p-6 flex gap-4"
                    >
                      {/* Image */}
                      <Link to={`/product/${item.productId}`} className="shrink-0">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-muted overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300" />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="font-display font-bold text-sm md:text-base leading-tight line-clamp-2 hover:text-accent transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-1.5 mb-3">
                          {item.size && (
                            <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              Ukuran: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="font-body text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              Warna: {item.color}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between flex-wrap gap-3">
                          {/* Price */}
                          <div>
                            <p className="font-display font-black text-accent text-base md:text-lg">{formatPrice(item.price)}</p>
                            {item.originalPrice && item.originalPrice !== item.price && (
                              <p className="font-body text-xs text-muted-foreground line-through">{formatPrice(item.originalPrice)}</p>
                            )}
                          </div>

                          {/* Qty + Delete */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.productId, item.qty - 1, item.size, item.color)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-display font-bold text-sm">{item.qty}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.qty + 1, item.size, item.color)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId, item.size, item.color)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Continue Shopping */}
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 font-display font-bold text-sm text-accent hover:underline mt-2"
                >
                  ← Lanjut Belanja
                </Link>
              </div>

              {/* ── Order Summary ── */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-8 space-y-4 sticky top-24">
                  <h2 className="font-display font-black text-lg uppercase">Ringkasan Pesanan</h2>

                  {/* Promo Code */}
                  <div className="space-y-2">
                    <p className="font-display font-bold text-sm">Kode Promo</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Masukkan kode..."
                        className="flex-1 h-10 px-3 rounded-xl border-2 border-border bg-background font-body text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 h-10 bg-accent text-accent-foreground font-display font-bold text-xs uppercase rounded-xl hover:bg-accent/90 transition-colors"
                      >
                        Pakai
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-500 font-body">{promoError}</p>}
                    {appliedPromo && (
                      <p className="text-xs text-green-600 font-bold font-body flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Promo {appliedPromo.code} berhasil diterapkan! ({(appliedPromo.discount * 100).toFixed(0)}% potongan)
                      </p>
                    )}
                    <div className="bg-muted/60 rounded-xl p-2.5 text-xs font-body text-muted-foreground">
                      <p className="font-semibold mb-1">Kode yang tersedia:</p>
                      <p>ANTARESTAR10 • EXPLORER15 • NEWMEMBER20</p>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 border-t border-border pt-4 font-body text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({totalItems} item)</span>
                      <span className="font-semibold">{formatPrice(totalPrice)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon Promo</span>
                        <span className="font-bold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ongkos Kirim</span>
                      <span className={shippingFee === 0 ? "text-green-600 font-bold" : "font-semibold"}>
                        {shippingFee === 0 ? "GRATIS" : formatPrice(shippingFee)}
                      </span>
                    </div>
                    {totalPrice < SHIPPING_THRESHOLD && (
                      <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                        Tambah {formatPrice(SHIPPING_THRESHOLD - totalPrice)} lagi untuk gratis ongkir!
                      </p>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="flex justify-between items-center border-t-2 border-border pt-4">
                    <span className="font-display font-black text-base uppercase">Total</span>
                    <span className="font-display font-black text-xl text-accent">{formatPrice(grandTotal)}</span>
                  </div>

                  {/* Checkout Button */}
                  <Button asChild className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold uppercase tracking-wider text-sm"><Link to="/checkout" className="flex items-center justify-center gap-2">
                      Lanjut Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </Link></Button>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                    {[
                      { icon: Shield, label: "Aman & Terpercaya" },
                      { icon: Truck, label: "Pengiriman Cepat" },
                      { icon: Package, label: "Pengemasan Rapi" },
                    ].map((b) => (
                      <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                        <b.icon className="w-4 h-4 text-accent" />
                        <p className="font-body text-[9px] text-muted-foreground leading-tight">{b.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
