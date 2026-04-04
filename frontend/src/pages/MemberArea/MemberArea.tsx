import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Copy, CheckCircle2, ChevronRight, Gift, Trophy, Activity, Users, Star, Truck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/AnimationPrimitives';
import api from '@/lib/api';
import MemberAreaSkeleton from '@/components/MemberAreaSkeleton';

// Remove Mock Data Constants as we'll use backend data

const MemberArea = () => {
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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, pointsRes, referralsRes, leaderboardRes, notifRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/user/points'),
          api.get('/user/referrals'),
          api.get('/user/leaderboard'),
          api.get('/notifications')
        ]);

        const profileData = profileRes.data.data;
        const ptsData = pointsRes.data.data;
        const referralList = referralsRes.data.data;
        const pts = Array.isArray(ptsData) ? ptsData : (ptsData.data || []);
        
        let nextTierPoints = 20000;
        if (profileData.current_tier?.name === 'Bronze') nextTierPoints = 500;
        if (profileData.current_tier?.name === 'Ranger') nextTierPoints = 2000;

        setProfile({
          name: profileData.user.name,
          joinDate: new Date(profileData.user.created_at).toLocaleDateString(),
          tier: profileData.current_tier?.name || "Bronze",
          points: profileData.total_points || 0,
          nextTierPoints: nextTierPoints,
          referralCode: profileData.user.referral_code || "ANT-MEMBER",
          referralCount: Array.isArray(referralList) ? referralList.length : 0,
          history: (pts || []).map((p: any) => ({
             id: p.id,
             action: p.source || 'Aktivitas',
             points: p.points > 0 ? `+${p.points}` : (p.points || 0).toString(),
             date: p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'
          })),
          bio: profileData.user.bio || "Pecinta alam yang suka mengeksplorasi pegunungan di Indonesia.",
          globalRank: profileData.global_rank || 0
        });

        setLeaderboard((leaderboardRes.data.data || []).map((user: any, idx: number) => ({
          rank: idx + 1,
          name: user.name || 'Anonymous',
          points: user.total_points || 0,
          tier: user.membership?.tier?.name || 'Bronze'
        })));

        setNotifications(notifRes.data.data || []);
      } catch (e) {
        console.error("Failed fetching member area data", e);
      }
    };
    fetchAllData().finally(() => setIsLoading(false));
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.put('/user/profile', { name: profile.name, bio: profile.bio });
    } catch(err) {
        console.error(err);
    }
    setIsEditing(false);
  };

  const progressPercentage = (profile.points / profile.nextTierPoints) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-[30px]">
      <Navbar />

      {isLoading ? (
        <MemberAreaSkeleton />
      ) : (
        <main className="section-padding section-container max-w-6xl mx-auto py-10">
        <Reveal delay={0.2}>
          <div className="py-16 md:py-24 text-center max-w-3xl mx-auto">
            <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter mb-4 italic">
              Area <span className="text-accent">Member</span> Penjelajah
            </h1>
            <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
              Selamat datang kembali, petualang. Ini adalah hub eksklusif Anda untuk mengelola pencapaian, referral, dan keuntungan member Antarestar.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COL: Profile & Tier (Main focus) */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8">
            <Reveal delay={0.1}>
              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-2xl shadow-black/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
                
                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-secondary p-1">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center border-4 border-card overflow-hidden">
                          <UserAvatar name={profile.name} size="large" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-card rounded-full" />
                    </div>

                    {!isEditing ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-1">{profile.name}</h2>
                        <p className="text-xs font-black text-accent uppercase tracking-widest mb-4">{profile.tier} Member</p>
                        <p className="text-sm text-muted-foreground leading-relaxed italic max-w-xs mx-auto mb-6">
                          "{profile.bio}"
                        </p>
                        <Button 
                          onClick={() => setIsEditing(true)}
                          variant="outline" 
                          className="rounded-full px-8 font-black uppercase text-[10px] tracking-widest h-10 border-2 hover:bg-accent hover:border-accent hover:text-white transition-all"
                        >
                          Edit Profil
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        onSubmit={handleSave}
                        className="w-full space-y-4 text-left"
                      >
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-1 block">Nama Lengkap</label>
                          <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})}
                            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2 mb-1 block">Bio / Slogan</label>
                          <textarea 
                            value={profile.bio} 
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            rows={3}
                            className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" className="flex-1 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 bg-accent hover:bg-accent/90">
                            Simpan
                          </Button>
                          <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl font-black uppercase text-[10px] tracking-widest h-12">
                            Batal
                          </Button>
                        </div>
                      </motion.form>
                    )}
                  </div>

                  <div className="h-px bg-border my-8" />

                  {/* Tier Card - Premium Redesign */}
                  <div className="bg-gradient-to-br from-primary to-black text-white p-6 rounded-3xl mb-0 shadow-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.3em] text-accent font-black mb-1">Keuntungan Loyalitas</p>
                          <h3 className="font-display font-black text-2xl uppercase tracking-tighter">
                            {profile.tier}
                          </h3>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                          <Award className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/50">
                          <span>{(profile.points || 0).toLocaleString('id-ID')} AP</span>
                          <span>{(profile.nextTierPoints || 500).toLocaleString('id-ID')} AP</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progressPercentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: 'circOut' }}
                            className="h-full bg-gradient-to-r from-accent to-secondary rounded-full shadow-[0_0_12px_rgba(230,81,0,0.5)]"
                          />
                        </div>
                        <p className="text-[9px] text-white/30 text-center font-bold tracking-widest uppercase">
                           {(Math.max(0, (profile.nextTierPoints || 0) - (profile.points || 0))).toLocaleString('id-ID')} poin lagi ke Elite
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Points & Perk Stats */}
            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border p-6 rounded-3xl text-center">
                   <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <Star className="w-5 h-5 text-accent" />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Poin Penjelajah</p>
                   <p className="font-display font-black text-2xl">{(profile.points || 0).toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-card border border-border p-6 rounded-3xl text-center">
                   <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-5 h-5 text-secondary" />
                   </div>
                   <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Peringkat Global</p>
                   <p className="font-display font-black text-2xl">#{profile.globalRank || '-'}</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COL: Leaderboard & Referral & History */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Order Notifications Card */}
               <Reveal delay={0.25}>
                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-display font-black text-xl uppercase tracking-tighter">Notifikasi Pesanan</h3>
                    </div>
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {notifications.length > 0 ? notifications.slice(0, 3).map((notif, idx) => {
                      const Icon = notif.type === 'order' ? Truck : notif.type === 'payment' ? CheckCircle2 : Activity;
                      return (
                        <div key={notif.id || idx} className="flex gap-4 p-3 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 group/item">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover/item:bg-card transition-colors">
                            <Icon className="w-4 h-4 text-muted-foreground group-hover/item:text-accent transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-black uppercase tracking-tight text-foreground">{notif.title}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-1 mb-1">{notif.message || notif.desc}</p>
                            <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                {new Date(notif.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                        <Activity className="w-8 h-8 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Belum ada notifikasi</p>
                      </div>
                    )}
                  </div>

                  <Button variant="ghost" className="w-full mt-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted">
                    Lihat Semua Notifikasi
                  </Button>
                </div>
              </Reveal>

               {/* Referral Card */}
               <Reveal delay={0.3}>
                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tighter">Pusat Referral</h3>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                    Bagikan semangat petualangan! Ajak temanmu bergabung dan dapatkan <strong>1.500 AP</strong> setiap mereka berbelanja untuk pertama kalinya.
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="bg-muted/50 p-4 rounded-2xl border border-border flex items-center justify-between group">
                      <span className="font-display font-black text-xl tracking-[0.2em] text-foreground">
                        {profile.referralCode}
                      </span>
                      <Button 
                        size="icon" 
                        variant={copied ? "default" : "outline"}
                        onClick={handleCopyCode}
                        className={`h-10 w-10 rounded-full transition-all ${copied ? 'bg-green-600 border-green-600 animate-bounce' : 'hover:bg-accent hover:border-accent hover:text-white'}`}
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-2xl border border-border text-center">
                        <p className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">Referral</p>
                        <p className="font-display font-black text-2xl text-foreground">{profile.referralCount}</p>
                      </div>
                      <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 text-center">
                        <p className="text-[8px] uppercase tracking-widest text-accent font-black mb-1">Bonus</p>
                        <p className="font-display font-black text-2xl text-accent">+{profile.referralCount * 1500}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Leaderboard Summary */}
              <Reveal delay={0.4}>
                <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/20">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-display font-black text-xl uppercase tracking-tighter">Papan Skor</h3>
                    </div>
                    <span className="text-[8px] font-black tracking-widest uppercase bg-secondary/10 text-secondary px-3 py-1 rounded-full">Top 5</span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {leaderboard.length > 0 ? leaderboard.slice(0, 5).map((user, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${user.name === profile.name ? 'border-accent bg-accent/5 shadow-inner' : 'border-border/50 bg-muted/20 hover:bg-muted/40'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] ${idx === 0 ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[11px] uppercase tracking-wider font-display font-black truncate max-w-[80px] sm:max-w-none ${user.name === profile.name ? 'text-accent' : 'text-foreground/80'}`}>{user.name}</p>
                          </div>
                        </div>
                        <p className="font-display font-black text-xs text-foreground/60">{(user.points || 0).toLocaleString('id-ID')} AP</p>
                      </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center opacity-30">
                            <Trophy className="w-8 h-8 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Memuat data...</p>
                        </div>
                    )}
                  </div>

                  <Button variant="ghost" className="w-full mt-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted">
                    Semua Peringkat <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Wide History Card */}
            <Reveal delay={0.5}>
              <div className="bg-card border border-border p-8 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Activity className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tighter">Jejak Aktivitas</h3>
                  </div>
                  <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Unduh Laporan</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 relative">
                  <div className="absolute left-[20px] top-4 bottom-4 w-px bg-border hidden sm:block" />
                  {profile.history.map((item, i) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative sm:pl-12 flex items-center justify-between p-4 hover:bg-muted/30 rounded-2xl transition-colors"
                    >
                      <div className={`absolute left-[14px] top-6 w-3 h-3 rounded-full ring-4 ring-card hidden sm:block ${item.points.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-display font-black text-sm uppercase tracking-tight text-foreground">{item.action}</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1 tracking-widest">{item.date}</p>
                      </div>
                      <div className={`font-display font-black text-lg ${String(item.points).startsWith('+') ? 'text-green-500' : 'text-accent'}`}>
                        {item.points}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

          </div>
        </div>

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
