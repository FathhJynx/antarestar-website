import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative z-10 shadow-2xl overflow-hidden"
          >
            {/* Visual Accent */}
            <div className={`absolute top-0 left-0 right-0 h-2 ${
                variant === 'danger' ? 'bg-red-500' :
                variant === 'info' ? 'bg-blue-500' :
                'bg-amber-500'
            }`} />

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg ${
                  variant === 'danger' ? 'bg-red-50' :
                  variant === 'info' ? 'bg-blue-50' :
                  'bg-amber-50'
              }`}>
                {variant === 'danger' ? (
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                ) : variant === 'info' ? (
                   <ShieldCheck className="w-8 h-8 text-blue-500" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                )}
              </div>

              <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic mb-3">
                {title}
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10">
                {message}
              </p>

                <div className="flex gap-4 w-full">
                   <button 
                     onClick={onClose}
                     className="flex-1 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                   >
                      {cancelText}
                   </button>
                   <button 
                     onClick={onConfirm}
                     className={`flex-[2] h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${
                        variant === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 
                        variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' :
                        'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                     }`}
                   >
                      {confirmText}
                   </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
