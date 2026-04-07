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
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/pages/Admin/components/AdminModal';
import { useQuery, useMutation } from '@tanstack/react-query';

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  pending: { label: 'PENDING', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
  processing: { label: 'PROCESSING', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Zap },
  shipped: { label: 'SHIPPED', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Truck },
  completed: { label: 'COMPLETED', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 },
  cancelled: { label: 'CANCELLED', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
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
      toast.success('TRANSACTION_STATUS_UPDATED');
      refetch();
      setIsDetailsOpen(false);
    }
  });

  const getStatusColor = (status: string) => {
    return statusConfig[status]?.color || 'text-white/20';
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              ORDER <span className="text-accent underline decoration-4 underline-offset-8">TERMINAL</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Transaction Manifest & Logistics Control Hub</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="bg-white/5 border border-white/5 rounded-2xl px-6 py-4 flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Live Processing</span>
                <span className="text-xl font-black text-accent italic">{orders.filter((o: any) => o.status === 'processing').length} NODES</span>
             </div>
          </div>
        </div>

        {/* Filters and Search Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH BY ORDER ID, CUSTOMER, OR TRACKING..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
            />
          </div>
          <div className="lg:col-span-5 flex gap-4 overflow-x-auto no-scrollbar">
            {['all', 'pending', 'processing', 'shipped', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`h-16 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                  statusFilter === status 
                    ? 'bg-accent text-white border-accent shadow-2xl shadow-accent/20' 
                    : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Ledger */}
        <div className="bg-white/[0.02] rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden min-h-[600px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-8" />
               <p className="text-[12px] uppercase font-black tracking-[0.4em]">Synchronizing Order Stream...</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">ORDER_ID</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">CONSIGNEE</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">VALUATION</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">STATUS</th>
                    <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.3em] text-white/20">ACTION</th>
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
                            {order.status}
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button 
                          onClick={() => { setSelectedOrder(order); setIsDetailsOpen(true); }}
                          className="h-12 px-6 bg-white/[0.05] hover:bg-accent text-white border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          VIEW MANIFEST
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
               <h3 className="text-2xl font-display font-black uppercase tracking-tighter italic">No Active Nodes</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2">The order ledger is currently empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* View Order Modal — Portalled Hub */}
      <AnimatePresence>
        {isDetailsOpen && selectedOrder && (
          <AdminModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} maxWidth="max-w-5xl">
            {/* Modal Header */}
            <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-[#111] shrink-0">
               <div>
                  <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic text-white">
                    ORDER <span className="text-accent underline decoration-4 underline-offset-8">MANIFEST</span>
                  </h3>
                  <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Active Transaction ID: {selectedOrder.id}</p>
               </div>
               <button onClick={() => setIsDetailsOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all group">
                  <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
               </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#0B0B0B] scrollbar-stealth font-body">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Shipping Column */}
                  <div className="space-y-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                           <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-white">Consignee Intelligence</h4>
                     </div>
                     <div className="space-y-6">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Full Name</span>
                           <p className="text-white text-lg font-black italic">{selectedOrder.address?.recipient_name || selectedOrder.user?.name}</p>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Contact Protocol</span>
                           <p className="text-white/60 text-sm font-medium">{selectedOrder.address?.phone || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Geoloc Address</span>
                           <p className="text-white/60 text-sm font-medium leading-relaxed">{selectedOrder.address?.address}, {selectedOrder.address?.city?.name || 'N/A'}</p>
                        </div>
                     </div>
                  </div>

                  {/* Pricing Column */}
                  <div className="space-y-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                           <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-white">Transaction Metadata</h4>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Base Total</span>
                           <span className="text-white font-black italic text-lg">Rp {Number(selectedOrder.total_price || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Status Node</span>
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 block font-bold">System Override Protocol</label>
                            <select 
                               value={selectedOrder.status} 
                               onChange={(e) => updateStatusMutation.mutate({ id: selectedOrder.id, status: e.target.value })}
                               className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-6 text-[11px] font-black uppercase tracking-widest text-white outline-none focus:border-accent appearance-none cursor-pointer"
                            >
                               <option value="pending" className="bg-[#111]">Pending</option>
                               <option value="processing" className="bg-[#111]">Processing</option>
                               <option value="shipped" className="bg-[#111]">Shipped</option>
                               <option value="completed" className="bg-[#111]">Completed</option>
                               <option value="cancelled" className="bg-[#111]">Cancelled</option>
                            </select>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Item Manifest */}
               <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 px-4 h-fit">Item Manifest Data</h4>
                  <div className="space-y-4">
                     {selectedOrder.items?.map((item: any) => (
                        <div key={item.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-accent/40 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                                 {item.product_variant?.product?.primary_image?.image_url && (
                                    <img 
                                      src={`${import.meta.env.VITE_API_BASE_URL}/storage/${item.product_variant.product.primary_image.image_url}`} 
                                      alt="" 
                                      className="w-full h-full object-cover" 
                                    />
                                 )}
                              </div>
                              <div>
                                 <h5 className="text-[13px] font-black uppercase tracking-tight text-white mb-1">
                                    {item.product_variant?.product?.name || 'Unknown Product'}
                                 </h5>
                                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                    Variant: {item.product_variant?.name || 'Default'} × {item.quantity}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-white italic">Rp {Number(item.price || 0).toLocaleString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Modal Footer */}
            <div className="px-12 py-10 border-t border-white/5 flex items-center justify-between bg-[#111] shrink-0">
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Authorized Access Console</p>
               <button onClick={() => setIsDetailsOpen(false)} className="h-16 px-12 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-accent hover:text-white transition-all italic">
                  CLOSE_MANIFEST
               </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default OrderManagement;