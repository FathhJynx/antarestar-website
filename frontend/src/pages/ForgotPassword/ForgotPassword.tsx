import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ArrowRight, ChevronLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

import AuthSideBanner from "@/components/auth/AuthSideBanner";

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
    <div className="min-h-screen w-full flex bg-[#0B0B0B] font-body overflow-hidden text-white">
      {/* Left Side: Immersive Image (Hidden on Mobile) */}
      <AuthSideBanner />

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 relative bg-[#0B0B0B] border-l border-white/5">
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
          <Link to="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-12 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display text-[10px] font-black uppercase tracking-widest">Kembali ke Halaman Masuk</span>
          </Link>

          <div className="mb-10">
            <h1 className="font-display font-black text-4xl text-white uppercase tracking-tight mb-3 italic">LUPA KODE AKSES?</h1>
            <p className="text-white/50 text-sm">
              Santai, tinggal masukin email lo di bawah buat atur ulang sandi.
            </p>
          </div>

          {isSent ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white/5 border border-orange-600/30 rounded-none text-center space-y-4">
              <div className="w-16 h-16 bg-orange-600/10 text-orange-600 rounded-none flex items-center justify-center mb-2">
                <MailCheck className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-lg text-white">Tautan Terkirim!</h3>
              <p className="text-white/50 text-sm italic">
                Cek email lo di <span className="font-bold text-white uppercase">{email}</span>. Gas atur ulang sandinya biar bisa login lagi.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-display text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Email lo yang terdaftar</Label>
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
                    KIRIM TAUTAN <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
