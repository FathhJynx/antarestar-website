import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartLayoutProps {
  children: React.ReactNode;
  summary: React.ReactNode;
  total: number;
  onCheckout: () => void;
  isEmpty: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const CartLayout = ({ children, summary, total, onCheckout, isEmpty }: CartLayoutProps) => {
  return (
    <div className="max-w-7xl mx-auto pt-28 md:pt-40 pb-32 px-4 sm:px-6 md:px-20 min-h-screen">
      {/* Page Header */}
      {!isEmpty && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-10 md:mb-16 border-b border-white/10 pb-8 md:pb-10">
            <div className="space-y-3">
                <Link to="/store" className="inline-flex items-center gap-4 text-white/40 hover:text-orange-600 transition-all mb-4 group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-bold text-[10px] uppercase tracking-widest">KEMBALI BELANJA</span>
                </Link>
                <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600">Tas Belanja Lo</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight">
                    KERANJANG.
                </h1>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
                <div className="px-6 py-2 border border-white/20 font-bold text-sm uppercase tracking-widest text-white/60">
                   SIAP CHECKOUT
                </div>
            </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-8 pb-32 lg:pb-0">
           {children}
        </div>

        {/* Right: Summary Desktop */}
        <div className="hidden lg:block lg:col-span-4 h-full relative">
           {summary}
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      {!isEmpty && (
        <div className="lg:hidden fixed bottom-24 left-4 right-4 z-50 p-4 bg-[#111]/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="flex items-center justify-between gap-6">
              <div className="space-y-1">
                 <p className="font-bold text-[10px] uppercase tracking-widest text-white/30">Total bayar</p>
                 <p className="font-bold text-xl text-white tracking-tight truncate">{formatPrice(total)}</p>
              </div>
              <Button 
                onClick={onCheckout}
                className="flex-1 bg-orange-600 hover:bg-white text-white font-bold uppercase text-[12px] tracking-widest px-8 h-14 rounded-xl transition-all group active:scale-95 shadow-lg"
              >
                Gas Checkout <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
           </div>
        </div>
      )}
    </div>
  );
};

export default CartLayout;
