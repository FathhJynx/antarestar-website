import React, { useState } from "react";
import { Zap, ShieldCheck, Mail, User, Instagram, ArrowRight, InstagramIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    instagram: "",
    reason: "",
    agree: false
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.agree) {
       toast.error("Setujui dulu Syarat & Ketentuan!");
       return;
    }
    setLoading(true);
    try {
      await api.post('/affiliate/register');
      toast.success("Welcome to the team! 🎉");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal daftar affiliate.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-600/30 pt-[88px] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/2" />
      
      <Navbar />

      <main className="w-full max-w-xl space-y-12 relative z-10 py-20">
         <div className="flex flex-col items-center text-center gap-6 mb-20">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="w-20 h-20 border border-white/10 flex items-center justify-center rounded-none relative"
            >
               <div className="absolute inset-2 border border-orange-600/20" />
               <Zap className="w-8 h-8 text-orange-600" />
            </motion.div>
            <div className="space-y-4">
               <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter leading-[0.85]">
                  ENROLLMENT <br /> <span className="text-white/20 uppercase">PROTOCOL.</span>
               </h1>
               <p className="text-[11px] font-display font-bold uppercase text-white/30 tracking-[0.4em] max-w-sm mx-auto leading-relaxed">Mulai perjalanan lo jadi Agent Antarestar sekarang.</p>
            </div>
         </div>

         <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                  <div className="grid grid-cols-1 gap-6">
                     <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="NAMA LENGKAP LO"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                        />
                     </div>
                     <div className="relative group">
                        <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="USERNAME INSTAGRAM / TIKTOK"
                          value={formData.instagram}
                          onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                          className="w-full h-16 bg-white/[0.02] border border-white/5 px-16 font-display font-black text-[11px] uppercase tracking-widest focus:border-orange-600 focus:outline-none transition-all placeholder:text-white/10"
                        />
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.instagram}
                    className="w-full h-16 bg-orange-600 text-white font-display font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-4 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                     GAS TERUS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
              </motion.div>
            ) : (
              <motion.div 
                 key="step2"
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="space-y-8"
              >
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-2 flex items-center gap-3">
                        <Sparkles className="w-3 h-3 text-orange-600" /> KONFIRMASI AKHIR
                     </p>
                     <div className="bg-white/[0.02] border border-white/5 p-8 space-y-6">
                        <div className="flex items-start gap-4">
                           <input 
                             type="checkbox" 
                             id="agree" 
                             checked={formData.agree}
                             onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                             className="mt-1 w-5 h-5 bg-black border-white/10 text-orange-600 focus:ring-orange-600"
                           />
                           <label htmlFor="agree" className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed cursor-pointer select-none">
                              Dengan mendaftar, gue setuju jadi partner resmi antarestar dan mengikuti segala "Rule of Engagement" yang ada. Gue siap gear up! 🔥
                           </label>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button 
                       onClick={() => setStep(1)}
                       className="w-1/3 h-16 border border-white/10 hover:border-white text-white font-display font-black uppercase text-[10px] tracking-widest transition-all"
                     >
                        KEMBALI
                     </button>
                     <button 
                       onClick={handleSubmit}
                       disabled={!formData.agree || loading}
                       className="flex-1 h-16 bg-white text-black hover:bg-orange-600 hover:text-white font-display font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                     >
                        {loading ? "ENROLLING..." : "MENJADI AGENT"}
                        {!loading && <ShieldCheck className="w-4 h-4" />}
                     </button>
                  </div>
              </motion.div>
            )}
         </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default RegistrationForm;
