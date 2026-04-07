import { Link } from "react-router-dom";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rp } from "@/utils/formatters";

interface OrderCardProps {
  order: any;
  statusConfig: any;
  handleConfirmReceipt: (id: string, rawId: string) => void;
  handleCancelOrder: (id: string) => void;
  onShowRating: (order: any) => void;
}

const OrderCard = ({ order, statusConfig, handleConfirmReceipt, handleCancelOrder, onShowRating }: OrderCardProps) => {
  const status = statusConfig[order.status] || { icon: ShoppingBag, color: "text-white/40", bg: "bg-white/5", label: order.status?.toUpperCase() || "PENDING" };
  const isCompleted = order.status === 'completed';
  const isShipping = order.status === 'shipping' || order.status === 'shipped';
  const isCancelled = order.status === 'cancelled';
  const isCancellable = order.status === 'unpaid' || order.status === 'processing' || order.status === 'pending';

  return (
    <div className="bg-[#141414] border border-white/5 overflow-hidden hover:border-orange-600/30 transition-all duration-500 group">
      <div className="p-4 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 bg-black/20">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="space-y-1">
             <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest leading-none">ORDER ID</p>
             <p className="font-display font-bold text-base sm:text-xl text-white tracking-tight leading-none">#{order.id}</p>
          </div>
        </div>
        
        <div className="flex flex-row items-center justify-between sm:justify-start sm:items-center gap-12 w-full sm:w-auto">
            <div className="space-y-1 text-left sm:text-right">
                <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest leading-none">TANGGAL</p>
                <p className="font-bold text-[10px] sm:text-sm text-white/60 italic uppercase">{order.date}</p>
            </div>
            <div className={`flex items-center gap-3 px-4 py-2 border ${status.color.replace('text-', 'border-')} font-bold text-[9px] uppercase tracking-widest italic`}>
              <status.icon className="w-3 h-3" />
              {status.label}
            </div>
        </div>
      </div>

      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 border-b border-white/5">
        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex flex-row gap-4 sm:gap-8 items-center">
            <div className="w-16 h-16 sm:w-32 sm:h-32 bg-black border border-white/5 p-2 sm:p-4 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 space-y-2">
             <div className="flex justify-between items-start gap-4">
                <h4 className="font-display font-bold text-sm sm:text-2xl uppercase italic leading-tight tracking-tight">{item.name}</h4>
                <span className="font-bold text-sm sm:text-xl text-orange-600 tracking-tight shrink-0">
                  {rp(item.price)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-white/30 italic">
                  {item.variant && <span>VARIAN: <span className="text-white">{item.variant}</span></span>}
                  {item.color && <span>WARNA: <span className="text-white">{item.color}</span></span>}
                  <span>QTY: <span className="text-white">{item.qty}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 sm:p-8 flex flex-col xl:flex-row gap-8 items-start justify-between bg-black/10">
        <div className="flex-1 w-full xl:max-w-xl">
          {isCancelled && order.cancelReason && (
            <div className="p-4 bg-red-600/5 border border-red-600/10 flex items-start gap-4">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase text-red-600 tracking-widest leading-none">ALASAN BATAL</p>
                <p className="text-xs text-white/40 font-bold uppercase italic tracking-tight">{order.cancelReason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full xl:w-[400px] space-y-6">
           <div className="flex justify-between items-end border-b border-white/5 pb-3">
              <p className="text-[9px] font-bold uppercase text-white/30 tracking-widest leading-none">TOTAL BAYAR</p>
              <p className="text-2xl font-display font-bold text-white tracking-tight leading-none">{rp(order.total)}</p>
           </div>

           <div className="grid grid-cols-2 gap-3 h-auto">
              {/* Primary Action */}
              {isShipping && (
                <Button onClick={() => handleConfirmReceipt(order.id, order.rawId)} className="h-12 bg-orange-600 hover:bg-white hover:text-black text-white rounded-none font-bold uppercase text-[9px] tracking-widest transition-all border-none">
                  SELESAI
                </Button>
              )}
              {isCompleted && !order.isRated && (
                <Button onClick={() => onShowRating(order)} className="h-12 bg-orange-600 hover:bg-white hover:text-black text-white rounded-none font-bold uppercase text-[9px] tracking-widest transition-all border-none">
                  BERI NILAI
                </Button>
              )}

              {/* Detail Link */}
              <Button asChild variant="outline" className="h-12 border-white/10 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase text-[9px] tracking-widest transition-all">
                <Link to={`/orders/${order.rawId}`}>DETAIL</Link>
              </Button>
              
              {isCancellable && (
                <Button variant="outline" onClick={() => handleCancelOrder(order.rawId)} className="h-12 border-red-600/20 text-red-600 hover:bg-red-600 hover:text-white rounded-none font-bold uppercase text-[9px] tracking-widest transition-all">
                  BATAL
                </Button>
              )}
              {isCompleted && (
                <Button variant="outline" asChild className="h-12 border-white/10 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase text-[9px] tracking-widest transition-all">
                  <Link to="/store">BELI LAGI</Link>
                </Button>
              )}
              {!isCompleted && !isCancellable && !isShipping && !isCancelled && (
                <Button variant="outline" asChild className="h-12 border-white/10 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase text-[9px] tracking-widest transition-all">
                  <Link to={`/orders/${order.rawId}/tracking`}>LACAK</Link>
                </Button>
              )}
              {isShipping && !isCompleted && (
                <Button variant="outline" asChild className="h-12 border-white/10 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase text-[9px] tracking-widest transition-all">
                  <Link to={`/orders/${order.rawId}/tracking`}>LACAK LIVE</Link>
                </Button>
              )}
              {isCancelled && (
                <Button variant="outline" asChild className="h-12 border-white/10 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase text-[9px] tracking-widest transition-all">
                  <Link to="/store">RE-INITIALIZE</Link>
                </Button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
