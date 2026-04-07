import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CANCEL_REASONS = [
  "Mau ganti alamat pengiriman",
  "Mau nambah barang lagi",
  "Berubah pikiran",
  "Ketemu harga yang lebih murah",
  "Lupa masukin kode promo",
  "Alasan lainnya"
];

const CancelModal = ({ isOpen, onClose, onConfirm }: CancelModalProps) => {
  const [reason, setReason] = useState("");

  // Robust scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            className="relative w-full max-w-lg bg-[#111111] rounded-t-[2rem] sm:rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                 <div className="space-y-1">
                    <p className="font-bold text-[9px] uppercase tracking-[0.4em] text-red-600">Protokol Batal</p>
                    <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-white leading-none">Batalkan Pesanan?</h3>
                 </div>
                 <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-xl transition-all active:scale-95">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-start p-4 bg-red-600/5 rounded-2xl border border-red-600/10 mb-2">
                   <AlertCircle className="w-5 h-5 text-red-600 mt-1 shrink-0" />
                   <div className="space-y-2">
                      <p className="text-sm font-bold text-white uppercase italic leading-tight">Yakin mau banting setir?</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                         Sayang banget, gear impian lo bakal ilang dari daftar pesanan nih kalau lo lanjutin proses batal.
                      </p>
                   </div>
                </div>

                <div className="space-y-4">
                  <p className="font-bold text-[9px] uppercase tracking-widest text-white/20 ml-1">Pilih Alasan Pembatalan</p>
                  <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-2 no-scrollbar">
                    {CANCEL_REASONS.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => setReason(r)}
                        className={`flex items-center gap-4 p-4 border rounded-xl transition-all text-left ${
                          reason === r 
                          ? "bg-red-600/10 border-red-600 text-white" 
                          : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            reason === r ? "border-red-600 bg-red-600" : "border-white/20"
                         }`}>
                            {reason === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                         </div>
                         <span className="text-[11px] font-bold uppercase tracking-tight italic">{r}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4">
                  <Button variant="outline" className="h-14 border-white/10 hover:bg-white/5 text-white/40 hover:text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all" onClick={onClose}>Ga Jadi Batal</Button>
                  <Button 
                    disabled={!reason}
                    onClick={() => { onConfirm(reason); }} 
                    className="h-14 bg-red-600 disabled:opacity-30 hover:bg-red-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all"
                  >
                    Ya, Batalkan
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CancelModal;
