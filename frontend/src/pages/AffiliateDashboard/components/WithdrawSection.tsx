import React, { useState } from "react";
import { Landmark, ArrowRight, User, Hash } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface WithdrawProps {
  balance: number;
}

const WithdrawSection = ({ balance }: WithdrawProps) => {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!amount || Number(amount) < 50000) {
       toast.error("Minimal penarikan Rp 50.000");
       return;
    }
    if (!bankName || !accountNumber || !accountName) {
       toast.error("Lengkapi data rekening lo!");
       return;
    }
    if (Number(amount) > balance) {
       toast.error("Saldo tidak mencukupi");
       return;
    }

    setLoading(true);
    try {
      await api.post('/affiliate/payouts', {
        amount: Number(amount),
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      });
      toast.success("Permintaan penarikan diproses! 🎉");
      setAmount("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal proses penarikan.");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="bg-[#111111] border border-white/5 p-8 sm:p-12 space-y-12">
      <div className="flex items-center justify-between">
         <div className="space-y-4">
            <p className="font-body font-bold text-[9px] uppercase tracking-[0.4em] text-orange-600 italic">SALDO SIAP DICAIRKAN</p>
            <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">TARIK SALDO.</h3>
         </div>
         <div className="flex flex-col text-right">
            <p className="text-[9px] font-black uppercase text-white/30 tracking-widest leading-none mb-3">SALDO TERSEDIA</p>
            <h4 className="font-display font-black text-2xl md:text-4xl uppercase text-white tracking-tighter tabular-nums">
               Rp {balance.toLocaleString('id-ID')}
            </h4>
         </div>
      </div>

      <div className="space-y-8 max-w-lg">
         {/* Bank Details */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
               <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
               <input 
                 type="text"
                 value={accountName}
                 onChange={(e) => setAccountName(e.target.value)}
                 placeholder="NAMA PEMILIK"
                 className="w-full h-14 bg-black border border-white/10 px-14 font-display font-black text-[10px] uppercase tracking-widest focus:border-orange-600 focus:outline-none placeholder:text-white/10 placeholder:font-black shadow-inner"
               />
            </div>
            <div className="relative group">
               <Landmark className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
               <input 
                 type="text"
                 value={bankName}
                 onChange={(e) => setBankName(e.target.value)}
                 placeholder="NAMA BANK"
                 className="w-full h-14 bg-black border border-white/10 px-14 font-display font-black text-[10px] uppercase tracking-widest focus:border-orange-600 focus:outline-none placeholder:text-white/10 placeholder:font-black shadow-inner"
               />
            </div>
         </div>

         <div className="relative group">
            <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="NOMOR REKENING"
              className="w-full h-14 bg-black border border-white/10 px-14 font-display font-black text-[10px] uppercase tracking-widest focus:border-orange-600 focus:outline-none placeholder:text-white/10 placeholder:font-black shadow-inner"
            />
         </div>

         <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-4 text-white/20 group-focus-within:text-orange-600 transition-colors">
               <div className="w-[1px] h-6 bg-white/10 group-focus-within:bg-orange-600/30 transition-colors" />
            </div>
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full h-16 bg-black border border-white/10 px-10 font-display font-black text-xl uppercase tracking-tighter focus:border-orange-600 focus:outline-none placeholder:text-white/10 shadow-inner"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-white/20 group-focus-within:text-white transition-colors">
               NOMINAL RP
            </div>
         </div>

         <button 
           onClick={handleWithdraw}
           disabled={loading}
           className={`w-full h-16 ${loading ? "bg-white/10 text-white/20" : "bg-white text-black hover:bg-orange-600 hover:text-white"} transition-all font-display font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 group disabled:cursor-not-allowed`}
         >
            {loading ? "PROCESSING MISSION..." : "TARIK SEKARANG"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
         <div className="space-y-3">
            <div className="text-[10px] font-black uppercase text-white tracking-widest flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-orange-600" /> SYARAT & KETENTUAN
            </div>
            <p className="font-body font-bold text-[9px] uppercase tracking-[0.2em] text-white/20 leading-relaxed max-w-sm">
               Penarikan di proses dalam 1x24 jam kerja (Senin - Jumat). Pastikan rekening bank di setting sudah benar.
            </p>
         </div>
      </div>
    </div>
  );
};

export default WithdrawSection;
