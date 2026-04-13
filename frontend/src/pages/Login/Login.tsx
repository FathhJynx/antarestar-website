import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, User, Lock, ArrowRight, ShieldCheck, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import AuthSideBanner from "@/components/auth/AuthSideBanner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedEmail = email.trim();

    try {
      const response = await api.post("/auth/login", { email: trimmedEmail, password });
      
      if (response.data && response.data.data) {
        const { user, token } = response.data.data;
        login(user, token);
        
        toast.success("Wuih, Balik Lagi Nih! 🔥", {
          description: "Lo udah masuk ke markas. Siap lanjut petualangan?",
        });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      // Extract specific error messages if available (from Laravel Validation)
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0] as string
        : error.response?.data?.message || "Email atau password lo salah nih.";

      toast.error("Login Gagal", {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0B0B] font-body overflow-hidden text-white">
      {/* Left Side: Immersive Image (Hidden on Mobile) */}
      <AuthSideBanner />

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-[#0B0B0B] border-l border-white/5">
        {/* Mobile Header Overlay (Image background on mobile only) */}
        <div className="lg:hidden absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop" alt="BG" className="w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-12 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Kembali ke Beranda</span>
          </Link>

          <div className="mb-10">
            <h1 className="font-display font-black text-4xl text-white uppercase tracking-tight mb-3 italic">SIAP LANJUT MISI?</h1>
            <p className="text-white/50 text-sm">Siapkan gear dan mental lo buat misi selanjutnya. Yuk gas masuk!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nama Pemanggil (Email)</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="lo@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 bg-white/5 border-white/10 focus:border-orange-600 focus:ring-0 rounded-none transition-all font-body text-sm text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Kode Akses (Sandi)</Label>
                <Link to="/forgot-password" title="Wait, I forgot!" className="text-orange-600 hover:text-white font-display text-[10px] font-black uppercase tracking-widest transition-colors">Lupa sandi?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-12 bg-white/5 border-white/10 focus:border-orange-600 focus:ring-0 rounded-none transition-all font-body text-sm text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-orange-600 hover:bg-white hover:text-black text-white font-display font-black text-sm uppercase tracking-[0.2em] rounded-none transition-all active:scale-[0.98] group"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/20 border-t-white-600 rounded-full"
                />
              ) : (
                <span className="flex items-center justify-center gap-3">
                  GAS MASUK <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Belum masuk regu?</p>
            <Link 
              to="/register" 
              className="w-full h-14 border border-white/10 hover:border-orange-600 hover:bg-orange-600/5 hover:text-orange-600 flex items-center justify-center font-display font-black text-[11px] uppercase tracking-[0.2em] rounded-none transition-all"
            >
              YUK GABUNG EXPLORER
            </Link>
            
            <div className="flex items-center gap-2 text-muted-foreground/40 font-body text-[10px] uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              <span>Sistem Enskripsi Aman Terverifikasi</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
