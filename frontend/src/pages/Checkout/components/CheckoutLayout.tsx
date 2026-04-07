import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/AnimationPrimitives";

interface CheckoutLayoutProps {
  children: React.ReactNode;
  summary: React.ReactNode;
  stickyBottom: React.ReactNode;
}

const CheckoutLayout = ({ children, summary, stickyBottom }: CheckoutLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white selection:bg-orange-600 selection:text-white font-body">
      <Navbar />

      <main className="pt-28 pb-32 md:pb-24 px-4 sm:px-6 md:px-20 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Reveal>
             <div className="mb-8 md:mb-16 space-y-3">
                <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">Finalisasi Pesanan</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight">
                    CHECKOUT <span className="text-white/20">GEAR.</span>
                </h1>
             </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* LEFT: FORM */}
            <div className="lg:col-span-8 space-y-8">
               {children}
            </div>

            {/* RIGHT: SUMMARY (STICKY) */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8">
               {summary}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
         {stickyBottom}
      </div>

      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default CheckoutLayout;
