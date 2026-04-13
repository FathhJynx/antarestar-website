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
  isOpen, onClose, onSubmit, title, subtitle, userName
}) => {
  useScrollLock(isOpen);
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) { setPoints(''); setReason(''); }
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 30 }}
            className="bg-[#0B0B0B] rounded-[2.5rem] w-full max-w-md relative z-10 shadow-[0_80px_160px_rgba(0,0,0,1)] border border-white/10 overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

            <div className="px-10 py-8 border-b border-white/5 bg-[#111] flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-[1.5rem] flex items-center justify-center text-accent shadow-2xl shadow-accent/10">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tighter italic text-white">
                    {title} <span className="text-accent underline decoration-4">{userName}</span>
                  </h3>
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mt-1">{subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-accent" />JUMLAH POIN
                </label>
                <input
                  type="number"
                  required
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="cth. 500"
                  className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-[14px] font-black text-white outline-none focus:border-accent/40 transition-all placeholder:text-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-accent" />ALASAN PENYESUAIAN
                </label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Masukkan alasan untuk log audit..."
                  className="w-full h-28 p-6 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white outline-none focus:border-accent/40 transition-all resize-none no-scrollbar placeholder:text-white/10"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border border-white/5 hover:bg-white/5 transition-all"
                >
                  BATALKAN
                </button>
                <button
                  type="submit"
                  className="flex-[2] h-14 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent/80 active:scale-95 transition-all shadow-2xl shadow-accent/20 flex items-center justify-center gap-3"
                >
                  <Save className="w-4 h-4" />SIMPAN DATA
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromptModal;
