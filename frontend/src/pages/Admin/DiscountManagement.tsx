import React, { useEffect, useState } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
  Hash,
  Layers,
  ArrowRight,
  TrendingDown,
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import { useQuery } from '@tanstack/react-query';

const DiscountManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  
  // Custom Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ id: '', code: '' });

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '' as string | number,
    min_purchase: '' as string | number,
    max_discount: '' as string | number,
    usage_limit: '' as string | number | null,
    valid_from: '',
    valid_until: '',
    is_active: true
  });

  const { data: coupons = [], isLoading, refetch: refetchCoupons } = useQuery({
    queryKey: ['admin_coupons'],
    queryFn: async () => {
      const response = await api.get('/admin/coupons');
      return response.data.data.data || [];
    },
    refetchInterval: 10000,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Mensinkronkan data promosi...');
    try {
      const submissionData = {
        ...formData,
        value: Number(formData.value),
        min_purchase: Number(formData.min_purchase),
        max_discount: Number(formData.max_discount),
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null
      };

      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon.id}`, submissionData);
        toast.success('Kupon diperbarui.', { id: loadingToast });
      } else {
        await api.post('/admin/coupons', submissionData);
        toast.success('Kupon baru berhasil dibuat.', { id: loadingToast });
      }
      setIsModalOpen(false);
      refetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kupon', { id: loadingToast });
    }
  };

  const handleDelete = (id: string, code: string) => {
    setDeleteConfig({ id, code });
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const loadingToast = toast.loading('Menonaktifkan kupon promosi...');
    try {
      await api.delete(`/admin/coupons/${deleteConfig.id}`);
      toast.success(`${deleteConfig.code} telah dihapus.`, { id: loadingToast });
      refetchCoupons();
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error('Gagal menghapus kupon.', { id: loadingToast });
    }
  };

  const handleOpenModal = (coupon: any = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
        min_purchase: Number(coupon.min_purchase),
        max_discount: Number(coupon.max_discount),
        usage_limit: coupon.usage_limit,
        valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().slice(0, 16) : '',
        valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().slice(0, 16) : '',
        is_active: coupon.is_active
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        min_purchase: '',
        max_discount: '',
        usage_limit: '',
        valid_from: '',
        valid_until: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const toggleStatus = async (coupon: any) => {
    try {
      await api.put(`/admin/coupons/${coupon.id}`, { is_active: !coupon.is_active });
      toast.success(`Kupon ${!coupon.is_active ? 'diaktifkan' : 'dinonaktifkan'}.`);
      refetchCoupons();
    } catch (err) {
      toast.error('Gagal memperbarui status.');
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Kelola <span className="text-accent text-lg">Promosi & Voucher</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Atur kode diskon dan kupon belanja pelanggan.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-12 px-8 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center gap-2 shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Buat Kupon Baru
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Kupon Aktif</p>
              <div className="flex items-center justify-between">
                 <h4 className="text-2xl font-display font-black text-slate-900">{coupons.filter(c => c.is_active).length}</h4>
                 <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                 </div>
              </div>
           </div>
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Terkelola</p>
              <div className="flex items-center justify-between">
                 <h4 className="text-2xl font-display font-black text-slate-900">{coupons.length}</h4>
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Hash className="w-5 h-5" />
                 </div>
              </div>
           </div>
           <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Performa Promosi</p>
              <div className="flex items-center justify-between relative z-10">
                 <h4 className="text-2xl font-display font-black text-accent">Aktif</h4>
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-accent">
                    <TrendingDown className="w-5 h-5" />
                 </div>
              </div>
           </div>
        </div>

        {/* Coupon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {isLoading ? (
              [...Array(3)].map((_, i) => (
                 <div key={i} className="h-64 bg-white border border-slate-200 rounded-[2.5rem] animate-pulse" />
              ))
           ) : coupons.length === 0 ? (
              <div className="col-span-full h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                 <Ticket className="w-16 h-16 text-slate-200 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Belum ada kupon diskon yang dibuat.</p>
              </div>
           ) : coupons.map((coupon, idx) => (
              <motion.div 
                 key={coupon.id} 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 className={`bg-white border-2 rounded-[2.5rem] p-8 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden ${coupon.is_active ? 'border-slate-100' : 'border-slate-50 opacity-60'}`}
              >
                 <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 transition-colors ${coupon.is_active ? 'bg-accent/10' : 'bg-slate-200'}`} />
                 
                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-display font-black border ${coupon.is_active ? 'bg-accent/5 border-accent/10 text-accent' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                       <Ticket className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => handleOpenModal(coupon)} 
                         className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                       >
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(coupon.id, coupon.code)} 
                         className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                       <h3 className="text-xl font-display font-black uppercase tracking-tight italic group-hover:text-accent transition-colors">
                          {coupon.code}
                       </h3>
                       <button onClick={() => toggleStatus(coupon)} className="transition-all">
                          {coupon.is_active ? 
                             <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                             <XCircle className="w-4 h-4 text-slate-300" />
                          }
                       </button>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg">
                          {coupon.type === 'percentage' ? `${Number(coupon.value)}% OFF` : `Rp ${Number(coupon.value).toLocaleString('id-ID')} OFF`}
                       </span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Batas Pemakaian: {coupon.usage_limit || '∞'}</span>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-50">
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400 flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Kedaluwarsa</span>
                          <span className="text-slate-900">{coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'Selamanya'}</span>
                       </div>
                       <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400 flex items-center gap-2"><ArrowRight className="w-3.5 h-3.5" /> Minimal Belanja</span>
                          <span className="text-slate-900">Rp {Number(coupon.min_purchase).toLocaleString('id-ID')}</span>
                       </div>
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-xl p-10 relative z-10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="mb-8 flex items-center justify-between relative z-10">
                   <div>
                      <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic leading-none">
                         {editingCoupon ? 'Atur' : 'Buat'} <span className="text-accent underline">Voucher Diskon</span>
                      </h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Tentukan detail dan masa berlaku kupon.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Tag className="w-3 h-3" /> Kode Kupon</label>
                         <input 
                           type="text" required
                           value={formData.code}
                           onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                           placeholder="e.g. DISKON2024"
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all font-mono"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2"><Layers className="w-3 h-3" /> Tipe Keuntungan</label>
                         <select 
                           value={formData.type}
                           onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all appearance-none"
                         >
                            <option value="percentage">Persentase (%)</option>
                            <option value="fixed">Nilai Tetap (IDR)</option>
                         </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nilai Potongan</label>
                         <input 
                           type="number" required
                           value={formData.value}
                           onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Batas (Boleh Kosong)</label>
                         <input 
                           type="number"
                           value={formData.usage_limit || ''}
                           onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                           placeholder="Tanpa Batas"
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Min. Pembelian</label>
                         <input 
                           type="number"
                           value={formData.min_purchase}
                           onChange={(e) => setFormData({ ...formData, min_purchase: Number(e.target.value) })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Maks. Potongan</label>
                         <input 
                           type="number" 
                           value={formData.max_discount}
                           onChange={(e) => setFormData({ ...formData, max_discount: Number(e.target.value) })}
                           placeholder="0 untuk tanpa batas"
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Berlaku Dari</label>
                         <input 
                           type="datetime-local"
                           value={formData.valid_from}
                           onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Berlaku Sampai</label>
                         <input 
                           type="datetime-local"
                           value={formData.valid_until}
                           onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                         />
                      </div>
                   </div>

                   <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <Info className="w-5 h-5 text-accent" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Kupon ini akan langsung aktif dan bisa digunakan oleh pelanggan sesuai syarat.</p>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Batal</button>
                      <button type="submit" className="flex-[2] h-14 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Simpan Perubahan</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Deletion */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="Penonaktifkan Kupon"
        message={`Apakah Anda yakin ingin menghapus protokol ${deleteConfig.code}? Voucher yang saat ini ada di keranjang penjelajah mungkin menjadi tidak valid.`}
        confirmText="Hapus Protokol"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default DiscountManagement;
