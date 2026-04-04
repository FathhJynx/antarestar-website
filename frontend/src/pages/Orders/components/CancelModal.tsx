import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CANCEL_REASONS = [
  "Ingin mengubah alamat pengiriman",
  "Ingin mengubah rincian pesanan (warna, ukuran, dll)",
  "Menemukan harga yang lebih murah di tempat lain",
  "Berubah pikiran / Tidak ingin lagi membeli",
  "Metode pembayaran terlalu rumit",
  "Lainnya"
];

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CancelModal = ({ isOpen, onClose, onConfirm }: CancelModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-background rounded-[2rem] shadow-2xl border border-border overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight leading-tight">Batalkan Pesanan?</h3>
              </div>
              
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">Pilih alasan pembatalan agar kami dapat terus meningkatkan layanan Antarestar.</p>
              
              <div className="space-y-2 mb-8">
                {CANCEL_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setSelectedReason(reason)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                      selectedReason === reason 
                      ? "border-red-500 bg-red-50/30 text-red-600" 
                      : "border-border hover:border-red-200 hover:bg-muted/30"
                    }`}
                  >
                    <span className="text-xs font-bold">{reason}</span>
                    <div className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${
                      selectedReason === reason ? "border-red-500 bg-red-500" : "border-border"
                    }`}>
                      {selectedReason === reason && <div className="w-1.5 h-1.5 bg-white rounded-full m-auto mt-0.5" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2" onClick={onClose}>Kembali</Button>
                <Button 
                  disabled={!selectedReason}
                  onClick={() => onConfirm(selectedReason)} 
                  className="h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200"
                >
                  Konfirmasi Batal
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CancelModal;
