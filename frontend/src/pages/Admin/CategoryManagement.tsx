import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronRight,
  ArrowUpRight,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import { useQuery } from '@tanstack/react-query';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Custom Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ id: '', name: '' });

  const { data: categories = [], isLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['admin_categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data.data || [];
    },
    refetchInterval: 10000,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slotToast = toast.loading('Uploading niche imagery...');
    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await api.post('/admin/media/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFormData(prev => ({ ...prev, image_url: response.data.data.url }));
      toast.success('Gambar berhasil disinkronkan.', { id: slotToast });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah gambar', { id: slotToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, formData);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await api.post('/admin/categories', formData);
        toast.success('Kategori berhasil dibuat');
      }
      setFormData({ name: '', image_url: '' });
      setEditingCategory(null);
      setIsModalOpen(false);
      refetchCategories();
    } catch (err) {
      toast.error('Operasi gagal');
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteConfig({ id, name });
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const loadingToast = toast.loading('Menghapus kategori...');
    try {
      await api.delete(`/admin/categories/${deleteConfig.id}`);
      toast.success(`Kategori ${deleteConfig.name} telah dihapus.`, { id: loadingToast });
      refetchCategories();
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error('Gagal menghapus kategori.', { id: loadingToast });
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Kategori <span className="text-accent text-lg">Produk</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Organisir perlengkapan Anda ke dalam kategori penjelajah khusus.</p>
          </div>
          <button 
            onClick={() => { setEditingCategory(null); setFormData({ name: '', image_url: '' }); setIsModalOpen(true); }}
            className="h-12 px-8 bg-accent text-white font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Buat Kategori Baru
          </button>
        </div>

        {/* Category List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
             [...Array(6)].map((_, i) => (
                <div key={i} className="h-44 bg-white border border-slate-200 rounded-[2rem] animate-pulse" />
             ))
          ) : categories.map((cat, idx) => (
            <motion.div 
              key={cat.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center text-slate-400 group-hover:text-accent transition-all border border-slate-100">
                     {cat.image_url ? (
                        <img src={cat.image_url} alt="" className="w-full h-full object-cover" />
                     ) : (
                        <FolderOpen className="w-6 h-6" />
                     )}
                  </div>
                 <div className="flex items-center gap-1">
                    <button 
                      onClick={() => { setEditingCategory(cat); setFormData({ name: cat.name, image_url: cat.image_url || '' }); setIsModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                    >
                       <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <Trash2 className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>

              <div className="relative z-10">
                 <h4 className="font-display font-black text-xl uppercase tracking-tighter text-slate-900 mb-1 leading-none group-hover:text-accent transition-colors">{cat.name}</h4>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-6">Slug: {cat.slug}</p>
                 
                 <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{cat.products_count || 0} Produk</span>
                    </div>
                    <button 
                       onClick={() => navigate(`/admin/products?category_id=${cat.id}`)}
                       className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-accent flex items-center gap-1 transition-colors"
                    >
                       Lihat <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

       {/* Deletion Confirmation */}
       <ConfirmModal 
         isOpen={isConfirmOpen}
         onClose={() => setIsConfirmOpen(false)}
         onConfirm={onConfirmDelete}
         title="Penghapusan Kategori"
         message={`Apakah Anda yakin ingin menghapus kategori ${deleteConfig.name}? Ini mungkin menyebabkan perlengkapan penjelajah tidak terkategori.`}
         confirmText="Hapus Kategori"
         variant="danger"
       />

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative z-10 shadow-2xl"
             >
                <div className="mb-8">
                   <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic mb-2">
                     {editingCategory ? 'Perbarui' : 'Buat'} <span className="text-accent underline">Kategori</span>
                   </h3>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tentukan kategori penjelajah baru untuk toko Anda.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gambar Kategori</label>
                       <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-3xl">
                          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center relative flex-shrink-0">
                             {formData.image_url ? (
                                <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                             ) : (
                                <FolderOpen className="w-6 h-6 text-slate-200" />
                             )}
                             {isUploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                   <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                </div>
                             )}
                          </div>
                          <div className="flex-1">
                             <label className="inline-flex items-center gap-2 px-6 h-9 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-lg active:scale-95">
                                <Plus className="w-3 h-3" /> Pilih Gambar
                                <input 
                                   type="file" 
                                   className="hidden" 
                                   accept="image/*"
                                   onChange={handleFileUpload}
                                   disabled={isUploading}
                                />
                             </label>
                             <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-2 px-1">PNG/JPG Maks 2MB</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Kategori</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Perlengkapan Mendaki"
                        className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all font-body shadow-sm"
                      />
                   </div>
                   <div className="flex gap-3 pt-4">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                      >
                         Batal
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] h-12 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                      >
                         {editingCategory ? 'Simpan Perubahan' : 'Inisialisasi Kategori'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default CategoryManagement;
