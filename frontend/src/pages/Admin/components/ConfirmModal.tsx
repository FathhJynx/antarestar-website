import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, title, message,
  confirmText = 'KONFIRMASI', cancelText = 'BATALKAN', variant = 'warning'
}) => {
  useScrollLock(isOpen);

  const variantConfig = {
    danger:  { icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-400/10',    border: 'border-red-400/20',    btn: 'bg-red-600 hover:bg-red-700 shadow-red-600/20' },
    warning: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20',  btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' },
    info:    { icon: ShieldCheck,   color: 'text-blue-400',   bg: 'bg-blue-400/10',   border: 'border-blue-400/20',   btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' },
  };

  const vc = variantConfig[variant];
  const Icon = vc.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="bg-[#0B0B0B] rounded-[2.5rem] w-full max-w-[340px] relative z-10 shadow-[0_60px_120px_rgba(0,0,0,1)] border border-white/10 overflow-hidden"
          >
            {/* Top accent line */}
            <div className={`h-0.5 w-full ${variant === 'danger' ? 'bg-red-500' : variant === 'info' ? 'bg-blue-500' : 'bg-amber-500'}`} />

            <div className="p-8">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all group"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 border ${vc.bg} ${vc.border}`}>
                  <Icon className={`w-8 h-8 ${vc.color}`} />
                </div>

                <h3 className="font-display font-black text-xl uppercase tracking-tighter italic mb-3 text-white">
                  {title}
                </h3>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed mb-8 px-2">
                  {message}
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={onConfirm}
                    className={`w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-2xl transition-all active:scale-95 ${vc.btn}`}
                  >
                    {confirmText}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border border-white/5 hover:bg-white/5 transition-all"
                  >
                    {cancelText}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
