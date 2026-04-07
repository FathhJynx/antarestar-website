import React from "react";
import { MapPin, Truck, CreditCard, StickyNote, Info } from "lucide-react";

interface CheckoutSectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const CheckoutSection = ({ title, subtitle, icon, children }: CheckoutSectionProps) => (
  <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-5 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden group">
    {/* Decorative Blur BG */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="flex items-center gap-4 border-b border-white/5 pb-6 sm:pb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 flex items-center justify-center rounded-xl text-orange-600 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="font-bold text-[9px] uppercase tracking-[0.4em] text-orange-600 leading-none">{subtitle}</p>
          <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-white italic leading-none">{title}</h3>
        </div>
      </div>

    <div className="grid gap-4">
      {children}
    </div>
  </div>
);

export const CheckoutInput = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    <p className="font-bold text-[10px] uppercase tracking-widest text-white/20 ml-1">{label}</p>
    <input 
      {...props}
      className="w-full bg-black border border-white/5 rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-sm font-bold text-white placeholder:text-white/10 outline-none focus:ring-2 focus:ring-orange-600/20 focus:border-orange-600/50 transition-all"
    />
  </div>
);

const CheckoutForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-8">
       {children}
    </div>
  );
};

export default CheckoutForm;
