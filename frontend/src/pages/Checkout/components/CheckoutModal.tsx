import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'confirmation' | 'loading';
  title?: string;
  message?: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  type = 'confirmation',
  title,
  message,
  onConfirm,
  confirmLabel = "Lanjut Bayar",
  cancelLabel = "Periksa Lagi"
}: CheckoutModalProps) => {
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

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, backdropFilter: "blur(8px)" },
    exit: { opacity: 0 }
  };

  const modalVariants: any = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 } 
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8">
          {/* Overlay */}
          <motion.div 
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={type !== 'loading' ? onClose : undefined}
            className="absolute inset-0 bg-black/80"
          />

          {/* Modal Container */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[450px] bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-10 overflow-hidden shadow-2xl"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-10 ${
              type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-orange-600'
            }`} />

            {/* Close Button */}
            {type !== 'loading' && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="space-y-6 sm:space-y-8 flex flex-col items-center text-center">
               {/* Icon Area */}
               <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center ${
                 type === 'success' ? 'bg-green-500/10 text-green-500' : 
                 type === 'error' ? 'bg-red-500/10 text-red-500' : 
                 type === 'loading' ? 'bg-orange-600/10 text-orange-600' :
                 'bg-orange-600/10 text-orange-600'
               }`}>
                  {type === 'success' && <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />}
                  {type === 'error' && <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />}
                  {type === 'loading' && <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin" />}
                  {type === 'confirmation' && <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />}
               </div>

               {/* Content */}
               <div className="space-y-3">
                  <h3 className="font-display font-bold text-2xl text-white uppercase tracking-tight">
                    {title || (
                      type === 'success' ? 'Pesanan Berhasil 🎉' :
                      type === 'error' ? 'Ada Yang Kelewat 😅' :
                      type === 'loading' ? 'Lagi Proses Bayar...' :
                      'Udah Yakin?'
                    )}
                  </h3>
                  <p className="font-bold text-[11px] text-white/40 uppercase tracking-widest leading-relaxed max-w-[300px] mx-auto">
                    {message || (
                      type === 'success' ? 'Gear lo lagi kita siapin. Tunggu sebentar ya, kita kirim secepatnya.' :
                      type === 'error' ? 'Cek lagi data lo dulu ya, biar ga ada masalah di pengiriman.' :
                      type === 'loading' ? 'Tunggu bentar ya, jangan tutup halaman ini.' :
                      'Pastikan semua data udah bener sebelum lanjut bayar.'
                    )}
                  </p>
               </div>

               {/* Actions */}
               {type !== 'loading' && (
                 <div className="w-full flex gap-4 pt-4">
                    {onConfirm ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={onClose}
                          className="flex-1 h-14 border-white/10 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all active:scale-[0.97]"
                        >
                          {cancelLabel}
                        </Button>
                        <Button
                          onClick={onConfirm}
                          className="flex-1 h-14 bg-orange-600 text-white hover:bg-white hover:text-orange-600 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all active:scale-[0.97] border-none"
                        >
                          {confirmLabel}
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={onClose}
                        className="w-full h-14 bg-orange-600 text-white hover:bg-white hover:text-orange-600 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all active:scale-[0.97] border-none"
                      >
                         {type === 'success' ? 'Lihat Pesanan' : 'Oke, Siap'}
                      </Button>
                    )}
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
