import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Coins, MessageSquare, X, Save } from 'lucide-react';
import { useScrollLock } from '@/hooks/useScrollLock';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { points: number; reason: string }) => void;
  title: string;
  subtitle: string;
  userName?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  userName
}) => {
  useScrollLock(isOpen);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPoints('');
      setReason('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!points || !reason) return;
    onSubmit({ points: Number(points), reason });
    onClose();
  };

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
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative z-10 shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="absolute top-0 right-0 p-6 z-20">
               <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                  <X className="w-4 h-4" />
               </button>
            </div>

            <div className="relative z-10 mb-10">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 border border-accent/5 shadow-sm">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic mb-1">
                {title} <span className="text-accent underline decoration-2 underline-offset-4">{userName}</span>
              </h3>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                {subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                   <Coins className="w-3 h-3" /> Jumlah Poin AP
                </label>
                <input 
                  type="number" 
                  required
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all font-body placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                   <MessageSquare className="w-3 h-3" /> Justifikasi Logistik
                </label>
                <textarea 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Masukkan alasan untuk manifes audit..."
                  className="w-full h-28 p-5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all resize-none font-body placeholder:text-slate-300"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all font-display"
                >
                  Batalkan
                </button>
                <button 
                  type="submit"
                  className="flex-[2] h-11 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 font-display flex items-center justify-center gap-2"
                >
                   <Save className="w-3.5 h-3.5 text-accent" />
                   Push Manifest
                </button>
              </div>
            </form>

            {/* Subtle Watermark */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
                <TrendingUp className="w-24 h-24" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromptModal;
