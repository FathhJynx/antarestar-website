import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

// Components
import AffiliateLayout from './components/AffiliateLayout';
import StatsGrid from './components/StatsGrid';
import PerformanceChart from './components/PerformanceChart';
import AffiliateLink from './components/AffiliateLink';
import ProductGrid from './components/ProductGrid';
import RecentActivity from './components/RecentActivity';
import WithdrawSection from './components/WithdrawSection';
import LoadingState from './components/LoadingState';
import RegistrationForm from './components/RegistrationForm';
import CommissionTable from './components/CommissionTable';
import SettingsForm from './components/SettingsForm';
import MissionBriefing from './components/MissionBriefing';

import { Reveal, StaggerContainer, StaggerItem } from '@/components/AnimationPrimitives';
import { Zap, Landmark } from 'lucide-react';

const AffiliateDashboard = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingStats, setLoadingStats] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated) {
      api.get('/affiliate/dashboard').then(res => {
         setDashboard(res.data?.data);
      }).catch(err => {
         if (err.response?.status === 400 && err.response.data?.message?.includes('No affiliate')) {
             // Not an affiliate yet
         }
      }).finally(() => setLoadingStats(false));
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loadingStats) {
      return <LoadingState />;
  }

  // Enrollment Prompt if not an affiliate
  if (!dashboard) {
    return <RegistrationForm />;
  }

  // Determine current sub-view
  const path = location.pathname;
  const isProducts = path.includes('/products');
  const isCommissions = path.includes('/commissions');
  const isWithdraw = path.includes('/withdraw');
  const isSettings = path.includes('/settings');
  const isDashboard = path === '/affiliate/dashboard' || path === '/affiliate/dashboard/';

  return (
    <AffiliateLayout>
      <MissionBriefing />
      <div className="space-y-12 lg:space-y-20">
        {/* 1. Portal Header - Mission Ready */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 border-b border-white/10 pb-12 overflow-hidden">
           <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-[pulse_2s_infinite]" />
                 <p className="font-display font-black text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-white/30">AGENT MANAGEMENT PROTOCOL</p>
              </div>
              <div className="relative group">
                 <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.9] text-white">
                   {isDashboard && <>PORTAL <br className="md:hidden" /> <span className="text-white/10">AGENT.</span></>}
                   {isProducts && <>GEAR <br className="md:hidden" /> <span className="text-white/10">INVENTORY.</span></>}
                   {isCommissions && <>AUDIT <br className="md:hidden" /> <span className="text-white/10">TREASURY.</span></>}
                   {isWithdraw && <>LIQUID <br className="md:hidden" /> <span className="text-white/10">DYNAMICS.</span></>}
                   {isSettings && <>SYSTEM <br className="md:hidden" /> <span className="text-white/10">CONFIG.</span></>}
                 </h1>
                 <div className="absolute -bottom-2 left-0 w-20 h-1.5 bg-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </div>
           </div>
           
           <div className="flex flex-col xl:text-right gap-4 bg-white/[0.02] border border-white/5 p-6 lg:p-8 hover:border-orange-600/20 transition-all group shrink-0">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-orange-600 transition-colors">OPERATIVE IDENTIFICATION</p>
              <h4 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tighter tabular-nums text-white group-hover:text-orange-600 transition-colors">
                 {dashboard.affiliate?.code}
              </h4>
           </div>
        </div>

        {/* Dynamic Views */}
        {isDashboard && (
          <div className="space-y-16 lg:space-y-24">
            <StaggerContainer>
               <StaggerItem>
                  <StatsGrid stats={dashboard.stats} />
               </StaggerItem>
            </StaggerContainer>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
               <PerformanceChart />
               <AffiliateLink affiliateCode={dashboard.affiliate?.code} />
            </div>

            <ProductGrid />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
               <RecentActivity />
               <div className="space-y-8 md:space-y-12">
                  <WithdrawSection balance={dashboard.stats?.current_balance || 0} />
                  <div className="bg-white/5 border border-white/5 p-8 sm:p-12 space-y-6 flex flex-col items-center justify-center text-center group hover:border-orange-600/30 transition-all cursor-default overflow-hidden relative">
                     <div className="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Zap className="w-12 h-12 text-orange-600 mb-4 animate-bounce" />
                     <p className="font-display font-black text-xl md:text-3xl uppercase text-white tracking-tighter leading-tight relative z-10">
                        GAS LAGI, TINGGAL <br /> DIKIT LAGI TARGET LO 🔥
                     </p>
                     <button className="relative z-10 text-[9px] font-black uppercase text-orange-600 tracking-[0.4em] border-b border-orange-600/20 hover:border-orange-600 transition-all">
                        LIHAT PROGRESS
                     </button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {isProducts && <ProductGrid />}
        {isWithdraw && <WithdrawSection balance={dashboard.stats?.current_balance || 0} />}
        {isCommissions && <CommissionTable />}
        {isSettings && <SettingsForm />}
      </div>
    </AffiliateLayout>
  );
};

export default AffiliateDashboard;
