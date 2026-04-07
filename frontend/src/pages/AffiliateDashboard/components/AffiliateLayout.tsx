import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Reveal } from '@/components/AnimationPrimitives';
import Footer from '@/components/Footer';

const AffiliateLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-orange-600/30 relative">
      {/* 1. Sidebar - FIXED POSITION */}
      <Sidebar />

      {/* 2. Main Content - OFFSET by Sidebar Width */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative">
         {/* Top Info Bar (Mobile Only) */}
         <div className="lg:hidden h-20 border-b border-white/5 flex items-center justify-between px-6 sm:px-10 shrink-0 bg-black z-[100] sticky top-0">
            <h1 className="font-display font-black text-xl uppercase tracking-tighter">
               ANTARESTAR <span className="text-orange-600">HUB.</span>
            </h1>
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-display font-black text-[10px] text-white">
                  {user?.name?.[0]?.toUpperCase() || 'A'}
               </div>
            </div>
         </div>

         <main className="flex-1 p-6 sm:p-10 lg:p-16 pt-10 lg:pt-32 pb-40">
            <Reveal>
               <div className="max-w-[1500px] mx-auto">
                {children}
               </div>
            </Reveal>
         </main>
         
         <Footer />
      </div>
    </div>
  );
};

export default AffiliateLayout;
