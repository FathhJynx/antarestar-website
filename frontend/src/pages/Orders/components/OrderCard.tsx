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
  const status = statusConfig[order.status];
  const isCompleted = order.status === 'completed';
  const isShipping = order.status === 'shipping';
  const isCancelled = order.status === 'cancelled';
  const isCancellable = order.status === 'unpaid' || order.status === 'processing';

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden hover:border-accent/30 transition-colors group">
      <div className="p-3 sm:p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/10">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/10 flex items-center justify-center p-2 shrink-0">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[8px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none">ID Pesanan</p>
              <p className="text-[10px] sm:text-xs font-bold text-foreground truncate">#{order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[8px] sm:text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">Tanggal</p>
              <p className="text-[9px] sm:text-[10px] font-bold text-foreground/70">{order.date}</p>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full ${status.bg} ${status.color} shadow-sm self-start sm:self-auto`}>
          <status.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest">{status.label}</span>
        </div>
      </div>

      <div className="p-3 sm:p-5 space-y-4 sm:space-y-5 border-b border-border">
        {order.items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-3 sm:gap-4 items-start">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-[11px] sm:text-base uppercase line-clamp-2 leading-tight mb-1 sm:mb-2 tracking-tight">{item.name}</h4>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-1 sm:gap-0">
                <div className="flex flex-col gap-0.5 text-[9px] sm:text-[10px] text-muted-foreground font-medium">
                  {item.variant && <span>{item.variant}</span>}
                  {item.color && <span>Warna: {item.color}</span>}
                  <span>Jumlah: {item.qty}</span>
                </div>
                <span className="font-display font-black text-xs sm:text-base text-accent">
                  {rp(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 sm:p-5 flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full">
          {isCancelled && order.cancelReason && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-1">Alasan Pembatalan</p>
                <p className="text-xs text-red-700 font-bold">{order.cancelReason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-64 flex flex-col gap-4 sm:gap-6 md:border-l md:border-border md:pl-8 pt-2 md:pt-0">
           <div className="flex justify-between items-center sm:items-end">
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Belanja</p>
              <p className="text-lg sm:text-2xl font-display font-black text-foreground">{rp(order.total)}</p>
           </div>

            <div className="grid grid-cols-1 gap-3">
              <Button asChild size="sm" className="w-full rounded-xl uppercase tracking-widest font-black text-[10px] h-10 px-6">
                <Link to={`/orders/${order.rawId}`}>Detail Pesanan</Link>
              </Button>
              
              {isShipping && (
                <Button onClick={() => handleConfirmReceipt(order.id, order.rawId)} className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-accent shadow-lg shadow-accent/20">
                  Konfirmasi Pesanan
                </Button>
              )}
              {isCompleted && !order.isRated && (
                <Button onClick={() => onShowRating(order)} className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-accent shadow-lg shadow-accent/20">
                  Beri Penilaian
                </Button>
              )}
              {isCompleted && order.isRated && (
                <Button disabled className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-muted text-muted-foreground border border-border">
                  Penilaian Selesai
                </Button>
              )}
              {isCancellable && (
                <Button variant="outline" onClick={() => handleCancelOrder(order.rawId)} className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2 hover:bg-red-50 hover:text-red-500 hover:border-red-500 transition-all">
                  Batalkan Pesanan
                </Button>
              )}
              {isCompleted && (
                <Button variant="outline" asChild className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                  <Link to="/store">Beli Lagi</Link>
                </Button>
              )}
              {!isCompleted && !isCancellable && !isShipping && !isCancelled && (
                <Button variant="outline" asChild className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                  <Link to={`/orders/${order.rawId}/tracking`}>Lacak Pesanan</Link>
                </Button>
              )}
              {isShipping && (
                <Button variant="outline" asChild className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                  <Link to={`/orders/${order.rawId}/tracking`}>Lacak Paket</Link>
                </Button>
              )}
              {isCancelled && (
                <Button variant="outline" asChild className="w-full h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-2">
                  <Link to="/store">Cari Produk Lain</Link>
                </Button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
