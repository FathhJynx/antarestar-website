import React from "react";
import { CheckoutSection } from "./CheckoutForm";
import { CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

interface PaymentSectionProps {
  selectedPayment: any;
  onOpenPaymentModal: () => void;
}

const PaymentSection = ({ selectedPayment, onOpenPaymentModal }: PaymentSectionProps) => {
  return (
    <CheckoutSection 
      title="Metode Pembayaran" 
      subtitle="Pilih cara bayar yang paling nyaman" 
      icon={<CreditCard className="w-5 h-5" />}
    >
      <button 
        onClick={onOpenPaymentModal}
        className="w-full text-left p-6 bg-black border border-white/5 rounded-xl hover:border-orange-600 transition-all group flex items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-orange-600 transition-all duration-500'
           }`}>
              <selectedPayment.icon className="w-6 h-6" />
           </div>
           
           <div className="space-y-1 leading-none">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                 <h4 className="font-display font-bold text-base sm:text-lg text-white uppercase italic tracking-tight leading-none">{selectedPayment.name}</h4>
                 <span className="w-fit text-[8px] font-bold text-orange-600 bg-orange-600/10 px-2 py-0.5 rounded uppercase tracking-wider">{selectedPayment.type}</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">
                 <CheckCircle2 className="w-3 h-3" />
                 <span>Otomatis</span>
              </div>
           </div>
        </div>

        <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-orange-600 transition-all group-hover:translate-x-1" />
      </button>
    </CheckoutSection>
  );
};

export default PaymentSection;
