/**
 * Affiliate.tsx — Affiliate Program landing page
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, DollarSign, BarChart3, Rocket, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, Globe, Target
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Affiliate = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDashboardAccess = () => {
    if (!isAuthenticated) {
      toast("Login Diperlukan", {
        description: "Silakan masuk untuk mengakses dashboard affiliate Anda.",
      });
      navigate("/login", { state: { from: { pathname: "/affiliate/dashboard" } } });
      return;
    }
    navigate("/affiliate/dashboard");
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Komisi Tinggi",
      desc: "Dapatkan komisi hingga 15% untuk setiap penjualan yang berhasil melalui link referral Anda."
    },
    {
      icon: BarChart3,
      title: "Real-time Tracking",
      desc: "Pantau performa, klik, dan konversi Anda secara real-time melalui dashboard eksklusif."
    },
    {
      icon: Zap,
      title: "Pembayaran Cepat",
      desc: "Proses pencairan dana yang mudah dan cepat langsung ke rekening bank atau e-wallet Anda."
    },
    {
      icon: Target,
      title: "Materi Marketing",
      desc: "Akses ke ribuan aset visual, banner, dan copy yang siap pakai untuk promosi Anda."
    }
  ];

  const steps = [
    {
      n: "01",
      title: "Daftar",
      desc: "Gabung secara gratis dan dapatkan link referral unik Anda dalam hitungan menit."
    },
    {
      n: "02",
      title: "Promosikan",
      desc: "Bagikan link Anda di media sosial, blog, atau komunitas Anda."
    },
    {
      n: "03",
      title: "Dapatkan Hasil",
      desc: "Terima komisi untuk setiap pembelian yang dilakukan melalui link Anda."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-primary">
        {/* BG image */}
        <div className="absolute inset-0">
          <img 
            src="/C:/Users/LENOVO/.gemini/antigravity/brain/5ced9312-97bd-4286-a3ff-41d71b9e1b8d/affiliate_hero_bg_1774841238189.png" 
            alt="" 
            className="w-full h-full object-cover opacity-20 filter grayscale scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
        </div>

        {/* Floating Abstract Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 right-10 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-10 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] pointer-events-none"
        />

        <div className="section-container px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <FadeUp>
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent font-display text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                  <Rocket className="w-4 h-4" />
                  Pusat Afiliasi Resmi
                </div>
              </FadeUp>
              
              <FadeUp delay={0.1}>
                <h1 className="font-display font-black text-white text-5xl sm:text-7xl md:text-8xl uppercase leading-[0.88] tracking-tighter mb-8 italic">
                  GROW <br />
                  <span className="text-secondary">FAST</span> <br />
                  <span className="text-accent">EARN MORE.</span>
                </h1>
              </FadeUp>
              
              <FadeUp delay={0.2}>
                <p className="font-body text-white/50 text-lg md:text-xl max-w-lg mb-12 leading-relaxed">
                  Bergabunglah dengan ekosistem kreator terbesar di industri outdoor. Dapatkan akses eksklusif ke produk baru dan komisi yang terus bertumbuh.
                </p>
              </FadeUp>
              
              <FadeUp delay={0.3}>
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <button 
                    onClick={handleDashboardAccess}
                    className="w-full sm:w-auto h-16 px-6 sm:px-12 bg-accent text-white font-display font-black text-[11px] sm:text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 sm:gap-4 hover:bg-accent/90 transition-all shadow-[0_0_32px_rgba(230,81,0,0.4)] group whitespace-nowrap"
                  >
                    Daftar Gratis & Mulai Cuan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <a 
                    href="#how-it-works"
                    className="w-full sm:w-auto h-16 px-6 sm:px-10 border-2 border-white/10 text-white font-display font-bold text-[11px] sm:text-sm uppercase tracking-widest rounded-2xl flex items-center justify-center hover:bg-white/5 transition-all whitespace-nowrap"
                  >
                    Lihat Model Komisi
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Visual Teaser */}
            <div className="hidden lg:block relative">
              <FadeUp delay={0.4}>
                <div className="relative p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl">
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center">
                          <DollarSign className="w-7 h-7 text-secondary" />
                        </div>
                        <div>
                          <p className="text-white/40 font-body text-[10px] uppercase tracking-widest">Estimasi Komisi</p>
                          <p className="text-white font-display font-black text-2xl">Rp 2.450.000</p>
                        </div>
                      </div>
                      <div className="px-4 py-1.5 bg-green-500/20 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">+24%</div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      {[
                        { label: 'Klik Link', val: '12.4K', color: 'blue' },
                        { label: 'Konversi', val: '342', color: 'orange' }
                      ].map(s => (
                        <div key={s.label} className="p-6 bg-black/20 rounded-[2rem] border border-white/5">
                           <p className="text-white/30 font-body text-[8px] uppercase tracking-[0.3em] mb-2">{s.label}</p>
                           <p className="text-white font-display font-black text-3xl">{s.val}</p>
                        </div>
                      ))}
                   </div>

                   <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-muted-foreground/30 overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                      <p className="text-white/40 font-body text-[10px] uppercase tracking-widest">+841 Kreator Bergabung</p>
                   </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-secondary/30">
        <div className="section-container px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.1}>
                <div className="bg-card p-8 rounded-[2rem] border border-border h-full flex flex-col hover:border-accent/40 transition-all group">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <b.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-display font-black text-xl uppercase mb-3">{b.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="section-container px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <FadeUp>
                <h2 className="font-display font-black text-4xl sm:text-5xl uppercase leading-[0.95] tracking-tight mb-8 italic">
                  Tiga Langkah <br /> <span className="text-muted-foreground/30">Mudah Memulai.</span>
                </h2>
              </FadeUp>
              <div className="space-y-8">
                {steps.map((s, i) => (
                  <FadeUp key={s.n} delay={i * 0.1}>
                    <div className="flex gap-6">
                      <div className="font-display font-black text-4xl text-accent/20 italic">{s.n}</div>
                      <div>
                        <h4 className="font-display font-black text-lg uppercase mb-2">{s.title}</h4>
                        <p className="font-body text-sm text-muted-foreground max-w-sm">{s.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 w-full aspect-square bg-primary/5 rounded-[3rem] border border-primary/10 relative overflow-hidden flex items-center justify-center p-12">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="relative z-10 w-full bg-card border border-border shadow-2xl rounded-3xl p-6"
               >
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20" />
                      <div>
                        <div className="w-24 h-2 bg-muted-foreground/20 rounded mb-2" />
                        <div className="w-16 h-1.5 bg-muted-foreground/10 rounded" />
                      </div>
                    </div>
                    <div className="text-accent font-display font-black text-xl">Rp 1.250.000</div>
                 </div>
                 <div className="space-y-4">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center justify-between py-3 border-t border-border">
                        <div className="w-32 h-2 bg-muted-foreground/10 rounded" />
                        <div className="w-12 h-2 bg-accent/20 rounded" />
                      </div>
                    ))}
                 </div>
               </motion.div>
               
               {/* Decorative dots */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #E65100 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="section-container px-6 sm:px-8 lg:px-12 relative z-10 text-center">
          <FadeUp>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter mb-8 italic">
              Siap Untuk <span className="text-secondary">Melangkah Lebih Jauh?</span>
            </h2>
            <p className="font-body text-white/60 text-lg max-w-xl mx-auto mb-12">
              Bergabunglah Sekarang dan nikmati kemudahan menghasilkan pendapatan pasif bersama brand outdoor nomor satu di Indonesia.
            </p>
            <button 
              onClick={handleDashboardAccess}
              className="h-14 px-8 sm:px-12 bg-accent text-white font-display font-black text-xs sm:text-sm uppercase tracking-widest rounded-2xl hover:bg-accent/90 transition-all shadow-2xl shadow-accent/20 inline-flex items-center gap-4 whitespace-nowrap"
            >
              Gabung Komunitas Partner <ArrowRight className="w-4 h-4" />
            </button>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Affiliate;
