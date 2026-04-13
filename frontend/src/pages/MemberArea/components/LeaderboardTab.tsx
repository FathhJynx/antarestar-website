import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface LeaderboardTabProps {
  leaderboard: any[];
  profileName: string;
}

const LeaderboardTab = ({ leaderboard, profileName }: LeaderboardTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="flex items-center justify-between border-b-2 border-white pb-4">
         <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic text-white">PAPAN SKOR GLOBAL</h3>
         <Trophy className="w-8 h-8 text-orange-600" />
      </div>
      <div className="space-y-2">
         {leaderboard.map((user, i) => (
           <div key={i} className={`flex items-center justify-between p-8 border-b border-white/5 transition-all ${user.name === profileName ? 'bg-orange-600/10 border-orange-600/50' : 'bg-white/5 hover:bg-white/10'}`}>
              <div className="flex items-center gap-8">
                 <span className={`font-display font-black text-2xl italic w-12 ${i === 0 ? 'text-orange-600' : 'text-white/20'}`}>
                    {i + 1}
                 </span>
                 <div>
                    <h4 className={`font-display font-black text-xl uppercase tracking-tight ${user.name === profileName ? 'text-orange-600' : 'text-white'}`}>{user.name}</h4>
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">{user.tier || 'MEMBER'}</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="font-display font-black text-2xl italic leading-none text-white">{user.points.toLocaleString('id-ID')}</p>
                 <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">AP POINTS</p>
              </div>
           </div>
         ))}
      </div>
    </motion.div>
  );
};

export default LeaderboardTab;
