import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import MemberAreaSkeleton from '@/pages/MemberArea/components/MemberAreaSkeleton';
import MemberSidebar from './components/MemberSidebar';
import MemberHero from './components/MemberHero';
import DashboardTab from './components/DashboardTab';
import ProfileTab from './components/ProfileTab';
import OrdersTab from './components/OrdersTab';
import LeaderboardTab from './components/LeaderboardTab';
import ReferralTab from './components/ReferralTab';

const MemberArea = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
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
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, pointsRes, referralsRes, leaderboardRes, productsRes, ordersRes] = await Promise.all([
          api.get('/user/profile'),
          api.get('/user/points'),
          api.get('/user/referrals'),
          api.get('/user/leaderboard?limit=50'),
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
          
          <MemberSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            profile={profile} 
            handleLogout={handleLogout} 
          />

          {/* ── MAIN CONTENT ── */}
          <section className="flex-1 bg-[#0B0B0B]">
             
             <MemberHero profile={profile} progressPercentage={progressPercentage} />

             {/* ── TAB CONTENT ── */}
             <div className="p-8 lg:p-16 max-w-6xl mx-auto pb-32">
                {activeTab === "dashboard" && (
                  <DashboardTab profile={profile} recommendations={recommendations} />
                )}

                {activeTab === "settings" && (
                  <ProfileTab profile={profile} setProfile={setProfile} handleSave={handleSave} />
                )}

                {activeTab === "orders" && (
                  <OrdersTab orders={orders} />
                )}

                {activeTab === "leaderboard" && (
                   <LeaderboardTab leaderboard={leaderboard} profileName={profile.name} />
                )}

                {activeTab === "referral" && (
                   <ReferralTab profile={profile} handleCopyCode={handleCopyCode} handleShare={handleShare} copied={copied} />
                )}
             </div>
          </section>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default MemberArea;
