import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Award, Copy, CheckCircle2, ChevronRight, Gift, Trophy, Activity, Users, Star, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/AnimationPrimitives';
import api from '@/lib/api';
import MemberAreaSkeleton from '@/components/MemberAreaSkeleton';

// Remove Mock Data Constants as we'll use backend data

const MemberArea = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>({
    name: "Petualang",
    joinDate: "-",
    tier: "Bronze",
    points: 0,
    nextTierPoints: 500,
    referralCode: "",
    referralCount: 0,
    history: [],
    bio: "Selamat datang di Antarestar!",
    globalRank: 0
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, pointsRes, referralsRes, leaderboardRes, notifRes, productsRes, ordersRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/user/points'),
          api.get('/user/referrals'),
          api.get('/user/leaderboard?limit=50'),
          api.get('/notifications'),
          api.get('/products'),
          api.get('/orders')
        ]);

        const profileData = profileRes.data.data;
        const ptsData = pointsRes.data.data;
        const referralList = referralsRes.data.data;
        
        setProfile({
          name: profileData.user.name,
          joinDate: new Date(profileData.user.created_at).toLocaleDateString(),
          tier: profileData.current_tier?.name || "Bronze",
          points: profileData.total_points || 0,
          nextTierPoints: profileData.current_tier?.name === 'Bronze' ? 500 : 2000,
          referralCode: profileData.user.referral_code || "ANT-MEMBER",
          referralCount: Array.isArray(referralList) ? referralList.length : 0,
          history: (Array.isArray(ptsData) ? ptsData : (ptsData.data || [])).map((p: any) => ({
             id: p.id,
             action: p.source || 'Aktivitas',
             points: p.points > 0 ? `+${p.points}` : (p.points || 0).toString(),
             date: new Date(p.created_at).toLocaleDateString()
          })),
          bio: profileData.user.bio || "Selamat berpetualang!",
          globalRank: profileData.global_rank || 0
        });

        setLeaderboard((leaderboardRes.data.data || []).map((user: any, idx: number) => ({
          rank: idx + 1,
          name: user.name,
          points: parseInt(user.total_points) || 0,
          tier: user.membership?.tier?.name || 'Explorer'
        })));

        setNotifications(notifRes.data.data || []);
        
        const prods = (productsRes.data.data.products || productsRes.data.data || []);
        setRecommendations(Array.isArray(prods) ? prods.slice(0, 3) : []);

        setOrders(Array.isArray(ordersRes.data.data) ? ordersRes.data.data : (ordersRes.data.data.data || []));
      } catch (err) {
        console.error("Failed fetching member area data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Gabung Antarestar Explorer Hub!',
          text: `Ayo petualang bareng gue di Antarestar. Pake kode referral gue: ${profile.referralCode}`,
          url: window.location.origin
        });
      } else {
        handleCopyCode();
        toast.success("Link referral disalin ke clipboard!");
      }
    } catch (e) {
      console.log('Sharing failed', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await api.put('/user/profile', { name: profile.name, bio: profile.bio });
        toast.success("Profil lo berhasil diupdate, petualang!");
    } catch(err) {
        console.error(err);
        toast.error("Gagal update profil. Coba lagi!");
    } finally {
        setIsLoading(false);
        setIsEditing(false);
    }
  };

  const progressPercentage = (profile.points / profile.nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-body selection:bg-orange-600 selection:text-white">
      <Navbar />

      {isLoading ? (
        <MemberAreaSkeleton />
      ) : (
        <main className="flex flex-col lg:flex-row min-h-screen pt-20">
          
          {/* ── STICKY SIDEBAR (NIKE/ADIDAS STYLE) ── */}
          <aside className="w-full lg:w-80 lg:min-h-screen border-r border-white/5 bg-[#0B0B0B] relative z-20">
            <div className="sticky top-20 p-8 space-y-12">
               {/* User Brief */}
               <div className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center overflow-hidden group-hover:border-orange-600 transition-colors duration-500">
                     <UserAvatar name={profile.name} size="large" />
                  </div>
                  <div>
                     <h3 className="font-display font-black text-lg uppercase tracking-tight leading-none mb-1">{profile.name}</h3>
                     <p className="text-[10px] font-black uppercase text-orange-600 tracking-widest">{profile.tier} MEMBER</p>
                  </div>
               </div>

               {/* Navigation Menu */}
               <nav className="flex flex-col gap-1">
                  {[
                    { label: "Dashboard", id: "dashboard", icon: Activity },
                    { label: "Pesanan lo", id: "orders", icon: Truck },
                    { label: "Pusat referral", id: "referral", icon: Users },
                    { label: "Ranking global", id: "leaderboard", icon: Trophy },
                    { label: "Ganti profil", id: "settings", icon: Star },
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-4 py-4 px-4 border-l-2 transition-all group rounded-none text-left ${activeTab === item.id ? 'border-orange-600 bg-white/5 text-white' : 'border-transparent text-white/40 hover:text-orange-600 hover:bg-white/5'}`}
                    >
                      <item.icon className={`w-4 h-4 group-hover:scale-110 transition-transform ${activeTab === item.id ? 'text-orange-600' : ''}`} />
                      <span className="font-display font-black uppercase text-[11px] tracking-[0.2em]">{item.label}</span>
                    </button>
                  ))}
               </nav>

               <div className="pt-12">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 italic">LOGOUT SESI</p>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full border-white/10 rounded-none h-12 uppercase font-black text-[10px] tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                  >
                     Keluar Sesi
                  </Button>
               </div>
            </div>
          </aside>

          {/* ── MAIN SCROLLABLE CONTENT ── */}
          <section className="flex-1 bg-[#0B0B0B]">
             
             {/* ── MEMBER HERO BANNER ── */}
             <div className="relative h-[400px] bg-black overflow-hidden flex items-end border-b border-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" 
                  alt="Outdoor" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale hover:scale-105 transition-transform duration-10000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent z-[1]" />
                
                <div className="relative z-10 p-12 w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
                   <Reveal delay={0.1}>
                      <div className="space-y-2">
                        <p className="text-orange-600 font-display font-black uppercase tracking-[0.4em] text-xs">OFFICIAL EXPLORER</p>
                        <h1 className="font-display font-black text-6xl md:text-8xl text-white uppercase tracking-tighter italic leading-[0.85]">
                           SIAp <br /> MENDAKI.
                        </h1>
                      </div>
                   </Reveal>

                   <Reveal delay={0.25}>
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-none w-full md:w-[320px] shadow-2xl">
                         <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Poin</span>
                            <span className="text-orange-600 font-display font-black text-xl italic">{profile.points.toLocaleString('id-ID')} AP</span>
                         </div>
                         <div className="h-1 bg-white/10 rounded-none mb-4 overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${progressPercentage}%` }}
                             className="h-full bg-orange-600"
                           />
                         </div>
                         <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 text-center italic">
                            {(profile.nextTierPoints - profile.points).toLocaleString('id-ID')} Poin Menuju Level Elite
                         </p>
                      </div>
                   </Reveal>
                </div>
             </div>

             <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12 min-h-screen">
                
                {activeTab === "dashboard" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    {/* BENTO GRID STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                      <div className="bg-white/5 p-10 border border-white/10 group hover:bg-orange-600 transition-all duration-500">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 group-hover:text-white transition-colors italic">Peringkat lo</p>
                          <h4 className="font-display font-black text-5xl italic group-hover:scale-110 transition-transform origin-left">#{profile.globalRank}</h4>
                      </div>
                      <div className="bg-white/5 p-10 border border-white/10 group hover:bg-white transition-all duration-500">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 group-hover:text-black transition-colors italic">Lama Join</p>
                          <h4 className="font-display font-black text-5xl italic group-hover:text-black group-hover:scale-110 transition-transform origin-left">{profile.joinDate}</h4>
                      </div>
                      <div className="bg-white/5 p-10 border border-white/10 group hover:bg-orange-600 transition-all duration-500">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 group-hover:text-white transition-colors italic">Referral</p>
                          <h4 className="font-display font-black text-5xl italic group-hover:scale-110 transition-transform origin-left">{profile.referralCount}</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      <div className="space-y-8">
                          <div className="flex items-center justify-between border-b-2 border-white pb-4">
                            <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic">JEJAK AKTIFITAS</h3>
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">TERBARU</span>
                          </div>
                          <div className="space-y-1">
                            {profile.history.slice(0, 5).map((item: any, i: number) => (
                              <div key={item.id} className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-all border-b border-white/5">
                                  <div>
                                    <p className="font-display font-black text-sm uppercase tracking-tight group-hover:text-orange-600 transition-colors">{item.action}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1 italic">{item.date}</p>
                                  </div>
                                  <span className="font-display font-black text-xl italic">{item.points}</span>
                              </div>
                            ))}
                          </div>
                      </div>

                      <div className="space-y-12">
                          <div className="bg-orange-600 p-12 text-white overflow-hidden relative group">
                            <div className="relative z-10">
                                <h3 className="font-display font-black text-3xl uppercase tracking-tighter italic mb-4">GABUNG ELITE?</h3>
                                <p className="text-sm font-bold uppercase tracking-tight mb-8 leading-relaxed max-w-xs">
                                  Banyak gear gratis dan prioritas diskon nungguin lo di level atas. 
                                </p>
                                <Button className="bg-black text-white rounded-none w-full h-14 font-display font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                  PELAJARI BENEFIT LEVEL
                                </Button>
                            </div>
                            <Activity className="absolute -bottom-8 -right-8 w-40 h-40 text-black/10 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
                          </div>

                          <div className="space-y-6">
                             <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic border-b border-white/10 pb-4">EKSKLUSIF GEAr</h3>
                             <div className="grid grid-cols-1 gap-4">
                                {recommendations.map((prod: any) => (
                                  <Link key={prod.id} to={`/product/${prod.id}`} className="flex items-center gap-4 group/p">
                                     <div className="w-20 h-20 bg-white/5 border border-white/10 overflow-hidden rounded-none shrink-0 group-hover/p:border-orange-600 transition-colors">
                                        <img src={prod.image || prod.thumb} className="w-full h-full object-cover group-hover/p:scale-110 transition-transform duration-500" alt="" />
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black uppercase text-white/40 mb-1">{prod.category || 'Gear'}</p>
                                        <h5 className="font-display font-black text-sm uppercase leading-tight group-hover/p:text-orange-600 transition-colors">{prod.name}</h5>
                                     </div>
                                  </Link>
                                ))}
                             </div>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
                    <div className="space-y-8">
                       <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic border-b-2 border-white pb-4">PENGATURAN PROFIL</h3>
                       <form onSubmit={handleSave} className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nama Asli</label>
                            <input 
                              type="text" 
                              value={profile.name} 
                              onChange={(e) => setProfile({...profile, name: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 text-sm font-black uppercase outline-none focus:border-orange-600 transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Bio Penjelajah</label>
                            <textarea 
                              value={profile.bio} 
                              onChange={(e) => setProfile({...profile, bio: e.target.value})}
                              rows={4}
                              className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all resize-none italic"
                            />
                          </div>
                          <Button className="bg-orange-600 text-white rounded-none h-14 w-full font-display font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                             SIMPAN PERUBAHAN
                          </Button>
                       </form>
                    </div>
                  </motion.div>
                )}

                {activeTab === "orders" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic border-b-2 border-white pb-4">RIWAYAT PESANAN</h3>
                    <div className="space-y-4">
                       {orders.length > 0 ? (
                         orders.map((order: any) => (
                           <div key={order.id} className="p-8 bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-orange-600 transition-colors">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {order.items?.[0]?.product_variant?.product?.primary_image?.url ? (
                                      <img src={order.items[0].product_variant.product.primary_image.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    ) : (
                                      <Truck className="w-8 h-8 text-white/20 group-hover:text-orange-600 transition-colors" />
                                    )}
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1 italic">#ORD-{order.id.toString().substring(0, 8).toUpperCase()}</p>
                                    <h4 className="font-display font-black text-lg uppercase tracking-tight">STATUS: {order.status?.toUpperCase() || 'DIPROSES'}</h4>
                                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">
                                       {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} ITEMS
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="font-display font-black text-xl italic text-white/80">
                                    Rp {(parseInt(order.total_price) || 0).toLocaleString('id-ID')}
                                 </span>
                                 <Button variant="outline" className="rounded-none border-white/20 h-12 px-8 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                                    LIHAT DETAIL
                                 </Button>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 opacity-20">
                            <Truck className="w-12 h-12 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Belum ada pesanan aktif.</p>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
                {activeTab === "leaderboard" && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div className="flex items-center justify-between border-b-2 border-white pb-4">
                         <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic">PAPAN SKOR GLOBAL</h3>
                         <Trophy className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="space-y-2">
                         {leaderboard.map((user, i) => (
                           <div key={i} className={`flex items-center justify-between p-8 border-b border-white/5 transition-all ${user.name === profile.name ? 'bg-orange-600/10 border-orange-600/50' : 'bg-white/5 hover:bg-white/10'}`}>
                              <div className="flex items-center gap-8">
                                 <span className={`font-display font-black text-2xl italic w-12 ${i === 0 ? 'text-orange-600' : 'text-white/20'}`}>
                                    {i + 1}
                                 </span>
                                 <div>
                                    <h4 className={`font-display font-black text-xl uppercase tracking-tight ${user.name === profile.name ? 'text-orange-600' : 'text-white'}`}>{user.name}</h4>
                                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">{user.tier || 'MEMBER'}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-display font-black text-2xl italic leading-none">{user.points.toLocaleString('id-ID')}</p>
                                 <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">AP POINTS</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </motion.div>
                )}

                {activeTab === "referral" && (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div className="flex items-center justify-between border-b-2 border-white pb-4">
                         <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic">REFERRAL CENTER</h3>
                         <Users className="w-8 h-8 text-orange-600" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                         <div className="bg-white/5 p-12 border border-white/10 space-y-8">
                            <h4 className="font-display font-black text-2xl uppercase italic">KODE MISI LO</h4>
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 flex-wrap md:flex-nowrap">
                               <span className="font-display font-black text-4xl tracking-widest flex-1">{profile.referralCode}</span>
                               <Button onClick={handleCopyCode} className={`h-14 px-8 rounded-none font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-600' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
                                  {copied ? "COPIED" : "COPY"}
                               </Button>
                            </div>
                            <Button onClick={handleShare} className="w-full bg-orange-600 text-white h-16 font-display font-black uppercase tracking-widest rounded-none hover:bg-white hover:text-black transition-all">
                               SHARE MISI KE TEMEN
                            </Button>
                         </div>

                         <div className="bg-orange-600 p-12 text-white space-y-6">
                            <h4 className="font-display font-black text-2xl uppercase italic">GIMANA CARANYA?</h4>
                            <div className="space-y-4">
                               {[
                                 "Share kode unik lo ke temen sesama petualang.",
                                 "Setiap temen join pake kode lo, poin lo nambah 500 AP.",
                                 "Kalo mereka beli gear pertama, bonus 1.500 AP buat lo!",
                                 "Tukerin poin di level Elite buat dapet gear gratis."
                               ].map((step, i) => (
                                 <div key={i} className="flex gap-4">
                                    <span className="font-display font-black text-2xl italic opacity-50">{i + 1}</span>
                                    <p className="text-sm font-bold uppercase tracking-tight leading-relaxed">{step}</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </motion.div>
                )}
             </div>
          </section>
        </main>
      )}
      <Footer />
    </div>
  );
};

// Updated UserAvatar component
const UserAvatar = ({ name, size = "normal" }: { name: string; size?: "normal" | "large" }) => {
  const safeName = name || 'User';
  const initials = safeName.split(' ').map(n => n[0]).join('').substring(0, 2);
  const sizeClasses = size === "large" ? "text-3xl" : "text-base";
  return <span className={`font-display font-black ${sizeClasses} text-accent uppercase`}>{initials}</span>;
}


export default MemberArea;
