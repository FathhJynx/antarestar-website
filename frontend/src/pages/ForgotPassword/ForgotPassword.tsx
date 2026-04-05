import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ArrowRight, ChevronLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import heroImg from "@/assets/hero-outdoor.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedEmail = email.trim();

    try {
      await api.post("/auth/forgot-password", { email: trimmedEmail });
      setIsSent(true);
      toast.success("Tautan Dikirim", {
        description: "Silakan periksa kotak masuk email Anda untuk mengatur ulang kata sandi.",
      });
    } catch (error: any) {
      const errorMsg = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat()[0] as string
        : error.response?.data?.message || "Terjadi kesalahan saat memproses permintaan Anda.";

      toast.error("Permintaan Gagal", {
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
              Secure Your <br /> 
              <span className="text-accent">Account.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/70 text-lg leading-relaxed"
            >
              Kami mengutamakan keamanan data dan privasi Anda. Atur ulang kata sandi melalui verifikasi tautan email yang aman.
            </motion.p>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-xs font-display uppercase tracking-widest">
            <span>© 2024 Antarestar</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>Explorer Community</span>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-background">
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
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-12 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Kembali ke Halaman Masuk</span>
          </Link>

          <div className="mb-10">
            <h1 className="font-display font-black text-4xl text-primary uppercase tracking-tight mb-3">Lupa Kata Sandi</h1>
            <p className="text-muted-foreground text-sm">
              Masukkan alamat email Anda untuk menerima tautan pengaturan ulang kata sandi.
            </p>
          </div>

          {isSent ? (
            <div className="flex flex-col items-center justify-center p-8 bg-secondary/30 border border-success/20 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-2">
                <MailCheck className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-lg text-primary">Tautan Terkirim!</h3>
              <p className="text-muted-foreground text-sm">
                Kami telah mengirim email ke <span className="font-bold text-foreground">{email}</span> dengan instruksi untuk mengatur ulang kata sandi Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-display text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Alamat Email Terdaftar</Label>
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
                    Kirim Otentikasi <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
