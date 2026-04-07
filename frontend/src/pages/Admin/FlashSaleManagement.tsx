import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Clock, 
  Calendar, 
  Package, 
  PlusCircle, 
  TrendingDown, 
  MinusCircle, 
  CheckCircle2, 
  XCircle, 
  X, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/components/Admin/AdminModal';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import { useQuery, useMutation } from '@tanstack/react-query';

const FlashSaleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  const [productFormData, setProductFormData] = useState({
    product_id: '',
    discount_type: 'percentage',
    discount_value: '',
    sale_stock: ''
  });

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ id: '', name: '' });

  const { data: campaigns = [], isLoading, refetch: refetchCampaigns } = useQuery({
    queryKey: ['admin_flash_sales'],
    queryFn: async () => {
      const response = await api.get('/admin/flash-sales');
      return response.data.data.data || [];
    }
  });

  const { data: products = [] } = useQuery({
    queryKey: ['admin_products_for_sale'],
    queryFn: async () => { const r = await api.get('/products'); return r.data.data.data || []; },
  });

  const createCampaign = useMutation({ mutationFn: (data: any) => api.post('/admin/flash-sales', data) });
  const updateCampaign = useMutation({ mutationFn: ({ id, ...data }: any) => api.put(`/admin/flash-sales/${id}`, data) });

  const handleCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCampaign) {
        await updateCampaign.mutateAsync({ id: editingCampaign.id, ...formData });
        toast.success('CAMPAIGN_UPDATED_IN_REGISTRY');
      } else {
        await createCampaign.mutateAsync(formData);
        toast.success('NEW_CAMPAIGN_DEPLOYED');
      }
      setIsModalOpen(false);
      setEditingCampaign(null);
      setFormData({ name: '', start_date: '', end_date: '', is_active: true });
      refetchCampaigns();
    } catch (error) {
      toast.error('PAYLOAD_REJECTED_BY_SERVER');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = toast.loading('Injecting asset into campaign node...');
    try {
      await api.post(`/admin/flash-sales/${selectedCampaignId}/products`, productFormData);
      toast.success('ASSET_INJECTED_SUCCESSFULLY', { id: t });
      setIsProductModalOpen(false);
      setProductFormData({ product_id: '', discount_type: 'percentage', discount_value: '', sale_stock: '' });
      refetchCampaigns();
    } catch (err: any) {
      toast.error('INJECTION_FAILED', { id: t });
    }
  };

  const handleRemoveProduct = async (id: string) => {
    if (!confirm('TERMINATE_ASSET_FROM_CAMPAIGN?')) return;
    const t = toast.loading('Removing node...');
    try {
      await api.delete(`/admin/flash-sales/products/${id}`);
      toast.success('NODE_ERASED', { id: t });
      refetchCampaigns();
    } catch (err) { toast.error('ERASE_FAILED', { id: t }); }
  };

  const toggleStatus = async (campaign: any) => {
    try {
      await api.put(`/admin/flash-sales/${campaign.id}`, { 
        ...campaign, 
        is_active: !campaign.is_active 
      });
      toast.success(`Broadcasting state toggled for ${campaign.name}`);
      refetchCampaigns();
    } catch (err) { toast.error('Signal transmission failed.'); }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfig({ id, name });
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const t = toast.loading('Wiping campaign from system...');
    try {
      await api.delete(`/admin/flash-sales/${deleteConfig.id}`);
      toast.success('Campaign terminated.', { id: t });
      refetchCampaigns();
      setIsConfirmOpen(false);
    } catch (err) { toast.error('Termination sequence failed.', { id: t }); }
  };

  const handleOpenModal = (campaign: any = null) => {
    if (campaign) {
      setEditingCampaign(campaign);
      setFormData({
        name: campaign.name,
        start_date: new Date(campaign.start_date).toISOString().slice(0, 16),
        end_date: new Date(campaign.end_date).toISOString().slice(0, 16),
        is_active: campaign.is_active
      });
    } else {
      setEditingCampaign(null);
      setFormData({ name: '', start_date: '', end_date: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-12 font-body">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic text-white shadow-red-500/10">
              FLASH <span className="text-red-600 underline decoration-4 underline-offset-8">SALE</span> CTR
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">High-Velocity Temporal Campaign Terminal</p>
          </div>
          <button onClick={() => handleOpenModal()} className="h-16 px-10 bg-red-600 shadow-2xl shadow-red-600/20 text-white font-display font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all group">
            <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" /> 
            INITIALIZE NEW CAMPAIGN
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">ACTIVE_CAMPAIGNS</p>
            <div className="flex items-center justify-between">
              <h4 className="text-4xl font-display font-black text-white italic">{campaigns.filter((c: any) => c.is_active).length}</h4>
              <div className="w-14 h-14 bg-red-500/10 border border-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                <Clock className="w-7 h-7" />
              </div>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">PRODUCTS ON SALE</p>
            <div className="flex items-center justify-between">
              <h4 className="text-4xl font-display font-black text-white italic">
                {campaigns.reduce((acc: number, c: any) => acc + (c.products?.length || 0), 0)}
              </h4>
              <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-white/30">
                <Package className="w-7 h-7" />
              </div>
            </div>
          </div>
          <div className="bg-red-600 rounded-[2rem] p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-red-100 mb-3 relative z-10 font-bold">PRIORITY_MODE</p>
            <div className="flex items-center justify-between relative z-10">
              <h4 className="text-2xl font-display font-black text-white italic uppercase">HIGH SPEED Hub</h4>
              <TrendingDown className="w-7 h-7 text-white/60" />
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="space-y-6">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="h-56 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
            ))
          ) : campaigns?.map((campaign: any, idx: number) => {
            const now = new Date();
            const isLive = campaign.is_active && new Date(campaign.start_date) <= now && new Date(campaign.end_date) >= now;
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 hover:border-red-500/20 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                  {/* Campaign Info */}
                  <div className="lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-white/20'}`} />
                      <h3 className="text-xl font-display font-black uppercase tracking-tight italic text-white group-hover:text-red-400 transition-colors uppercase">{campaign.name}</h3>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        <Calendar className="w-4 h-4 text-red-500" />
                        {new Date(campaign.start_date).toLocaleDateString()} Hub {'->'} {new Date(campaign.end_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        <Clock className="w-4 h-4 text-red-500" />
                        {new Date(campaign.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} Hub - {new Date(campaign.end_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      {isLive && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-green-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />BROADCASTING LIVE
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModal(campaign)} className="h-11 px-5 bg-white/5 border border-white/5 text-white/40 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:border-white/20 hover:text-white transition-all flex items-center gap-2">
                        <Edit2 className="w-4 h-4" />EDIT
                      </button>
                      <button onClick={() => handleDelete(campaign.id, campaign.name)} className="w-11 h-11 flex items-center justify-center bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/20 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 font-bold">ASSETS ({campaign.products?.length || 0})</h4>
                      <button
                        onClick={() => { setSelectedCampaignId(campaign.id); setIsProductModalOpen(true); }}
                        className="h-9 px-5 border border-red-500/30 text-red-400 bg-red-500/10 font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4" />ADD Hub
                      </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                      {campaign.products?.map((p: any) => (
                        <div key={p.id} className="w-48 shrink-0 bg-white/[0.03] border border-white/5 rounded-2xl p-4 group/item relative overflow-hidden transition-all shadow-xl">
                          <button
                            onClick={() => handleRemoveProduct(p.id)}
                            className="absolute top-3 right-3 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all z-10 shadow-lg"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <div className="w-full h-32 rounded-xl bg-black/40 border border-white/5 overflow-hidden mb-4">
                             {p.product?.images?.[0] && <img src={p.product.images[0].image_url} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <h5 className="text-[11px] font-black text-white/80 uppercase truncate italic">{p.product?.name}</h5>
                          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-1">OFF {p.discount_type === 'percentage' ? `${p.discount_value}%` : `Rp ${Number(p.discount_value).toLocaleString()}`}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-lg">
        <div className="px-10 py-8 border-b border-white/5 bg-[#111] flex items-center justify-between shrink-0 font-body">
           <div>
              <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic text-white uppercase italic">
                {editingCampaign ? 'RE-SYNC' : 'INITIALIZE'} <span className="text-red-500 underline decoration-4 underline-offset-8">CAMPAIGN</span>
              </h3>
              <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mt-2">Deploy temporal flash sale node.</p>
           </div>
           <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 transition-all">
              <X className="w-7 h-7" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 font-body">
           <form id="campaignForm" onSubmit={handleCampaignSubmit} className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Campaign Designation</label>
                 <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. MEGA FLASH SALE 2025" className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white uppercase tracking-wider outline-none focus:border-red-500 transition-all italic" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Start Signal</label>
                    <input type="datetime-local" required value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="w-full h-16 px-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white outline-none focus:border-red-500 transition-all" />
                 </div>
                 <div className="space-y-3 text-right">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Termination Time Hub</label>
                    <input type="datetime-local" required value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} className="w-full h-16 px-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white outline-none focus:border-red-500 transition-all" />
                 </div>
              </div>
           </form>
        </div>

        <div className="px-10 py-8 border-t border-white/5 bg-[#111] flex items-center justify-between shrink-0 font-body">
           <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Authorized Deploy State Hub</p>
           <button type="submit" form="campaignForm" className="h-16 px-12 bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-xl italic">
              DEPLO Hub
           </button>
        </div>
      </AdminModal>

      <AdminModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} maxWidth="max-w-xl">
          <div className="px-10 py-8 border-b border-white/5 bg-[#111] flex items-center justify-between shrink-0 font-body">
              <div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic text-white italic">
                      ADD <span className="text-red-500 underline decoration-4 underline-offset-4">PRODUCT Hub</span>
                  </h3>
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic font-bold">Link asset to current flash campaign node Hub.</p>
              </div>
               <button onClick={() => setIsProductModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 transition-all">
                  <X className="w-6 h-6" />
               </button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 font-body">
              <form id="addProductForm" onSubmit={handleAddProduct} className="space-y-8 h-fit">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Asset Selection Hub</label>
                      <div className="relative">
                          <select required value={productFormData.product_id} onChange={(e) => setProductFormData({ ...productFormData, product_id: e.target.value })} className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white outline-none focus:border-red-500 appearance-none cursor-pointer uppercase">
                              <option value="" className="bg-[#111]">SELECT ASSET Hub</option>
                              {products.map((p: any) => (
                                  <option key={p.id} value={p.id} className="bg-[#111] font-body">{p.name.toUpperCase()}</option>
                              ))}
                          </select>
                          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/20" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 h-fit">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Disc. Protocol</label>
                          <select value={productFormData.discount_type} onChange={(e) => setProductFormData({ ...productFormData, discount_type: e.target.value })} className="w-full h-16 px-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white outline-none focus:border-red-500 appearance-none uppercase">
                              <option value="percentage" className="bg-[#111]">Percentage % Hub</option>
                              <option value="fixed" className="bg-[#111]">Fixed Amount RP Hub</option>
                          </select>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold h-fit">Valuation Override Hub</label>
                          <input type="number" required value={productFormData.discount_value} onChange={(e) => setProductFormData({ ...productFormData, discount_value: e.target.value })} className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white outline-none focus:border-red-500" placeholder="VALUE..." />
                      </div>
                  </div>
                  <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Allocation Stock Hub</label>
                      <input type="number" required value={productFormData.sale_stock} onChange={(e) => setProductFormData({ ...productFormData, sale_stock: e.target.value })} className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white outline-none focus:border-red-500" placeholder="QTY..." />
                  </div>
              </form>
          </div>
          <div className="px-10 py-8 border-t border-white/5 bg-[#111] flex items-center justify-end font-body">
              <button type="submit" form="addProductForm" className="h-16 px-12 bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-black transition-all shadow-xl italic">
                  INJECT ASSET Hub
              </button>
          </div>
      </AdminModal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmDelete}
        title="DELETE CAMPAIGN Hub"
        message={`Delete campaign "${deleteConfig.name}"? All linked product flash prices will be terminated.`}
        confirmText="DELETE CAMPAIGN Hub"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default FlashSaleManagement;
