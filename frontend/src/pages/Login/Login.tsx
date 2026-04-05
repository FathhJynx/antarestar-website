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

import heroImg from "@/assets/hero-outdoor.jpg";

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
        
        toast.success("Selamat Datang Kembali!", {
          description: "Anda telah berhasil masuk ke Antarestar Explorer Hub.",
        });
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      // Extract specific error messages if available (from Laravel Validation)
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0] as string
        : error.response?.data?.message || "Email atau password salah.";

      toast.error("Login Gagal", {
        description: errorMsg,
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
              className="font-display font-black text-5xl text-white uppercase leading-none mb-6"
            >
              Where First Step <br /> 
              <span className="text-accent">Matter.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed"
            >
              Bergabunglah dengan komunitas penjelajah terbesar dan temukan perlengkapan petualangan terbaik untuk menemani langkah Anda.
            </motion.p>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-xs font-display uppercase tracking-widest">
            <span>© 2024 Antarestar</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Explorer Community</span>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-background">
        {/* Mobile Header Overlay (Image background on mobile only) */}
        <div className="lg:hidden absolute inset-0 z-0">
            <img src={heroImg} alt="BG" className="w-full h-full object-cover opacity-20 grayscale" />
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
            <h1 className="font-display font-black text-4xl text-primary uppercase tracking-tight mb-3">Selamat Datang</h1>
            <p className="text-muted-foreground text-sm">Masuk untuk mengakses fitur eksklusif dan pesanan Anda.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Alamat Email</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 bg-secondary/50 border-transparent focus:border-accent focus:ring-accent/10 rounded-2xl transition-all font-body text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Kata Sandi</Label>
                <Link to="/forgot-password" className="text-accent hover:text-accent/80 font-display text-[10px] font-black uppercase tracking-widest">Lupa Kata Sandi?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pl-12 bg-secondary/50 border-transparent focus:border-accent focus:ring-accent/10 rounded-2xl transition-all font-body text-sm"
                />
              </div>
            </div>

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
                  Masuk Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-border flex flex-col items-center gap-6">
            <p className="text-muted-foreground text-xs">Belum punya akun?</p>
            <Link 
              to="/register" 
              className="w-full h-12 border-2 border-border hover:border-accent hover:bg-accent/5 hover:text-accent flex items-center justify-center font-display font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
            >
              Daftar Sebagai Member
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
