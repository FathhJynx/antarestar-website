import React, { useEffect, useState } from 'react';
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
  Tag,
  Box,
  Coins,
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  Zap,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/pages/Admin/components/AdminModal';
import ConfirmModal from '@/pages/Admin/components/ConfirmModal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useQuery, useMutation } from '@tanstack/react-query';

const ProductManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdParam = searchParams.get('category_id');
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [isUploading, setIsUploading] = useState<{[key: number]: boolean}>({});
  
  // Custom Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState({ id: '', name: '' });

  const { data: products = [], isLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['admin_products', search, categoryIdParam],
    queryFn: async () => {
      const response = await api.get('/products', { 
        params: { 
          search,
          category_id: categoryIdParam || undefined
        } 
      });
      return response.data.data.data || [];
    },
    refetchInterval: 10000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin_categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data.data || [];
    },
  });

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    variants: [{ name: 'Default', price: 0, stock: 0, color_name: '', color_code: '', size: '' }],
    images: [{ image_url: '', is_primary: true }]
  });

  const createProduct = useMutation({
    mutationFn: (data: any) => api.post('/admin/catalog/products', data),
    onSuccess: () => {
        toast.success('Produk berhasil ditambahkan.');
        refetchProducts();
        setIsModalOpen(false);
    }
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => api.put(`/admin/catalog/products/${id}`, data),
    onSuccess: () => {
        toast.success('Data produk berhasil diperbarui.');
        refetchProducts();
        setIsModalOpen(false);
    }
  });

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        category_id: product.category_id,
        variants: product.variants?.length 
          ? product.variants.map((v: any) => ({ 
              id: v.id, 
              name: v.name, 
              price: v.price, 
              stock: v.stock, 
              color_name: v.color_name || '', 
              color_code: v.color_code || '', 
              size: v.size || '' 
            })) 
          : [{ name: 'Default', price: 0, stock: 0, color_name: '', color_code: '', size: '' }],
        images: product.images?.length 
          ? product.images.map((img: any) => ({ id: img.id, image_url: img.image_url, is_primary: img.is_primary })) 
          : [{ image_url: '', is_primary: true }]
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        category_id: '',
        variants: [{ name: 'Default', price: 0, stock: 0, color_name: '', color_code: '', size: '' }],
        images: [{ image_url: '', is_primary: true }]
      });
    }
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { name: '', price: 0, stock: 0, color_name: '', color_code: '', size: '' }]
    });
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { image_url: '', is_primary: formData.images.length === 0 }]
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    
    if (newImages.length > 0 && !newImages.some(img => img.is_primary)) {
      newImages[0].is_primary = true;
    }
    
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slotToast = toast.loading(`Mengunggah media slot ${index + 1}...`);
    setIsUploading(prev => ({ ...prev, [index]: true }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const response = await api.post('/admin/media/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const newUrl = response.data.data.url;
      const newImages = [...formData.images];
      newImages[index].image_url = newUrl;
      setFormData({ ...formData, images: newImages });

      toast.success(`Media slot ${index + 1} berhasil disinkronkan.`, { id: slotToast });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyinkronkan media.', { id: slotToast });
    } finally {
      setIsUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
        updateProduct.mutate({ id: editingProduct.id, data: formData });
    } else {
        createProduct.mutate(formData);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setDeleteConfig({ id, name });
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const loadingToast = toast.loading('MENGHAPUS PRODUK...');
    try {
      await api.delete(`/admin/catalog/products/${deleteConfig.id}`);
      toast.success(`${deleteConfig.name} BERHASIL DIHAPUS.`, { id: loadingToast });
      refetchProducts();
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error('GAGAL MENGHAPUS PRODUK.', { id: loadingToast });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              PROTOKOL <span className="text-accent underline decoration-4 underline-offset-8">INVENTARIS</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Manajemen Katalog & Terminal Kontrol Stok</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-16 px-10 bg-accent text-white font-display font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl flex items-center gap-3 shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> 
            TAMBAH PRODUK BARU
          </button>
        </div>

        {/* Filters and Search Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="CARI KATALOG BERDASARKAN NAMA, SKU, ATAU KATEGORI..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 pl-16 pr-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
            />
          </div>
          <div className="lg:col-span-4 flex gap-4">
            <button className="flex-1 h-16 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-white/40 hover:text-white hover:bg-white/5 transition-all group">
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">FILTER</span>
            </button>
            
            {categoryIdParam && (
               <button 
                 onClick={() => setSearchParams({})}
                 className="h-16 px-8 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-2xl shadow-red-500/10"
               >
                  <X className="w-5 h-5 font-black" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">RESET</span>
               </button>
            )}
          </div>
        </div>

        {/* Product Ledger Table */}
        <div className="bg-white/[0.02] rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden min-h-[600px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
               <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_50px_rgba(251,133,0,0.3)]" />
               <p className="text-[12px] uppercase font-black tracking-[0.4em]">Menyinkronkan Data Inventaris...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto no-scrollbar flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">IDENTITAS</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">KATEGORI</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">HARGA</th>
                    <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/20">STOK</th>
                    <th className="px-10 py-8 text-right text-[11px] font-black uppercase tracking-[0.3em] text-white/20">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => {
                    const minPrice = Math.min(...product.variants?.map((v: any) => v.price) || [0]);
                    const maxPrice = Math.max(...product.variants?.map((v: any) => v.price) || [0]);
                    const totalStock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;
                    
                    return (
                      <tr key={product.id} className="hover:bg-white/[0.03] transition-all group border-l-4 border-transparent hover:border-accent font-body">
                        <td className="px-10 py-10">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-black">
                               {product.images?.[0] ? (
                                 <img src={product.images[0].image_url} alt="" className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-white/10">
                                    <ImageIcon className="w-8 h-8" />
                                 </div>
                               )}
                            </div>
                            <div>
                               <h4 className="text-sm font-black uppercase tracking-tight text-white mb-2 group-hover:text-accent transition-colors italic">{product.name}</h4>
                               <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] leading-none">SKU: {product.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-10">
                           <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/5 border border-white/5 w-fit group-hover:border-accent/20 transition-all">
                              <Layers className="w-4 h-4 text-accent" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{product.category?.name || 'UMUM'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-10">
                             <div className="flex flex-col">
                                <span className="text-lg font-black text-white italic group-hover:translate-x-1 transition-transform">
                                   Rp {Number(minPrice || 0).toLocaleString('id-ID')}
                                </span>
                                {maxPrice > minPrice && (
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-2 flex items-center gap-2">
                                   <ArrowRight className="w-4 h-4 text-accent" />
                                   HINGGA {Number(maxPrice || 0).toLocaleString('id-ID')}
                                </span>
                                )}
                             </div>
                        </td>
                        <td className="px-8 py-10">
                           <div className="flex flex-col gap-3">
                             <span className={`text-[11px] font-black uppercase tracking-widest ${totalStock < 10 ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-white/40'}`}>
                                {totalStock} UNIT AKTIF
                             </span>
                            <div className="w-32 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                               <div className={`h-full rounded-full transition-all duration-1000 ${totalStock < 10 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`} style={{ width: `${Math.min(totalStock, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-10 text-right">
                          <div className="flex items-center justify-end gap-3 translate-x-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                             <button onClick={() => handleOpenModal(product)} className="w-12 h-12 flex items-center justify-center bg-white/5 text-white hover:bg-blue-500 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-blue-500 shadow-xl shadow-black">
                                <Edit2 className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => handleDelete(product.id, product.name)}
                               className="w-12 h-12 flex items-center justify-center bg-white/5 text-white hover:bg-red-600 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-red-600 shadow-xl shadow-black"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
               <div className="w-24 h-24 bg-white/5 text-white rounded-[3rem] flex items-center justify-center mb-10 border border-white/10">
                  <Search className="w-12 h-12" />
               </div>
               <h3 className="font-display font-black text-3xl uppercase tracking-tighter mb-4 italic">DATA KOSONG</h3>
               <p className="text-[12px] text-white font-black uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed">Sistem gagal menemukan data katalog di sektor ini.</p>
             </div>
           )}
        </div>
      </div>

      {/* AdminModal Hub */}
      <AdminModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="max-w-6xl">
        {/* Modal Header */}
        <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-[#111] shrink-0">
           <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Pusat Konfigurasi Sistem</h2>
              </div>
              <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic text-white">
                {editingProduct ? 'PERBARUI' : 'TAMBAH'} <span className="text-accent underline decoration-4">PROTOKOL-ASET</span>
              </h3>
           </div>
           <button 
             onClick={() => setIsModalOpen(false)} 
             className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all group"
           >
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
           </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-12 space-y-16 scroll-smooth bg-[#0B0B0B] scrollbar-stealth">
           <form id="productForm" onSubmit={handleSubmit} className="space-y-16">
              {/* Section 1: Core Identification */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-body">
                 <div className="lg:col-span-4">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 sticky top-0 uppercase">IDENTITAS INTI</h4>
                    <p className="text-[11px] text-white/40 font-medium leading-relaxed italic uppercase">Tentukan metadata utama untuk produk dalam sistem katalog global.</p>
                 </div>
                 <div className="lg:col-span-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Nama Produk</label>
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black uppercase tracking-widest outline-none focus:border-accent transition-all text-white"
                            placeholder="NAMA PRODUK..."
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">Kategori Produk</label>
                          <div className="relative">
                            <select 
                                required
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full h-16 px-8 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black uppercase tracking-widest outline-none focus:border-accent transition-all text-white appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-[#111]">PILIH KATEGORI</option>
                                {categories.map((cat: any) => (
                                <option key={cat.id} value={cat.id} className="bg-[#111]">{cat.name.toUpperCase()}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/20 pointer-events-none" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ml-1 font-bold">Deskripsi Produk</label>
                       <textarea 
                         rows={4}
                         required
                         value={formData.description}
                         onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                         className="w-full p-8 bg-white/5 border border-white/5 rounded-[2rem] text-[12px] font-medium leading-relaxed outline-none focus:border-accent transition-all text-white/70 resize-none no-scrollbar"
                         placeholder="DESKRIPSI PRODUK..."
                       />
                    </div>
                 </div>
              </div>

              {/* Section 2: Variation Specs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-body">
                 <div className="lg:col-span-4">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 sticky top-0 uppercase">VARIAN PRODUK</h4>
                    <p className="text-[11px] text-white/40 font-medium leading-relaxed italic uppercase">Sinkronkan berbagai varian, tingkatan harga, dan data stok di semua node.</p>
                    <button 
                      type="button"
                      onClick={handleAddVariant}
                      className="mt-8 w-full h-14 border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/5 text-white/20 hover:text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                    >
                       <Plus className="w-5 h-5" /> TAMBAH VARIAN
                    </button>
                 </div>
                 <div className="lg:col-span-8 space-y-6">
                    {formData.variants.map((variant, idx) => (
                       <motion.div 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         key={idx} 
                         className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative group/var hover:border-white/20 transition-all font-body"
                       >
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              <div className="md:col-span-2 space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Nama Varian</label>
                                 <input 
                                   type="text"
                                   required
                                   value={variant.name}
                                   onChange={(e) => {
                                      const newVariants = [...formData.variants];
                                      newVariants[idx].name = e.target.value;
                                      setFormData({ ...formData, variants: newVariants });
                                   }}
                                   className="w-full h-14 px-6 bg-black/40 border border-white/5 rounded-xl text-[11px] font-black uppercase outline-none focus:border-accent text-white"
                                   placeholder="NAMA VARIAN (CONTOH: XL, HITAM, DSB)..."
                                 />
                              </div>
                              <div className="space-y-3 text-right">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Harga Satuan</label>
                                 <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-accent font-black text-[10px]">RP</span>
                                    <input 
                                      type="number"
                                      required
                                      value={variant.price}
                                      onChange={(e) => {
                                         const newVariants = [...formData.variants];
                                         newVariants[idx].price = Number(e.target.value);
                                         setFormData({ ...formData, variants: newVariants });
                                      }}
                                      className="w-full h-14 pl-12 pr-6 bg-black/40 border border-white/5 rounded-xl text-[11px] font-black outline-none focus:border-accent text-white"
                                    />
                                 </div>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Kapasitas Stok</label>
                                 <input 
                                   type="number"
                                   required
                                   value={variant.stock}
                                   onChange={(e) => {
                                      const newVariants = [...formData.variants];
                                      newVariants[idx].stock = Number(e.target.value);
                                      setFormData({ ...formData, variants: newVariants });
                                   }}
                                   className="w-full h-14 px-6 bg-black/40 border border-white/5 rounded-xl text-[11px] font-black outline-none focus:border-accent text-white"
                                 />
                              </div>
                               <div className="space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Ukuran / Dimensi</label>
                                 <input 
                                   type="text"
                                   value={variant.size || ''}
                                   onChange={(e) => {
                                      const newVariants = [...formData.variants];
                                      newVariants[idx].size = e.target.value;
                                      setFormData({ ...formData, variants: newVariants });
                                   }}
                                   className="w-full h-14 px-6 bg-black/40 border border-white/5 rounded-xl text-[11px] font-black uppercase outline-none focus:border-accent text-white"
                                   placeholder="UKURAN (XL, 42, DSB)"
                                 />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Kode Warna</label>
                                 <div className="flex gap-4">
                                    <input 
                                      type="text"
                                      value={variant.color_code || ''}
                                      onChange={(e) => {
                                         const newVariants = [...formData.variants];
                                         newVariants[idx].color_code = e.target.value;
                                         setFormData({ ...formData, variants: newVariants });
                                      }}
                                      className="flex-1 h-14 px-6 bg-black/40 border border-white/5 rounded-xl text-[11px] font-black font-mono outline-none focus:border-accent text-white"
                                      placeholder="#HEX"
                                    />
                                    <div className="w-14 h-14 rounded-xl border border-white/10 shadow-inner" style={{ backgroundColor: variant.color_code || '#222' }} />
                                 </div>
                              </div>
                           </div>
                           {formData.variants.length > 1 && (
                             <button 
                               type="button"
                               onClick={() => handleRemoveVariant(idx)}
                               className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover/var:opacity-100 transition-all shadow-xl shadow-red-500/20 z-10"
                             >
                                <X className="w-5 h-5" />
                             </button>
                           )}
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* Section 3: Asset Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-body">
                 <div className="lg:col-span-4">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mb-4 sticky top-0 uppercase">MANIFEST VISUAL</h4>
                    <p className="text-[11px] text-white/40 font-medium leading-relaxed italic uppercase">Unggah aset visual ke infrastruktur toko global.</p>
                    <button 
                      type="button"
                      onClick={handleAddImage}
                      className="mt-8 w-full h-14 border-2 border-dashed border-white/10 hover:border-accent/40 hover:bg-accent/5 text-white/20 hover:text-accent rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                    >
                       <Camera className="w-5 h-5" /> TAMBAH SLOT MEDIA
                    </button>
                 </div>
                 <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formData.images.map((image, idx) => (
                       <div key={idx} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative group/img overflow-hidden transition-all hover:border-white/20">
                           <div className="aspect-square w-full rounded-2xl bg-black/40 border border-white/5 overflow-hidden mb-8 relative group-hover/img:border-accent/40 transition-all">
                              {image.image_url ? (
                                 <img src={image.image_url} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-1000" />
                              ) : (
                                 <div className="absolute inset-0 flex items-center justify-center text-white/5">
                                    <ImageIcon className="w-16 h-16" />
                                 </div>
                              )}
                              {isUploading[idx] && (
                                 <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">MENGUNGGAH...</span>
                                 </div>
                              )}
                           </div>
                           <div className="space-y-4">
                              <div className="relative group/input">
                                 <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 z-10" />
                                 <input 
                                    type="text"
                                    required
                                    value={image.image_url || ''}
                                    onChange={(e) => {
                                       const newImages = [...formData.images];
                                       newImages[idx].image_url = e.target.value;
                                       setFormData({ ...formData, images: newImages });
                                    }}
                                    className="w-full h-14 pl-12 pr-6 bg-black/40 border border-white/5 rounded-xl text-[10px] font-bold outline-none focus:border-accent text-white"
                                    placeholder="URL SUMBER MEDIA..."
                                 />
                              </div>
                              <div className="flex gap-3">
                                 <label className="flex-1 h-14 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                                    <Zap className="w-4 h-4 fill-current" /> UNGGAH GAMBAR
                                    <input 
                                       type="file" 
                                       className="hidden" 
                                       accept="image/*"
                                       onChange={(e) => handleFileUpload(idx, e)}
                                       disabled={isUploading[idx]}
                                    />
                                 </label>
                                 {formData.images.length > 1 && (
                                    <button 
                                      type="button"
                                      onClick={() => handleRemoveImage(idx)}
                                      className="w-14 h-14 bg-red-600/10 border border-red-600/20 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                                    >
                                       <Trash className="w-5 h-5" />
                                    </button>
                                 )}
                              </div>
                           </div>
                       </div>
                    ))}
                 </div>
              </div>
           </form>
        </div>

        {/* Modal Footer */}
        <div className="px-12 py-10 border-t border-white/5 flex items-center justify-between bg-[#111] shrink-0">
           <button 
             type="button" 
             onClick={() => setIsModalOpen(false)} 
             className="h-16 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white/30 hover:bg-white/5 hover:text-white transition-all border border-white/5 bg-transparent"
           >
              BATALKAN
           </button>
           <button 
              type="submit" 
              form="productForm"
              disabled={createProduct.isPending || updateProduct.isPending}
              className="h-16 px-12 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white active:scale-95 transition-all shadow-2xl flex items-center gap-4 disabled:opacity-50 italic"
           >
              {(createProduct.isPending || updateProduct.isPending) ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : <Save className="w-5 h-5" />}
              {editingProduct ? 'SIMPAN PERUBAHAN' : 'TERBITKAN PRODUK'}
           </button>
        </div>
      </AdminModal>

       {/* Deletion Confirmation */}
       <ConfirmModal 
         isOpen={isConfirmOpen}
         onClose={() => setIsConfirmOpen(false)}
         onConfirm={onConfirmDelete}
         title="PENGHAPUSAN PRODUK"
         message={`KONFIRMASI PENGHAPUSAN PERMANEN UNTUK ${deleteConfig.name.toUpperCase()}. TINDAKAN INI TIDAK DAPAT DIBATALKAN. SELURUH LOG DAN VARIAN TERKAIT AKAN DIHAPUS DARI DATABASE UTAMA.`}
         confirmText="HAPUS PERMANEN"
         variant="danger"
       />
    </AdminLayout>
  );
};

export default ProductManagement;
