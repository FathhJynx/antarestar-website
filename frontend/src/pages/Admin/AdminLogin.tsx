import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, ShieldCheck, Lock, ArrowRight, Fingerprint, Key, ChevronLeft } from "lucide-react";
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
        
        // Strict role check for the admin portal
        if (user.role !== 'admin') {
          toast.error("Akses Ditolak", {
            description: "Akun Anda tidak memiliki izin administratif untuk mengakses portal ini.",
          });
          return;
        }

        login(user, token);
        
        toast.success("Otorisasi Berhasil", {
          description: `Selamat datang kembali, ${user.name}. Sesi administratif telah dimulai.`,
        });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0] as string
        : error.response?.data?.message || "Kredensial yang Anda masukkan tidak valid.";

      toast.error("Otorisasi Gagal", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] font-body relative overflow-hidden p-6">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-center" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] relative z-10"
      >
        {/* Hub Logo */}
        <div className="flex flex-col items-center mb-10">
           <Link to="/" className="group mb-8">
             <div className="w-16 h-16 bg-white/[0.03] border border-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-xl shadow-2xl group-hover:border-accent transition-all duration-500 group-hover:scale-110">
                <ShieldCheck className="w-8 h-8 text-accent" />
             </div>
           </Link>
           <h2 className="font-display font-black text-3xl text-white uppercase tracking-tighter text-center">
             Pusat <span className="text-accent">Kendali</span> Admin
           </h2>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Protokol Autentikasi Level-4 Aktif</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
           {/* Inner Glow */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />
           
           <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Identitas Admin</Label>
                <div className="relative">
                  <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ADMIN_ID"
                    className="w-full h-14 pl-14 pr-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold outline-none ring-accent/10 focus:ring-4 focus:border-accent/40 transition-all text-sm placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Kata Sandi</Label>
                <div className="relative">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-14 pr-5 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold outline-none ring-accent/10 focus:ring-4 focus:border-accent/40 transition-all text-sm placeholder:text-slate-700"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-display font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-accent/20 transition-all active:scale-[0.98] group"
              >
                {isLoading ? (
                   <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  <span className="flex items-center gap-3">
                    Masuk ke Sistem <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
           </form>

           <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
              <Link to="/login" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                 <ChevronLeft className="w-3 h-3" /> Login Penjelajah
              </Link>
              <div className="flex items-center gap-2 text-slate-500 text-[8px] font-black uppercase tracking-[0.2em]">
                 <Lock className="w-3 h-3 text-accent" />
                 <span>Port Aman</span>
              </div>
           </div>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-3 opacity-30">
          <ShieldAlert className="w-3.5 h-3.5 text-white" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white">Peringatan: Akses tidak sah akan dicatat</span>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
