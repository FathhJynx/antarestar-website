import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, Package, Truck, MapPin, 
  CreditCard, ExternalLink, AlertCircle, ShoppingBag,
  Clock, PackageCheck, FileText, CheckCircle2, Copy, Info, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { rp } from "@/utils/formatters";

// Status configuration
const statusConfig: any = {
  unpaid: { label: "BELUM BAYAR", color: "text-orange-600", bg: "bg-orange-600/10", icon: Clock },
  processing: { label: "DIPROSES", color: "text-blue-600", bg: "bg-blue-600/10", icon: Package },
  shipping: { label: "DIKIRIM", color: "text-purple-600", bg: "bg-purple-600/10", icon: Truck },
  completed: { label: "SELESAI", color: "text-green-600", bg: "bg-green-600/10", icon: PackageCheck },
  cancelled: { label: "BATAL", color: "text-red-600", bg: "bg-red-600/10", icon: AlertCircle },
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
        total_price: parseFloat(o.total_price || 0),
        discount: parseFloat(o.discount_amount || 0),
        shipping_cost: parseFloat(o.shipping_cost || 0),
        grand_total: parseFloat(o.grand_total || 0),
        paymentMethod: (o.payment_method || "Bank Transfer"),
        address: {
           name: o.address?.recipient_name || "PENERIMA",
           phone: o.address?.phone || "-",
           state: o.address?.province?.name || "Provinsi",
           city: o.address?.city?.name || "Kota",
           postal_code: o.address?.postal_code || "-----",
           address_line: o.address?.address_line || o.address?.address || "Alamat Tujuan"
        },
        courier: {
           name: (o.shipping_courier || "Kurir") + " " + (o.shipping_service || ""),
           resi: o.tracking_number || "Belum ada resi",
        },
        items: o.items?.map((item: any) => ({
           id: item.id,
           name: item.product_variant?.product?.name || "Produk Antarestar",
           image: item.product_variant?.product?.primary_image?.image_url || item.product_variant?.product?.images?.[0]?.image_url || "https://via.placeholder.com/300",
           price: parseFloat(item.price || 0),
           qty: item.quantity,
           variant: item.product_variant?.name || "-"
        })) || []
      });
    }).catch(() => {
       toast.error("Data pesanan tidak ditemukan.");
    }).finally(() => setLoading(false));
  }, [id]);

  const handleCopyResi = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.courier.resi);
    toast.success("Nomor resi disalin.");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col selection:bg-orange-600">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-6 md:px-20">
          <div className="max-w-7xl mx-auto space-y-12">
             <Skeleton className="h-64 w-full bg-white/5 rounded-none" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <Skeleton className="h-96 md:col-span-2 bg-white/5 rounded-none" />
                <Skeleton className="h-96 bg-white/5 rounded-none" />
             </div>
          </div>
        </main>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.processing;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col selection:bg-orange-600 font-body">
      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 pt-28 md:pt-40 pb-24 px-4 sm:px-6 md:px-20 print:hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-10 md:mb-16 border-b border-white/10 pb-8 md:pb-10 text-white">
                <div className="space-y-3">
                    <Link to="/orders" className="inline-flex items-center gap-4 text-white/40 hover:text-orange-600 transition-all mb-4 group">
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-bold text-[10px] uppercase tracking-widest">KEMBALI KE DAFTAR</span>
                    </Link>
                    <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">Detail Pesanan</p>
                    <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter leading-tight">
                        PESANAN <span className="text-white/20">LO.</span>
                    </h1>
                </div>
                <div className="hidden md:flex flex-col items-end gap-2">
                    <div className={`px-8 py-3 border border-white/20 ${status.color} font-bold text-lg uppercase tracking-widest italic`}>
                       {status.label}
                    </div>
                </div>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              <Reveal direction="up" delay={0.1}>
                <div className="bg-[#141414] border border-white/5 overflow-hidden">
                  <div className="p-5 sm:p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                     <h3 className="font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-white/30 leading-none">DAFTAR BARANG</h3>
                     <span className="font-bold text-[9px] sm:text-[10px] text-white/20 uppercase tracking-widest leading-none">{order.items.length} ITEM</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 sm:p-8 flex flex-row gap-4 sm:gap-8 group items-center">
                        <div className="w-16 h-16 sm:w-32 sm:h-32 bg-black p-2 sm:p-4 border border-white/5 flex items-center justify-center shrink-0">
                           <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center py-1">
                          <div className="flex justify-between items-start gap-4">
                             <div className="space-y-1 sm:space-y-3">
                                <h4 className="font-display font-bold text-sm sm:text-2xl md:text-3xl uppercase italic leading-tight tracking-tight max-w-md">
                                   {item.name}
                                </h4>
                                <div className="flex flex-wrap gap-2 sm:gap-4 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-white/30 italic leading-none">
                                    {item.variant && <span>VARIAN: <span className="text-white">{item.variant}</span></span>}
                                    <span>QTY: <span className="text-white">{item.qty}</span></span>
                                </div>
                             </div>
                             <span className="font-bold text-base sm:text-2xl text-orange-600 tracking-tight shrink-0 mt-0.5 sm:mt-0">
                                {rp(item.price)}
                             </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Delivery Info */}
              <Reveal direction="up" delay={0.2}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-white">
                     <div className="bg-[#141414] p-5 sm:p-8 border border-white/5 space-y-4 sm:space-y-6">
                        <p className="font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-white/30">ALAMAT TUJUAN</p>
                        <div className="space-y-2 sm:space-y-4">
                            <h4 className="font-bold text-lg sm:text-xl uppercase italic text-white tracking-tight leading-none">{order.address.name}</h4>
                            <p className="font-bold text-[10px] sm:text-[11px] text-white/40 uppercase tracking-[0.05em] leading-relaxed">
                                {order.address.address_line},<br />
                                {order.address.city}, {order.address.state} {order.address.postal_code}
                            </p>
                        </div>
                     </div>
                     <div className="bg-[#141414] p-5 sm:p-8 border border-white/5 space-y-4 sm:space-y-6">
                        <p className="font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-white/30 leading-none">UNIT LOGISTIK</p>
                        <div className="space-y-4 sm:space-y-6">
                            <h4 className="font-bold text-lg sm:text-xl uppercase italic text-white tracking-tight leading-none leading-none">{order.courier.name}</h4>
                            <div className="space-y-2 leading-none">
                                <p className="text-[8px] font-bold uppercase text-white/20 tracking-widest">NOMOR RESI</p>
                                <div className="flex items-center justify-between p-3 bg-black border border-white/5 group hover:border-orange-600 transition-colors">
                                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest">{order.courier.resi}</span>
                                    <button onClick={handleCopyResi}><Copy className="w-3.5 h-3.5 text-white/20 group-hover:text-orange-600" /></button>
                                </div>
                            </div>
                        </div>
                     </div>
                  </div>
              </Reveal>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 space-y-12">
               <Reveal direction="up" delay={0.3}>
                  <div className="bg-[#141414] p-5 sm:p-8 border border-white/5 space-y-8 sm:space-y-10 text-white leading-none">
                     <div className="space-y-2">
                       <p className="font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-white/30">Ringkasan Pesanan</p>
                       <h2 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-white">RINGKASAN.</h2>
                     </div>

                     <div className="space-y-4 sm:space-y-5 pt-6 sm:pt-8 border-t border-white/5 font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-white/40">
                        <div className="flex justify-between">
                           <span>SUBTOTAL</span>
                           <span className="text-white text-base sm:text-lg">{rp(order.total_price)}</span>
                        </div>
                        <div className="flex justify-between">
                           <span>LOGISTIK</span>
                           <span className="text-white text-base sm:text-lg">{rp(order.shipping_cost)}</span>
                        </div>
                        <div className="flex justify-between text-orange-600">
                           <span>DISKON</span>
                           <span className="text-base sm:text-lg">-{rp(order.discount)}</span>
                        </div>
                     </div>

                     <div className="pt-6 sm:pt-8 border-t-2 border-white">
                        <div className="flex justify-between items-end mb-6 sm:mb-8">
                           <span className="font-bold text-[8px] sm:text-[10px] uppercase tracking-widest text-white/40">TOTAL BAYAR</span>
                           <span className="font-display font-bold text-2xl sm:text-4xl text-white tracking-tight leading-none">{rp(order.grand_total)}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:gap-4 h-auto">
                            <Button onClick={handlePrint} className="h-14 sm:h-16 bg-white text-black hover:bg-orange-600 hover:text-white rounded-none font-bold uppercase text-[9px] sm:text-[10px] tracking-widest transition-all border-none">
                                CETAK INVOICE <FileText className="ml-3 w-4 h-4" />
                            </Button>
                            <Button asChild variant="outline" className="h-14 sm:h-16 border-white/10 text-white hover:bg-white hover:text-black rounded-none font-bold uppercase text-[9px] sm:text-[10px] tracking-widest transition-all text-xs">
                               <Link to={`/orders/${order.rawId}/tracking`} className="flex items-center justify-center gap-3">LACAK PAKET <Truck className="w-4 h-4" /></Link>
                            </Button>
                        </div>
                     </div>
                  </div>
               </Reveal>

               {/* Operative Details */}
               <Reveal direction="up" delay={0.4}>
                  <div className="bg-white text-black p-8 space-y-8 leading-none">
                      <div className="space-y-2">
                         <p className="font-bold text-[10px] uppercase tracking-widest text-black/40">DATA PEMESAN</p>
                         <h2 className="font-display font-bold text-2xl uppercase tracking-tight text-black leading-none">INFO PENERIMA.</h2>
                       </div>

                       <div className="space-y-6 pt-8 border-t border-black/10">
                           <div className="space-y-1">
                              <p className="font-bold text-[9px] uppercase tracking-widest text-black/30">NOMOR PESANAN</p>
                              <p className="font-bold text-sm text-black uppercase tracking-widest leading-none">#{order.id}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="font-bold text-[9px] uppercase tracking-widest text-black/30">METODE PEMBAYARAN</p>
                              <p className="font-bold text-sm text-black uppercase tracking-widest">{order.paymentMethod}</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4 h-16 pt-6 border-t border-black/5">
                               <button className="h-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
                               <button className="h-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Info className="w-4 h-4" /></button>
                           </div>
                       </div>
                  </div>
               </Reveal>
            </div>
          </div>
        </div>
      </main>

      {/* --- Printable Invoice Section --- */}
      <div id="printable-invoice" className="hidden print:block p-12 bg-white text-black font-body min-h-screen">
         <div className="flex justify-between items-start mb-20 border-b-8 border-black pb-12">
            <div>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-display font-bold text-4xl">A</div>
                  <h1 className="font-display font-bold text-4xl uppercase italic tracking-tight">ANTARESTAR.</h1>
               </div>
               <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">NOMOR INVOICE: {order.id}</p>
            </div>
            <div className="text-right">
               <h2 className="font-display font-bold text-6xl uppercase tracking-tighter italic leading-none">INVOICE.</h2>
               <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mt-4">TANGGAL: {order.date}</p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-20 mb-20 border-b-4 border-black pb-16">
            <div>
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-6 italic">ALAMAT TUJUAN</h3>
               <p className="text-2xl font-display font-bold uppercase mb-2 italic">{order.address.name}</p>
               <p className="text-sm font-display font-bold uppercase italic tracking-tight leading-relaxed">{order.address.address_line}, {order.address.city}</p>
            </div>
            <div className="text-right">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-6 italic">DATA PENGIRIMAN</h3>
               <p className="text-2xl font-display font-bold uppercase mb-2 italic">{order.courier.name}</p>
               <p className="text-sm font-display font-bold uppercase italic tracking-tight">{order.paymentMethod}</p>
            </div>
         </div>

         <table className="w-full mb-20">
            <thead>
               <tr className="text-[10px] font-bold uppercase tracking-widest text-black/30 text-left border-b-4 border-black pb-4">
                  <th className="pb-4 italic">DESKRIPSI BARANG</th>
                  <th className="pb-4 text-center italic">JUMLAH</th>
                  <th className="pb-4 text-right italic">SUBTOTAL</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
               {order.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                     <td className="py-8">
                        <p className="text-xl font-display font-bold uppercase italic tracking-tight">{item.name}</p>
                        <p className="text-[10px] text-black/30 font-bold uppercase italic tracking-widest mt-1">{item.variant}</p>
                     </td>
                     <td className="py-8 text-center text-lg font-bold italic">{item.qty}</td>
                     <td className="py-8 text-right text-xl font-display font-bold italic">{rp(item.price * item.qty)}</td>
                  </tr>
               ))}
            </tbody>
         </table>

         <div className="flex justify-end pt-12 border-t-8 border-black">
            <div className="w-96 space-y-4">
               <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-black/40">
                  <span>SUBTOTAL</span>
                  <span className="text-black">{rp(order.total_price)}</span>
               </div>
               <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-black/40">
                  <span>PENGIRIMAN</span>
                  <span className="text-black">{rp(order.shipping_cost)}</span>
               </div>
               <div className="flex justify-between items-center pt-8 border-t-4 border-black">
                  <span className="font-display font-bold text-xl italic uppercase">TOTAL</span>
                  <span className="text-5xl font-display font-bold text-orange-600 italic tracking-tight leading-none">{rp(order.grand_total)}</span>
               </div>
            </div>
         </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default OrderDetail;
