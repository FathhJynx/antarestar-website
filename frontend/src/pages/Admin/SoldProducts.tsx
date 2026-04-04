import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink,
  Package,
  Calendar,
  User,
  ArrowUpRight,
  TrendingUp,
  Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const SoldProducts = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: soldData, isLoading } = useQuery({
    queryKey: ['admin_sold_products', search, page],
    queryFn: async () => {
      const response = await api.get('/admin/sold-products', {
        params: { 
          search,
          page,
          per_page: 15
        }
      });
      return response.data.data;
    },
    refetchInterval: 10000,
  });

  const items = soldData?.data || [];
  const pagination = soldData || null;


  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Produk <span className="text-accent text-lg">Terjual</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Laporan produk yang telah berhasil dikirim ke pelanggan.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Total Unit</p>
                   <p className="text-[13px] font-black text-slate-900 leading-none">{pagination?.total || 0}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            </span>
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama produk atau varian..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] font-bold outline-none ring-accent/10 focus:ring-4 transition-all shadow-sm"
            />
          </div>
          <button className="h-[52px] px-6 bg-white border border-slate-200 rounded-[1.25rem] flex items-center gap-2 text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Filter Lanjut</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center opacity-40 italic">
               <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] uppercase font-black tracking-[0.2em]">Membuat laporan penjualan...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Produk & Varian</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Unit</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Jual</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Pembeli</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">ID Pesanan</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 italic">
                  {items.map((item, idx) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                             {item.product_variant?.product?.primary_image?.image_url ? (
                               <img src={item.product_variant.product.primary_image.image_url} alt="" className="w-full h-full object-cover" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <Package className="w-5 h-5" />
                               </div>
                             )}
                          </div>
                          <div>
                             <h4 className="text-[13px] font-black uppercase tracking-tight text-slate-900 leading-tight mb-1">{item.product_variant?.product?.name}</h4>
                             <p className="text-[10px] text-accent font-bold uppercase tracking-widest leading-none flex items-center gap-1.5">
                                <Box className="w-3 h-3" />
                                {item.product_variant?.name}
                             </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-[13px] font-black text-slate-900 border border-slate-200">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                           <span className="text-[13px] font-black text-slate-900">
                              Rp {Number(item.price || 0).toLocaleString('id-ID')}
                           </span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total: Rp {Number(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                           <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                              {item.order?.user?.name?.[0] || 'U'}
                           </div>
                           <p className="text-[11px] font-black uppercase tracking-tight text-slate-700">{item.order?.user?.name || 'Member'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Link 
                          to={`/admin/orders?search=${item.order_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-accent hover:border-accent/40 transition-all shadow-sm"
                        >
                           #{item.order_id.substring(0, 8).toUpperCase()}
                           <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">
                              {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                           </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-10 opacity-30">
               <ShoppingBag className="w-16 h-16 mb-4 text-slate-300" />
               <h3 className="font-display font-black text-xl uppercase tracking-tighter">Penjualan Belum Tercatat</h3>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Belum ada unit barang yang terjual.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
           <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
                 <button
                   key={p}
                   onClick={() => setPage(p)}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${
                     page === p 
                       ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                       : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'
                   }`}
                 >
                   {p}
                 </button>
              ))}
           </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SoldProducts;
