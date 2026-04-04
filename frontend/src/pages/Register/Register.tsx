import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, ArrowRight, ShieldCheck, ChevronLeft, UserPlus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import heroImg from "@/assets/hero-outdoor.jpg";

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

      toast.success("Registrasi Berhasil!", {
        description: "Akun Anda telah dibuat. Silakan masuk untuk memulai petualangan.",
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
    <div className="min-h-screen w-full flex bg-background font-body overflow-hidden">
      {/* Left Side: Immersive Image (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src={heroImg} 
          alt="Outdoor Adventure" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20" />
        
        {/* Brand Content */}
        <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img src="/logo.webp" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <span className="font-display font-black text-xl text-white uppercase tracking-tighter">Antare<span className="text-accent">star</span></span>
          </Link>

          <div className="max-w-md">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-black text-5xl text-white uppercase leading-none mb-6 italic"
            >
              Start Your <br /> 
              <span className="text-secondary text-6xl">JOURNEY</span> <br />
              <span className="text-accent">WITH US.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed"
            >
              Bergabunglah dengan komunitas penjelajah terbesar dan nikmati keuntungan eksklusif sebagai member Antarestar.
            </motion.p>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-xs font-display uppercase tracking-widest">
            <span>© 2024 Antarestar</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Explorer Community</span>
          </div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-background">
        {/* Mobile Header Overlay */}
        <div className="lg:hidden absolute inset-0 z-0">
            <img src={heroImg} alt="BG" className="w-full h-full object-cover opacity-20 grayscale" />
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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 text-accent rounded-full mb-4">
              <UserPlus className="w-3 h-3" />
              <span className="font-display text-[9px] font-black uppercase tracking-widest text-accent">Pendaftaran Member</span>
            </div>
            <h1 className="font-display font-black text-4xl text-primary uppercase tracking-tight mb-3">Buat Akun Baru</h1>
            <p className="text-muted-foreground text-sm">Lengkapi data diri Anda untuk bergabung sebagai member resmi.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Bima Adyaksa"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 pl-12 bg-secondary/30 border-transparent focus:border-accent focus:ring-accent/10 rounded-2xl transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 pl-12 bg-secondary/30 border-transparent focus:border-accent focus:ring-accent/10 rounded-2xl transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 bg-secondary/30 border-transparent focus:border-accent focus:ring-accent/10 rounded-2xl transition-all font-body text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pl-12 bg-secondary/30 border-transparent focus:border-accent focus:ring-accent/10 rounded-2xl transition-all font-body text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-display font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/10 transition-all active:scale-[0.98] group"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    Daftar Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-border flex flex-col items-center gap-6">
            <p className="text-muted-foreground text-xs">Sudah memiliki akun?</p>
            <Link 
              to="/login"
              className="w-full h-12 border-2 border-border hover:border-accent hover:bg-accent/5 hover:text-accent flex items-center justify-center font-display font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
            >
              Masuk ke Akun Anda
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
