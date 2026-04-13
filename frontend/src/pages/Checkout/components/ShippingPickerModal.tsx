import React from "react";
import { Truck } from "lucide-react";
import CustomModal from "./Modal";
import { rp } from "@/utils/formatters";

interface ShippingPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shippingMethods: any[];
  selectedShipping: any;
  onSelect: (sm: any) => void;
}

const ShippingPickerModal = ({
  isOpen,
  onClose,
  shippingMethods,
  selectedShipping,
  onSelect
}: ShippingPickerModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Pilih Pengiriman">
       <div className="space-y-4 pb-10">
          {shippingMethods.map((sm) => (
             <button
               key={sm.id}
               onClick={() => { onSelect(sm); onClose(); }}
               className={`group relative text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between overflow-hidden ${
                 selectedShipping.id === sm.id 
                 ? "border-orange-600 bg-orange-600/5 shadow-[0_0_20px_rgba(234,88,12,0.1)]" 
                 : "border-white/5 hover:border-orange-600/40 bg-black/40"
               }`}
             >
                <div className="flex items-center gap-6 relative z-10">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      selectedShipping.id === sm.id ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/30 group-hover:text-white'
                   }`}>
                      <Truck className="w-6 h-6" />
                   </div>
                   <div className="space-y-1">
                      <span className="block font-bold text-base text-white uppercase tracking-tight italic leading-none">{sm.name}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{sm.courier}</span>
                         <div className="w-1 h-1 rounded-full bg-white/10" />
                         <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em]">{sm.eta}</span>
                      </div>
                   </div>
                </div>
                <div className="text-right flex flex-col items-end relative z-10">
                   <span className="font-display font-black text-lg text-white leading-none mb-1">{rp(sm.price)}</span>
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Estimasi Biaya</span>
                </div>
             </button>
          ))}
       </div>
    </CustomModal>
  );
};

export default ShippingPickerModal;
