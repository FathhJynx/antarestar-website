import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, ShieldCheck, Lock, ArrowRight, Fingerprint, Key, ChevronLeft, Terminal } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const trimmedEmail = email.trim();
    try {
      const response = await api.post("/auth/login", { email: trimmedEmail, password });
      if (response.data && response.data.data) {
        const { user, token } = response.data.data;
        if (user.role !== 'admin') {
          toast.error("AKSES DITOLAK", { description: "Tingkat otorisasi Anda tidak mencukupi untuk mengakses portal admin." });
          return;
        }
        login(user, token);
        toast.success("AUTENTIKASI BERHASIL", { description: `Selamat datang kembali, ${user.name}.` });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat()[0] as string
        : error.response?.data?.message || "Identitas yang Anda masukkan salah.";
      toast.error("AUTENTIKASI GAGAL", { description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0B0B] font-body overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-[45%] bg-[#111] border-r border-white/5 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
          {/* Grid dots */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-black text-sm uppercase tracking-[0.3em] text-white">ANTARESTAR</p>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">KONTROL ADMIN</p>
            </div>
          </Link>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="font-display font-black text-6xl uppercase tracking-tighter leading-none italic text-white mb-4">
              PORTAL<br /><span className="text-accent">ADMIN</span>
            </h1>
            <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-xs">
              Pusat kendali aman untuk mengelola jaringan misi Antarestar. Diperlukan otorisasi tingkat tinggi.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'ENKRIPSI', value: 'AES-256' },
              { label: 'PROTOKOL', value: 'HTTPS/TLS' },
              { label: 'SESI', value: 'JWT Auth' },
              { label: 'MONITORING', value: 'Aktif' },
            ].map(item => (
              <div key={item.label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">{item.label}</p>
                <p className="text-[12px] font-black text-white/60 uppercase italic">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 opacity-30">
          <ShieldAlert className="w-4 h-4 text-white" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Akses tanpa izin akan dicatat dan dilaporkan</span>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-accent/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-black text-sm uppercase tracking-[0.3em] text-white">ADMIN ANTARESTAR</p>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">PUSAT KENDALI AMAN</p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(251,133,0,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">DIBUTUHKAN AUTENTIKASI</span>
            </div>
            <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-white italic">
              LOGIN<br /><span className="text-accent underline decoration-4">ADMINISTRATOR</span>
            </h2>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                  <Fingerprint className="w-3.5 h-3.5 text-accent" />ID_ADMIN
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@antarestar.id"
                  className="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-black text-[12px] outline-none focus:border-accent/40 transition-all placeholder:text-white/10 uppercase tracking-wider"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-accent" />KUNCI_AKSES
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-black text-[14px] outline-none focus:border-accent/40 transition-all placeholder:text-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-accent hover:bg-accent/80 text-white font-display font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-accent/20 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group mt-4"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    <Terminal className="w-5 h-5" />
                    MASUK SISTEM
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <Link to="/login" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors flex items-center gap-2">
                <ChevronLeft className="w-3 h-3" />LOGIN PENJELAJAH
              </Link>
              <div className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-[0.2em]">
                <Lock className="w-3 h-3 text-accent" />
                <span>PORT AMAN</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
