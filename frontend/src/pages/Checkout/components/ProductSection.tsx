import React from "react";
import { CheckoutSection } from "./CheckoutForm";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { rp } from "@/utils/formatters";

interface ProductSectionProps {
  checkoutItems: any[];
  selectedShipping: any;
  onOpenShippingModal: () => void;
}

const ProductSection = ({ checkoutItems, selectedShipping, onOpenShippingModal }: ProductSectionProps) => {
  return (
    <CheckoutSection 
      title="Daftar Barang" 
      subtitle="Barang yang lo checkout" 
      icon={<ShoppingBag className="w-5 h-5" />}
    >
      <div className="space-y-4">
        <div className="bg-black border border-white/5 rounded-xl overflow-hidden divide-y divide-white/5">
           {checkoutItems.map((item, idx) => (
             <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 group hover:bg-white/5 transition-all">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black border border-white/5 p-3 flex items-center justify-center shrink-0">
                   <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="flex-1 flex flex-col justify-center py-1 space-y-1 text-center sm:text-left">
                   <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                      <div className="space-y-1">
                         <h4 className="font-display font-bold text-base sm:text-lg text-white uppercase italic tracking-tight leading-tight max-w-sm">
                            {item.name}
                         </h4>
                         <div className="flex justify-center sm:justify-start flex-wrap gap-3 font-bold text-[9px] uppercase tracking-widest text-white/20 italic leading-none">
                             {item.variant && <span>VARIAN: <span className="text-white">{item.variant}</span></span>}
                             <span>JUMLAH: <span className="text-white">{item.qty || item.quantity}</span></span>
                         </div>
                      </div>
                      <span className="font-bold text-lg sm:text-xl text-orange-600 tracking-tight shrink-0 mt-1 sm:mt-0">
                         {rp(item.price)}
                      </span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </CheckoutSection>
  );
};

export default ProductSection;
