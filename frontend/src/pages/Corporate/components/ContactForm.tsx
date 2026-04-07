import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, User, Building, Mail, Package, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    needs: "",
    budget: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call to match existing B2B endpoint if possible
      await api.post("/b2b/inquiries", {
        contact_name: form.name,
        company_name: form.company,
        email: form.email,
        message: `Kebutuhan: ${form.needs} | Budget: ${form.budget}`
      });
      setIsSent(true);
      toast.success("INQUIRY SECURED.");
    } catch (err) {
      toast.error("MISSION FAILED. RE-TRY.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full bg-[#090909] border-2 border-white/5 rounded-none px-6 py-5 text-white text-sm font-bold placeholder:text-white/10 outline-none focus:border-orange-600 focus:bg-orange-600/5 transition-all transition-all transition-all";

  if (isSent) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0D0D0D] border border-white/10 rounded-none p-12 text-center space-y-8"
      >
        <div className="w-24 h-24 bg-orange-600 rounded-none flex items-center justify-center mx-auto shadow-2xl shadow-orange-600/20">
           <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <div className="space-y-4">
           <h3 className="font-display font-black text-4xl text-white uppercase italic tracking-tighter">MISSION SECURED.</h3>
           <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">Pesan lo udah masuk ke radar tim kita. Tunggu kabar dari kita paling lambat 1x24 jam ya!</p>
        </div>
        <Button onClick={() => setIsSent(false)} variant="outline" className="h-14 px-10 border-white/10 hover:border-white text-white rounded-none font-black uppercase text-[10px] tracking-widest transition-all">Kirim Inquiry Baru</Button>
      </motion.div>
    );
  }

  return (
    <section className="py-24 md:py-48 bg-black">
       <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-none p-8 md:p-20 space-y-12">
             
             <div className="space-y-4 text-center pb-8 border-b border-white/5">
                <p className="font-bold text-[9px] uppercase tracking-[0.6em] text-orange-600 leading-none italic">LEAVE YOUR MARK</p>
                <h3 className="font-display font-black text-2xl md:text-5xl text-white uppercase tracking-tighter italic">KIRIM INQUIRY.</h3>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3 relative group">
                      <label className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest ml-1"><User className="w-3.5 h-3.5" /> NAMA LENGKAP</label>
                      <input 
                         required
                         className={inputStyle}
                         placeholder="NAMA LO"
                         value={form.name}
                         onChange={e => setForm({...form, name: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3 relative group">
                      <label className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest ml-1"><Building className="w-3.5 h-3.5" /> PERUSAHAAN</label>
                      <input 
                         required
                         className={inputStyle}
                         placeholder="NAMA KANTOR / TIM LO"
                         value={form.company}
                         onChange={e => setForm({...form, company: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-3 relative group">
                   <label className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest ml-1"><Mail className="w-3.5 h-3.5" /> EMAIL AKTIF</label>
                   <input 
                      required
                      type="email"
                      className={inputStyle}
                      placeholder="EMAIL@KANTOR.COM"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                   />
                </div>

                <div className="space-y-3 relative group">
                   <label className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest ml-1"><Package className="w-3.5 h-3.5" /> ESTIMASI PRODUK & JUMLAH</label>
                   <input 
                      required
                      className={inputStyle}
                      placeholder="MISAL: 100 PCS JAKET VALMORA"
                      value={form.needs}
                      onChange={e => setForm({...form, needs: e.target.value})}
                   />
                </div>

                <div className="space-y-3 relative group">
                   <label className="flex items-center gap-2 text-white/20 text-[9px] font-black uppercase tracking-widest ml-1"><MessageSquare className="w-3.5 h-3.5" /> PESAN TAMBAHAN (OPSIONAL)</label>
                   <textarea 
                      className={inputStyle + " h-32 resize-none py-6"}
                      placeholder="KASIH TAU KITA KALO ADA KEBUTUHAN KHUSUS..."
                      value={form.needs}
                      onChange={e => setForm({...form, needs: e.target.value})}
                   />
                </div>

                <div className="pt-8">
                   <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-16 md:h-20 bg-white hover:bg-orange-600 text-black hover:text-white font-black uppercase tracking-widest rounded-none transition-all group overflow-hidden"
                   >
                      <span className="flex items-center gap-4">
                         {isSubmitting ? "TRANSMITTING..." : "KIRIM INQUIRY"} <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                   </Button>
                </div>
             </form>

          </div>
       </div>
    </section>
  );
};

export default ContactForm;
