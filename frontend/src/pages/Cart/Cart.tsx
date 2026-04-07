import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Reveal } from "@/components/AnimationPrimitives";
import CartEmpty from "./components/CartEmpty";
import CartList from "./components/CartList";
import CartSummary from "./components/CartSummary";
import CartLayout from "./components/CartLayout";
import { useNavigate } from "react-router-dom";

const SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 25000;

const Cart = () => {
  const { items, totalPrice, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<null | { code: string; discount: number }>(null);

  const PROMO_CODES: Record<string, number> = {
    "ANTARESTAR10": 0.10,
    "EXPLORER15": 0.15,
    "NEWMEMBER20": 0.20,
  };

  const handleApplyPromo = (code: string) => {
    const upper = code.toUpperCase().trim();
    if (PROMO_CODES[upper]) {
      setAppliedPromo({ code: upper, discount: PROMO_CODES[upper] });
      toast.success("Mantap! Promo berhasil dipasang 👌");
    } else {
      toast.error("Waduh, kode promonya gak bisa dipake nih 😅");
      setAppliedPromo(null);
    }
  };

  const shippingFee = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discountAmount = appliedPromo ? Math.round(totalPrice * appliedPromo.discount) : 0;
  const grandTotal = totalPrice - discountAmount + shippingFee;

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleRemove = (id: string | number, size?: string, color?: string, variantId?: string) => {
     removeFromCart(String(id), size, color, variantId);
     toast.success("Gear udah dikeluarin dari tas lo 👌");
  };

  const handleUpdateQty = (id: string | number, qty: number, size?: string, color?: string, variantId?: string) => {
     updateQuantity(String(id), qty, size, color, variantId);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white selection:bg-orange-600 selection:text-white overflow-x-hidden">
      <Navbar />

      {items.length === 0 ? (
        <div className="pt-32">
           <CartEmpty />
        </div>
      ) : (
        <CartLayout 
          total={grandTotal}
          onCheckout={handleCheckout}
          isEmpty={false}
          summary={
            <CartSummary 
              subtotal={totalPrice}
              total={grandTotal}
              onCheckout={handleCheckout}
              shipping={shippingFee}
              discount={discountAmount}
              onApplyPromo={handleApplyPromo}
            />
          }
        >
          <Reveal direction="up" delay={0.1}>
            <CartList 
               items={items}
               onRemove={handleRemove}
               onUpdateQty={handleUpdateQty}
            />
          </Reveal>
        </CartLayout>
      )}

      <Footer />
    </div>
  );
};

export default Cart;
