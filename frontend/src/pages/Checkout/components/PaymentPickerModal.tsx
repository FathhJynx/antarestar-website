import React from "react";
import { Check } from "lucide-react";
import CustomModal from "./Modal";

interface PaymentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethods: any[];
  selectedPayment: any;
  onSelect: (pm: any) => void;
}

const PaymentPickerModal = ({
  isOpen,
  onClose,
  paymentMethods,
  selectedPayment,
  onSelect
}: PaymentPickerModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Metode Pembayaran">
       <div className="space-y-10 pb-10">
          {['E-Wallet', 'Transfer Bank', 'Lainnya'].map((group) => {
            const methods = paymentMethods.filter(p => p.type === group);
            if (methods.length === 0) return null;
            
            return (
              <div key={group} className="space-y-4">
                 <div className="flex items-center gap-3 ml-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{group}</p>
                    <div className="h-px flex-1 bg-white/5" />
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {methods.map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => { onSelect(pm); onClose(); }}
                        className={`group relative text-left p-5 rounded-2xl border-2 transition-all overflow-hidden ${
                          selectedPayment.id === pm.id 
                          ? "border-orange-600 bg-orange-600/5" 
                          : "border-white/5 hover:border-orange-600/40 bg-black/40"
                        }`}
                      >
                         <div className="flex items-center justify-between relative z-10 text-white">
                            <div className="flex items-center gap-4">
                               <div className={`p-3 rounded-xl transition-colors ${selectedPayment.id === pm.id ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/30 group-hover:text-white'}`}>
                                  <pm.icon className="w-5 h-5" />
                               </div>
                               <div>
                                  <span className="block font-bold text-xs text-white uppercase tracking-widest leading-none mb-1">{pm.name}</span>
                                  <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{pm.type}</span>
                               </div>
                            </div>
                            {selectedPayment.id === pm.id && <Check className="w-4 h-4 text-orange-600" />}
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
            );
          })}
       </div>
    </CustomModal>
  );
};

export default PaymentPickerModal;
