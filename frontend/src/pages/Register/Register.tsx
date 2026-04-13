import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, ShieldCheck, ChevronLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import AuthSideBanner from "@/components/auth/AuthSideBanner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Password tidak cocok", {
        description: "Pastikan konfirmasi password Anda sama dengan password utama.",
      });
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword
      });

      toast.success("Mantap, Akun Lo Jadi! 🚀", {
        description: "Akun lo udah aktif. Yuk gas login buat mulai petualangan!",
      });
      navigate("/login");
    } catch (error: any) {
      toast.error("Registrasi Gagal", {
        description: error.response?.data?.message || "Terjadi kesalahan saat mendaftar akun.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0B0B0B] font-body overflow-hidden text-white">
      {/* Left Side: Immersive Image (Hidden on Mobile) */}
      <AuthSideBanner />

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-[#0B0B0B] border-l border-white/5">
        {/* Mobile Header Overlay */}
        <div className="lg:hidden absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2073&auto=format&fit=crop" alt="BG" className="w-full h-full object-cover opacity-20 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[440px] relative z-10"
        >
          {/* Back button */}
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Kembali ke Login</span>
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-600/10 border border-orange-600/20 text-orange-600 rounded-none mb-4">
              <UserPlus className="w-3 h-3" />
              <span className="font-display text-[9px] font-black uppercase tracking-widest">Pendaftaran Regu</span>
            </div>
            <h1 className="font-display font-black text-4xl text-white uppercase tracking-tight mb-3 italic">IKUT EKSPEDISI?</h1>
            <p className="text-white/50 text-sm">Gabung jadi regu explorer dan dapetin akses eksklusif ke gear terbaik kita.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nama Asli</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Antarestar Explorer"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 focus:border-orange-600 focus:ring-0 rounded-none transition-all font-body text-sm text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nama Pemanggil (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="lo@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 bg-white/5 border-white/10 focus:border-orange-600 focus:ring-0 rounded-none transition-all font-body text-sm text-white placeholder:text-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Kode Akses</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 bg-white/5 border-white/10 focus:border-orange-600 focus:ring-0 rounded-none transition-all font-body text-sm text-white placeholder:text-white/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Ulangi Kode</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-12 bg-white/5 border-white/10 focus:border-orange-600 focus:ring-0 rounded-none transition-all font-body text-sm text-white placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-orange-600 hover:bg-white hover:text-black text-white font-display font-black text-sm uppercase tracking-[0.2em] rounded-none transition-all active:scale-[0.98] group"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    DAFTAR SEKARANG <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-6">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Udah punya akses?</p>
            <Link 
              to="/login"
              className="w-full h-14 border border-white/10 hover:border-orange-600 hover:bg-orange-600/5 hover:text-orange-600 flex items-center justify-center font-display font-black text-[11px] uppercase tracking-[0.2em] rounded-none transition-all"
            >
              GAS MASUK
            </Link>
            
            <div className="flex items-center gap-2 text-muted-foreground/40 font-body text-[10px] uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              <span>Proteksi Data Terjamin</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
