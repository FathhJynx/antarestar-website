import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye,
  Image as ImageIcon,
  Layers,
  X,
  Save,
  Trash,
  Tag,
  Box,
  Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import { useQuery } from '@tanstack/react-query';

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

  const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slotToast = toast.loading(`Uploading media slot ${index + 1}...`);
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
      toast.error(err.response?.data?.message || 'Gagal mengunggah media', { id: slotToast });
    } finally {
      setIsUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingProduct ? 'Memperbarui produk...' : 'Membuat produk baru...');
    
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData);
        toast.success('Produk berhasil diperbarui', { id: loadingToast });
      } else {
        await api.post('/admin/products', formData);
        toast.success('Produk berhasil dibuat', { id: loadingToast });
      }
      setIsModalOpen(false);
      refetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operasi gagal', { id: loadingToast });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    setDeleteConfig({ id, name });
    setIsConfirmOpen(true);
  };

  const onConfirmDelete = async () => {
    const loadingToast = toast.loading('Menghapus produk...');
    try {
      await api.delete(`/admin/products/${deleteConfig.id}`);
      toast.success(`${deleteConfig.name} telah dihapus.`, { id: loadingToast });
      refetchProducts();
      setIsConfirmOpen(false);
    } catch (err) {
      toast.error('Gagal menghapus produk.', { id: loadingToast });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Daftar <span className="text-accent text-lg">Produk</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Kelola katalog barang dan tingkat stok produk.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="h-12 px-8 bg-accent text-white font-black uppercase text-[11px] tracking-widest rounded-2xl flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Produk Baru
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            </span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama, SKU, atau kategori..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] font-bold outline-none ring-accent/10 focus:ring-4 transition-all"
            />
          </div>
          <button className="h-[52px] px-6 bg-white border border-slate-200 rounded-[1.25rem] flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Filter</span>
          </button>
          
          {categoryIdParam && (
             <button 
               onClick={() => setSearchParams({})}
               className="h-[52px] px-6 bg-accent/5 border border-accent/10 rounded-[1.25rem] flex items-center gap-2 text-accent hover:bg-accent/10 transition-all shadow-sm"
             >
                <X className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">Clear Category Filter</span>
             </button>
          )}
        </div>

        {/* Product List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center opacity-40 italic">
               <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] uppercase font-black tracking-[0.2em]">Sinkronisasi data produk...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Produk</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Kategori</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Rentang Harga</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Stok</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Kendali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => {
                    const minPrice = Math.min(...product.variants?.map((v: any) => v.price) || [0]);
                    const maxPrice = Math.max(...product.variants?.map((v: any) => v.price) || [0]);
                    const totalStock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;
                    
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0">
                               {product.images?.[0] ? (
                                 <img src={product.images[0].image_url} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-6 h-6" />
                                 </div>
                               )}
                            </div>
                            <div>
                               <h4 className="text-[13px] font-black uppercase tracking-tight text-slate-900 leading-tight mb-1">{product.name}</h4>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">SKU: {product.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 w-fit">
                              <Layers className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{product.category?.name || 'Uncategorized'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-col">
                             <span className="text-[13px] font-black text-slate-900">
                                Rp {minPrice.toLocaleString('id-ID')}
                             </span>
                             {maxPrice > minPrice && (
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Hingga {maxPrice.toLocaleString('id-ID')}</span>
                             )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col gap-1.5">
                             <span className={`text-[11px] font-black uppercase tracking-widest ${totalStock < 10 ? 'text-red-500' : 'text-slate-600'}`}>
                                {totalStock} Tersisa
                             </span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                               <div className={`h-full rounded-full ${totalStock < 10 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min(totalStock, 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                             <button onClick={() => handleOpenModal(product)} title="Edit Product" className="p-2.5 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                                <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
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
            <div className="h-96 flex flex-col items-center justify-center text-center p-10">
               <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mb-6">
                  <Search className="w-8 h-8" />
               </div>
               <h3 className="font-display font-black text-xl uppercase tracking-tighter mb-2">Tidak ada produk ditemukan</h3>
               <p className="text-slate-400 text-sm max-w-xs mx-auto uppercase font-bold tracking-widest leading-relaxed">Kami tidak dapat menemukan perlengkapan yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
             >
                {/* Modal Header */}
                <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <div>
                      <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic">
                        {editingProduct ? 'Perbarui' : 'Inisialisasi'} <span className="text-accent underline">Perlengkapan</span>
                      </h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Konfigurasi spesifikasi alat dan data inventori.</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm">
                      <X className="w-5 h-5" />
                   </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-10">
                   <form id="productForm" onSubmit={handleSubmit} className="space-y-10">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                               <Tag className="w-3 h-3" /> Nama Produk
                            </label>
                            <input 
                              type="text" 
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Tenda Camp Pro"
                              className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all font-body shadow-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                               <Layers className="w-3 h-3" /> Kategori Penjelajah
                            </label>
                            <select 
                              required
                              value={formData.category_id}
                              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                              className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all font-body shadow-sm appearance-none"
                            >
                               <option value="">Pilih Kategori</option>
                               {categories.map(cat => (
                                 <option key={cat.id} value={cat.id}>{cat.name}</option>
                               ))}
                            </select>
                         </div>
                         <div className="md:col-span-2 space-y-2">
                           <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                               Deskripsi
                            </label>
                            <textarea 
                              rows={4}
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="Jelaskan kemampuan dan fitur alat ini..."
                              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all font-body shadow-sm resize-none"
                            />
                         </div>
                      </div>

                      {/* Variant Management */}
                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 border-l-4 border-accent pl-3 leading-none">Varian SKU & Harga</h4>
                            <button 
                              type="button"
                              onClick={handleAddVariant}
                              className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                            >
                               + Tambah Alternatif
                            </button>
                         </div>

                         <div className="space-y-4">
                            {formData.variants.map((variant, idx) => (
                               <div key={idx} className="flex flex-col md:flex-row gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-3xl group/var relative">
                                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                         <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Nama Tampilan Varian</label>
                                         <div className="relative">
                                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                            <input 
                                              type="text"
                                              placeholder="e.g. Ukuran M / Hitam"
                                              value={variant.name}
                                              onChange={(e) => {
                                                 const newVariants = [...formData.variants];
                                                 newVariants[idx].name = e.target.value;
                                                 setFormData({ ...formData, variants: newVariants });
                                              }}
                                              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-accent transition-all shadow-sm"
                                            />
                                         </div>
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ukuran (Opsional)</label>
                                         <input 
                                           type="text"
                                           placeholder="e.g. XL, 42, 2L"
                                           value={variant.size || ''}
                                           onChange={(e) => {
                                              const newVariants = [...formData.variants];
                                              newVariants[idx].size = e.target.value;
                                              setFormData({ ...formData, variants: newVariants });
                                           }}
                                           className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-accent transition-all shadow-sm"
                                         />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Nama Warna (Opsional)</label>
                                         <input 
                                           type="text"
                                           placeholder="e.g. Hitam Karbon"
                                           value={variant.color_name || ''}
                                           onChange={(e) => {
                                              const newVariants = [...formData.variants];
                                              newVariants[idx].color_name = e.target.value;
                                              setFormData({ ...formData, variants: newVariants });
                                           }}
                                           className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-accent transition-all shadow-sm"
                                         />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Kode Hex Warna (Opsional)</label>
                                         <div className="flex gap-2">
                                            <input 
                                              type="text"
                                              placeholder="#000000"
                                              value={variant.color_code || ''}
                                              onChange={(e) => {
                                                 const newVariants = [...formData.variants];
                                                 newVariants[idx].color_code = e.target.value;
                                                 setFormData({ ...formData, variants: newVariants });
                                              }}
                                              className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-accent transition-all shadow-sm font-mono"
                                            />
                                            <div 
                                               className="w-11 h-11 rounded-xl border border-slate-200 shadow-inner"
                                               style={{ backgroundColor: variant.color_code || '#f8fafc' }}
                                            />
                                         </div>
                                      </div>
                                   </div>
                                   
                                   <div className="w-full md:w-32 space-y-2">
                                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Harga Dasar</label>
                                      <div className="relative">
                                         <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                         <input 
                                           type="number"
                                           value={variant.price}
                                           onChange={(e) => {
                                              const newVariants = [...formData.variants];
                                              newVariants[idx].price = Number(e.target.value);
                                              setFormData({ ...formData, variants: newVariants });
                                           }}
                                           className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-accent transition-all shadow-sm"
                                         />
                                      </div>
                                   </div>
                                   <div className="w-full md:w-24 space-y-2">
                                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Stok</label>
                                      <input 
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => {
                                           const newVariants = [...formData.variants];
                                           newVariants[idx].stock = Number(e.target.value);
                                           setFormData({ ...formData, variants: newVariants });
                                        }}
                                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-accent transition-all shadow-sm"
                                      />
                                   </div>
                                   {formData.variants.length > 1 && (
                                      <button 
                                        type="button"
                                        onClick={() => handleRemoveVariant(idx)}
                                        className="p-2 text-slate-300 hover:text-red-500 transition-colors mt-auto md:mb-1"
                                      >
                                         <Trash className="w-4 h-4" />
                                      </button>
                                   )}
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Image Management */}
                      <div className="space-y-6">
                         <h4 className="text-[12px] font-black uppercase tracking-tight text-slate-900 border-l-4 border-accent pl-3 leading-none">Aset Visual</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.images.map((image, idx) => (
                               <div key={idx} className="space-y-2">
                                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">URL Media {idx + 1}</label>
                                   <div className="relative group/field flex flex-col gap-3">
                                      <div className="flex gap-3">
                                         <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative group-hover:border-accent/40 transition-all">
                                            {image.image_url ? (
                                               <img src={image.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                               <ImageIcon className="w-6 h-6 text-slate-300" />
                                            )}
                                            {isUploading[idx] && (
                                               <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                               </div>
                                            )}
                                         </div>
                                         <div className="flex-1 space-y-2">
                                            <div className="relative h-12">
                                               <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 z-10" />
                                               <input 
                                                  type="text"
                                                  placeholder="URL Media atau Unggah File..."
                                                  value={image.image_url || ''}
                                                  onChange={(e) => {
                                                     const newImages = [...formData.images];
                                                     newImages[idx].image_url = e.target.value;
                                                     setFormData({ ...formData, images: newImages });
                                                  }}
                                                  className="w-full h-full pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-accent/10 transition-all shadow-sm"
                                               />
                                            </div>
                                            <label className="inline-flex items-center gap-2 px-6 h-9 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-lg active:scale-95">
                                               <Plus className="w-3 h-3" /> Pilih File
                                               <input 
                                                  type="file" 
                                                  className="hidden" 
                                                  accept="image/*"
                                                  onChange={(e) => handleFileUpload(idx, e)}
                                                  disabled={isUploading[idx]}
                                               />
                                            </label>
                                         </div>
                                      </div>
                                   </div>
                               </div>
                            ))}
                         </div>
                      </div>
                   </form>
                </div>

                {/* Modal Footer */}
                <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                   <button 
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     className="px-8 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
                   >
                      Batalkan Perubahan
                   </button>
                   <button 
                     form="productForm"
                     type="submit"
                     className="px-10 h-12 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-3"
                   >
                      <Save className="w-4 h-4" /> 
                      {editingProduct ? 'Perbarui Produk' : 'Terbitkan Produk'}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* Deletion Confirmation */}
       <ConfirmModal 
         isOpen={isConfirmOpen}
         onClose={() => setIsConfirmOpen(false)}
         onConfirm={onConfirmDelete}
         title="Pemusnahan Inventori"
         message={`Apakah Anda yakin ingin menghapus ${deleteConfig.name}? Tindakan ini tidak dapat dibatalkan dan semua varian akan hilang.`}
         confirmText="Hapus Permanen"
         variant="danger"
       />
    </AdminLayout>
  );
};

export default ProductManagement;
