import React from "react";
import { CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  subtotal: number;
  total: number;
  onCheckout: () => void;
  shipping?: number;
  discount?: number;
  onApplyPromo?: (code: string) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const CartSummary = ({ subtotal, total, onCheckout, shipping = 0, discount = 0, onApplyPromo }: CartSummaryProps) => {
  const [promoCode, setPromoCode] = React.useState("");

  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 lg:p-8 sticky top-32 h-fit space-y-8 group overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="space-y-2">
         <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600">Ringkasan Pesanan</p>
         <h2 className="font-display font-bold text-2xl text-white uppercase tracking-tight leading-none">
           Detail <br /> Pembayaran.
         </h2>
      </div>

      <div className="space-y-4">
        <label className="font-display font-black text-[10px] uppercase tracking-widest text-white/30 italic">Punya Kode Promo?</label>
        <div className="flex gap-2">
           <input 
             type="text" 
             value={promoCode} 
             onChange={(e) => setPromoCode(e.target.value)}
             placeholder="Masukkan kode..." 
             className="flex-1 bg-black border border-white/5 rounded-xl px-4 font-display font-black text-xs uppercase italic focus:outline-none focus:border-orange-600 h-14 transition-all"
           />
           <button 
             onClick={() => onApplyPromo?.(promoCode)}
             className="px-6 bg-white text-black rounded-xl font-display font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all h-14"
           >
              Pakai
           </button>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-white/5">
        <div className="flex justify-between items-center text-white/40">
           <span className="font-bold text-[10px] uppercase tracking-widest leading-none">Total barang</span>
           <span className="font-bold text-lg text-white tracking-tight">{formatPrice(subtotal)}</span>
        </div>
        
        {shipping > 0 && (
          <div className="flex justify-between items-center text-white/40">
            <span className="font-bold text-[10px] uppercase tracking-widest leading-none">Ongkir</span>
            <span className="font-bold text-lg text-white tracking-tight">{formatPrice(shipping)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between items-center text-orange-600">
            <span className="font-bold text-[10px] uppercase tracking-widest leading-none">Diskon</span>
            <span className="font-bold text-lg tracking-tight">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <div className="pt-8 border-t-2 border-white space-y-8">
         <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="font-bold text-[10px] uppercase tracking-widest text-white/20">Total bayar</p>
               <h3 className="font-display font-bold text-3xl text-white tracking-tight leading-none">
                  {formatPrice(total)}
               </h3>
            </div>
         </div>

         <div className="space-y-4">
            <Button 
              onClick={onCheckout}
              className="w-full bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-bold uppercase text-[12px] tracking-widest px-8 py-7 rounded-xl h-auto transition-all group active:scale-[0.97] shadow-lg border-none"
            >
               Gas Checkout <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <p className="text-center font-bold text-[10px] uppercase tracking-widest text-white/20">
               Udah siap buat petualangan? 🔥
            </p>
         </div>
      </div>
    </div>
  );
};

export default CartSummary;
