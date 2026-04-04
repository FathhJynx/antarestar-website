import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
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
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning'
}) => {
  useScrollLock(isOpen);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
           <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="bg-white rounded-[2rem] w-full max-w-[340px] p-8 relative z-10 shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Visual Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                variant === 'danger' ? 'bg-red-500' :
                variant === 'info' ? 'bg-blue-500' :
                'bg-amber-500'
            }`} />

            <div className="flex flex-col items-center text-center relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${
                  variant === 'danger' ? 'bg-red-50 border-red-100' :
                  variant === 'info' ? 'bg-blue-50 border-blue-100' :
                  'bg-amber-50 border-amber-100'
              }`}>
                {variant === 'danger' ? (
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                ) : variant === 'info' ? (
                   <ShieldCheck className="w-7 h-7 text-blue-500" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-amber-500" />
                )}
              </div>

              <h3 className="font-display font-black text-xl uppercase tracking-tighter italic mb-2">
                {title}
              </h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed mb-8 px-2">
                {message}
              </p>

                <div className="flex flex-col gap-2 w-full">
                   <button 
                     onClick={onConfirm}
                     className={`w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200/50' : 
                        variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200/50' :
                        'bg-slate-900 hover:bg-slate-800 shadow-slate-900/10'
                     }`}
                   >
                      {confirmText}
                   </button>
                   <button 
                     onClick={onClose}
                     className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                   >
                      {cancelText}
                   </button>
                </div>
            </div>

            {/* Subtle Watermark */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                {variant === 'danger' ? <AlertTriangle className="w-24 h-24" /> : <ShieldCheck className="w-24 h-24" />}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
