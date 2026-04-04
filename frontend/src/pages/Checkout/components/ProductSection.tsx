import { ShoppingBag, ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { rp } from "@/utils/formatters";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  qty: number;
  size?: string;
  color?: string;
  image: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  courier: string;
  price: number;
  eta: string;
}

interface ProductSectionProps {
  checkoutItems: CheckoutItem[];
  selectedShipping: ShippingMethod;
  onOpenShippingModal: () => void;
}

const ProductSection = ({ checkoutItems, selectedShipping, onOpenShippingModal }: ProductSectionProps) => (
  <section className="bg-card border border-border rounded-xl md:rounded-2xl shadow-sm">
    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center p-1.5">
          <ShoppingBag className="w-full h-auto text-white" />
        </div>
        <span className="font-display font-black text-sm uppercase">Antarestar Official Store</span>
      </div>
      <div className="flex items-center gap-1.5 text-accent">
        <ShieldCheck className="w-4 h-4 fill-current" />
        <span className="text-[10px] font-black uppercase tracking-widest">Toko Terverifikasi</span>
      </div>
    </div>

    <div className="p-4 sm:p-8 space-y-5 sm:space-y-8">
      {checkoutItems.map((item) => (
        <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 md:gap-6 items-start">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 group relative">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-sm md:text-base uppercase line-clamp-2 leading-tight mb-2 tracking-tight">{item.name}</h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {item.size && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-lg border border-border/50">
                  Ukuran: {item.size}
                </span>
              )}
              {item.color && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-lg border border-border/50">
                  Warna: {item.color}
                </span>
              )}
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold font-body text-muted-foreground">Jumlah: {item.qty}</span>
              <div className="flex flex-col items-end">
                {item.originalPrice && item.originalPrice > item.price && (
                   <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] font-black uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded leading-none">Flash Sale</span>
                      <span className="text-[10px] text-muted-foreground line-through font-medium">
                        {rp(item.originalPrice * item.qty)}
                      </span>
                   </div>
                )}
                <span className="font-display font-black text-base text-accent">
                  {rp(item.price * item.qty)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-muted/30 p-4 sm:p-8 border-t border-border mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground">Pesan Untuk Penjual</label>
          <textarea 
            placeholder="Contoh: Tolong bungkus aman ya min..." 
            rows={2}
            className="w-full bg-background border border-border/60 rounded-xl p-4 text-sm font-body outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none shadow-inner"
          />
        </div>

        <div className="space-y-3">
          <label className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground">Opsi Pengiriman</label>
          <button 
            onClick={onOpenShippingModal}
            className="w-full flex items-center justify-between p-4 bg-background border border-border/60 rounded-xl hover:border-accent transition-all group shadow-sm"
          >
            <div className="text-left flex items-start gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm uppercase">{selectedShipping.name}</span>
                  <span className="text-[10px] font-bold text-accent px-1.5 py-0.5 bg-accent/10 rounded">{rp(selectedShipping.price)}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 tracking-tight">Estimasi tiba {selectedShipping.eta} • {selectedShipping.courier}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default ProductSection;
