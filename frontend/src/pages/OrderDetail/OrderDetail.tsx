import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, Package, Truck, MapPin, 
  CreditCard, ExternalLink, AlertCircle, ShoppingBag,
  Clock, PackageCheck, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Reveal } from "@/components/AnimationPrimitives";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Status configuration
const statusConfig: any = {
  unpaid: { label: "Menunggu Pembayaran", color: "text-amber-500", bg: "bg-amber-50", icon: Clock },
  processing: { label: "Sedang Diproses", color: "text-blue-500", bg: "bg-blue-50", icon: Package },
  shipping: { label: "Dalam Pengiriman", color: "text-purple-500", bg: "bg-purple-50", icon: Truck },
  completed: { label: "Selesai", color: "text-green-500", bg: "bg-green-50", icon: PackageCheck },
  cancelled: { label: "Dibatalkan", color: "text-red-500", bg: "bg-red-50", icon: AlertCircle },
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    
    api.get(`/orders/${id}`).then(res => {
      const o = res.data?.data;
      if (!o) throw new Error("Order not found");
      setOrder({
        id: o.order_number || ("ANT-" + String(o.id).slice(0, 8).toUpperCase()),
        rawId: o.id,
        date: new Date(o.created_at).toLocaleString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: o.status,
        total: parseFloat(o.total_price || 0),
        discount: parseFloat(o.discount_amount || 0),
        shippingFee: parseFloat(o.shipping_cost || 0),
        serviceFee: parseFloat(o.service_fee || 0),
        paymentMethod: (o.payment_method || "Bank Transfer").toUpperCase(),
        address: {
           name: o.address?.recipient_name || "Penerima",
           phone: o.address?.phone || "-",
           city: o.address?.city?.name || (o.address?.city_id ? "Kota" : "Pusat"),
           detail: o.address?.address_line || o.address?.address || "Alamat lengkap tidak tersedia"
        },
        courier: {
           name: (o.shipping_courier || "Ekspedisi") + " " + (o.shipping_service || ""),
           resi: o.tracking_number || "Menunggu Resi",
           link: "#"
        },
        items: o.items?.map((item: any) => ({
           id: item.id,
           name: item.product_variant?.product?.name || "Produk Antarestar",
           image: item.product_variant?.product?.primary_image?.image_url || item.product_variant?.product?.images?.[0]?.image_url || "https://via.placeholder.com/300",
           price: parseFloat(item.price || 0),
           qty: item.quantity,
           variant: item.product_variant?.name || (item.product_variant?.color_name ? `${item.product_variant.color_name}${item.product_variant.size ? ' / ' + item.product_variant.size : ''}` : "-")
        })) || []
      });
    }).catch((err) => {
       console.error("Fetch error:", err);
       toast.error("Gagal memuat detail pesanan");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleCopyResi = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.courier.resi);
    toast.success("Nomor Resi Berhasil Disalin!");
  };

  const handleHelp = () => {
    if (!order) return;
    const phone = "6281234567890"; // Placeholder admin number
    const message = encodeURIComponent(`Halo Antarestar, saya butuh bantuan untuk pesanan #${order.id}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const status = statusConfig[order?.status || 'processing'];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-body">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="section-padding flex-1 pt-24 md:pt-32 pb-20 print:hidden">
        <div className="section-container max-w-4xl">
           {loading || !order ? (
              <OrderDetailSkeletonContent />
           ) : (
              <>
                {/* Back Button */}
                <Link to="/orders" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8 group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-display text-[10px] font-black uppercase tracking-widest">Kembali ke Pesanan Saya</span>
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="font-display font-black text-3xl uppercase tracking-tighter">Detail Pesanan</h1>
                      <div className={`px-3 py-1 rounded-full ${status.bg} ${status.color} flex items-center gap-2`}>
                         <status.icon className="w-3 h-3" />
                         <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">ORDER ID: <span className="text-foreground">#{order.id}</span> &bull; {order.date}</p>
                  </div>
                  <div className="flex gap-2">
                     <Button 
                       onClick={handleHelp}
                       variant="outline" className="rounded-xl h-12 px-6 border-2 font-display font-black text-[10px] uppercase tracking-widest"
                     >
                        Bantuan
                     </Button>
                     <Button 
                       onClick={handlePrint}
                       className="rounded-xl h-12 px-6 bg-accent hover:bg-accent/90 shadow-lg shadow-accent/20 font-display font-black text-[10px] uppercase tracking-widest"
                     >
                        Cetak Invoice
                     </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   {/* Main Content */}
                   <div className="lg:col-span-8 space-y-8">
                      {/* Items Section */}
                      <Reveal delay={0.1}>
                        <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
                           <div className="p-6 border-b border-border bg-muted/10 flex items-center justify-between">
                              <h3 className="font-display font-black text-sm uppercase tracking-widest flex items-center gap-2">
                                 <ShoppingBag className="w-4 h-4 text-accent" /> Daftar Produk
                              </h3>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{order.items.length} Barang</span>
                           </div>
                           <div className="p-6 divide-y divide-border">
                              {order.items.map((item: any, idx: number) => (
                                 <div key={idx} className="py-6 first:pt-0 last:pb-0 flex gap-4">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border bg-muted shrink-0">
                                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <h4 className="font-display font-bold text-sm uppercase mb-1 line-clamp-1">{item.name}</h4>
                                       <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">{item.variant}</p>
                                       <div className="flex justify-between items-center">
                                          <p className="text-xs text-muted-foreground font-medium">{item.qty} x Rp {item.price.toLocaleString("id-ID")}</p>
                                          <p className="font-display font-black text-sm text-accent">Rp {(item.price * item.qty).toLocaleString("id-ID")}</p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                      </Reveal>

                      {/* Logistics Section */}
                      <Reveal delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                               <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-accent" /> Alamat Pengiriman
                               </h3>
                               <div className="space-y-4">
                                  <div>
                                     <p className="text-sm font-display font-black uppercase mb-1">{order.address.name}</p>
                                     <p className="text-xs text-muted-foreground font-medium">{order.address.phone}</p>
                                  </div>
                                  <p className="text-xs text-foreground/80 leading-relaxed font-body">
                                     {order.address.detail}, {order.address.city}
                                  </p>
                               </div>
                           </div>
                           <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                               <h3 className="font-display font-black text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                                  <Truck className="w-3.5 h-3.5 text-accent" /> Informasi Pengiriman
                               </h3>
                               <div className="space-y-6">
                                  <div>
                                     <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Kurir & Layanan</p>
                                     <p className="text-sm font-display font-bold uppercase">{order.courier.name}</p>
                                  </div>
                                  <div>
                                     <div className="flex justify-between items-end mb-1">
                                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No. Resi</p>
                                         <button onClick={handleCopyResi} className="text-[9px] font-black uppercase text-accent hover:underline">Copy</button>
                                     </div>
                                     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border/50 group">
                                        <p className="text-sm font-display font-black tracking-widest">{order.courier.resi}</p>
                                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
                                     </div>
                                  </div>
                               </div>
                           </div>
                        </div>
                      </Reveal>
                   </div>

                   {/* Sidebar Content */}
                   <div className="lg:col-span-4 space-y-8">
                      {/* Billing Summary */}
                      <Reveal delay={0.3}>
                         <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            <h3 className="font-display font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-accent" /> Rincian Pembayaran
                            </h3>

                            <div className="space-y-4 mb-8">
                               <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground font-medium">Subtotal Produk</span>
                                  <span className="text-foreground font-bold">Rp {order.items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0).toLocaleString("id-ID")}</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground font-medium">Biaya Pengiriman</span>
                                  <span className="text-foreground font-bold">Rp {order.shippingFee.toLocaleString("id-ID")}</span>
                               </div>
                               <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground font-medium">Biaya Layanan</span>
                                  <span className="text-foreground font-bold">Rp {order.serviceFee.toLocaleString("id-ID")}</span>
                               </div>
                               {order.discount > 0 && (
                                 <div className="flex justify-between text-xs text-green-600">
                                    <span className="font-medium">Potongan Voucher</span>
                                    <span className="font-bold">-Rp {order.discount.toLocaleString("id-ID")}</span>
                                  </div>
                               )}
                               <div className="pt-4 border-t border-dashed border-border flex justify-between items-center">
                                  <span className="text-sm font-display font-black uppercase tracking-tight">Total Belanja</span>
                                  <span className="text-xl font-display font-black text-accent text-glow-accent">Rp {order.total.toLocaleString("id-ID")}</span>
                               </div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-2xl border border-border/50">
                               <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-2">Metode Pembayaran</p>
                               <p className="text-xs font-display font-black uppercase text-foreground">{order.paymentMethod}</p>
                            </div>
                         </div>
                      </Reveal>

                      {/* Tracking Progress Card */}
                      <Reveal delay={0.4}>
                         <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 group-hover:bg-accent/30 transition-colors" />
                            
                            <h3 className="relative z-10 font-display font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-accent" /> Lacak Cepat
                            </h3>

                            <div className="relative z-10 space-y-6">
                               <div className="flex gap-4">
                                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
                                     <Package className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                     <p className="text-xs font-black uppercase tracking-tight">Pesanan Diproses</p>
                                     <p className="text-[10px] text-white/50 font-bold uppercase mt-0.5">24 Mar &bull; 14:10</p>
                                  </div>
                               </div>
                               <div className="flex gap-4">
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                     <Truck className="w-4 h-4 text-white/30" />
                                  </div>
                                  <div className="opacity-40">
                                     <p className="text-xs font-black uppercase tracking-tight">Dalam Pengiriman</p>
                                     <p className="text-[10px] text-white/50 font-bold uppercase mt-0.5">Menunggu Kurir</p>
                                  </div>
                               </div>
                               <Button variant="outline" asChild className="w-full h-12 rounded-xl text-black border-white/20 hover:bg-white hover:text-primary font-display font-black text-[10px] uppercase tracking-widest mt-4 transition-all"><Link to={`/orders/${order.rawId}/tracking`}>Lihat Perjalanan Lengkap</Link></Button>
                            </div>
                         </div>
                      </Reveal>
                   </div>
                </div>
              </>
           )}
        </div>
      </main>

      {/* --- Printable Invoice Section --- */}
      {order && (
        <div id="printable-invoice" className="hidden print:block p-12 bg-white text-black font-body min-h-screen relative overflow-hidden">
           {/* Decorative Elements */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10" />
           
           {/* Header */}
           <div className="flex justify-between items-start mb-12">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FB8500] rounded-xl flex items-center justify-center text-white font-display font-black text-xl">A</div>
                    <div>
                       <h1 className="font-display font-black text-lg uppercase tracking-tight leading-none text-[#FB8500]">Antarestar</h1>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Explorer Hub &bull; Tactical Gear</p>
                    </div>
                 </div>
                 <div className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-[200px]">
                    Kawasan Niaga Antarestar, Blok B-12<br />
                    Jakarta Selatan, DKI Jakarta 12345<br />
                    cs@antarestar.com &bull; 021-555-0123
                 </div>
              </div>
              <div className="text-right">
                 <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-slate-900 mb-1">Invoice</h2>
                 <p className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">NO. TRANSAKSI: {order.id}</p>
                 
                 {/* ID Status Badge */}
                 {order.status === 'completed' && (
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 border-2 border-green-500 rounded-xl bg-green-50/50">
                       <CheckCircle2 className="w-4 h-4 text-green-600" />
                       <span className="text-sm font-display font-black uppercase text-green-600 tracking-widest italic">PAID / LUNAS</span>
                    </div>
                 )}
              </div>
           </div>

           {/* Info Grid */}
           <div className="grid grid-cols-2 gap-16 mb-16 border-y border-slate-100 py-10">
              <div className="space-y-6">
                 <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Ditujukan Kepada</h3>
                    <p className="text-sm font-display font-black uppercase mb-1">{order.address.name}</p>
                    <p className="text-xs text-slate-600 font-medium">{order.address.phone}</p>
                 </div>
                 <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Alamat Pengiriman</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{order.address.detail}, {order.address.city}</p>
                 </div>
              </div>
              <div className="text-right space-y-6 border-l border-slate-50 pl-16">
                 <div>
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Tanggal Transaksi</h3>
                    <p className="text-sm font-display font-black uppercase">{order.date}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Metode</h3>
                       <p className="text-[11px] font-bold uppercase">{order.paymentMethod}</p>
                    </div>
                    <div>
                       <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Kurir</h3>
                       <p className="text-[11px] font-bold uppercase">{order.courier.name}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Items Table */}
           <div className="mb-16">
              <table className="w-full">
                 <thead>
                    <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-900 pb-4">
                       <th className="pb-4 font-black">Deskripsi Produk</th>
                       <th className="pb-4 text-center font-black">Harga Unit</th>
                       <th className="pb-4 text-center font-black">Kuantitas</th>
                       <th className="pb-4 text-right font-black">Jumlah</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {order.items.map((item: any, idx: number) => (
                       <tr key={idx} className="group">
                          <td className="py-6">
                             <p className="text-[12px] font-display font-black uppercase tracking-tight">{item.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">VARIANT: {item.variant}</p>
                          </td>
                          <td className="py-6 text-center text-xs font-bold text-slate-600 italic">Rp {item.price.toLocaleString("id-ID")}</td>
                          <td className="py-6 text-center text-xs font-black">x{item.qty}</td>
                          <td className="py-6 text-right text-sm font-display font-black">Rp {(item.price * item.qty).toLocaleString("id-ID")}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Totals Summary */}
           <div className="flex justify-between items-start pt-10 border-t-2 border-slate-900">
              <div className="max-w-[300px]">
                 <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 italic">Catatan Penting:</h4>
                 <p className="text-[10px] text-slate-400 italic leading-relaxed">Terima kasih telah mempercayai Antarestar Explorer Hub. Simpan invoice ini sebagai bukti transaksi resmi dan syarat klaim garansi produk jika tersedia.</p>
              </div>
              <div className="w-80 space-y-3">
                 <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Subtotal Produk</span>
                    <span>Rp {order.items.reduce((sum: number, item: any) => sum + item.price * item.qty, 0).toLocaleString("id-ID")}</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Biaya Pengiriman</span>
                    <span>Rp {order.shippingFee.toLocaleString("id-ID")}</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <span>Biaya Layanan</span>
                    <span>Rp {order.serviceFee.toLocaleString("id-ID")}</span>
                 </div>
                 {order.discount > 0 && (
                   <div className="flex justify-between text-[11px] font-black text-green-600 uppercase tracking-widest">
                      <span>Potongan Voucher</span>
                      <span>-Rp {order.discount.toLocaleString("id-ID")}</span>
                   </div>
                 )}
                 <div className="flex justify-between items-center pt-5 mt-5 border-t border-slate-100">
                    <span className="text-[13px] font-display font-black uppercase tracking-tighter">Total Bayar</span>
                    <span className="text-3xl font-display font-black text-[#FB8500]">Rp {order.total.toLocaleString("id-ID")}</span>
                 </div>
              </div>
           </div>

           {/* Branded Footer */}
           <div className="mt-24 pt-16 border-t border-slate-50 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 bg-white font-display font-black text-[10px] uppercase tracking-[1em] text-slate-200">ANTARESTAR</div>
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-[#FB8500] mb-3">Forge Your Own Path</p>
              <div className="flex justify-center gap-6 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>Instagram: @antarestar.id</span>
                 <span>&bull;</span>
                 <span>Website: www.antarestar.com</span>
                 <span>&bull;</span>
                 <span>Tiktok: @antarestar.explorer</span>
              </div>
           </div>
        </div>
      )}

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

const OrderDetailSkeletonContent = () => (
  <>
    <Skeleton className="h-4 w-40 mb-8" />
    
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-12 w-32 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
       <div className="lg:col-span-8 space-y-8">
          <div className="bg-card border border-border rounded-[2rem] overflow-hidden p-6 space-y-6">
             <div className="flex justify-between items-center pb-6 border-b border-border">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
             </div>
             {[1, 2].map(i => (
               <div key={i} className="flex gap-4 py-4">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                     <Skeleton className="h-5 w-3/4" />
                     <Skeleton className="h-4 w-1/4" />
                     <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-24" />
                     </div>
                  </div>
               </div>
             ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-3">
                   <Skeleton className="h-5 w-40" />
                   <Skeleton className="h-4 w-32" />
                   <Skeleton className="h-10 w-full" />
                </div>
             </div>
             <div className="bg-card border border-border rounded-[2rem] p-8 space-y-6">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-4">
                   <Skeleton className="h-5 w-40" />
                   <Skeleton className="h-12 w-full rounded-xl" />
                </div>
             </div>
          </div>
       </div>
       <div className="lg:col-span-4 space-y-8">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-8">
             <Skeleton className="h-5 w-40" />
             <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
             </div>
             <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
       </div>
    </div>
  </>
);

export default OrderDetail;

// Internal helpers/components
const Activity = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  </svg>
);
