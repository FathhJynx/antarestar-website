import React from "react";
import { TicketPercent, ArrowRight } from "lucide-react";
import CustomModal from "./Modal";
import { rp } from "@/utils/formatters";

interface VoucherPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucherInput: string;
  setVoucherInput: (val: string) => void;
  onApply: (code: string) => void;
  vouchers: any[];
  onSelect: (v: any) => void;
}

const VoucherPickerModal = ({
  isOpen,
  onClose,
  voucherInput,
  setVoucherInput,
  onApply,
  vouchers,
  onSelect
}: VoucherPickerModalProps) => {
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Voucher Belanja">
       <div className="space-y-10 pb-10">
          <div className="relative group">
             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <TicketPercent className="w-5 h-5 text-white/20 group-focus-within:text-orange-600 transition-colors" />
             </div>
             <input 
               placeholder="MASUKKAN KODE VOUCHER" 
               value={voucherInput} onChange={e => setVoucherInput(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-32 py-5 text-sm font-bold text-white uppercase outline-none focus:border-orange-600 focus:bg-orange-600/5 transition-all placeholder:text-white/10 italic"
             />
             <button 
                onClick={() => onApply(voucherInput)}
                className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all active:scale-95"
             >
                KLAIM
             </button>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3 text-white">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Voucher Tersedia</p>
                <div className="h-px flex-1 bg-white/5" />
             </div>
             <div className="grid grid-cols-1 gap-4">
                {vouchers.map(v => (
                  <button 
                    key={v.id} 
                    onClick={() => { onSelect(v); onClose(); }} 
                    className="group relative w-full h-28 bg-black border-2 border-white/5 hover:border-orange-600 rounded-2xl flex items-center p-6 transition-all overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-32 h-full bg-orange-600/5 -skew-x-12 translate-x-8 group-hover:translate-x-4 transition-transform" />
                     <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-white/30 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                        <TicketPercent className="w-8 h-8" />
                     </div>
                     <div className="ml-6 text-left space-y-1 relative z-10 text-white">
                        <p className="font-display font-black text-lg text-white uppercase tracking-tighter italic">{v.name}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">KODE: {v.code}</span>
                           <div className="w-1 h-1 rounded-full bg-white/10" />
                           <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Min. Belanja {rp(v.minSpend)}</p>
                        </div>
                     </div>
                     <ArrowRight className="ml-auto w-5 h-5 text-white/10 group-hover:text-orange-600 transition-all group-hover:translate-x-1" />
                  </button>
                ))}
             </div>
          </div>
       </div>
    </CustomModal>
  );
};

export default VoucherPickerModal;
