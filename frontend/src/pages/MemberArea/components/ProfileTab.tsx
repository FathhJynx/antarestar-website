import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProfileTabProps {
  profile: any;
  setProfile: (profile: any) => void;
  handleSave: (e: React.FormEvent) => void;
}

const ProfileTab = ({ profile, setProfile, handleSave }: ProfileTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
      <div className="space-y-8">
         <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic border-b-2 border-white pb-4 text-white">PENGATURAN PROFIL</h3>
         <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Nama Asli</label>
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 text-sm font-black uppercase outline-none focus:border-orange-600 transition-all text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Bio Penjelajah</label>
              <textarea 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-none px-6 py-4 text-sm font-bold outline-none focus:border-orange-600 transition-all resize-none italic text-white"
              />
            </div>
            <Button className="bg-orange-600 text-white rounded-none h-14 w-full font-display font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
               SIMPAN PERUBAHAN
            </Button>
         </form>
      </div>
    </motion.div>
  );
};

export default ProfileTab;
