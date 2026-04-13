import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardTabProps {
  profile: any;
  recommendations: any[];
}

const DashboardTab = ({ profile, recommendations }: DashboardTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      {/* BENTO GRID STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        <div className="bg-white/5 p-10 border border-white/10 group hover:bg-orange-600 transition-all duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 group-hover:text-white transition-colors italic">Peringkat lo</p>
            <h4 className="font-display font-black text-3xl md:text-5xl italic group-hover:scale-110 transition-transform origin-left text-white">#{profile.globalRank}</h4>
        </div>
        <div className="bg-white/5 p-10 border border-white/10 group hover:bg-white transition-all duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 group-hover:text-black transition-colors italic">Lama Join</p>
            <h4 className="font-display font-black text-3xl md:text-5xl italic group-hover:text-black group-hover:scale-110 transition-transform origin-left text-white">{profile.joinDate}</h4>
        </div>
        <div className="bg-white/5 p-10 border border-white/10 group hover:bg-orange-600 transition-all duration-500">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 group-hover:text-white transition-colors italic">Referral</p>
            <h4 className="font-display font-black text-3xl md:text-5xl italic group-hover:scale-110 transition-transform origin-left text-white">{profile.referralCount}</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b-2 border-white pb-4">
              <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic text-white">JEJAK AKTIFITAS</h3>
              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">TERBARU</span>
            </div>
            <div className="space-y-1">
              {profile.history.slice(0, 5).map((item: any) => (
                <div key={item.id} className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 transition-all border-b border-white/5 text-white">
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
               <h3 className="font-display font-black text-2xl uppercase tracking-tighter italic border-b border-white/10 pb-4 text-white">EKSKLUSIF GEAR</h3>
               <div className="grid grid-cols-1 gap-4">
                  {recommendations.map((prod: any) => (
                    <Link key={prod.id} to={`/product/${prod.id}`} className="flex items-center gap-4 group/p">
                       <div className="w-20 h-20 bg-white/5 border border-white/10 overflow-hidden rounded-none shrink-0 group-hover/p:border-orange-600 transition-colors">
                          <img src={prod.image || prod.thumb} className="w-full h-full object-cover group-hover/p:scale-110 transition-transform duration-500" alt="" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase text-white/40 mb-1">{prod.category || 'Gear'}</p>
                          <h5 className="font-display font-black text-sm uppercase leading-tight group-hover/p:text-orange-600 transition-colors text-white">{prod.name}</h5>
                       </div>
                    </Link>
                  ))}
               </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardTab;
