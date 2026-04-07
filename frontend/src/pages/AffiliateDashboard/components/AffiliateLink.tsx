import React, { useState } from "react";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

interface AffiliateLinkProps {
  affiliateCode: string;
}

const AffiliateLink = ({ affiliateCode }: AffiliateLinkProps) => {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/affiliate/track/${affiliateCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link Affiliate Disalin! 👋");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-orange-600 p-8 sm:p-12 relative overflow-hidden group h-full">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-[2s]">
         <Share2 className="w-32 h-32" />
      </div>

      <div className="space-y-12 relative z-10">
         <div className="space-y-4">
            <p className="font-body font-black text-[9px] uppercase tracking-[0.4em] text-white/50">SHARE KE AUDIENCE LO</p>
            <h3 className="font-display font-black text-2xl md:text-5xl uppercase text-white tracking-tighter">LINK UNIK LO.</h3>
         </div>

         <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-black border border-white/10 p-2 group-focus-within:border-orange-600 transition-all">
               <input 
                 readOnly
                 value={link}
                 className="flex-1 bg-transparent border-none px-4 py-4 font-display font-bold text-[10px] sm:text-[11px] uppercase tracking-widest text-white/50 focus:outline-none truncate"
               />
               <button 
                 onClick={copyLink}
                 className="h-14 sm:h-auto px-10 py-5 bg-white text-black hover:bg-orange-600 hover:text-white transition-all font-display font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shrink-0"
               >
                  {copied ? "COPIED" : "COPY LINK"}
                  <Copy className="w-4 h-4" />
               </button>
            </div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed italic max-w-sm">
               * Share link ini ke social media lo buat dapet komisi dari setiap pembelian.
            </p>
         </div>
      </div>
    </div>
  );
};

export default AffiliateLink;
