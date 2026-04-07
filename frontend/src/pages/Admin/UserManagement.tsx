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
      <div className="space-y-12">
        {/* Command Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5">
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
              MEMBER <span className="text-accent underline decoration-4 underline-offset-8">REGISTRY</span>
            </h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Explorer Network Monitoring & Authorization Hub</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Tab Switcher */}
            <div className="flex bg-white/[0.03] border border-white/5 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setActiveTab('registry')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'registry' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/30 hover:text-white'}`}
              >REGISTRY</button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'leaderboard' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/30 hover:text-white'}`}
              >LEADERBOARD</button>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 h-16 flex items-center gap-5">
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">TOTAL NODES</p>
                <p className="text-lg font-black text-accent italic">{users.length}</p>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">TOP HUNTER</p>
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
                placeholder="SEARCH MEMBER IDENTITY OR COMMS_LINK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-16 pl-16 pr-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] outline-none focus:border-accent/40 transition-all text-white placeholder:text-white/10"
              />
            </div>

            {/* Member Registry Table */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
              {isLoading ? (
                <div className="h-96 flex flex-col items-center justify-center opacity-20">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6" />
                  <p className="text-[10px] uppercase font-black tracking-[0.4em]">Decrypting member database...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">MEMBER ID</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">CLEARANCE / STATUS</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">AP SCORE</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">ENROLLED</th>
                        <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-white/20">CONTROLS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {users.map((user, idx) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="px-10 py-7">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-display font-black text-lg group-hover:scale-110 transition-transform duration-500">
                                {user.name?.[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-[13px] font-black uppercase tracking-tight text-white group-hover:text-accent transition-colors italic">{user.name}</h4>
                                  {user.role === 'admin' && <Shield className="w-4 h-4 text-blue-400" />}
                                </div>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-7">
                            <div className="flex items-center gap-2 mb-2">
                              <Award className={`w-4 h-4 ${user.membership?.tier?.name === 'Elite' ? 'text-accent' : 'text-white/20'}`} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{user.membership?.tier?.name || 'Bronze'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">ONLINE</span>
                            </div>
                          </td>
                          <td className="px-6 py-7">
                            <span className="text-lg font-black text-accent italic">{user.total_points || 0}</span>
                            <span className="text-[10px] font-black text-white/20 ml-1 uppercase tracking-widest">AP</span>
                          </td>
                          <td className="px-6 py-7 text-[11px] font-black text-white/40 uppercase tracking-wider italic">
                            {new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-10 py-7 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleOpenView(user.id)} title="View Profile" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleOpenEdit(user)} title="Edit Profile" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleAdjustPoints(user.id, user.name)} title="Adjust Points" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-accent hover:bg-accent/10 transition-all">
                                <TrendingUp className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleUpdateRole(user.id, user.role, user.name)} title="Manage Role" className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${user.role === 'admin' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'bg-white/5 border-white/5 text-white/20 hover:text-blue-400 hover:bg-blue-400/10'}`}>
                                <Shield className="w-4 h-4" />
                              </button>
                              <button onClick={() => navigate(`/admin/orders?user_id=${user.id}`)} title="Order History" className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-accent hover:bg-accent/10 transition-all">
                                <ArrowUpRight className="w-4 h-4" />
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
          /* Leaderboard */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
              <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent border border-accent/20">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic">HUNTER <span className="text-accent underline decoration-4">LEADERBOARD</span></h3>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">ORDER VOLUME RANKING</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {isLeaderboardLoading ? (
                  <div className="p-20 text-center opacity-20">
                    <Trophy className="w-12 h-12 text-white/10 mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Computing rankings...</p>
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="p-20 text-center opacity-20">
                    <Users className="w-12 h-12 mx-auto mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">No data found.</p>
                  </div>
                ) : leaderboard.map((item, idx) => (
                  <div key={item.id} className="px-10 py-6 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-black text-lg border ${
                          idx === 0 ? 'bg-accent text-white border-accent shadow-lg shadow-accent/30' :
                          idx === 1 ? 'bg-white/10 text-white border-white/10' :
                          idx === 2 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-white/20 border-white/5'
                        }`}>{idx + 1}</div>
                        {idx < 3 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-[#111] rounded-full flex items-center justify-center border border-white/10">
                            <Award className={`w-3.5 h-3.5 ${idx === 0 ? 'text-accent' : idx === 1 ? 'text-white/60' : 'text-blue-400'}`} />
                          </motion.div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-black uppercase tracking-tight text-white group-hover:text-accent transition-colors italic">{item.name}</h4>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{item.membership?.tier?.name || 'Bronze'} TIER</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-display font-black text-white italic leading-none">{item.orders_count}</p>
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">COMPLETED</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-[#111] border border-white/10 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 blur-[80px] -mr-10 -mt-10 rounded-full" />
                <Users className="w-10 h-10 text-accent mb-8 relative z-10" />
                <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic mb-4 leading-none relative z-10">NETWORK <span className="text-accent underline">STATS</span></h3>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed mb-10 relative z-10">Active hunter metrics across the Antarestar network.</p>
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">AVG ORDERS</p>
                    <p className="text-2xl font-display font-black italic">12.4</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">RETENTION</p>
                    <p className="text-2xl font-display font-black italic text-accent">94%</p>
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
          <AdminModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} maxWidth="max-w-6xl">
                <div className="px-12 py-10 border-b border-white/5 bg-[#111] flex items-center justify-between shrink-0">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center text-white font-display font-black text-3xl shadow-2xl shadow-accent/20">
                         {selectedUser.name?.[0]}
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(251,133,0,0.6)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Member Profile</span>
                         </div>
                         <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic text-white">{selectedUser.name}</h3>
                         <p className="text-accent font-black text-[10px] uppercase tracking-[0.3em] mt-1">NODE: {selectedUser.id.substring(0, 16)}</p>
                      </div>
                   </div>
                   <button onClick={() => setIsViewOpen(false)} className="w-14 h-14 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all group">
                      <X className="w-7 h-7 group-hover:rotate-90 transition-transform" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-[#0B0B0B] scrollbar-stealth">
                   <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                      {/* Identity Column */}
                      <div className="md:col-span-4 space-y-6">
                         <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3"><Users className="w-4 h-4 text-accent" />IDENTITY_LEAK</h4>
                            <div className="space-y-4">
                               <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">COMMS_LINK</p>
                                  <p className="text-[12px] font-black text-white/70 flex items-center gap-3"><Mail className="w-4 h-4 text-accent" />{selectedUser.email}</p>
                               </div>
                               <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">CONTACT_NODE</p>
                                  <p className="text-[12px] font-black text-white/70 flex items-center gap-3"><Phone className="w-4 h-4 text-accent" />{selectedUser.phone || 'NO LINK CONFIGURED'}</p>
                               </div>
                               <div className="p-5 bg-black/40 border border-white/5 rounded-2xl">
                                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">ENROLLED</p>
                                  <p className="text-[12px] font-black text-white/70 flex items-center gap-3"><Calendar className="w-4 h-4 text-accent" />{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                               </div>
                            </div>
                         </div>
                         <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-3"><MapPin className="w-4 h-4 text-accent" />COORDINATES</h4>
                            <div className="space-y-3">
                               {selectedUser.addresses?.length > 0 ? selectedUser.addresses.slice(0, 2).map((addr: any) => (
                                  <div key={addr.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl text-[11px] font-bold text-white/40 italic">{addr.address_line}, {addr.city?.name}</div>
                               )) : (<p className="text-[11px] italic text-white/20 p-2">No active coordinates.</p>)}
                            </div>
                         </div>
                      </div>

                      {/* Stats & Activity Column */}
                      <div className="md:col-span-8 space-y-8">
                         <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 text-center relative overflow-hidden">
                               <div className="absolute inset-0 bg-accent/5" />
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 relative z-10">AP SCORE</p>
                               <h3 className="text-5xl font-display font-black text-accent tracking-tighter leading-none mb-2 italic relative z-10 [text-shadow:0_0_30px_rgba(251,133,0,0.4)]">{selectedUser.total_points || 0}</h3>
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 relative z-10">POINTS</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 text-center">
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">OPS_VOL</p>
                               <h3 className="text-5xl font-display font-black text-white tracking-tighter leading-none mb-2 italic">{selectedUser.orders_count || 0}</h3>
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">COMPLETED</p>
                            </div>
                            <div className={`rounded-[2rem] p-8 text-center border relative overflow-hidden ${selectedUser.role === 'admin' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">AUTHORITY</p>
                               <h3 className={`text-2xl font-display font-black uppercase italic leading-none mb-2 tracking-tighter ${selectedUser.role === 'admin' ? 'text-blue-400' : 'text-white/40'}`}>{selectedUser.role === 'admin' ? 'ADMIN' : 'MEMBER'}</h3>
                               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">CLEARANCE</p>
                            </div>
                         </div>
                         <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 flex items-center gap-3"><Award className="w-4 h-4 text-accent" />MISSION_STATEMENT</h4>
                            <p className="text-[13px] font-medium text-white/30 leading-relaxed italic">{selectedUser.bio || "No mission statement defined by this explorer."}</p>
                         </div>
                         <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 flex items-center gap-3"><History className="w-4 h-4 text-accent" />RECENT_OPS</h4>
                            <div className="space-y-4">
                                {selectedUser.orders?.slice(0, 3).map((order: any) => (
                                   <div key={order.id} className="flex items-center justify-between p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-accent/20 transition-all group/ord">
                                      <div className="flex items-center gap-5">
                                         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover/ord:text-accent text-white/20 transition-colors"><ShoppingBag className="w-5 h-5" /></div>
                                         <div>
                                            <p className="text-[13px] font-display font-black uppercase text-white italic group-hover/ord:text-accent transition-colors">#{order.id.substring(0, 8).toUpperCase()}</p>
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] flex items-center gap-2 mt-1"><Calendar className="w-3 h-3" />{new Date(order.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                         </div>
                                      </div>
                                      <div className="text-right">
                                         <p className="text-[15px] font-display font-black text-white italic">Rp {Number(order.total_price || 0).toLocaleString('id-ID')}</p>
                                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mt-1 ${order.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/20 border border-white/5'}`}>
                                            <div className={`w-1 h-1 rounded-full ${order.status === 'completed' ? 'bg-green-400' : 'bg-white/20'}`} />
                                            {order.status}
                                         </span>
                                      </div>
                                   </div>
                                ))}
                               {selectedUser.orders?.length === 0 && <p className="text-[11px] italic text-white/20">No operation logs found.</p>}
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="px-12 py-10 border-t border-white/5 bg-[#111] flex items-center justify-end shrink-0">
                   <button onClick={() => setIsViewOpen(false)} className="h-16 px-12 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-accent hover:text-white transition-all italic">CLOSE_PROFILE</button>
                </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && selectedUser && (
          <AdminModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="max-w-2xl">
                <div className="px-10 py-8 border-b border-white/5 bg-[#111] flex items-center gap-6 shrink-0">
                   <div className="w-14 h-14 bg-accent rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-accent/20">
                      <Edit className="w-7 h-7" />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic text-white">PROFILE <span className="text-accent underline decoration-4">OVERRIDE</span></h3>
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Modify explorer manifest & authority level.</p>
                   </div>
                   <button onClick={() => setIsEditOpen(false)} className="w-12 h-12 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all group">
                      <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 space-y-8 bg-[#0B0B0B] scrollbar-stealth">
                   <form id="editUserForm" onSubmit={handleEditSubmit} className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2"><Users className="w-3 h-3 text-accent" />FULL NAME</label>
                         <input type="text" required value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white uppercase tracking-wider outline-none focus:border-accent/40 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2"><Mail className="w-3 h-3 text-accent" />COMMS_LINK</label>
                         <input type="email" required value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white outline-none focus:border-accent/40 transition-all" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2"><Phone className="w-3 h-3 text-accent" />CONTACT_NODE</label>
                         <input type="text" value={editFormData.phone} onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} placeholder="+628123456789" className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-[12px] font-black text-white outline-none focus:border-accent/40 transition-all placeholder:text-white/10" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-2"><Shield className="w-3 h-3 text-accent" />AUTHORITY_LEVEL</label>
                         <div className="relative">
                           <select value={editFormData.role} onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })} className="w-full h-14 px-6 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-black text-white/60 uppercase tracking-wider outline-none focus:border-accent/40 transition-all appearance-none cursor-pointer">
                              <option value="user" className="bg-[#111]">MEMBER (Basic Access)</option>
                              <option value="admin" className="bg-[#111]">COMMANDER (Full Control)</option>
                           </select>
                           <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 text-white/20 pointer-events-none" />
                         </div>
                      </div>
                   </form>
                </div>

                <div className="px-10 py-8 border-t border-white/5 bg-[#111] flex items-center shrink-0 gap-4">
                   <button type="button" onClick={() => setIsEditOpen(false)} className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border border-white/5 hover:text-white hover:bg-white/5 transition-all">ABORT</button>
                   <button type="submit" form="editUserForm" className="flex-[2] h-14 bg-accent text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent/80 active:scale-95 transition-all shadow-2xl shadow-accent/20 flex items-center justify-center gap-3">
                      <Save className="w-4 h-4" />SYNC PROFILE
                   </button>
                </div>
          </AdminModal>
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
