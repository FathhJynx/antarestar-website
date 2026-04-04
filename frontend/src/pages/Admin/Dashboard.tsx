import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Package,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin_dashboard_stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        console.log('Dashboard API Response Structure:', response.data);
        const fetchedStats = response.data.data;
        
        if (!fetchedStats || fetchedStats.overview?.total_orders === 0) {
           console.warn('Backend returned 0 orders. Verification needed.');
        }
        return fetchedStats;
      } catch (err: any) {
        console.error('Failed to fetch dashboard stats', err);
        toast.error(err.response?.data?.message || 'Gagal memuat data dashboard');
        throw err;
      }
    },
    refetchInterval: 10000, // Background poll every 10 seconds
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-200" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white rounded-[2.5rem] border border-slate-200" />
            <div className="h-96 bg-white rounded-[2.5rem] border border-slate-200" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    { 
      label: 'Total Pendapatan', 
      value: `Rp ${Number(stats?.overview?.total_revenue || 0).toLocaleString('id-ID')}`, 
      icon: DollarSign, 
      color: 'blue',
      growth: '+12.5%',
      up: true
    },
    { 
      label: 'Pertumbuhan Pengguna', 
      value: `+${stats?.overview?.user_growth || 0}`, 
      icon: Users, 
      color: 'orange',
      growth: '30 hari terakhir',
      up: true
    },
    { 
      label: 'Total Pesanan', 
      value: stats?.overview?.total_orders || 0, 
      icon: ShoppingBag, 
      color: 'purple',
      growth: '+18.2%',
      up: true
    },
    { 
      label: 'Pesanan Menunggu', 
      value: stats?.overview?.pending_orders || 0, 
      icon: Clock, 
      color: 'pink',
      growth: 'perlu tindakan',
      up: false
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Ringkasan <span className="text-accent text-lg">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Selamat datang kembali, Administrator. Inilah ringkasan performa hari ini.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sistem Berjalan Normal</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} 
                   style={{ backgroundColor: card.color }} />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-accent group-hover:text-white transition-all">
                  <card.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${card.up ? 'text-green-500' : 'text-amber-500'}`}>
                  {card.up ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  {card.growth}
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                <h3 className="font-display font-black text-2xl tracking-tighter text-slate-900 leading-none">{card.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Revenue Chart Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tighter">Grafik <span className="text-accent underline">Pendapatan</span></h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Visualisasi 7 hari terakhir transaksi penjualan</p>
                 </div>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                 <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-900">7 Hari Terakhir</button>
                 <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">30 Hari</button>
              </div>
           </div>
           
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stats?.revenue_chart || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FB8500" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#FB8500" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }}
                       tickFormatter={(value) => `Rp ${value / 1000000}M`}
                    />
                    <Tooltip 
                       contentStyle={{ 
                          backgroundColor: '#fff', 
                          borderRadius: '1.25rem', 
                          border: '1px solid #f1f5f9', 
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          padding: '12px'
                       }}
                       labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', color: '#64748b' }}
                       itemStyle={{ fontSize: '12px', fontWeight: 900, color: '#FB8500' }}
                       formatter={(value: number) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Pendapatan']}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="revenue" 
                       stroke="#FB8500" 
                       strokeWidth={4} 
                       fillOpacity={1} 
                       fill="url(#colorRevenue)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tighter">Daftar Pesanan <span className="text-accent underline">Terbaru</span></h3>
               </div>
               <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                  Lihat Semua <ArrowUpRight className="w-3 h-3" />
               </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID Pesanan</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pelanggan</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total</th>
                    <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats?.recent_orders?.map((order: any) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="px-8 py-5 text-[11px] font-black tracking-widest text-slate-400 group-hover:text-accent transition-colors">#{order.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-5">
                        <p className="text-[12px] font-bold text-slate-900 uppercase tracking-tight">{order.user}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-transparent shadow-sm ${
                          order.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                          order.status === 'unpaid' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          order.status === 'shipping' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-slate-50 text-slate-600 border-slate-100'
                        }`}>
                          {order.status === 'completed' ? 'Selesai' : 
                           order.status === 'unpaid' ? 'Menunggu' :
                           order.status === 'shipping' ? 'Dikirim' :
                           order.status === 'processing' ? 'Diproses' : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[12px] font-black text-slate-900">
                        Rp {Number(order.total || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-8 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!stats?.recent_orders || stats.recent_orders.length === 0) && (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                   <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em]">Tidak Ada Aktivitas Pesanan</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats / Side Column */}
          <div className="space-y-8">
            {/* Top Products */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tighter">Produk <span className="text-accent underline">Terlaris</span></h3>
               </div>
               <div className="space-y-5 relative z-10">
                  {stats?.top_products?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group cursor-default">
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-300 uppercase">0{i+1}</span>
                          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight group-hover:text-accent transition-colors truncate max-w-[120px]">{item.name}</p>
                       </div>
                       <span className="text-[11px] font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{item.total_sold} terjual</span>
                    </div>
                  ))}
                  {(!stats?.top_products || stats.top_products.length === 0) && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-center py-4 italic">Belum ada data penjualan</p>
                  )}
               </div>
            </div>

            {/* Inventory Warning */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <Package className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-display font-black text-xl uppercase tracking-tighter">Status <span className="text-red-500">Stok</span></h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Peringatan Kritis</p>
                  <span className="text-lg font-black text-red-500">{stats?.inventory?.low_stock_count || 0} SKU</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                       style={{ width: `${Math.min((stats?.inventory?.low_stock_count || 0) * 10, 100)}%` }} />
                </div>
                <button className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10">
                  Kelola Produk <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Campaign Control */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col h-full">
                  <Clock className="w-10 h-10 mb-6 text-accent" />
                  <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-2 italic">Flash Sale <br/> Berjalan</h3>
                  <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-10">{stats?.promotions?.active_flash_sales || 0} Promo Aktif</p>
                  <button className="h-12 w-full rounded-2xl bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                    Kelola Promo <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
