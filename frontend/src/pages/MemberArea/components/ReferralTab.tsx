import React from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferralTabProps {
  profile: any;
  handleCopyCode: () => void;
  handleShare: () => void;
  copied: boolean;
}

const ReferralTab = ({ profile, handleCopyCode, handleShare, copied }: ReferralTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
      <div className="flex items-center justify-between border-b-2 border-white pb-4">
         <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic text-white">REFERRAL CENTER</h3>
         <Users className="w-8 h-8 text-orange-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
         <div className="bg-white/5 p-12 border border-white/10 space-y-8">
            <h4 className="font-display font-black text-2xl uppercase italic text-white">KODE MISI LO</h4>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-6 flex-wrap md:flex-nowrap text-white">
               <span className="font-display font-black text-4xl tracking-widest flex-1">{profile.referralCode}</span>
               <Button onClick={handleCopyCode} className={`h-14 px-8 rounded-none font-black uppercase tracking-widest transition-all ${copied ? 'bg-green-600' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}>
                  {copied ? "COPIED" : "COPY"}
               </Button>
            </div>
            <Button onClick={handleShare} className="w-full bg-orange-600 text-white h-16 font-display font-black uppercase tracking-widest rounded-none hover:bg-white hover:text-black transition-all">
               SHARE MISI KE TEMEN
            </Button>
         </div>

         <div className="bg-orange-600 p-12 text-white space-y-6">
            <h4 className="font-display font-black text-2xl uppercase italic">GIMANA CARANYA?</h4>
            <div className="space-y-4">
               {[
                 "Share kode unik lo ke temen sesama petualang.",
                 "Setiap temen join pake kode lo, poin lo nambah 500 AP.",
                 "Kalo mereka beli gear pertama, bonus 1.500 AP buat lo!",
                 "Tukerin poin di level Elite buat dapet gear gratis."
               ].map((step, i) => (
                 <div key={i} className="flex gap-4">
                    <span className="font-display font-black text-2xl italic opacity-50">{i + 1}</span>
                    <p className="text-sm font-bold uppercase tracking-tight leading-relaxed">{step}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default ReferralTab;
