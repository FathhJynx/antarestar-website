import React, { useState } from "react";
import { User, Landmark, Hash, Save, ShieldCheck, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SettingsForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
     bank: "BCA",
     accountName: "FATHAN AGENT",
     accountNumber: "882312984",
     phone: "081234567890",
     email: "fathan@example.com"
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
       toast.success("System configuration updated! 🎉");
       setLoading(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-24">
       <div className="space-y-12">
          <div className="space-y-4">
             <p className="font-body font-black text-[9px] uppercase tracking-[0.4em] text-white/20">AGENT PROFILE</p>
             <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">DATA IDENTITAS.</h3>
          </div>

          <div className="space-y-6">
             <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="text" 
                  value={formData.accountName} 
                  placeholder="AGENT FULL NAME"
                  className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                />
             </div>
             <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="email" 
                  value={formData.email} 
                  placeholder="AGENT EMAIL"
                  className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                />
             </div>
             <div className="relative group">
                <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="text" 
                  value={formData.phone} 
                  placeholder="PHONE NUMBER"
                  className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                />
             </div>
          </div>
       </div>

       <div className="space-y-12">
          <div className="space-y-4">
             <p className="font-body font-black text-[9px] uppercase tracking-[0.4em] text-orange-600 italic">TREASURY CHANNEL</p>
             <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">DATA REKENING.</h3>
          </div>

          <div className="space-y-6">
             <div className="relative group">
                <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="text" 
                  value={formData.bank} 
                  placeholder="BANK NAME"
                  className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                />
             </div>
             <div className="relative group">
                <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="text" 
                  value={formData.accountNumber} 
                  placeholder="ACCOUNT NUMBER"
                  className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                />
             </div>

             <motion.button 
               onClick={handleSave}
               disabled={loading}
               whileTap={{ scale: 0.98 }}
               className="w-full h-16 bg-white text-black hover:bg-orange-600 hover:text-white font-display font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-4 group disabled:opacity-50 mt-12"
             >
                {loading ? "DEPLOYING CONFIG..." : "SAVE CONFIGURATION"}
                {!loading && <Save className="w-4 h-4" />}
             </motion.button>
          </div>
       </div>
    </div>
  );
};

export default SettingsForm;
