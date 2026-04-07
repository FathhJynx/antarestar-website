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

    api.get(`/orders/${id}`)
      .then(res => {
        const order = res.data?.data;
        if (!order) throw new Error("Order not found");
        
        api.get(`/orders/${id}/shipment-logs`)
           .then(logRes => {
             const logs = logRes.data?.data || [];
             const sortedLogs = [...logs].reverse();
             
             setTrack({
                id: order.id,
                displayId: order.order_number || ("ANT-" + String(order.id).slice(0, 8).toUpperCase()),
                courier: (order.shipping_courier || "ANTARESTAR CARRIER") + " " + (order.shipping_service || ""),
                resi: order.tracking_number || "AWAITING TRACKING ID",
                status: order.status,
                origin: "ANTARESTAR HQ (TANGERANG)",
                destination: order.address?.address_line || order.address?.address || "TARGET LOCATION",
                steps: sortedLogs.map((l: any, i: number) => ({
                  status: l.status.replace(/_/g, ' ').toUpperCase(),
                  date: new Date(l.created_at).toLocaleString("en-US", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                  location: l.location || (i === sortedLogs.length - 1 ? "HQ_CENTER" : "TRANSIT_HUB"),
                  desc: l.description,
                  completed: true,
                  active: i === 0
                }))
             });
             setLoading(false);
           }).catch(() => {
             toast.error("MISSION_LOGS_FAILED.");
             setLoading(false);
           });
      })
      .catch(() => {
        toast.error("MISSION_DATA_UNAVAILABLE.");
        setLoading(false);
      });
  }, [id]);

  const handleCopyResi = () => {
    if (!track) return;
    navigator.clipboard.writeText(track.resi);
    toast.success("TRACKING_ID_COPIED.");
  };

  if (loading || !track) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-6 md:px-20">
          <div className="max-w-7xl mx-auto space-y-12">
            <Skeleton className="h-48 w-full bg-white/5 rounded-none" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <Skeleton className="h-[600px] md:col-span-2 bg-white/5 rounded-none" />
               <Skeleton className="h-96 bg-white/5 rounded-none" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col selection:bg-orange-600">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-40 pb-24 px-4 sm:px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                   <Link to={`/orders/${id}`} className="inline-flex items-center gap-4 text-white/40 hover:text-orange-600 transition-all mb-8 group">
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-bold text-[10px] uppercase tracking-widest">KEMBALI KE DETAIL</span>
                   </Link>
                   
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-10">
                      <div className="space-y-3">
                        <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">Protokol Pengiriman</p>
                        <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight">LACAK <span className="text-white/20">PAKET.</span></h1>
                      </div>
                      <div className="flex bg-white text-black p-6 items-center gap-8 border-b-4 border-orange-600 min-w-[300px]">
                         <div className="space-y-1 flex-1 leading-none">
                            <span className="text-[9px] font-bold uppercase text-black/30 tracking-widest leading-none">NOMOR RESI</span>
                            <span className="block text-xl font-bold tracking-widest uppercase">{track.resi}</span>
                         </div>
                         <button onClick={handleCopyResi} className="w-10 h-10 bg-black text-white hover:bg-orange-600 transition-all flex items-center justify-center shrink-0">
                            <Copy className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Timeline Area */}
                  <div className="lg:col-span-8 space-y-12">
                     <Reveal direction="up">
                        <div className="bg-[#141414] border border-white/5 relative overflow-hidden">
                           <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                               <h3 className="font-bold text-[10px] uppercase tracking-widest text-white/40">STATUS PENGIRIMAN</h3>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-600 animate-pulse" />
                                  <span className="font-bold text-[9px] text-orange-600 uppercase tracking-widest leading-none">LIVE UPDATING</span>
                               </div>
                           </div>

                           <div className="p-10 md:p-16 relative space-y-0">
                               <div className="absolute left-[39px] top-10 bottom-10 w-px bg-white/10" />
                              
                              {track.steps.map((step: any, idx: number) => (
                                 <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative pl-24 pb-16 last:pb-0 group"
                                 >
                                    <div className={`absolute left-0 top-0 w-20 h-20 flex items-center justify-center z-10 transition-all ${
                                       step.active ? "bg-orange-600 text-white" : 
                                       step.completed ? "bg-white text-black" : "bg-white/5 text-white/20"
                                    }`}>
                                       {step.active ? <Truck className="w-8 h-8" /> : step.completed ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-3 h-3 bg-current" />}
                                    </div>
                                    
                                    <div className="space-y-4 pt-2 leading-none">
                                       <div className="flex justify-between items-start gap-8">
                                          <div className="space-y-3">
                                             <h4 className={`text-2xl md:text-3xl font-display font-bold uppercase italic leading-tight tracking-tight ${step.active ? "text-orange-600" : "text-white"}`}>
                                                {step.status}
                                             </h4>
                                             <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/30 italic">
                                                <span>{step.date}</span>
                                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                                <span className="text-orange-600">{step.location}</span>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="p-5 bg-black/40 border border-white/5 max-w-xl">
                                          <p className="text-[11px] font-bold uppercase italic tracking-widest leading-relaxed text-white/40">{step.desc}</p>
                                       </div>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     </Reveal>
                  </div>

                  {/* Sidebar Details */}
                  <div className="lg:col-span-4 space-y-12">
                     <Reveal direction="up" delay={0.2}>
                        <div className="bg-[#141414] border border-white/5 p-8 space-y-8">
                            <div className="space-y-2">
                                <p className="font-bold text-[10px] uppercase tracking-widest text-white/30">LOKASI TUJUAN</p>
                                <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-white leading-none">DROP ZONE.</h3>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="aspect-square bg-black border border-white/5 relative group overflow-hidden flex items-center justify-center">
                                    <MapPin className="relative z-10 w-20 h-20 text-orange-600 animate-bounce" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.1),transparent_70%)]" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       <div className="w-[80%] h-[80%] border border-white/5 rotate-45" />
                                       <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                          <div className="w-full h-px bg-white" />
                                          <div className="h-full w-px bg-white" />
                                       </div>
                                    </div>
                                </div>
                                <Button asChild className="w-full h-16 bg-white text-black hover:bg-orange-600 hover:text-white rounded-none font-bold uppercase text-[10px] tracking-widest border-none transition-all">
                                    <a href="#" target="_blank" rel="noopener noreferrer">LIHAT MAPS <ExternalLink className="w-4 h-4 ml-3" /></a>
                                </Button>
                            </div>
                        </div>
                     </Reveal>

                     <Reveal direction="up" delay={0.3}>
                        <div className="bg-white p-8 space-y-8 text-black leading-none">
                            <div className="space-y-2">
                                <p className="font-bold text-[10px] uppercase tracking-widest text-black/40">DETAIL PENGIRIMAN</p>
                                <h3 className="font-display font-bold text-2xl uppercase tracking-tight text-black leading-none">INFO PAKET.</h3>
                            </div>

                            <div className="space-y-8 border-t border-black/10 pt-8">
                               <div className="flex gap-5">
                                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                     <Truck className="w-5 h-5" />
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[9px] font-bold uppercase text-black/30 tracking-widest leading-none mb-1">KURIR UNIT</p>
                                     <p className="font-bold text-base uppercase tracking-tight">{track.courier}</p>
                                  </div>
                               </div>
                               <div className="flex gap-5">
                                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                     <MapPin className="w-5 h-5" />
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[9px] font-bold uppercase text-black/30 tracking-widest leading-none mb-1">DROP ZONE</p>
                                     <p className="font-bold text-xs uppercase tracking-tight leading-relaxed text-black/60 line-clamp-2">{track.destination}</p>
                                  </div>
                               </div>
                            </div>

                            <div className="pt-8 border-t border-black/10 grid grid-cols-2 gap-4 h-16">
                               <button className="h-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
                               <button className="h-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Info className="w-4 h-4" /></button>
                            </div>
                        </div>
                     </Reveal>
                  </div>
                </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tracking;
