import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Layers,
  X,
  Save,
  Trash,
  ChevronRight,
  Zap,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/pages/Admin/components/AdminModal';
import { useQuery, useMutation } from '@tanstack/react-query';

const CategoryManagement = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    image_url: ''
  });

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ['admin_categories', search],
    queryFn: async () => {
      const response = await api.get('/categories', { params: { search } });
      return response.data.data || [];
    }
  });

  const categoryMutation = useMutation({
    mutationFn: (data: any) => editingCategory 
      ? api.put(`/admin/catalog/categories/${editingCategory.id}`, data)
      : api.post('/admin/catalog/categories', data),
    onSuccess: () => {
      toast.success(editingCategory ? 'Data kategori berhasil diperbarui.' : 'Kategori baru berhasil ditambahkan.');
      refetch();
      setIsModalOpen(false);
    }
  });

  const handleOpenModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, image_url: category.image_url || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', image_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const t = toast.loading('Menyinkronkan data visual...');
    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('image', file);
      const res = await api.post('/admin/media/upload', uploadData);
      setFormData({ ...formData, image_url: res.data.data.url });
      toast.success('Data visual berhasil disinkronkan.', { id: t });
    } catch (err: any) {
      toast.error('Gagal menyinkronkan data visual.', { id: t });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    categoryMutation.mutate(formData);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('KONFIRMASI PENGHAPUSAN KATEGORI INI?')) return;
    const t = toast.loading('MENGHAPUS DATA...');
    try {
      await api.delete(`/admin/catalog/categories/${id}`);
      toast.success('DATA BERHASIL DIHAPUS DARI SISTEM.', { id: t });
      refetch();
    } catch (err) {
      toast.error('GAGAL MENGHAPUS DATA.', { id: t });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12 font-body">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic text-white">
              SEKTOR <span className="text-accent underline decoration-4 underline-offset-8">KATEGORI</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Pusat Taksonomi Global & Kendali Departemen</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-16 px-10 bg-accent text-white font-display font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            TAMBAH SEKTOR BARU
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
          <input 
            type="text" 
            placeholder="CARI MANIFEST SEKTOR..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-16 pl-16 pr-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent transition-all text-white placeholder:text-white/10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
            ))
          ) : categories?.map((cat: any) => (
            <div key={cat.id} className="group relative overflow-hidden bg-[#111] border border-white/5 rounded-[2.5rem] p-8 hover:border-accent transition-all duration-500 shadow-2xl shadow-black h-[280px] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-all" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-6 flex-shrink-0 group-hover:scale-110 transition-all duration-700">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt="" className="w-full h-full object-cover group-hover:opacity-40" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                       <Layers className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                   <h3 className="text-xl font-display font-black uppercase tracking-tighter italic text-white mb-2 group-hover:text-accent transition-colors">{cat.name}</h3>
                   <div className="flex items-center gap-3">
                      <div className="h-4 w-px bg-white/10" />
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{cat.products_count || 0} ASET TERHUBUNG</p>
                   </div>
                </div>
                <div className="mt-auto pt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <button onClick={() => handleOpenModal(cat)} className="flex-1 h-12 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-accent hover:text-white transition-all shadow-xl shadow-black italic">
                    UBAH DATA
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="w-12 h-12 flex items-center justify-center bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xl shadow-red-600/10">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-md">
        <div className="px-10 py-8 border-b border-white/5 bg-[#111] flex items-center gap-6 shrink-0 font-body">
           <div className="w-14 h-14 bg-accent rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-accent/20">
              <Layers className="w-7 h-7" />
           </div>
           <div>
              <h3 className="text-xl font-display font-black tracking-tighter uppercase italic">{editingCategory ? 'UBAH' : 'TAMBAH'} SEKTOR</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">Sinkronisasi Departemen Global</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 font-body">
           <form id="categoryForm" onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Nama Label Sektor</label>
                 <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    className="w-full h-16 bg-white/5 border border-white/5 rounded-2xl px-6 text-[12px] font-black uppercase tracking-widest text-white outline-none focus:border-accent transition-all"
                    placeholder="MASUKKAN NAMA..."
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 font-bold">Identifikasi Visual</label>
                 <div className="aspect-video w-full rounded-[2rem] bg-black/40 border border-white/5 overflow-hidden relative group/upload">
                    {formData.image_url ? (
                       <img src={formData.image_url} alt="" className="w-full h-full object-cover group-hover/upload:opacity-40 transition-opacity" />
                    ) : (
                       <div className="absolute inset-0 flex items-center justify-center text-white/5">
                          <Camera className="w-12 h-12" />
                       </div>
                    )}
                    {isUploading && (
                       <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-accent">MENYINKRONKAN...</span>
                       </div>
                    )}
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover/upload:opacity-100 transition-all bg-accent/20">
                       <span className="text-[11px] font-black uppercase tracking-widest text-white bg-black/80 px-6 py-3 rounded-full border border-white/10">UNGGAH GAMBAR</span>
                       <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                 </div>
                 <input 
                    type="text" 
                    value={formData.image_url} 
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
                    className="w-full h-12 bg-white/5 border-none text-[10px] font-mono text-white/20 outline-none px-4 rounded-xl"
                    placeholder="URL SUMBER MEDIA..."
                 />
              </div>
           </form>
        </div>

        <div className="px-10 py-8 border-t border-white/5 bg-[#111] flex items-center justify-end font-body">
           <button 
             type="submit" 
             form="categoryForm" 
             disabled={categoryMutation.isPending || isUploading}
             className="h-16 px-10 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-accent hover:text-white transition-all shadow-xl disabled:opacity-50 italic"
           >
              SIMPAN PERUBAHAN
           </button>
        </div>
      </AdminModal>
    </AdminLayout>
  );
};

export default CategoryManagement;
