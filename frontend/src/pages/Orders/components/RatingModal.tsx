import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onRate: (orderId: string, rating: number, comment: string) => void;
}

const RatingModal = ({ isOpen, onClose, order, onRate }: RatingModalProps) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

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

  if (!order) return null;

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
                    <p className="font-bold text-[9px] uppercase tracking-[0.4em] text-orange-600">Feedback Gear</p>
                    <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-white">Beri Penilaian</h3>
                 </div>
                 <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-orange-600 text-white/40 hover:text-white rounded-xl transition-all active:scale-95">
                    <X className="w-5 h-5" />
                 </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-black border border-white/5 flex-shrink-0 p-2">
                    <img src={order.items[0].image} alt="" className="w-full h-full object-contain grayscale" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest mb-1 leading-none">ORDER ID #{order.id}</p>
                    <p className="text-sm font-display font-bold uppercase truncate italic text-white">{order.items[0].name}</p>
                    {order.items.length > 1 && <p className="text-[10px] text-white/20 mt-1 font-bold uppercase">+ {order.items.length - 1} GEAR LAINNYA</p>}
                  </div>
                </div>

                <div className="text-center space-y-4 pt-2">
                  <p className="font-bold text-[10px] uppercase tracking-widest text-white/40">Gimana kualitas gear ini?</p>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star className={`w-8 h-8 sm:w-10 sm:h-10 ${star <= (hover || rating) ? "fill-orange-600 text-orange-600 drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]" : "text-white/10"} transition-all duration-300`} />
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.3em] h-5 italic">
                    {rating === 1 && "Buruk Sekali"}
                    {rating === 2 && "Buruk"}
                    {rating === 3 && "Biasa Saja"}
                    {rating === 4 && "Bagus"}
                    {rating === 5 && "Sangat Bagus"}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-bold text-[9px] uppercase tracking-widest text-white/20 ml-1">
                    <MessageSquare className="w-3.5 h-3.5" />Tulis Ulasan Kamu
                  </label>
                  <textarea 
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Bagikan pengalamanmu menggunakan gear Antarestar ini..."
                    rows={4} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600/50 transition-all resize-none placeholder:text-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4">
                  <Button variant="outline" className="h-14 border-white/10 hover:bg-white/5 text-white/40 hover:text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all" onClick={onClose}>Batal</Button>
                  <Button onClick={() => { onRate(order.rawId, rating, comment); onClose(); }} className="h-14 bg-orange-600 hover:bg-white hover:text-black text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-600/10">Kirim Penilaian</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
