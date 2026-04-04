import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ArrowRight,
  TrendingDown,
  Info,
  ChevronRight,
  X,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useQuery } from '@tanstack/react-query';

const FlashSaleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);

  useScrollLock(isModalOpen);
  
  // Product Selection Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Custom Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ id: '', name: '' });

  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  const [productFormData, setProductFormData] = useState({
    product_id: '',
    discount_type: 'percentage',
    discount_value: '' as string | number,
    sale_stock: '' as string | number
  });

  const { data: campaigns = [], isLoading, refetch: refetchCampaigns } = useQuery({
    queryKey: ['admin_flash_sales'],
    queryFn: async () => {
      const response = await api.get('/admin/flash-sales');
      return response.data.data || [];
    },
    refetchInterval: 10000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin_flash_sale_catalog'],
    queryFn: async () => {
      const response = await api.get('/products');
      return response.data.data.data || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Mensinkronkan data Flash Sale...');
    try {
      if (editingCampaign) {
        await api.put(`/admin/flash-sales/${editingCampaign.id}`, formData);
        toast.success('Kampanye Flash Sale diperbarui.', { id: loadingToast });
      } else {
        await api.post('/admin/flash-sales', formData);
        toast.success('Kampanye Flash Sale baru berhasil dibuat.', { id: loadingToast });
      }
      setIsModalOpen(false);
      refetchCampaigns();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operasi gagal', { id: loadingToast });
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaignId) return;
    
    const loadingToast = toast.loading('Menambahkan produk ke Flash Sale...');
    try {
      await api.post('/admin/flash-sale-products', {
        ...productFormData,
        discount_value: Number(productFormData.discount_value),
        sale_stock: Number(productFormData.sale_stock),
        flash_sale_id: selectedCampaignId
      });
      toast.success('Produk ditambahkan ke kampanye.', { id: loadingToast });
      setIsProductModalOpen(false);
      refetchCampaigns(); // Refresh to see new products in list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan produk', { id: loadingToast });
    }
  };

  const handleRemoveProduct = async (productRelationId: string) => {
    const loadingToast = toast.loading('Menghapus produk dari Flash Sale...');
    try {
      await api.delete(`/admin/flash-sale-products/${productRelationId}`);
      toast.success('Produk dihapus dari kampanye.', { id: loadingToast });
      refetchCampaigns();
    } catch (err) {
      toast.error('Gagal menghapus produk.', { id: loadingToast });
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfig({ id, name });
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const loadingToast = toast.loading('Menonaktifkan kampanye Flash Sale...');
    try {
      await api.delete(`/admin/flash-sales/${deleteConfig.id}`);
      toast.success(`Kampanye ${deleteConfig.name} telah dihapus.`, { id: loadingToast });
      refetchCampaigns();
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error('Gagal menghapus kampanye.', { id: loadingToast });
    }
  };

  const handleOpenModal = (campaign: any = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        name: campaign.name,
        start_date: campaign.start_date ? new Date(campaign.start_date).toISOString().slice(0, 16) : '',
        end_date: campaign.end_date ? new Date(campaign.end_date).toISOString().slice(0, 16) : '',
        is_active: campaign.is_active
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        is_active: true
      });
      setProductFormData({
        product_id: '',
        discount_type: 'percentage',
        discount_value: '',
        sale_stock: ''
      });
    }
    setIsModalOpen(true);
  };

  const toggleStatus = async (campaign: any) => {
    try {
      await api.put(`/admin/flash-sales/${campaign.id}`, { is_active: !campaign.is_active });
      toast.success(`Kampanye ${!campaign.is_active ? 'diaktifkan' : 'dinonaktifkan'}.`);
      refetchCampaigns();
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
              Kelola <span className="text-red-500">Flash Sale</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Atur kampanye harga kilat dan stok terbatas.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-12 px-8 bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center gap-2 shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Buat Kampanye Baru
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Kampanye Berjalan</p>
              <div className="flex items-center justify-between">
                 <h4 className="text-2xl font-display font-black text-slate-900">
                    {campaigns.filter(c => {
                       const now = new Date();
                       return c.is_active && new Date(c.start_date) <= now && new Date(c.end_date) >= now;
                    }).length}
                 </h4>
                 <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                    <Zap className="w-5 h-5 fill-current" />
                 </div>
              </div>
           </div>
           <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Produk Sale</p>
              <div className="flex items-center justify-between">
                 <h4 className="text-2xl font-display font-black text-slate-900">
                    {campaigns.reduce((acc, c) => acc + (c.products?.length || 0), 0)}
                 </h4>
                 <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <Package className="w-5 h-5" />
                 </div>
              </div>
           </div>
           <div className="bg-red-600 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <p className="text-[9px] font-black uppercase tracking-widest text-red-200 mb-2">Urutan Prioritas</p>
              <div className="flex items-center justify-between relative z-10">
                 <h4 className="text-2xl font-display font-black text-white italic uppercase">High Speed</h4>
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
                    <TrendingDown className="w-5 h-5" />
                 </div>
              </div>
           </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-6">
           {isLoading ? (
              [...Array(2)].map((_, i) => (
                 <div key={i} className="h-48 bg-white border border-slate-200 rounded-[2.5rem] animate-pulse" />
              ))
           ) : campaigns.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                 <Zap className="w-16 h-16 text-slate-200 mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Tidak ada kampanye flash sale.</p>
              </div>
           ) : campaigns.map((campaign, idx) => (
              <motion.div 
                 key={campaign.id} 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
              >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                     {/* Campaign Info */}
                     <div className="lg:w-1/3 border-r border-slate-50 pr-8">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-xl font-display font-black uppercase tracking-tight italic text-slate-900">{campaign.name}</h3>
                           <button onClick={() => toggleStatus(campaign)}>
                              {campaign.is_active ? 
                                 <CheckCircle2 className="w-4 h-4 text-green-500" /> : 
                                 <XCircle className="w-4 h-4 text-slate-300" />
                              }
                           </button>
                        </div>
                        <div className="space-y-3 mb-6">
                           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              <Calendar className="w-4 h-4" /> {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              <Clock className="w-4 h-4" /> {new Date(campaign.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(campaign.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => handleOpenModal(campaign)} className="h-10 px-4 bg-slate-50 text-slate-600 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2">
                              <Edit2 className="w-3 h-3" /> Edit Campaign
                           </button>
                           <button onClick={() => handleDelete(campaign.id, campaign.name)} className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>

                     {/* Products Section */}
                     <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Produk Terikat <span>({campaign.products?.length || 0})</span></h4>
                           <button 
                             onClick={() => { setSelectedCampaignId(campaign.id); setIsProductModalOpen(true); }}
                             className="h-8 px-4 border border-red-100 text-red-500 font-black uppercase text-[9px] tracking-widest rounded-lg hover:bg-red-50 transition-all flex items-center gap-2"
                           >
                              <PlusCircle className="w-3 h-3" /> Tambah Produk
                           </button>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                           {campaign.products && campaign.products.length > 0 ? (
                              campaign.products.map((p: any) => (
                                 <div key={p.id} className="w-48 shrink-0 bg-slate-50 border border-slate-100 rounded-2xl p-4 group/item relative overflow-hidden">
                                    <button 
                                      onClick={() => handleRemoveProduct(p.id)}
                                      className="absolute top-2 right-2 w-6 h-6 bg-white text-red-500 rounded-lg shadow-sm flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity z-10"
                                    >
                                       <MinusCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden flex items-center justify-center p-2">
                                       <img src={p.product?.primary_image?.image_url || 'https://via.placeholder.com/100'} alt={p.product?.name} className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-900 truncate mb-1">{p.product?.name}</p>
                                    <div className="flex flex-col gap-1">
                                       <div className="flex items-center justify-between">
                                          <span className="text-[11px] font-black text-red-600">
                                             {p.discount_type === 'percentage' ? `${p.discount_value}% OFF` : `Potongan Rp ${Number(p.discount_value).toLocaleString('id-ID')}`}
                                          </span>
                                          <span className="text-[9px] font-bold text-slate-400">Stok: {p.sale_stock}</span>
                                       </div>
                                       <div className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">Berlaku untuk semua varian</div>
                                    </div>
                                 </div>
                              ))
                           ) : (
                              <div className="w-full py-10 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                 <Package className="w-6 h-6 text-slate-300 mb-2" />
                                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Belum ada produk</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
              </motion.div>
           ))}
        </div>
      </div>

      {/* Campaign Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="bg-white rounded-[2rem] w-full max-w-lg p-8 relative z-10 shadow-2xl overflow-hidden border border-slate-100">
                <div className="mb-6 flex items-center justify-between relative z-10">
                   <div>
                      <h3 className="font-display font-black text-xl uppercase tracking-tighter italic leading-none">
                         {editingCampaign ? 'Update' : 'Launch'} <span className="text-red-500">Flash Sale</span>
                      </h3>
                      <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-2">Atur parameter waktu kampanye kilat.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Kampanye</label>
                      <input 
                        type="text" required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. MEGA SALE MUDIK 2024"
                        className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-display uppercase italic"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Waktu Mulai</label>
                         <input 
                           type="datetime-local" required
                           value={formData.start_date}
                           onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Waktu Berakhir</label>
                         <input 
                           type="datetime-local" required
                           value={formData.end_date}
                           onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                         />
                      </div>
                   </div>

                   <div className="flex items-center gap-3 p-4 bg-red-50/50 rounded-3xl border border-red-100">
                      <Info className="w-5 h-5 text-red-500" />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Sistem akan otomatis menghitung mundur beranda user saat kampanye dimulai.</p>
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Batal</button>
                      <button type="submit" className="flex-[2] h-14 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">Simpan Kampanye</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProductModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-xl p-10 relative z-10 shadow-2xl overflow-hidden">
                <div className="mb-8 flex items-center justify-between">
                   <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic leading-none">Pilih Produk <span className="text-red-500">Sale</span></h3>
                   <button onClick={() => setIsProductModalOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <form onSubmit={handleAddProduct} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pilih Produk</label>
                      <select 
                        required
                        value={productFormData.product_id}
                        onChange={(e) => setProductFormData({ ...productFormData, product_id: e.target.value })}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all appearance-none"
                      >
                         <option value="">Pilih Produk...</option>
                         {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                         ))}
                      </select>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Diskon</label>
                         <select 
                           value={productFormData.discount_type}
                           onChange={(e) => setProductFormData({ ...productFormData, discount_type: e.target.value })}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                         >
                            <option value="percentage">Persentase (%)</option>
                            <option value="fixed">Nominal Tetap (Rp)</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nilai Diskon</label>
                         <input 
                           type="number" required
                           value={productFormData.discount_value}
                           onChange={(e) => setProductFormData({ ...productFormData, discount_value: e.target.value })}
                           placeholder={productFormData.discount_type === 'percentage' ? "e.g. 20" : "e.g. 50000"}
                           className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stok Sale (Total)</label>
                      <input 
                        type="number" required
                        value={productFormData.sale_stock}
                        onChange={(e) => setProductFormData({ ...productFormData, sale_stock: e.target.value })}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
                      />
                   </div>

                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsProductModalOpen(false)} className="flex-1 h-14 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Batal</button>
                      <button type="submit" className="flex-[2] h-14 bg-red-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">Tambahkan ke Sale</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="Hapus Kampanye"
        message={`Apakah Anda yakin ingin menghapus kampanye ${deleteConfig.name}? Semua data produk terikat didalamnya juga akan dihapus dari antrian Flash Sale.`}
        confirmText="Hapus Selamanya"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default FlashSaleManagement;
