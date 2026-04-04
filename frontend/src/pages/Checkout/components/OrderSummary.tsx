import { TicketPercent, Info, Truck, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { rp } from "@/utils/formatters";

interface OrderSummaryProps {
  checkoutItemsCount: number;
  subtotal: number;
  shippingPrice: number;
  shippingDiscount: number;
  insuranceFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  isProcessing: boolean;
  onPlaceOrder: () => void;
  appliedVoucher: { code: string } | null;
  onShowVoucherModal: () => void;
}

const OrderSummary = ({
  checkoutItemsCount,
  subtotal,
  shippingPrice,
  shippingDiscount,
  insuranceFee,
  serviceFee,
  discount,
  total,
  isProcessing,
  onPlaceOrder,
  appliedVoucher,
  onShowVoucherModal
}: OrderSummaryProps) => (
  <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
    {/* Voucher Section */}
    <section className="bg-card border border-border rounded-xl md:rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-accent/10 rounded-lg text-accent">
          <TicketPercent className="w-5 h-5" />
        </div>
        <h3 className="font-display font-black text-sm uppercase tracking-tight">Voucher & Promo</h3>
      </div>
      <button 
        onClick={onShowVoucherModal}
        className={`w-full flex items-center justify-between p-4 border rounded-xl transition-all group ${
          appliedVoucher 
            ? "bg-green-50 border-green-200 text-green-700" 
            : "border-dashed border-border hover:border-accent hover:bg-accent/5 text-muted-foreground hover:text-accent"
        }`}
      >
        <div className="flex items-center gap-3">
          {appliedVoucher ? (
            <div className="bg-green-500 text-white rounded-full p-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center text-[10px] font-black">+</div>
          )}
          <span className="text-xs font-black uppercase tracking-widest">
            {appliedVoucher ? appliedVoucher.code : "Pilih Promo Antarestar"}
          </span>
        </div>
        <ArrowRight className={`w-4 h-4 transition-transform ${appliedVoucher ? "hidden" : "group-hover:translate-x-1"}`} />
      </button>
    </section>

    {/* Billing Summary */}
    <section className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-xl shadow-black/5">
      <div className="bg-muted/30 px-5 py-4 border-b border-border">
        <h3 className="font-display font-black text-base uppercase tracking-tight">Ringkasan Pesanan</h3>
      </div>
      <div className="p-4 sm:p-6 space-y-5">
        <div className="space-y-3.5">
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>Total Harga ({checkoutItemsCount} Barang)</span>
            <span className="text-foreground">{rp(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-medium">
            <span>Total Ongkos Kirim</span>
            <div className="text-right">
              <span className={shippingDiscount > 0 ? "line-through mr-2 opacity-50" : "text-foreground"}>
                {rp(shippingPrice)}
              </span>
              {shippingDiscount > 0 && (
                <span className="text-green-600">{rp(shippingPrice - shippingDiscount)}</span>
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-medium items-center gap-1.5">
            <div className="flex items-center gap-1">
              <span>Biaya Asuransi Pengiriman</span>
              <Info className="w-3 h-3 cursor-help opacity-40" />
            </div>
            <span className="text-foreground">{rp(insuranceFee)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground font-medium items-center gap-1.5">
            <div className="flex items-center gap-1">
              <span>Biaya Layanan</span>
              <Info className="w-3 h-3 cursor-help opacity-40" />
            </div>
            <span className="text-foreground">{rp(serviceFee)}</span>
          </div>
          
          {(discount > 0 || shippingDiscount > 0) && (
            <div className="pt-3.5 border-t border-dashed border-border space-y-2">
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span className="flex items-center gap-1.5 uppercase tracking-tighter"><TicketPercent className="w-3.5 h-3.5" /> Promo Digunakan</span>
                  <span>- {rp(discount)}</span>
                </div>
              )}
              {shippingDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span className="flex items-center gap-1.5 uppercase tracking-tighter"><Truck className="w-3.5 h-3.5" /> Gratis Ongkir</span>
                  <span>- {rp(shippingDiscount)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-5 border-t-2 border-border flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-foreground pb-4">
              <span className="font-display font-black text-[10px] sm:text-sm uppercase opacity-60">Total Bayar</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-accent drop-shadow-sm">{rp(total)}</span>
          </div>
        </div>

        <Button 
          onClick={onPlaceOrder}
          disabled={isProcessing}
          className="w-full h-16 rounded-2xl uppercase tracking-[0.2em] font-black text-sm bg-accent hover:bg-accent/90 shadow-xl shadow-accent/20 active:scale-[0.98] transition-all"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memproses...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Buat Pesanan
              <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </Button>
      </div>
    </section>

    <div className="bg-muted-foreground/5 p-4 rounded-xl border border-divider/50 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-accent" />
        <span className="text-[10px] font-black uppercase text-foreground">Kebijakan Pengembalian</span>
      </div>
      <p className="text-[10px] text-muted-foreground leading-relaxed">Nikmati garansi 7 hari retur jika produk tidak sesuai atau cacat produksi. Antarestar menjamin kualitas terbaik.</p>
    </div>
  </div>
);

export default OrderSummary;
