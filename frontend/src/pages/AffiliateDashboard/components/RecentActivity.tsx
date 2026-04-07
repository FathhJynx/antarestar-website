import React from "react";
import { MessageSquare, Zap, TrendingUp, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const RecentActivity = () => {
  const { data: conversions = [] } = useQuery({
    queryKey: ['affiliate-conversions'],
    queryFn: async () => {
       const res = await api.get('/affiliate/conversions');
       return res.data?.data || [];
    }
  });

  return (
    <div className="bg-[#111111] border border-white/5 p-8 sm:p-12 space-y-12">
      <div className="space-y-4">
         <p className="font-body font-bold text-[9px] uppercase tracking-[0.4em] text-white/20 uppercase">TIMELINE</p>
         <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">AKTIVITAS TERBARU.</h3>
      </div>

      <div className="space-y-4">
        {conversions.slice(0, 5).map((activity: any, i: number) => (
          <motion.div 
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-6 p-6 border border-white/5 hover:border-white/10 hover:bg-white/[0.01] transition-all group"
          >
             <div className={`w-12 h-12 flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:text-black transition-all text-green-500`}>
                <ShoppingBag className="w-5 h-5" />
             </div>
             <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">ORDER BERHASIL!</p>
                   <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">+ Rp {Number(activity.commission_amount).toLocaleString('id-ID')}</p>
                </div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wide truncate max-w-[200px] sm:max-w-md">KODE ORDER: #{activity.order_id?.substring(0, 8)}</p>
             </div>
             <div className="hidden sm:block">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">{new Date(activity.created_at).toLocaleDateString()}</p>
             </div>
          </motion.div>
        ))}
        {conversions.length === 0 && (
           <div className="py-20 text-center border border-dashed border-white/5">
              <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">BELUM ADA AKTIVITAS KONVERSI.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
