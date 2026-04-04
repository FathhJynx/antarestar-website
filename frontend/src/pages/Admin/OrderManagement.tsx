import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  X,
  User,
  MapPin,
  Calendar,
  CreditCard,
  ExternalLink,
  PackageCheck,
  Star,
  Camera,
  Loader2,
  Save,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useQuery } from '@tanstack/react-query';

const OrderManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdParam = searchParams.get('user_id');

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useScrollLock(isDetailModalOpen);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: orders = [], isLoading, refetch: fetchOrders } = useQuery({
    queryKey: ['admin_orders', search, statusFilter, userIdParam],
    queryFn: async () => {
      const response = await api.get('/admin/orders', {
        params: { search, status: statusFilter, user_id: userIdParam || undefined }
      });
      return response.data?.data?.data || [];
    },
    refetchInterval: 10000, // Real-time order monitoring every 10 seconds
  });

  const fetchOrderDetail = async (id: string) => {
    try {
      const response = await api.get(`/orders/${id}`);
      setSelectedOrder(response.data.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      toast.error('Gagal mengambil detail pesanan');
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const loadingToast = toast.loading('Memperbarui status...');
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success(`Status pesanan diperbarui ke ${status}`, { id: loadingToast });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        fetchOrderDetail(orderId);
      }
    } catch (err) {
      toast.error('Otoritas diperlukan untuk perubahan status', { id: loadingToast });
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-600 border-green-200';
      case 'unpaid': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'shipping': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <AdminLayout>
       <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Manajemen <span className="text-accent text-lg">Pesanan</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pantau dan proses semua pesanan pelanggan di seluruh platform.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-4 shadow-sm">
                <div className="flex items-center gap-2">
                   <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Sistem Aktif</span>
                </div>
             </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan ID Pesanan atau Nama Anggota..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] font-bold outline-none focus:ring-accent/10 focus:ring-4 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[52px] bg-white border border-slate-200 rounded-[1.25rem] pl-10 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-accent/5 transition-all appearance-none cursor-pointer shadow-sm"
              >
                 <option value="all">Semua Status</option>
                 <option value="unpaid">Menunggu Pembayaran</option>
                 <option value="processing">Diproses</option>
                 <option value="shipping">Dikirim</option>
                 <option value="completed">Selesai</option>
                 <option value="cancelled">Dibatalkan</option>
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rotate-90 text-slate-400 pointer-events-none" />
            </div>

            {userIdParam && (
               <button 
                 onClick={() => setSearchParams({})}
                 className="h-[52px] px-6 bg-accent/5 border border-accent/10 rounded-[1.25rem] flex items-center gap-2 text-accent hover:bg-accent/10 transition-all shadow-sm"
               >
                  <X className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Clear Member Filter</span>
               </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {isLoading ? (
             <div className="h-64 flex flex-col items-center justify-center opacity-40 italic">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[10px] uppercase font-black tracking-[0.3em]">Querying order database...</p>
             </div>
          ) : orders.length > 0 ? (
            orders.map((order, idx) => (
              <motion.div 
                key={order.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-md transition-all group overflow-hidden relative"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-2 h-full opacity-30 ${
                   order.status === 'completed' ? 'bg-green-500' :
                   order.status === 'unpaid' ? 'bg-amber-500' :
                   order.status === 'shipping' ? 'bg-blue-500' :
                   'bg-slate-300'
                }`} />

                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-1">
                  <div className="flex items-start gap-5 min-w-[240px]">
                     <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 flex-shrink-0 border border-slate-100">
                        <ShoppingBag className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-[15px] font-black uppercase tracking-tight text-slate-900 group-hover:text-accent transition-colors">#{order.id.substring(0, 8).toUpperCase()}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-widest border shadow-sm ${getStatusStyle(order.status)}`}>
                             {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <User className="w-3 h-3" />
                          {order.user?.name || "Anonymous Member"}
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 xl:gap-16 flex-1 max-w-4xl px-2">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Items Count</p>
                        <p className="text-[13px] font-black text-slate-900 flex items-center gap-2">
                           {order.items?.length || 0} Products
                        </p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Amount</p>
                        <p className="text-[13px] font-black text-slate-900">Rp {Number(order.total_price || 0).toLocaleString('id-ID')}</p>
                     </div>
                     <div className="hidden md:block">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Order Date</p>
                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-none mt-1">
                           {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                     </div>
                     <div className="hidden md:block">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Destination</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate max-w-[150px] flex items-center gap-2">
                           <MapPin className="w-3 h-3 text-slate-300" />
                           {order.address?.city?.name || 'Central Hub'}
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <select 
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-accent/5 transition-all cursor-pointer appearance-none min-w-[130px]"
                        >
                               <option value="unpaid">Menunggu Pembayaran</option>
                              <option value="processing">Diproses</option>
                              <option value="shipping">Dikirim</option>
                              <option value="completed">Selesai</option>
                              <option value="cancelled">Dibatalkan</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                               <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                            </div>
                         </div>
                         <button 
                           onClick={() => fetchOrderDetail(order.id)}
                           title="Lihat Detail Lengkap"
                           className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-accent hover:border-accent hover:bg-accent/5 transition-all shadow-sm"
                         >
                            <ExternalLink className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                 <div className="h-96 flex flex-col items-center justify-center opacity-30 text-center">
                   <ShoppingBag className="w-16 h-16 mb-6" />
                   <h3 className="font-display font-black text-xl uppercase tracking-tighter mb-1">Daftar Pesanan Kosong</h3>
                   <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Belum ada data pesanan yang masuk</p>
                </div>
              )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
         {isDetailModalOpen && selectedOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsDetailModalOpen(false)}
                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
               />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col border border-white/20"
               >
                  {/* Modal Header */}
                  <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                     <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                            <PackageCheck className="w-6 h-6" />
                         </div>
                         <div>
                             <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic">
                               Detail <span className="text-accent underline text-lg">#{selectedOrder.id.substring(0, 8).toUpperCase()}</span>
                             </h3>
                             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Informasi lengkap pesanan dan data pelanggan.</p>
                         </div>
                     </div>
                     <button onClick={() => setIsDetailModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-10">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Column: Line Items */}
                        <div className="lg:col-span-2 space-y-8">
                           <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8">
                              <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 border-l-4 border-accent pl-3 mb-6 leading-none">Rincian Pesanan</h4>
                              <div className="space-y-4">
                                 {selectedOrder.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-5 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                       <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                                          {item.product_variant?.product?.primary_image?.image_url || item.product_variant?.product?.images?.[0]?.image_url ? (
                                            <img src={item.product_variant?.product?.primary_image?.image_url || item.product_variant?.product?.images?.[0]?.image_url} alt="" className="w-full h-full object-cover" />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200"><ShoppingBag className="w-6 h-6" /></div>
                                          )}
                                       </div>
                                       <div className="flex-1">
                                          <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight mb-1">{item.product_variant?.product?.name || 'Unknown Product'}</h5>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.product_variant?.name || 'Default Variant'}</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[13px] font-black text-slate-900">Rp {Number(item.price || 0).toLocaleString('id-ID')}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>

                              <div className="mt-10 pt-8 border-t border-slate-100 space-y-4 px-2">
                                 <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Subtotal Produk</span>
                                    <span>Rp {Number(selectedOrder.total_price + (selectedOrder.discount_amount || 0) - (selectedOrder.shipping_cost || 0)).toLocaleString('id-ID')}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                    <span>Biaya Logistik</span>
                                    <span>Rp {Number(selectedOrder.shipping_cost || 0).toLocaleString('id-ID')}</span>
                                 </div>
                                 {selectedOrder.discount_amount > 0 && (
                                   <div className="flex justify-between items-center text-red-400 font-bold uppercase tracking-widest text-[10px]">
                                      <span>Potongan Voucher</span>
                                      <span>-Rp {Number(selectedOrder.discount_amount || 0).toLocaleString('id-ID')}</span>
                                   </div>
                                 )}
                                 <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <span className="font-display font-black text-lg uppercase tracking-tighter">Total Keseluruhan</span>
                                    <span className="font-display font-black text-2xl text-accent">Rp {Number(selectedOrder.total_price || 0).toLocaleString('id-ID')}</span>
                                 </div>
                              </div>
                           </div>

                           {/* Shipment Logs */}
                           <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8">
                              <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 border-l-4 border-blue-500 pl-3 mb-8 leading-none">Riwayat Pengiriman</h4>
                              <div className="ml-4 space-y-8 relative">
                                 <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200" />
                                 {selectedOrder.shipment_logs?.map((log: any, idx: number) => (
                                    <div key={log.id} className="relative pl-10">
                                       <div className="absolute left-[-4px] top-1 w-2 h-2 rounded-full bg-blue-500 z-10" />
                                       <div className="mb-1 flex items-center justify-between">
                                          <h6 className="text-[11px] font-black uppercase tracking-widest text-slate-900">{log.status.replace('_', ' ')}</h6>
                                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.created_at).toLocaleString()}</p>
                                       </div>
                                       <p className="text-[12px] text-slate-500 font-bold">{log.description}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Right Column: Customer & Shipping */}
                        <div className="space-y-8">
                           {/* Customer Data */}
                           <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 text-white">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                                 <User className="w-3.5 h-3.5 text-accent" /> Data Pelanggan
                              </h4>
                              <div className="space-y-6">
                                 <div>
                                    <p className="text-[20px] font-black tracking-tight leading-none mb-1 italic">{selectedOrder.user?.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Authorized Member ID: {selectedOrder.user?.id.substring(0, 8)}</p>
                                 </div>
                                 <div className="space-y-4 pt-6 border-t border-slate-800">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Clock className="w-4 h-4" /></div>
                                       <div>
                                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Contact</p>
                                          <p className="text-[11px] font-bold text-slate-200">{selectedOrder.user?.email}</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><CreditCard className="w-4 h-4" /></div>
                                        <div>
                                           <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Metode Pembayaran</p>
                                           <p className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">{selectedOrder.payment_method}</p>
                                        </div>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Shipping Destination */}
                           <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                                 <MapPin className="w-3.5 h-3.5 text-slate-500" /> Tujuan Pengiriman
                              </h4>
                              <div className="space-y-4">
                                 <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <p className="text-[13px] font-black text-slate-900 mb-2">{selectedOrder.address?.recipient_name}</p>
                                    <p className="text-[12px] text-slate-500 font-bold leading-relaxed mb-4">
                                       {selectedOrder.address?.address}, {selectedOrder.address?.city?.name}, {selectedOrder.address?.province?.name} {selectedOrder.address?.postal_code}
                                    </p>
                                    <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-400">
                                       <Truck className="w-3.5 h-3.5" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">Standard Land Transport</span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           {/* Quick Actions */}
                           <div className="space-y-3">
                              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Override Status</label>
                              <div className="grid grid-cols-1 gap-2">
                                 <select 
                                    value={selectedOrder.status}
                                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                    className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest shadow-sm outline-none focus:ring-4 focus:ring-accent/10 transition-all cursor-pointer"
                                 >
                                     <option value="unpaid">Tandai Menunggu Pembayaran</option>
                                     <option value="processing">Mulai Proses</option>
                                     <option value="shipping">Kirim Pesanan</option>
                                     <option value="completed">Selesaikan Pesanan</option>
                                     <option value="cancelled">Batalkan Pesanan</option>
                                  </select>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">ID Keamanan: {selectedOrder.id.split('-').join('')}</p>
                     <button 
                       onClick={() => setIsDetailModalOpen(false)}
                       className="px-10 h-12 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
                     >
                        Tutup Detail
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default OrderManagement;
