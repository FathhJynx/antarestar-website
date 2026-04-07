import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ShoppingBag, Calendar, DollarSign, ArrowRight } from "lucide-react";

const CommissionTable = () => {
  const { data: conversions = [], isLoading } = useQuery({
    queryKey: ['affiliate-conversions-full'],
    queryFn: async () => {
       const res = await api.get('/affiliate/conversions');
       return res.data?.data || [];
    }
  });

  if (isLoading) return <div className="py-20 animate-pulse bg-white/5 border border-white/5" />;

  return (
    <div className="space-y-12">
      <div className="bg-[#111111] border border-white/5 overflow-hidden">
        <div className="p-8 sm:p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <p className="font-body font-black text-[9px] uppercase tracking-[0.4em] text-white/20">FINANCIAL AUDIT</p>
              <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">DATA KOMISI.</h3>
           </div>
           <div className="flex items-center gap-10">
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase text-white/20 tracking-widest leading-none mb-2">TOTAL RECORD</p>
                 <p className="font-display font-black text-2xl text-orange-600">{conversions.length}</p>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="p-8 font-display font-black text-[10px] uppercase tracking-[0.3em] text-white/40">Timestamp</th>
                <th className="p-8 font-display font-black text-[10px] uppercase tracking-[0.3em] text-white/40">Order ID</th>
                <th className="p-8 font-display font-black text-[10px] uppercase tracking-[0.3em] text-white/40">Order Value</th>
                <th className="p-8 font-display font-black text-[10px] uppercase tracking-[0.3em] text-orange-600">Your Share</th>
                <th className="p-8 font-display font-black text-[10px] uppercase tracking-[0.3em] text-white/40">Status</th>
              </tr>
            </thead>
            <tbody>
              {conversions.map((conv: any, i: number) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={conv.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                       <Calendar className="w-3.5 h-3.5 text-white/20" />
                       <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{new Date(conv.created_at).toLocaleDateString("id-ID")}</span>
                    </div>
                  </td>
                  <td className="p-8">
                     <span className="font-display font-black text-[11px] uppercase tracking-widest">#{conv.order_id?.substring(0, 12)}</span>
                  </td>
                  <td className="p-8">
                     <span className="text-[11px] font-black text-white/40 uppercase tracking-widest">Rp {Number(conv.order_amount).toLocaleString('id-ID')}</span>
                  </td>
                  <td className="p-8">
                     <span className="text-sm font-black text-white uppercase tracking-tight">Rp {Number(conv.commission_amount).toLocaleString('id-ID')}</span>
                  </td>
                  <td className="p-8">
                     <span className="px-3 py-1 bg-green-500/10 text-green-500 font-display font-black text-[9px] uppercase tracking-widest border border-green-500/20">CONFIRMED</span>
                  </td>
                </motion.tr>
              ))}
              {conversions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-32 text-center">
                     <ShoppingBag className="w-12 h-12 text-white/5 mx-auto mb-6" />
                     <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.3em]">No conversion data available yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionTable;
