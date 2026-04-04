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
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/layouts/AdminLayout';
import api from '@/lib/api';
import { toast } from 'sonner';
import ConfirmModal from '@/components/Admin/ConfirmModal';
import PromptModal from '@/components/Admin/PromptModal';
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
    const loadingToast = toast.loading('Mengakses manifes penjelajah...');
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setSelectedUser(response.data.data);
      setIsViewOpen(true);
      toast.dismiss(loadingToast);
    } catch (err) {
      toast.error('Gagal memuat detail penjelajah', { id: loadingToast });
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
    const loadingToast = toast.loading('Sinkronisasi pembaruan profil...');
    try {
      await api.put(`/admin/users/${selectedUser.id}`, editFormData);
      toast.success('Manifes berhasil diperbarui.', { id: loadingToast });
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
    const loadingToast = toast.loading('Adjusting explorer points...');
    try {
      await api.post(`/admin/users/${promptConfig.userId}/adjust-points`, data);
      toast.success('Protocol adjustment successful.', { id: loadingToast });
      refetchUsers();
    } catch (err) {
      toast.error('Failed to adjust explorer points.', { id: loadingToast });
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string, userName: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setConfirmConfig({ userId, role: newRole, userName });
    setIsConfirmOpen(true);
  };

  const onConfirmRoleChange = async () => {
    const loadingToast = toast.loading('Updating member authorization...');
    try {
      await api.put(`/admin/users/${confirmConfig.userId}/role`, { role: confirmConfig.role });
      toast.success('Authorization protocol updated.', { id: loadingToast });
      refetchUsers();
    } catch (err) {
      toast.error('Failed to update role.', { id: loadingToast });
    }
  };


  return (
    <AdminLayout>
       <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
              Daftar <span className="text-accent text-lg">Penjelajah</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Pantau komunitas penjelajah Antarestar dan sistem poin.</p>
          </div>
          <div className="flex gap-4">
             <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                <button 
                  onClick={() => setActiveTab('registry')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'registry' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Registry
                </button>
                <button 
                  onClick={() => setActiveTab('leaderboard')}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leaderboard' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  Leaderboard
                </button>
             </div>
             <div className="bg-white border border-slate-200 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-sm">
                <div className="text-center">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Members</p>
                   <p className="text-sm font-black text-slate-900">{users.length}</p>
                </div>
                <div className="w-px h-6 bg-slate-100" />
                <div className="text-center">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Top Hunter</p>
                   <p className="text-sm font-black text-accent">{leaderboard[0]?.name || '--'}</p>
                </div>
             </div>
          </div>
        </div>

        {activeTab === 'registry' ? (
          <>
        {/* Search */}
        <div className="max-w-md group">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
            </span>
            <input 
              type="text" 
              placeholder="Search members by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center opacity-40 italic">
               <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-[10px] uppercase font-black tracking-[0.2em]">Accessing encrypted explorer logs...</p>
               <p className="text-[10px] uppercase font-black tracking-[0.2em]">Mengakses log penjelajah terenkripsi...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Info Anggota</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Level / Status</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Poin AP</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tgl Bergabung</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Kendali</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user, idx) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent font-display font-black text-sm">
                             {user.name?.[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                               <h4 className="text-[13px] font-black uppercase tracking-tight text-slate-900 leading-tight">{user.name}</h4>
                               {user.role === 'admin' && (
                                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                               )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex items-center gap-2 mb-1.5">
                            <Award className={`w-3.5 h-3.5 ${user.membership?.tier?.name === 'Elite' ? 'text-accent' : 'text-slate-400'}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Anggota {user.membership?.tier?.name || 'Bronze'}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 italic">Akun Aktif</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-[11px] font-black text-slate-900">
                        {user.total_points || 0} AP
                      </td>
                      <td className="px-6 py-6 text-[11px] font-black text-slate-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 text-slate-400">
                           <button 
                             onClick={() => handleOpenView(user.id)}
                             title="Detailed Manifest" 
                             className="p-2.5 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                           >
                               <Eye className="w-4 h-4" />
                            </button>
                            <button 
                             onClick={() => handleOpenEdit(user)}
                             title="Refine Profile" 
                             className="p-2.5 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                           >
                               <Edit className="w-4 h-4" />
                            </button>
                           <button 
                             onClick={() => handleAdjustPoints(user.id, user.name)}
                             title="Adjust Points" 
                             className="p-2.5 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                           >
                              <TrendingUp className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => handleUpdateRole(user.id, user.role, user.name)}
                             title="Manage Role" 
                             className={`p-2.5 rounded-xl transition-all ${user.role === 'admin' ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'}`}
                           >
                              <Shield className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => navigate(`/admin/orders?user_id=${user.id}`)}
                              title="View Order History" 
                              className="p-2.5 text-slate-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                            >
                               <Users className="w-4 h-4" />
                            </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </>
        ) : (
          /* Leaderboard Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden h-fit">
               <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <Trophy className="w-5 h-5" />
                     </div>
                     <h3 className="font-display font-black text-lg uppercase tracking-tight italic">Peringkat <span className="text-accent underline">Hunter</span> Terbaik</h3>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Urutkan berdasar Vol. Pesanan</span>
               </div>
               
               <div className="divide-y divide-slate-100">
                  {isLeaderboardLoading ? (
                     <div className="p-20 text-center animate-pulse opacity-40">
                        <Trophy className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Menghitung ulang peringkat penjelajah...</p>
                     </div>
                  ) : leaderboard.length === 0 ? (
                     <div className="p-20 text-center opacity-40">
                        <Users className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Tidak ada data operasional ditemukan.</p>
                     </div>
                  ) : leaderboard.map((item, idx) => (
                     <div key={item.id} className="px-8 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="relative">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black text-sm border ${
                                 idx === 0 ? 'bg-accent text-white border-accent shadow-lg shadow-accent/25' :
                                 idx === 1 ? 'bg-slate-900 text-white border-slate-900 shadow-lg' :
                                 idx === 2 ? 'bg-blue-500 text-white border-blue-500 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100'
                              }`}>
                                 {idx + 1}
                              </div>
                              {idx < 3 && (
                                 <motion.div 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100"
                                 >
                                    <Award className={`w-3.5 h-3.5 ${idx === 0 ? 'text-accent' : idx === 1 ? 'text-slate-900' : 'text-blue-500'}`} />
                                 </motion.div>
                              )}
                           </div>
                           <div>
                              <h4 className="text-[13px] font-black uppercase tracking-tight text-slate-900 group-hover:text-accent transition-colors">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Penjelajah {item.membership?.tier?.name || 'Bronze'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[14px] font-display font-black text-slate-900 leading-none">{item.orders_count}</p>
                           <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Pesanan Selesai</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
               <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                  <Users className="w-8 h-8 text-accent mb-6" />
                  <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic mb-4 leading-none">Dominasi <span className="text-accent underline">Operasional</span></h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">Visualisasi pemburu paling aktif di jaringan Antarestar.</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Avg Vol Pesanan</p>
                        <p className="text-xl font-display font-black">12.4</p>
                     </div>
                     <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">Tingkat Retensi</p>
                        <p className="text-xl font-display font-black text-accent">94%</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {isViewOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col">
                <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent font-display font-black text-xl">
                         {selectedUser.name?.[0]}
                      </div>
                      <div>
                         <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic leading-none">{selectedUser.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID Penjelajah:</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-2 py-0.5 rounded-md">#{selectedUser.id.substring(0, 8)}</span>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => setIsViewOpen(false)} className="w-12 h-12 rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-400">
                      <X className="w-6 h-6 text-red-500" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Personal Info */}
                      <div className="space-y-6">
                         <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                               <Users className="w-3.5 h-3.5" /> Data Identitas
                            </h4>
                            <div className="space-y-4">
                               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Protokol Email</p>
                                  <p className="text-[13px] font-bold text-slate-900 flex items-center gap-2"><Mail className="w-3 h-3 text-accent" /> {selectedUser.email}</p>
                               </div>
                               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Kontak</p>
                                  <p className="text-[13px] font-bold text-slate-900 flex items-center gap-2"><Phone className="w-3 h-3 text-accent" /> {selectedUser.phone || 'Tidak Ada Kontak Terhubung'}</p>
                               </div>
                               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Bergabung Sejak</p>
                                  <p className="text-[13px] font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-3 h-3 text-accent" /> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                               </div>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                               <MapPin className="w-3.5 h-3.5" /> Lokasi Basis
                            </h4>
                            <div className="space-y-3">
                               {selectedUser.addresses?.length > 0 ? selectedUser.addresses.slice(0, 2).map((addr: any) => (
                                  <div key={addr.id} className="p-4 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-600 bg-slate-50/50">
                                     {addr.address_line}, {addr.city?.name}
                                  </div>
                               )) : (
                                  <p className="text-[11px] italic text-slate-400 p-2">Tidak ada koordinat logistik aktif.</p>
                               )}
                            </div>
                         </div>
                      </div>

                      {/* Bio & Stats */}
                      <div className="md:col-span-2 space-y-8">
                         <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-900 rounded-3xl p-6 text-white text-center">
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Kekuatan</p>
                               <p className="text-2xl font-display font-black text-accent">{selectedUser.total_points || 0}</p>
                               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Poin AP</p>
                            </div>
                            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100">
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Vol. Operasi</p>
                               <p className="text-2xl font-display font-black text-slate-900">{selectedUser.orders_count || 0}</p>
                               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Pesanan Selesai</p>
                            </div>
                            <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100">
                               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Level Otoritas</p>
                               <p className="text-2xl font-display font-black text-slate-900 uppercase italic">{selectedUser.role === 'admin' ? 'Komandan' : 'Penjelajah'}</p>
                               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Akses Protokol</p>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                               <Award className="w-3.5 h-3.5" /> Biografi Penjelajah
                            </h4>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                               <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic overflow-hidden">
                                  {selectedUser.bio || "Tidak ada pernyataan misi yang ditentukan oleh penjelajah ini."}
                               </p>
                            </div>
                         </div>

                         <div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                               <History className="w-3.5 h-3.5" /> Log Logistik
                            </h4>
                            <div className="space-y-4">
                               {selectedUser.orders?.slice(0, 3).map((order: any) => (
                                  <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all hover:border-accent/40">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                           <ShoppingBag className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                           <p className="text-[11px] font-black uppercase text-slate-900 leading-none mb-1">Pesanan #{order.id.substring(0, 6)}</p>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[12px] font-black text-slate-900 leading-none mb-1">Rp {Number(order.total_amount).toLocaleString('id-ID')}</p>
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                                           order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                                        }`}>{order.status === 'completed' ? 'Selesai' : order.status}</span>
                                     </div>
                                  </div>
                               ))}
                               {selectedUser.orders?.length === 0 && <p className="text-[11px] italic text-slate-400">Tidak ada riwayat logistik tercatat.</p>}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative z-10 shadow-2xl">
                <div className="mb-8 text-center">
                   <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent mx-auto mb-6">
                      <Edit className="w-8 h-8" />
                   </div>
                   <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic mb-2">Profil <span className="text-accent underline">Override</span></h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Sesuaikan kredensial penjelajah dan tingkat otoritas.</p>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Protokol Email</label>
                      <input 
                        type="email" 
                        required
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kontak (Telepon)</label>
                      <input 
                        type="text" 
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        placeholder="e.g. +628123456789"
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Akses Protokol (Peran)</label>
                      <select 
                        value={editFormData.role}
                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                        className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold outline-none focus:ring-4 focus:ring-accent/10 transition-all appearance-none"
                      >
                         <option value="user">Penjelajah (User)</option>
                         <option value="admin">Komandan (Admin)</option>
                      </select>
                   </div>
                   
                   <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 h-12 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Batal</button>
                      <button type="submit" className="flex-[2] h-12 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">Simpan Perubahan</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation for Role Change */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onConfirmRoleChange}
        title="Peringatan Otoritas"
        message={`Konfirmasi modifikasi peran untuk ${confirmConfig.userName} ke status: ${confirmConfig.role.toUpperCase()}?`}
        confirmText="Konfirmasi Modifikasi"
        variant="info"
      />

      {/* Prompt for Points Adjustment */}
      <PromptModal 
        isOpen={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
        onSubmit={onPromptSubmit}
        title="Points Adjustment"
        subtitle="Specify protocol modification and audit reason."
        userName={promptConfig.userName}
      />
    </AdminLayout>
  );
};

export default UserManagement;
