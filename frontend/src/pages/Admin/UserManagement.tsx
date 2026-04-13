import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  Star, 
  MoreVertical,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Award,
  Edit,
  Eye,
  Trophy,
  History,
  Calendar,
  MapPin,
  Mail,
  Phone,
  X,
  ShoppingBag,
  Save,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import { AdminModal } from '@/pages/Admin/components/AdminModal';
import ConfirmModal from '@/pages/Admin/components/ConfirmModal';
import PromptModal from '@/pages/Admin/components/PromptModal';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useQuery } from '@tanstack/react-query';

const UserManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Custom Modal States
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ userId: '', role: '', userName: '' });
  
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [promptConfig, setPromptConfig] = useState({ userId: '', userName: '' });

  // Tab State
  const [activeTab, setActiveTab] = useState<'registry' | 'leaderboard'>('registry');

  // Edit/View Modal State
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', role: '' });

  useScrollLock(isViewOpen || isEditOpen);

  const { data: users = [], isLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin_users', search],
    queryFn: async () => {
      const response = await api.get('/admin/users', { params: { search } });
      return response.data.data.data || [];
    },
    enabled: activeTab === 'registry',
    refetchInterval: 10000,
  });

  const { data: leaderboard = [], isLoading: isLeaderboardLoading, refetch: refetchLeaderboard } = useQuery({
    queryKey: ['admin_leaderboard'],
    queryFn: async () => {
      const response = await api.get('/admin/users/leaderboard/orders');
      return response.data.data || [];
    },
    enabled: activeTab === 'leaderboard',
    refetchInterval: 10000,
  });

  const handleOpenView = async (userId: string) => {
    const loadingToast = toast.loading('Mengakses data penjelajah...');
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.data);
      setIsViewOpen(true);
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error('Gagal memuat detail penjelajah.', { id: loadingToast });
    }
  };

  const handleOpenEdit = (user: any) => {
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user'
    });
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Menyinkronkan pembaruan profil...');
    try {
      await api.put(`/admin/users/${selectedUser.id}`, editFormData);
      toast.success('Data profil berhasil diperbarui.', { id: loadingToast });
      setIsEditOpen(false);
      refetchUsers();
    } catch (err) {
      toast.error('Gagal memperbarui profil penjelajah.', { id: loadingToast });
    }
  };

  const handleAdjustPoints = async (userId: string, userName: string) => {
    setPromptConfig({ userId, userName });
    setIsPromptOpen(true);
  };

  const onPromptSubmit = async (data: { points: number; reason: string }) => {
    const loadingToast = toast.loading('Menyesuaikan poin penjelajah...');
    try {
      await api.post(`/admin/users/${promptConfig.userId}/adjust-points`, data);
      toast.success('Penyesuaian poin berhasil dilakukan.', { id: loadingToast });
      refetchUsers();
    } catch (err) {
      toast.error('Gagal menyesuaikan poin penjelajah.', { id: loadingToast });
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string, userName: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setConfirmConfig({ userId, role: newRole, userName });
    setIsConfirmOpen(true);
  };

  const onConfirmRoleChange = async () => {
    const loadingToast = toast.loading('Memperbarui otoritas anggota...');
    try {
      await api.put(`/admin/users/${confirmConfig.userId}/role`, { role: confirmConfig.role });
      toast.success('Otoritas anggota berhasil diperbarui.', { id: loadingToast });
      refetchUsers();
    } catch (err) {
      toast.error('Gagal memperbarui peran anggota.', { id: loadingToast });
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Command Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              DAFTAR <span className="text-accent underline decoration-4 underline-offset-8">ANGGOTA</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Pusat Monitoring Jaringan Explorer & Otorisasi</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Tab Switcher */}
            <div className="flex bg-white/[0.03] border border-white/5 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setActiveTab('registry')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'registry' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/30 hover:text-white'}`}
              >REGISTRI</button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'leaderboard' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/30 hover:text-white'}`}
              >PAPAN SKOR</button>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 h-16 flex items-center gap-5">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">TOTAL DATA</p>
                <p className="text-lg font-black text-accent italic">{users.length}</p>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">PUNCAK SKOR</p>
                <p className="text-[11px] font-black text-white uppercase italic">{leaderboard[0]?.name || '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'registry' ? (
          <>
            {/* Search Bar */}
            <div className="relative group max-w-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="CARI IDENTITAS ANGGOTA ATAU EMAIL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-16 pl-16 pr-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
              />
            </div>

            {/* Member Registry Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/5 font-body">
                      <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">IDENTITAS</th>
                      <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">STATUS TIER</th>
                      <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">POIN AKTIF</th>
                      <th className="px-8 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">AKSES</th>
                      <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-white/20">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-body">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-white/[0.03] transition-all group cursor-default">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center font-display font-black text-lg shadow-xl shadow-accent/10 border border-white/10 group-hover:scale-110 transition-transform">
                              {user.name?.[0]?.toUpperCase() || 'E'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-accent transition-colors italic">{user.name}</p>
                              <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                              <Shield className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.1em] italic">{user.membership?.tier?.name || 'Explorer'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            </div>
                            <span className="text-lg font-black text-white italic">{user.points?.total_points || 0}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                            {user.role === 'admin' ? 'ADMINISTRATOR' : 'ANGGOTA'}
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenView(user.id)}
                              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-accent text-white rounded-xl transition-all border border-white/5"
                              title="Lihat Data"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-blue-500 text-white rounded-xl transition-all border border-white/5"
                              title="Ubah Profil"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAdjustPoints(user.id, user.name)}
                              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-yellow-500 text-white rounded-xl transition-all border border-white/5"
                              title="Atur Poin"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateRole(user.id, user.role, user.name)}
                              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-purple-500 text-white rounded-xl transition-all border border-white/5"
                              title="Ubah Otoritas"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-10">
            {/* Leaderboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leaderboard.slice(0, 3).map((user: any, i: number) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={user.id}
                  className={`p-10 rounded-[2.5rem] border relative overflow-hidden group ${i === 0 ? 'bg-accent text-white border-accent shadow-2xl shadow-accent/20' : 'bg-white/[0.02] border-white/5'}`}
                >
                  {i === 0 && <Trophy className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12 group-hover:scale-110 transition-transform duration-700" />}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-display font-black text-2xl ${i === 0 ? 'bg-white text-accent' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                        {i + 1}
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${i === 0 ? 'bg-white/20' : 'bg-accent/10 text-accent'}`}>
                        TOP HUNTER
                      </div>
                    </div>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-2 italic">{user.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${i === 0 ? 'text-white/60' : 'text-white/20'}`}>MEMBER SINCE {new Date(user.created_at).getFullYear()}</p>

                    <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 gap-6">
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${i === 0 ? 'text-white/40' : 'text-white/20'}`}>TOTAL ORDERS</p>
                        <p className="text-xl font-black italic">{user.orders_count}x</p>
                      </div>
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${i === 0 ? 'text-white/40' : 'text-white/20'}`}>SPENT VALUATION</p>
                        <p className="text-xl font-black italic">Rp {Number(user.total_spent || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Rest of Leaderboard Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden">
              <div className="px-10 py-8 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20">RANKING SISTEM PENJELAJAH</h3>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.01] font-body">
                      <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/10">RANK</th>
                      <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/10">ANGGOTA</th>
                      <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/10 text-center">ORDER</th>
                      <th className="px-10 py-6 text-right text-[9px] font-black uppercase tracking-[0.3em] text-white/10">TOTAL BELANJA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-body">
                    {leaderboard.slice(3).map((user: any, i: number) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-10 py-6 text-sm font-black text-white/20 italic group-hover:text-accent transition-colors">#{i + 4}</td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-white uppercase italic">{user.name}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-black text-white/60 italic">{user.orders_count}x</span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <span className="text-sm font-black text-white italic">Rp {Number(user.total_spent || 0).toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View User Modal */}
      <AnimatePresence>
        {isViewOpen && selectedUser && (
          <AdminModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} maxWidth="max-w-5xl">
            <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-[#111] shrink-0">
              <div>
                <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic text-white">
                  MANIFES <span className="text-accent underline decoration-4 underline-offset-8">PENJELAJAH</span>
                </h3>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Active Node ID: {selectedUser.id}</p>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-accent hover:bg-accent/10 transition-all group">
                <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-[#0B0B0B] space-y-12 no-scrollbar font-body">
              {/* Profile Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-1 flex flex-col items-center p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-accent text-white flex items-center justify-center font-display font-black text-5xl mb-8 shadow-2xl shadow-accent/20 border-4 border-white/10">
                    {selectedUser.name?.[0]?.toUpperCase()}
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight italic mb-2 text-center">{selectedUser.name}</h4>
                  <p className="text-xs font-black text-accent uppercase tracking-[0.3em] mb-8">{selectedUser.membership?.tier?.name || 'Explorer'}</p>
                  
                  <div className="w-full space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 text-white/40 group hover:text-white transition-colors">
                      <Mail className="w-4 h-4 text-accent" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 group hover:text-white transition-colors">
                      <Phone className="w-4 h-4 text-accent" />
                      <span className="text-[11px] font-black uppercase tracking-widest">{selectedUser.phone || 'BELUM DIATUR'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/40 group hover:text-white transition-colors">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="text-[11px] font-black uppercase tracking-widest">JOIN {new Date(selectedUser.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-accent/30 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" /> TOTAL POIN
                      </p>
                      <p className="text-4xl font-black text-white italic">{selectedUser.points?.total_points || 0}</p>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-accent/30 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-3 h-3 text-accent" /> TOTAL PESANAN
                      </p>
                      <p className="text-4xl font-black text-white italic">{selectedUser.orders_count || 0}x</p>
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                    <div className="flex items-center gap-4 mb-10">
                      <History className="w-5 h-5 text-accent" />
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-white/40">Log Aktivitas Terbaru</h4>
                    </div>
                    <div className="space-y-6 opacity-30 italic py-10 flex flex-col items-center">
                       <Clock className="w-10 h-10 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">Fitur sedang dalam pengembangan...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-12 py-8 border-t border-white/5 flex justify-end bg-[#111] shrink-0">
              <button onClick={() => setIsViewOpen(false)} className="px-10 py-4 bg-white text-black font-display font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-accent hover:text-white transition-all shadow-2xl">
                TUTUP MANIFES
              </button>
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AdminModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="max-w-2xl">
        <div className="px-12 py-10 border-b border-white/5 flex items-center justify-between bg-[#111] shrink-0">
          <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic text-white">
            UBAH <span className="text-accent underline decoration-4 underline-offset-8">PROFIL</span>
          </h3>
          <button onClick={() => setIsEditOpen(false)} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleEditSubmit} className="p-12 bg-[#0B0B0B] space-y-8">
          <div className="space-y-6">
            <div className="space-y-2 font-body">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-xl text-sm font-black uppercase tracking-widest outline-none focus:border-accent text-white transition-all"
              />
            </div>
            <div className="space-y-2 font-body">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Alamat Email</label>
              <input
                type="email"
                required
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-xl text-sm font-black lowercase outline-none focus:border-accent text-white transition-all opacity-50 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="space-y-2 font-body">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Nomor Telepon</label>
              <input
                type="text"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-xl text-sm font-black outline-none focus:border-accent text-white transition-all"
                placeholder="0812xxxxxx"
              />
            </div>
            <div className="space-y-2 font-body">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Tingkat Akses</label>
              <select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest outline-none focus:border-accent text-white transition-all appearance-none cursor-pointer"
              >
                <option value="user" className="bg-[#111]">ANGGOTA BIASA</option>
                <option value="admin" className="bg-[#111]">ADMINISTRATOR</option>
              </select>
            </div>
          </div>

          <div className="pt-8 flex gap-4 font-body">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="flex-1 h-14 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/20 hover:bg-white/5 hover:text-white transition-all"
            >
              BATALKAN
            </button>
            <button
              type="submit"
              className="flex-[2] h-14 bg-white text-black hover:bg-accent hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-3 italic"
            >
              <Save className="w-4 h-4" /> SIMPAN PERUBAHAN
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Point Adjustment Modal */}
      <PromptModal
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onSubmit={onPromptSubmit}
        title="PENYESUAIAN POIN"
        message={`MASUKKAN JUMLAH POIN UNTUK DITAMBAHKAN ATAU DIKURANGI DARI AKUN ${promptConfig.userName.toUpperCase()}.`}
        label="Jumlah Poin (gunakan tanda minus untuk mengurangi)"
        type="number"
      />

      {/* Role Change Confirmation */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmRoleChange}
        title="OTORISASI AKSES"
        message={`APAKAH ANDA YAKIN INGIN MENGUBAH TINGKAT AKSES UNTUK ${confirmConfig.userName.toUpperCase()} MENJADI ${confirmConfig.role.toUpperCase()}?`}
        confirmText="YA, PERBARUI AKSES"
      />
    </AdminLayout>
  );
};

export default UserManagement;
