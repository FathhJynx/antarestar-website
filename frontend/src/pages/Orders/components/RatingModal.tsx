import { useState } from "react";
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

  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-background rounded-[2.5rem] shadow-2xl overflow-hidden border border-border">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display font-black text-xl uppercase tracking-tight">Beri Penilaian</h3>
                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 items-center p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img src={order.items[0].image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">Pesanan {order.id}</p>
                    <p className="text-sm font-display font-bold uppercase truncate">{order.items[0].name}</p>
                    {order.items.length > 1 && <p className="text-[10px] text-muted-foreground mt-0.5 font-bold">+ {order.items.length - 1} produk lainnya</p>}
                  </div>
                </div>

                <div className="text-center space-y-4 pt-2">
                  <p className="font-display font-black text-xs uppercase tracking-widest text-muted-foreground">Bagaimana kualitas produk ini?</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star className={`w-10 h-10 ${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} transition-colors`} />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm font-black text-accent uppercase tracking-widest h-5">
                    {rating === 1 && "Buruk Sekali"}{rating === 2 && "Buruk"}{rating === 3 && "Biasa Saja"}{rating === 4 && "Bagus"}{rating === 5 && "Sangat Bagus"}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground">
                    <MessageSquare className="w-3.5 h-3.5" />Tulis Ulasan Kamu
                  </label>
                  <textarea 
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Bagikan pengalamanmu menggunakan gear Antarestar ini..."
                    rows={4} className="w-full bg-muted/20 border border-border rounded-2xl p-4 text-sm font-body outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest border-2" onClick={onClose}>Batal</Button>
                  <Button onClick={() => { onRate(order.rawId, rating, comment); onClose(); }} className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20">Kirim Penilaian</Button>
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
