import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, MousePointerClick, ShoppingBag, ArrowRight, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/AnimationPrimitives';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AffiliateDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingStats, setLoadingStats] = useState(true);
  
  const [dashboard, setDashboard] = useState<any>(null);
  const [conversions, setConversions] = useState<any[]>([]);
  const [linkInput, setLinkInput] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      api.get('/affiliate/dashboard').then(res => {
         setDashboard(res.data?.data);
      }).catch(err => {
         if (err.response?.status === 400 && err.response.data?.message?.includes('No affiliate')) {
             // User is not an affiliate, let's gracefully handle or tell them to register
             toast.error("Akun Anda belum terdaftar sebagai Affiliate.");
         }
      }).finally(() => setLoadingStats(false));

      api.get('/affiliate/conversions').then(res => {
         setConversions(res.data?.data || []);
      }).catch(console.warn);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const generateLink = () => {
    if (!linkInput) return;
    if (!dashboard?.affiliate?.code) {
      toast.error("Kode affiliate tidak ditemukan.");
      return;
    }
    const url = new URL(linkInput);
    url.searchParams.set('ref', dashboard.affiliate.code);
    navigator.clipboard.writeText(url.toString());
    toast.success("Link berhasil disalin ke clipboard!");
  };

  if (isLoading || loadingStats) {
      return <div className="min-h-screen bg-background text-foreground flex items-center justify-center">Memuat Dashboard...</div>;
  }

  // Fallback if not registered (Ideally, redirect to a registration page, but we'll show a prompt)
  if (!dashboard) {
      return (
         <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-[80px]">
           <Navbar />
           <main className="section-padding section-container max-w-6xl mx-auto py-12 flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-display font-black mb-4">Mulai Hasilkan Komisi</h2>
              <p className="text-muted-foreground mb-8">Anda perlu mendaftar program Affiliate terlebih dahulu.</p>
              <Button onClick={() => api.post('/affiliate/register').then(() => window.location.reload())}>Daftar Affiliate Sekarang</Button>
           </main>
           <Footer />
         </div>
      );
  }

  const { stats, affiliate } = dashboard;
  const recentSales = conversions.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-[80px]">
      <Navbar />

      <main className="section-padding section-container max-w-6xl mx-auto py-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-body text-[10px] tracking-[0.4em] font-bold uppercase text-accent bg-accent/10 px-3 py-1.5 rounded-sm">
                  Partner Portal
                </span>
                <span className="font-body text-[10px] tracking-[0.2em] font-bold uppercase text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                </span>
              </div>
               <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2">Affiliate Dashboard</h1>
               <p className="font-body text-xs md:text-sm text-muted-foreground max-w-lg">Hai {user?.name}, pantau performa kampanye, komisi, dan konversi Anda.</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="text-xs uppercase font-bold tracking-widest bg-background">
                Settings
              </Button>
              <Button className="text-xs uppercase font-bold tracking-widest bg-accent hover:bg-accent/90 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                Withdraw Funds
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Top Earnings Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggerItem>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500">
                <DollarSign className="w-20 h-20" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2 relative z-10">Total Komisi</p>
              <h3 className="font-display font-black text-3xl text-foreground relative z-10">
                Rp {Number(stats.total_earnings).toLocaleString('id-ID')}
              </h3>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm relative overflow-hidden group bg-gradient-to-br from-card to-muted">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:-translate-y-2 duration-500">
                <TrendingUp className="w-20 h-20" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-2 relative z-10">Saldo Aktif</p>
              <h3 className="font-display font-black text-3xl text-foreground relative z-10">
                Rp {Number(stats.current_balance).toLocaleString('id-ID')}
              </h3>
              <p className="mt-4 text-[10px] text-muted-foreground relative z-10">Bisa Ditarik</p>
            </div>
          </StaggerItem>

          <StaggerItem>
             <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <MousePointerClick className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Link Clicks</p>
                </div>
                <h3 className="font-display font-black text-3xl text-foreground">{stats.total_clicks}</h3>
             </div>
          </StaggerItem>

          <StaggerItem>
             <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Conversions</p>
                </div>
                <div className="flex items-end justify-between gap-1 overflow-hidden">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-foreground truncate">{stats.total_conversions}</h3>
                  <p className="text-[9px] sm:text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded mb-1 sm:mb-2 shrink-0">CR: {stats.conversion_rate}</p>
                </div>
             </div>
          </StaggerItem>
        </StaggerContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area: Link Generator & Sales Table */}
          <div className="lg:col-span-2 space-y-8">
            
            <Reveal delay={0.3}>
              <div className="bg-gradient-to-r from-card to-accent/5 border border-border p-6 md:p-8 rounded-2xl shadow-sm">
                 <h3 className="font-display font-black text-2xl uppercase tracking-tight mb-2">Generate Affiliate Link</h3>
                 <p className="text-sm text-muted-foreground mb-6">Tempel URL produk dari halaman *store* untuk memanggil link afiliasi unik yang tertaut dengan komisi *{affiliate.commission_value}%* Anda.</p>
                 
                 <div className="flex flex-col sm:flex-row gap-4">
                   <input 
                     type="text" 
                     value={linkInput}
                     onChange={(e) => setLinkInput(e.target.value)}
                     placeholder="https://antarestar.com/store/item..." 
                     className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                   />
                   <Button onClick={generateLink} className="h-auto bg-accent hover:bg-accent/90 text-white font-bold uppercase tracking-widest text-xs px-8">
                     Generate
                   </Button>
                 </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <h3 className="font-display font-black text-xl uppercase tracking-tight">Recent Conversions</h3>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">KODE: {affiliate.code}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-muted-foreground uppercase tracking-widest bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-bold">Order ID</th>
                        <th className="px-6 py-4 font-bold">Amount</th>
                        <th className="px-6 py-4 font-bold text-accent">Komisi Anda</th>
                        <th className="px-6 py-4 font-bold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale: any, i: number) => (
                        <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs">{sale.order_id?.substring(0, 8)}</td>
                          <td className="px-6 py-4 text-muted-foreground">Rp {Number(sale.order_amount).toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 font-bold text-accent">Rp {Number(sale.commission_amount).toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">{new Date(sale.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {recentSales.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground text-sm">Belum ada konversi. Bagikan link Anda!</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Side Panel: Tier Info & Assets */}
          <div className="space-y-8">
            <Reveal delay={0.5}>
               <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full mix-blend-screen pointer-events-none" />
                 <p className="text-[9px] uppercase tracking-widest font-bold text-accent mb-2">Performance Tier</p>
                 <h3 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mb-4 flex items-center gap-3">
                    Silver <span className="bg-white/10 text-[9px] px-2 py-1 rounded">{affiliate.commission_value}% Comm.</span>
                 </h3>
                 
                 <p className="text-xs text-white/70 mb-6 leading-relaxed">
                   Tingkatkan konversi Anda bulan ini untuk membuka tier *Gold* dan nikmati komisi flat **10%** + Prioritas Sample Produk Baru.
                 </p>

                 <div className="space-y-4">
                   <div className="bg-black/40 border border-white/10 rounded-lg p-3 flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                     <span className="text-white/60">Current Target</span>
                     <span className="text-white">{stats.total_conversions} / 100 Sales</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stats.total_conversions / 100) * 100)}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                 </div>
               </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Share2 className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-black text-lg uppercase tracking-tight">Marketing Assets</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-6">Unduh media HD resmi (foto katalog, video klip) bebas hak cipta untuk konten promosi Anda.</p>
                <div className="grid grid-cols-2 gap-3">
                   <div className="aspect-square bg-muted rounded-xl border border-border flex items-center justify-center hover:border-accent transition-colors cursor-pointer group">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent group-hover:scale-105 transition-all">Zip 1.2 GB</span>
                   </div>
                   <div className="aspect-square bg-muted rounded-xl border border-border flex items-center justify-center hover:border-accent transition-colors cursor-pointer group">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent group-hover:scale-105 transition-all">Banners</span>
                   </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default AffiliateDashboard;
