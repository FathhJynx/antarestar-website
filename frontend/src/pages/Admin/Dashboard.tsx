import React, { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowRight,
  Package,
  AlertTriangle,
  ExternalLink,
  Zap
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
              <div key={i} className="h-32 bg-white/[0.03] rounded-[2rem] border border-white/5" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-white/[0.03] rounded-[2.5rem] border border-white/5" />
            <div className="h-96 bg-white/[0.03] rounded-[2.5rem] border border-white/5" />
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
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              OVERVIEW <span className="text-accent underline decoration-4 underline-offset-8">DASHBOARD</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">System Pulse & Transactional Metrics</p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
             <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#111] bg-accent flex items-center justify-center text-[8px] font-black italic">
                    {i+1}
                  </div>
                ))}
             </div>
             <div className="h-4 w-px bg-white/10 mx-2" />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/50">3 Active Operators</span>
          </div>
        </div>

        {/* Stats Grid — Boxed Modular Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5 rounded-[2rem] overflow-hidden">
          {statCards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 flex flex-col justify-between min-h-[180px] group transition-all duration-500 hover:bg-white/[0.02] ${idx !== 3 ? 'border-r border-white/5' : ''} ${idx > 1 ? 'sm:border-t lg:border-t-0 border-white/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl bg-white/5 text-white group-hover:bg-accent transition-all duration-500`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${card.up ? 'text-green-500' : 'text-amber-500'}`}>
                  {card.up ? <TrendingUp className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {card.growth}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{card.label}</p>
                <h3 className="font-display font-black text-3xl tracking-tighter text-white leading-none group-hover:translate-x-2 transition-transform duration-500">{card.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Analytics & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Revenue Chart Section */}
           <div className="lg:col-span-8 bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                       <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-display font-black text-2xl uppercase tracking-tighter">REVENUE <span className="text-white/30">STREAM</span></h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Active Node: Transact-Alpha-01</p>
                    </div>
                 </div>
                 <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
                    <button className="px-6 py-2.5 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-accent/20 transition-all">WEEKLY</button>
                    <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">MONTHLY</button>
                 </div>
              </div>
              
              <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.revenue_chart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#FB8500" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#FB8500" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#ffffff05" />
                       <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#ffffff20' }} 
                          dy={15}
                       />
                       <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#ffffff20' }}
                          tickFormatter={(value) => `Rp ${value / 1000000}M`}
                       />
                       <Tooltip 
                          contentStyle={{ 
                             backgroundColor: '#111', 
                             borderRadius: '1.5rem', 
                             border: '1px solid #ffffff10', 
                             boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                             padding: '20px'
                          }}
                          labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '8px', color: '#ffffff30' }}
                          itemStyle={{ fontSize: '14px', fontWeight: 900, color: '#FB8500' }}
                          formatter={(value: number) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'VALUATION']}
                       />
                       <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#FB8500" 
                          strokeWidth={5} 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          animationDuration={2000}
                       />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Metrics Column */}
           <div className="lg:col-span-4 space-y-10">
              {/* Flash Sale Monitor */}
              <div className="bg-gradient-to-br from-accent to-orange-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-accent/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                  <div className="relative z-10 flex flex-col h-full">
                    <Zap className="w-12 h-12 mb-8 text-white fill-current" />
                    <h3 className="font-display font-black text-3xl uppercase tracking-tighter mb-4 italic leading-none">FLASH <br/>PROTOCOL</h3>
                    <div className="flex items-center gap-3 mb-10">
                       <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                       <p className="text-[11px] font-black text-white/70 uppercase tracking-[0.3em]">{stats?.promotions?.active_flash_sales || 0} ACTIVE CAMPAIGNS</p>
                    </div>
                    <button className="h-16 w-full rounded-2xl bg-white text-accent font-display font-black uppercase text-[11px] tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
                      OVERRIDE <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
              </div>

              {/* Inventory Alert */}
              <div className="bg-white/[0.03] p-10 rounded-[2.5rem] border border-white/5">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                       <Package className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tighter">STOCK <span className="text-white/20">STATUS</span></h3>
                 </div>
                 <div className="space-y-8">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">CRITICAL SKU</p>
                       <span className="text-2xl font-black text-white">{stats?.inventory?.low_stock_count || 0} UNIT</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${Math.min((stats?.inventory?.low_stock_count || 0) * 10, 100)}%` }}
                         transition={{ duration: 1.5, ease: "easeOut" }}
                         className="h-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                       />
                    </div>
                    <Link to="/admin/products" className="w-full h-14 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                       RESOLVE INVENTORY <ExternalLink className="w-4 h-4 text-xs" />
                    </Link>
                 </div>
              </div>
           </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white/[0.02] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
           <div className="p-10 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.01]">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                   <Clock className="w-6 h-6 text-white/40" />
                 </div>
                 <div>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tighter">RECENT <span className="text-accent underline">HISTORY</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Encrypted Ledger Logs</p>
                 </div>
              </div>
              <Link to="/admin/orders" className="h-12 px-8 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-accent hover:text-white hover:border-accent transition-all flex items-center gap-3">
                 FULL DATABASE SYNC <ArrowRight className="w-4 h-4" />
              </Link>
           </div>

           <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">LOG ID</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">ENTITY</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">PRAGMA</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">VALUATION</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-white/20">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats?.recent_orders?.map((order: any) => (
                    <tr key={order.id} className="hover:bg-white/[0.03] transition-all group group cursor-pointer border-l-4 border-transparent hover:border-accent">
                      <td className="px-10 py-8 text-[11px] font-black tracking-[0.2em] text-white/40 group-hover:text-accent transition-colors">#{order.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-8 py-8">
                        <p className="text-sm font-black text-white uppercase tracking-tight italic">{order.user}</p>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all ${
                          order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                          order.status === 'unpaid' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                          order.status === 'shipping' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]' :
                          'bg-white/5 text-white/50 border-white/10'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-sm font-black text-white italic">
                        Rp {Number(order.total || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-10 py-8 text-right text-[11px] font-black text-white/30 uppercase tracking-widest">
                        {order.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!stats?.recent_orders || stats.recent_orders.length === 0) && (
                <div className="py-24 flex flex-col items-center justify-center opacity-10">
                   <ShoppingBag className="w-16 h-16 mb-6" />
                   <p className="text-[12px] font-black uppercase tracking-[0.4em]">NO LOGS DETECTED</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
