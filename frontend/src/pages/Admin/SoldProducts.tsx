import React, { useState } from 'react';
import {
  ShoppingBag, Search, Filter, Package, Calendar, User, ArrowUpRight, TrendingUp, Box
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const SoldProducts = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: soldData, isLoading } = useQuery({
    queryKey: ['admin_sold_products', search, page],
    queryFn: async () => {
      const response = await api.get('/admin/sold-products', {
        params: { search, page, per_page: 15 }
      });
      return response.data.data;
    },
    refetchInterval: 10000,
  });

  const items = soldData?.data || [];
  const pagination = soldData || null;

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              LAPORAN <span className="text-accent underline decoration-4 underline-offset-8">PENJUALAN</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Log Pengiriman Peralatan & Unit Terjual</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 h-14 flex items-center gap-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">TOTAL UNIT</p>
              <p className="text-lg font-black text-white italic">{pagination?.total || 0}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="CARI BERDASARKAN PRODUK ATAU VARIAN..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full h-14 pl-16 pr-6 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
            />
          </div>
          <button className="h-14 px-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 text-white/30 hover:border-white/20 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em]">FILTER</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] min-h-[400px]">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center opacity-20">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-[10px] uppercase font-black tracking-[0.4em]">Menyusun log pengiriman...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">PRODUK & VARIAN</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center">QTY</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">HARGA SATUAN</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">PEMBELI</th>
                    <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">ID PESANAN</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-white/20">TANGGAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {items.map((item: any, idx: number) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, ease: [0.16, 1, 0.3, 1] }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                            {item.product_variant?.product?.primary_image?.image_url ? (
                              <img src={item.product_variant.product.primary_image.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/10"><Package className="w-6 h-6" /></div>
                            )}
                          </div>
                          <div>
                            <h4 className="text-[13px] font-black uppercase tracking-tight text-white italic group-hover:text-accent transition-colors">{item.product_variant?.product?.name}</h4>
                            <p className="text-[10px] text-accent font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                              <Box className="w-3 h-3" />{item.product_variant?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-7 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-white/5 border border-white/5 text-[14px] font-black text-white italic">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <p className="text-[13px] font-black text-white italic">Rp {Number(item.price || 0).toLocaleString('id-ID')}</p>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1">Total: Rp {Number(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 text-accent flex items-center justify-center text-[11px] font-black">
                            {item.order?.user?.name?.[0] || 'U'}
                          </div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-white/60 italic">{item.order?.user?.name || 'Anggota'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-7">
                        <Link
                          to={`/admin/orders?search=${item.order_id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-accent hover:border-accent/30 transition-all"
                        >
                          #{item.order_id.substring(0, 8).toUpperCase()}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                      <td className="px-10 py-7 text-right">
                        <p className="text-[11px] font-black text-white/40 uppercase tracking-wider italic">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">
                          {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center opacity-20">
              <ShoppingBag className="w-16 h-16 mb-6" />
              <h3 className="font-display font-black text-xl uppercase tracking-tighter italic">TIDAK ADA DATA PENGIRIMAN</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2">Belum ada unit produk yang terjual.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all ${
                  page === p
                    ? 'bg-accent text-white shadow-2xl shadow-accent/20'
                    : 'bg-white/[0.02] border border-white/5 text-white/30 hover:border-white/20 hover:text-white'
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
