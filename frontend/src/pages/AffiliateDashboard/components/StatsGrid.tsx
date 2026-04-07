import React from "react";
import { MousePointerClick, ShoppingBag, DollarSign, Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface StatsProps {
  stats: any;
}

const StatsGrid = ({ stats }: StatsProps) => {
  const statsList = [
    { label: "KLIK", value: stats?.total_clicks || 0, icon: MousePointerClick, color: "text-blue-500", trend: "+12%" },
    { label: "ORDER", value: stats?.total_conversions || 0, icon: ShoppingBag, color: "text-green-500", trend: "+5%" },
    { label: "KOMISI", value: `RP ${Number(stats?.total_earnings || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: "text-orange-600", trend: "10% RATE" },
    { label: "SALDO", value: `RP ${Number(stats?.current_balance || 0).toLocaleString('id-ID')}`, icon: Wallet, color: "text-orange-600", trend: "READY" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {statsList.map((stat, i) => (
        <motion.div
           key={i}
           className="bg-[#0A0A0A] border border-white/5 p-8 flex flex-col justify-between min-h-[180px] group hover:border-orange-600/30 transition-all duration-500 relative overflow-hidden"
        >
          {/* Subtle Glow */}
          <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 blur-[60px] rounded-full transition-opacity ${stat.color.replace('text', 'bg')}`} />
          
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
               <span className="font-display font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white/40 transition-colors">{stat.label}</span>
               <p className="text-[8px] font-bold text-orange-600 tracking-[0.2em]">{stat.trend}</p>
            </div>
            <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color} opacity-20 group-hover:opacity-100 transition-all flex-shrink-0 group-hover:scale-110 duration-500`} />
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl md:text-3xl lg:text-4xl uppercase tracking-tighter text-white leading-tight mt-6 relative z-10">
            {stat.value}
          </h3>

          <div className="w-10 h-[2px] bg-white/5 group-hover:w-full group-hover:bg-orange-600 transition-all duration-700 mt-6" />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
