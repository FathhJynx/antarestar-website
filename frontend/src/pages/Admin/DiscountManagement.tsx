import React, { useState } from 'react';
import {
  Ticket, Plus, Edit2, Trash2, Calendar, Clock, CheckCircle2, XCircle,
  Tag, Hash, Layers, ArrowRight, TrendingDown, Info, ChevronRight, X, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/pages/Admin/components/AdminModal';
import ConfirmModal from '@/pages/Admin/components/ConfirmModal';
import { useQuery, useMutation } from '@tanstack/react-query';

const DiscountManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
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

  const couponMutation = useMutation({
    mutationFn: (data: any) => {
      const submissionData = {
        ...data,
        value: Number(data.value),
        min_purchase: Number(data.min_purchase),
        max_discount: Number(data.max_discount),
        usage_limit: data.usage_limit ? Number(data.usage_limit) : null
      };
      return editingCoupon 
        ? api.put(`/admin/coupons/${editingCoupon.id}`, submissionData)
        : api.post('/admin/coupons', submissionData);
    },
    onSuccess: () => {
      toast.success(editingCoupon ? 'COUPON_PROTOCOL_UPDATED' : 'NEW_COUPON_DEPLOYED');
      refetchCoupons();
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'COUPON_SYNC_FAILED');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    couponMutation.mutate(formData);
  };

  const handleDelete = (id: string, code: string) => { setDeleteConfig({ id, code }); setIsConfirmOpen(true); };

  const onConfirmDelete = async () => {
    const t = toast.loading('TERMINATING_VOUCHER...');
    try {
      await api.delete(`/admin/coupons/${deleteConfig.id}`);
      toast.success(`${deleteConfig.code} ERASED.`, { id: t });
      refetchCoupons();
      setIsConfirmOpen(false);
    } catch { toast.error('ERASE_FAILED.', { id: t }); }
  };

  const handleOpenModal = (coupon: any = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code, type: coupon.type, value: Number(coupon.value),
        min_purchase: Number(coupon.min_purchase), max_discount: Number(coupon.max_discount),
        usage_limit: coupon.usage_limit,
        valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().slice(0, 16) : '',
        valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().slice(0, 16) : '',
        is_active: coupon.is_active
      });
    } else {
      setEditingCoupon(null);
      setFormData({ code: '', type: 'percentage', value: '', min_purchase: '', max_discount: '', usage_limit: '', valid_from: '', valid_until: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const toggleStatus = async (coupon: any) => {
    try {
      await api.put(`/admin/coupons/${coupon.id}`, { is_active: !coupon.is_active });
      toast.success(`Coupon signal state: ${!coupon.is_active ? 'ACTIVE' : 'OFFLINE'}`);
      refetchCoupons();
    } catch { toast.error('SIGNAL_UPDATE_FAILED'); }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              PROMO <span className="text-accent underline decoration-4 underline-offset-8">ARSENAL</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Deploy and manage discount vouchers & promo codes</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="h-16 px-10 bg-accent text-white font-display font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            INITIALIZE NEW COUPON
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">ACTIVE COUPONS</p>
            <div className="flex items-center justify-between">
              <h4 className="text-4xl font-display font-black text-white italic">{coupons.filter((c: any) => c.is_active).length}</h4>
              <div className="w-14 h-14 bg-green-400/10 border border-green-400/20 rounded-2xl flex items-center justify-center text-green-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">TOTAL MANAGED</p>
            <div className="flex items-center justify-between">
              <h4 className="text-4xl font-display font-black text-white italic">{coupons.length}</h4>
              <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/30">
                <Hash className="w-7 h-7" />
              </div>
            </div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3 relative z-10 font-bold">SYSTEM_STATUS</p>
            <div className="flex items-center justify-between relative z-10">
              <h4 className="text-accent font-display font-black text-2xl uppercase italic [text-shadow:0_0_20px_rgba(251,133,0,0.4)]">BROADCASTING</h4>
              <TrendingDown className="w-7 h-7 text-accent" />
            </div>
          </div>
        </div>

        {/* Coupon Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
            ))
          ) : coupons.length === 0 ? (
            <div className="col-span-full h-96 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] opacity-30">
              <Ticket className="w-16 h-16 mb-6" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">No discount coupons deployed yet.</p>
            </div>
          ) : coupons.map((coupon: any, idx: number) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`bg-white/[0.02] border rounded-[2.5rem] p-8 group hover:border-accent/20 transition-all relative overflow-hidden font-body ${coupon.is_active ? 'border-white/5' : 'border-white/[0.02] opacity-50'}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${coupon.is_active ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/5 text-white/20'}`}>
                  <Ticket className="w-7 h-7" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(coupon)} className="w-11 h-11 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(coupon.id, coupon.code)} className="w-11 h-11 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-display font-black uppercase tracking-tighter italic text-white group-hover:text-accent transition-colors">{coupon.code}</h3>
                  <button onClick={() => toggleStatus(coupon)}>
                    {coupon.is_active
                      ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                      : <XCircle className="w-5 h-5 text-white/20" />}
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-accent text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-accent/20 italic">
                    {coupon.type === 'percentage' ? `${Number(coupon.value)}% OFF` : `Rp ${Number(coupon.value).toLocaleString('id-ID')} OFF`}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Limit: {coupon.usage_limit || '∞'}</span>
                </div>
                <div className="space-y-3 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/20 flex items-center gap-2 font-bold"><Clock className="w-3.5 h-3.5 text-accent" />TERMINATION</span>
                    <span className="text-white/50 italic">{coupon.valid_until ? new Date(coupon.valid_until).toLocaleDateString() : 'FOREVER'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/20 flex items-center gap-2 font-bold"><ArrowRight className="w-3.5 h-3.5 text-accent" />MIN_VALUATION</span>
                    <span className="text-white/50 italic">Rp {Number(coupon.min_purchase).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-2xl">
        <div className="px-10 py-8 border-b border-white/5 bg-[#111] flex items-center justify-between shrink-0 font-body">
           <div>
              <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic text-white">
                {editingCoupon ? 'RE-SYNC' : 'INITIALIZE'} <span className="text-accent underline decoration-4">VOUCHER</span>
              </h3>
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Deploy temporal discount logic into the core catalog.</p>
           </div>
           <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent transition-all group">
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-[#0B0B0B] scrollbar-stealth font-body">
           <form id="couponForm" onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8 h-fit">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 font-bold"><Tag className="w-4 h-4 text-accent" />Coupons ID Hub</label>
                    <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="BLAST24" className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[14px] font-black tracking-widest text-white outline-none focus:border-accent transition-all font-mono uppercase" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 flex items-center gap-2 font-bold"><Layers className="w-4 h-4 text-accent" />Logic Protocol</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full h-16 px-6 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white/80 outline-none focus:border-accent appearance-none cursor-pointer uppercase">
                       <option value="percentage" className="bg-[#111]">Percentage (%) Hub</option>
                       <option value="fixed" className="bg-[#111]">Fixed Amount (IDR) Hub</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 h-fit">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Valuation Offset</label>
                    <input type="number" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[13px] font-black text-white outline-none focus:border-accent" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Usage Quota</label>
                    <input type="number" value={formData.usage_limit || ''} onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })} placeholder="∞ INFINITE Hub" className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[13px] font-black text-white outline-none focus:border-accent placeholder:text-white/10" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 h-fit">
                 <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Base Threshold Hub</label>
                    <input type="number" value={formData.min_purchase} onChange={(e) => setFormData({ ...formData, min_purchase: e.target.value })} className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[13px] font-black text-white outline-none focus:border-red-500" />
                 </div>
                 <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Ceiling Cap Hub</label>
                    <input type="number" value={formData.max_discount} onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })} className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[13px] font-black text-white outline-none focus:border-red-500" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-8 h-fit">
                 <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold font-bold">Launch Signal Hub</label>
                    <input type="datetime-local" value={formData.valid_from} onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })} className="w-full h-16 px-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white/60 outline-none focus:border-accent" />
                 </div>
                 <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold font-bold">Termination Relay Hub</label>
                    <input type="datetime-local" value={formData.valid_until} onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })} className="w-full h-16 px-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white/60 outline-none focus:border-accent" />
                 </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-accent/5 border border-accent/10 rounded-[2rem] h-fit">
                 <Info className="w-5 h-5 text-accent shrink-0 mt-1" />
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed">By authorizing this coupon, you acknowledge that it will synchronize immediately across all active transaction nodes in the sector.</p>
              </div>
           </form>
        </div>

        <div className="px-10 py-8 border-t border-white/5 bg-[#111] flex items-center justify-between shrink-0 font-body">
           <button type="button" onClick={() => setIsModalOpen(false)} className="h-16 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/20 border border-white/5 hover:text-white hover:bg-white/5 transition-all">ABORT_SYNC</button>
           <button type="submit" form="couponForm" disabled={couponMutation.isPending} className="h-16 px-12 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-accent hover:text-white transition-all shadow-2xl disabled:opacity-50 italic">
              {couponMutation.isPending ? 'PROCESSING_HUB...' : (editingCoupon ? 'SYNC_PROTOCOL' : 'INITIALIZE_DEPLOY Hub')}
           </button>
        </div>
      </AdminModal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="TERMINATE_COUPON Hub"
        message={`AUTHORIZING PERMANENT DELETION OF "${deleteConfig.code}". ALL ACTIVE CART NODES WILL BE INTERRUPTED.`}
        confirmText="EXECUTE_WIPE Hub"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default DiscountManagement;
