import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  ChevronRight,
  MoreVertical,
  X,
  Printer,
  Package,
  Calendar,
  CreditCard,
  Users,
  Zap,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/pages/Admin/components/AdminModal';
import { useQuery, useMutation } from '@tanstack/react-query';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending: { label: 'MENUNGGU', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  processing: { label: 'DIPROSES', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Zap },
  shipped: { label: 'DIKIRIM', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Truck },
  completed: { label: 'SELESAI', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 },
  cancelled: { label: 'DIBATALKAN', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
};

const OrderManagement = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['admin_orders', search, statusFilter],
    queryFn: async () => {
      const response = await api.get('/admin/orders', {
        params: { search, status: statusFilter !== 'all' ? statusFilter : undefined }
      });
      return response.data.data.data || [];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      api.put(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Status transaksi berhasil diperbarui.');
      refetch();
      setIsDetailsOpen(false);
    }
  });

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              KENDALI <span className="text-accent underline decoration-4 underline-offset-8">PESANAN</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Manifest Transaksi & Pusat Kontrol Logistik</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Sedang Diproses</span>
                <span className="text-xl font-black text-accent italic">{orders.filter((o: any) => o.status === 'processing').length} PESANAN</span>
             </div>
          </div>
        </div>

        {/* Filters and Search Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="CARI BERDASARKAN ID PESANAN, PELANGGAN, ATAU NO. RESI..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
            />
          </div>
          <div className="lg:col-span-5 flex gap-4 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`h-16 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                  statusFilter === status 
                    ? 'bg-accent text-white border-accent shadow-2xl shadow-accent/20' 
                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5'
                }`}
              >
                {status === 'all' ? 'SEMUA' : statusConfig[status]?.label || status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Ledger */}
        <div className="bg-white/[0.02] rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden min-h-[600px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-8" />
               <p className="text-[12px] uppercase font-black tracking-[0.4em]">Menyinkronkan Aliran Pesanan...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">ID PESANAN</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">PENERIMA</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">TOTAL BAYAR</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">STATUS</th>
                    <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.3em] text-white/20">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-white/[0.03] transition-all group font-body">
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-white italic group-hover:text-accent transition-colors">#{order.id.substring(0, 12).toUpperCase()}</span>
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                              {new Date(order.created_at).toLocaleDateString()}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                         <div className="flex flex-col">
                           <span className="text-[12px] font-black text-white/80 uppercase">{order.address?.recipient_name || order.user?.name}</span>
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{order.address?.city?.name || 'N/A'}</span>
                         </div>
                      </td>
                      <td className="px-8 py-8">
                         <span className="text-lg font-black text-white italic">Rp {Number(order.total_price || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-8">
                         <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.border} ${statusConfig[order.status]?.color}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig[order.status]?.color?.replace('text-','bg-')} animate-pulse`} />
                            {statusConfig[order.status]?.label || order.status.toUpperCase()}
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}
                          className="h-12 px-6 bg-white/[0.05] hover:bg-accent text-white border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          LIHAT RINCIAN
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-32 text-center">
               <ShoppingBag className="w-16 h-16 mb-6" />
               <h3 className="text-2xl font-display font-black uppercase tracking-tighter italic">Tidak Ada Pesanan</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2">Buku besar pesanan saat ini kosong.</p>
            </div>
          )}
        </div>
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {isDetailsOpen && selectedOrder && (
          <AdminModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} maxWidth="max-w-5xl">
            {/* Modal Header */}
            <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-[#111] shrink-0">
               <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic text-white">
                    MANIFEST <span className="text-accent underline decoration-4 underline-offset-8">PESANAN</span>
                  </h3>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-2">ID Transaksi Aktif: {selectedOrder.id}</p>
               </div>
               <button onClick={() => setIsDetailsOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all group">
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 bg-[#0B0B0B] space-y-12 no-scrollbar">
               {/* Customer & Shipping Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-body">
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                     <div className="flex items-center gap-4 mb-6">
                        <Users className="w-5 h-5 text-accent" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40">Data Pelanggan</h4>
                     </div>
                     <div className="space-y-4">
                        <p className="text-xl font-black text-white">{selectedOrder.user?.name}</p>
                        <p className="text-sm text-white/60">{selectedOrder.user?.email}</p>
                        <p className="text-sm text-white/60">{selectedOrder.user?.phone || 'N/A'}</p>
                     </div>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                     <div className="flex items-center gap-4 mb-6">
                        <MapPin className="w-5 h-5 text-accent" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40">Alamat Pengiriman</h4>
                     </div>
                     <div className="space-y-2">
                        <p className="text-sm font-black text-white uppercase">{selectedOrder.address?.recipient_name}</p>
                        <p className="text-sm text-white/60 leading-relaxed">{selectedOrder.address?.address}</p>
                        <p className="text-sm text-white/60">{selectedOrder.address?.city?.name}, {selectedOrder.address?.province?.name} {selectedOrder.address?.postal_code}</p>
                     </div>
                  </div>
               </div>

               {/* Items Table */}
               <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/[0.03] border-b border-white/5">
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">PRODUK</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/20">QTY</th>
                           <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-white/20">SUBTOTAL</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 font-body">
                        {selectedOrder.items?.map((item: any) => (
                           <tr key={item.id}>
                              <td className="px-8 py-6">
                                 <p className="text-sm font-black text-white uppercase tracking-tight italic">{item.product_variant?.product?.name}</p>
                                 <p className="text-[10px] font-black text-white/30 uppercase mt-1">Varian: {item.product_variant?.name}</p>
                              </td>
                              <td className="px-8 py-6 text-sm text-white/60 font-black">{item.quantity}x</td>
                              <td className="px-8 py-6 text-right text-sm font-black text-white italic">Rp {Number(item.price * item.quantity).toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               {/* Order Totals & Controls */}
               <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  <div className="md:col-span-7 space-y-8">
                     <div className="p-8 bg-accent/5 border border-accent/10 rounded-3xl">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-6">Pembaruan Status Protokol</h4>
                        <div className="flex flex-wrap gap-3">
                           {Object.keys(statusConfig).map((status) => (
                              <button
                                key={status}
                                onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, status })}
                                disabled={updateStatusMutation.isPending || selectedOrder.status === status}
                                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                  selectedOrder.status === status 
                                    ? 'bg-accent text-white border-accent cursor-default opacity-50' 
                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white hover:border-accent/40'
                                }`}
                              >
                                {statusConfig[status].label}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  <div className="md:col-span-5 space-y-4 font-body">
                     <div className="flex justify-between text-sm">
                        <span className="text-white/40 font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-white font-black">Rp {Number(selectedOrder.total_price - selectedOrder.shipping_cost).toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-white/40 font-bold uppercase tracking-widest">Biaya Pengiriman</span>
                        <span className="text-white font-black">Rp {Number(selectedOrder.shipping_cost).toLocaleString()}</span>
                     </div>
                     <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                        <span className="text-xs font-black text-accent uppercase tracking-[0.2em]">Total Akhir</span>
                        <span className="text-3xl font-black text-white italic leading-none">Rp {Number(selectedOrder.total_price).toLocaleString()}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="px-12 py-8 border-t border-white/5 flex justify-between items-center bg-[#111] shrink-0">
               <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                  <Printer className="w-4 h-4" /> CETAK INVOICE
               </button>
               <button onClick={() => setIsDetailsOpen(false)} className="px-8 py-4 bg-white text-black font-display font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-white transition-all shadow-2xl active:scale-95">
                  TUTUP MANIFEST
               </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default OrderManagement;
