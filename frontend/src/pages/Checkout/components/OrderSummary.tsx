import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, ShieldCheck, TicketPercent } from "lucide-react";
import { rp } from "@/utils/formatters";

interface OrderSummaryProps {
  checkoutItemsCount: number;
  subtotal: number;
  shippingPrice: number;
  shippingDiscount: number;
  insuranceFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  isProcessing: boolean;
  onPlaceOrder: () => void;
  appliedVoucher: any;
  onShowVoucherModal: () => void;
}

const OrderSummary = ({
  checkoutItemsCount,
  subtotal,
  shippingPrice,
  shippingDiscount,
  insuranceFee,
  serviceFee,
  discount,
  total,
  isProcessing,
  onPlaceOrder,
  appliedVoucher,
  onShowVoucherModal
}: OrderSummaryProps) => {
  return (
    <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 md:p-8 space-y-8 sticky top-32 group overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="space-y-2">
         <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">Ringkasan Pesanan</p>
         <h2 className="font-display font-bold text-2xl text-white uppercase tracking-tight leading-none">
           Detail <br /> Pembayaran.
         </h2>
      </div>

      <div className="space-y-4">
        <button 
          onClick={onShowVoucherModal}
          className="w-full flex items-center justify-between p-4 bg-black border border-white/5 rounded-xl hover:border-orange-600 transition-all group"
        >
          <div className="flex items-center gap-3">
             <TicketPercent className="w-5 h-5 text-orange-600" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">{appliedVoucher ? appliedVoucher.code : 'Pasang Voucher'}</span>
          </div>
          <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest group-hover:underline">Ganti</span>
        </button>
      </div>

      <div className="space-y-6 pt-6 border-t border-white/5 leading-none">
        <div className="flex justify-between items-center text-white/40">
           <span className="font-bold text-[10px] uppercase tracking-widest">Subtotal ({checkoutItemsCount} item)</span>
           <span className="font-bold text-lg text-white tracking-tight">{rp(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center text-white/40">
           <span className="font-bold text-[10px] uppercase tracking-widest">Biaya Pengiriman</span>
           <span className="font-bold text-lg text-white tracking-tight">{rp(shippingPrice)}</span>
        </div>

        {shippingDiscount > 0 && (
          <div className="flex justify-between items-center text-green-500">
             <span className="font-bold text-[10px] uppercase tracking-widest">Potongan Ongkir</span>
             <span className="font-bold text-lg tracking-tight">-{rp(shippingDiscount)}</span>
          </div>
        )}

        {(insuranceFee > 0 || serviceFee > 0) && (
          <div className="flex justify-between items-center text-white/40">
             <span className="font-bold text-[10px] uppercase tracking-widest">Layanan & Proteksi</span>
             <span className="font-bold text-lg text-white tracking-tight">{rp(insuranceFee + serviceFee)}</span>
          </div>
        )}

        {discount > 0 && (
          <div className="flex justify-between items-center text-orange-600">
            <span className="font-bold text-[10px] uppercase tracking-widest">Diskon Gear</span>
            <span className="font-bold text-lg tracking-tight">-{rp(discount)}</span>
          </div>
        )}
      </div>

      <div className="pt-8 border-t-2 border-white space-y-8 leading-none">
         <div className="flex justify-between items-end">
            <div className="space-y-1">
               <p className="font-bold text-[10px] uppercase tracking-widest text-white/20">Total Bayar</p>
               <h3 className="font-display font-bold text-3xl text-white tracking-tight leading-none">
                  {rp(total)}
               </h3>
            </div>
            <div className="flex items-center gap-2 text-white/20">
               <ShieldCheck className="w-4 h-4" />
               <span className="text-[10px] font-bold uppercase tracking-widest">SECURE</span>
            </div>
         </div>

         <div className="space-y-4">
            <Button 
              disabled={isProcessing}
              onClick={onPlaceOrder}
              className="w-full h-16 bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-bold uppercase text-[12px] tracking-widest px-8 py-7 rounded-xl transition-all group active:scale-[0.97] shadow-lg border-none"
            >
               Bayar Sekarang <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <p className="text-center font-bold text-[10px] uppercase tracking-widest text-white/20">
               Hampir sampai di petualangan lo! 🔥
            </p>
         </div>
      </div>
    </div>
  );
};

export default OrderSummary;
