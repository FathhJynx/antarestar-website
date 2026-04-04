import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Truck, Package, CheckCircle2, 
  MapPin, Clock, ShieldCheck, ExternalLink,
  Copy, Phone, Info, AlertCircle, ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Reveal } from "@/components/AnimationPrimitives";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const Tracking = () => {
  const { id } = useParams();
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    // Fetch order first to get courier info
    api.get(`/orders/${id}`)
      .then(res => {
        const order = res.data?.data;
        if (!order) throw new Error("Order not found");
        
        api.get(`/orders/${id}/shipment-logs`)
           .then(logRes => {
             const logs = logRes.data?.data || [];
             // Reverse logs for latest first display
             const sortedLogs = [...logs].reverse();
             
             setTrack({
                id: order.id,
                displayId: order.order_number || ("ANT-" + String(order.id).slice(0, 8).toUpperCase()),
                courier: (order.shipping_courier || "Ekspedisi") + " " + (order.shipping_service || ""),
                resi: order.tracking_number || "Menunggu Resi",
                status: order.status,
                origin: "Antarestar HQ (Tangerang)",
                destination: order.address?.address_line || order.address?.address || "Unknown",
                steps: sortedLogs.map((l: any, i: number) => ({
                  status: l.status.replace(/_/g, ' ').toUpperCase(),
                  date: new Date(l.created_at).toLocaleString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                  location: l.location || (i === sortedLogs.length - 1 ? "Antarestar HQ (Tangerang)" : "Transit Hub"),
                  desc: l.description,
                  completed: true,
                  active: i === 0
                }))
             });
             setLoading(false);
           }).catch(() => {
             toast.error("Gagal memuat log pengiriman");
             setLoading(false);
           });
      })
      .catch(() => {
        toast.error("Gagal memuat data pesanan");
        setLoading(false);
      });
  }, [id]);

  const handleCopyResi = () => {
    if (!track) return;
    navigator.clipboard.writeText(track.resi);
    toast.success("Nomor Resi Berhasil Disalin!");
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-body">
      <Navbar />

      <main className="section-padding flex-1 pt-24 md:pt-32 pb-20">
        <div className="section-container max-w-4xl">
           {loading || !track ? (
              <TrackingSkeletonContent />
           ) : (
              <>
                {/* Header */}
                <div className="mb-10">
                   <Link to={`/orders/${track.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-6 group">
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-display text-[10px] font-black uppercase tracking-widest">Kembali ke Detail Pesanan</span>
                   </Link>
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div>
                        <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2">Lacak Paket</h1>
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Pesanan <span className="text-foreground">#{track.displayId}</span> &bull; {track.courier}</p>
                      </div>
                      <div className="flex bg-card border border-border rounded-2xl p-4 shadow-sm items-center gap-6">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Nomor Resi</span>
                            <span className="text-sm font-display font-black tracking-widest uppercase">{track.resi}</span>
                         </div>
                         <button onClick={handleCopyResi} className="p-2.5 bg-muted hover:bg-accent hover:text-white transition-all rounded-xl">
                            <Copy className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Timeline Area */}
                  <div className="lg:col-span-8 space-y-6">
                     <Reveal>
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                           
                           <div className="relative space-y-0">
                              <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border sm:left-[23px]" />
                              
                              {track.steps.map((step: any, idx: number) => (
                                 <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-14 pb-12 last:pb-0"
                                 >
                                    <div className={`absolute left-0 top-1.5 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-background flex items-center justify-center z-10 shadow-sm transition-all ${
                                       step.active ? "bg-accent text-white ring-8 ring-accent/10" : 
                                       step.completed ? "bg-primary text-white" : "bg-muted text-muted-foreground/30"
                                    }`}>
                                       {step.active ? <Truck className="w-5 h-5" /> : step.completed ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                                    </div>
                                    
                                    <div className="space-y-2">
                                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                          <h4 className={`text-base md:text-lg font-display font-black uppercase tracking-tight ${step.active ? "text-accent" : "text-foreground"}`}>
                                             {step.status}
                                          </h4>
                                          <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase">{step.date}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-muted-foreground">
                                          <MapPin className="w-3.5 h-3.5" />
                                          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{step.location}</span>
                                       </div>
                                       <p className="text-sm text-foreground/70 leading-relaxed max-w-lg">{step.desc}</p>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     </Reveal>
                  </div>

                  {/* Sidebar Details */}
                  <div className="lg:col-span-4 space-y-6">
                     {/* Map Card */}
                     <Reveal delay={0.2}>
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm aspect-square md:aspect-auto md:h-80 relative group">
                           <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                             <MapPin className="w-16 h-16 text-muted-foreground/20" />
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                           
                           <div className="absolute inset-0 p-8 flex flex-col justify-between">
                              <div className="flex justify-between items-start">
                                 <div className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/20">
                                    <Package className="w-5 h-5 text-accent" />
                                 </div>
                                 <div className="bg-accent text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-accent/20">
                                    Dalam Perjalanan
                                 </div>
                              </div>
                              
                              <div className="space-y-4">
                                 <div className="flex items-center gap-4 text-white">
                                    <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center shrink-0">
                                       <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
                                    </div>
                                    <div className="flex-1">
                                       <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-0.5">Lokasi Terkini</p>
                                       <p className="text-xs font-bold uppercase truncate">{track.steps[0]?.location || "Transit Hub Jakarta Selatan"}</p>
                                    </div>
                                 </div>
                                 <Button asChild className="w-full bg-white hover:bg-muted text-primary font-black uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl shadow-xl"><a href="#" target="_blank" rel="noopener noreferrer">Buka Google Maps <ExternalLink className="w-3.5 h-3.5 ml-2" /></a></Button>
                              </div>
                           </div>
                        </div>
                     </Reveal>

                     {/* Shipping Info */}
                     <Reveal delay={0.3}>
                        <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
                           
                           <h3 className="relative z-10 font-display font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-accent" /> Detail Pengiriman
                           </h3>

                           <div className="relative z-10 space-y-6">
                              <div className="flex gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                    <Truck className="w-5 h-5 text-accent" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Kurir Paket</p>
                                    <p className="text-sm font-display font-black uppercase">{track.courier}</p>
                                 </div>
                              </div>
                              <div className="flex gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                    <MapPin className="w-5 h-5 text-accent" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Alamat Tujuan</p>
                                    <p className="text-[10px] text-white/60 mt-1 line-clamp-2">{track.destination}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                              <button className="flex flex-col items-center gap-2 group/btn">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:border-accent transition-all">
                                    <Phone className="w-5 h-5" />
                                 </div>
                                 <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Hubungi Kurir</span>
                              </button>
                              <button className="flex flex-col items-center gap-2 group/btn">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/btn:bg-accent group-hover/btn:border-accent transition-all">
                                    <Info className="w-5 h-5" />
                                 </div>
                                 <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Bantuan</span>
                              </button>
                           </div>
                        </div>
                     </Reveal>
                  </div>
                </div>
              </>
           )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const TrackingSkeletonContent = () => (
  <>
    <div className="mb-10">
       <Skeleton className="h-4 w-48 mb-6" />
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 md:h-16" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-20 w-full md:w-64 rounded-2xl" />
       </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
         <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-10">
                 <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                 <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                       <Skeleton className="h-6 w-1/2" />
                       <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-16 w-full" />
                 </div>
              </div>
            ))}
         </div>
      </div>
      <div className="lg:col-span-4 space-y-6">
         <Skeleton className="aspect-square md:h-80 w-full rounded-[2.5rem]" />
         <div className="bg-primary rounded-[2.5rem] p-8 space-y-6">
            <Skeleton className="h-5 w-32 bg-white/20" />
            <Skeleton className="h-12 w-full bg-white/10 rounded-xl" />
            <Skeleton className="h-16 w-full bg-white/10 rounded-xl" />
         </div>
      </div>
    </div>
  </>
);

export default Tracking;
