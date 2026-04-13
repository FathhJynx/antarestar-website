import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Layers,
  Ticket,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dasbor', path: '/admin' },
    { icon: Package, label: 'Produk', path: '/admin/products' },
    { icon: Layers, label: 'Kategori', path: '/admin/categories' },
    { icon: ShoppingBag, label: 'Pesanan', path: '/admin/orders' },
    { icon: FileText, label: 'Laporan Penjualan', path: '/admin/sold-products' },
    { icon: Users, label: 'Manajemen Pengguna', path: '/admin/users' },
    { icon: Ticket, label: 'Diskon & Voucher', path: '/admin/discounts' },
    { icon: Zap, label: 'Flash Sale', path: '/admin/flash-sales' },
    { icon: FileText, label: 'Manajemen Konten', path: '/admin/content' },
  ];

  const fetchNotificationData = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        api.get('/notifications/unread-count'),
        api.get('/notifications?per_page=5')
      ]);
      setUnreadCount(countRes.data.data.unread_count);
      setNotifications(listRes.data.data.data || []);
    } catch (err) {
      console.error('Failed to sync notifications');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('Semua notifikasi ditandai dibaca');
    } catch (err) {
      toast.error('Gagal memperbarui status notifikasi');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read');
    }
  };

  useEffect(() => {
    fetchNotificationData();
    const interval = setInterval(fetchNotificationData, 60000); // Polling every 60s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex font-body">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'
          } fixed inset-y-0 left-0 z-50 bg-[#141414] border-r border-white/5 transition-all duration-300 ease-in-out hidden lg:block shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-20 flex items-center px-6 border-b border-white/5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <Package className="w-6 h-6" />
              </div>
              {isSidebarOpen && (
                <span className="font-display font-black text-lg uppercase tracking-tighter">
                  Panel <span className="text-accent">Admin</span>
                </span>
              )}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/20'
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-accent'} transition-colors`} />
                  {isSidebarOpen && (
                    <span className={`text-[13px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && isSidebarOpen && (
                    <motion.div layoutId="active-pill" className="ml-auto">
                      <ChevronRight className="w-4 h-4 text-white/50" />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-500" />
              {isSidebarOpen && (
                <span className="text-[11px] font-black uppercase tracking-widest">Keluar</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header */}
        <header className="h-20 bg-[#141414]/90 backdrop-blur-md sticky top-0 z-[40] border-b border-white/5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-white/40 hover:bg-white/5 hover:text-white rounded-lg hidden lg:block"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden md:block w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="w-4 h-4 text-white/30" />
              </span>
              <input
                type="text"
                placeholder="Cari data..."
                className="w-full pl-10 pr-4 py-2 bg-[#0B0B0B] border border-white/10 rounded-xl text-xs text-white placeholder:text-white/20 focus:border-accent/40 focus:bg-white/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 p-1.5 pr-4 bg-[#0B0B0B] border border-white/5 rounded-full">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-display font-black text-xs">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-wider text-white leading-none mb-0.5">{user?.name || 'Administrator'}</p>
                <p className="text-[8px] font-bold text-accent uppercase tracking-widest leading-none">Administrator Utama</p>
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-lg relative transition-all ${isNotificationsOpen ? 'bg-accent/10 text-accent' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-[#141414] rounded-full flex items-center justify-center text-[8px] font-black text-white"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-[#1a1a1a] border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
                  >
                    <div className="p-6 bg-[#141414] border-b border-white/5 flex items-center justify-between">
                      <div>
                        <h4 className="text-[12px] font-black uppercase tracking-widest text-white leading-none">Notifikasi</h4>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Pemberitahuan Sistem</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-white/5">
                          {notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`p-5 flex gap-4 transition-colors cursor-pointer group hover:bg-white/5 ${!notif.is_read ? 'bg-accent/5' : ''}`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.title.includes('Pesanan') ? 'bg-blue-500/10 text-blue-500' :
                                  notif.title.includes('Stok') ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-white/5 text-white/60'
                                }`}>
                                {notif.title.includes('Pesanan') ? <ShoppingBag className="w-5 h-5" /> :
                                  notif.title.includes('Stok') ? <AlertTriangle className="w-5 h-5" /> :
                                    <Bell className="w-5 h-5" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h5 className={`text-[11px] font-black uppercase tracking-tight truncate ${!notif.is_read ? 'text-white' : 'text-white/50'}`}>
                                    {notif.title}
                                  </h5>
                                  {!notif.is_read && <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />}
                                </div>
                                <p className="text-[11px] text-white/50 font-bold line-clamp-2 leading-relaxed mb-2 italic">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/30">
                                  <Clock className="w-3 h-3" />
                                  {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center opacity-30 italic">
                          <CheckCircle2 className="w-8 h-8 mb-2" />
                          <p className="text-[9px] font-black uppercase tracking-[0.2em]">Tidak ada pemberitahuan baru</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-[#141414] border-t border-white/5">
                      <Link
                        to="/admin/orders"
                        onClick={() => setIsNotificationsOpen(false)}
                        className="w-full py-3 bg-[#0B0B0B] border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white hover:border-accent/40 transition-all shadow-sm"
                      >
                        Lihat Seluruh Aktivitas
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar overlay could be added here if needed */}
    </div>
  );
};

export default AdminLayout;
