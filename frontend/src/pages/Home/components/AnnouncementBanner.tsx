import { useState, useEffect } from "react";
import { Zap, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Link } from "react-router-dom";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data: activeCampaign } = useQuery({
    queryKey: ['active-flash-sale-banner'],
    queryFn: async () => {
      const res = await api.get('/promotions/flash-sales');
      const campaigns = res.data.data || [];
      return campaigns[0] || null;
    }
  });

  useEffect(() => {
    if (activeCampaign) {
      const isDismissed = localStorage.getItem(`dismissed-flash-sale-${activeCampaign.id || activeCampaign.name}`);
      if (isDismissed) {
        setIsVisible(false);
      }
    }
  }, [activeCampaign]);

  const handleClose = () => {
    setIsVisible(false);
    if (activeCampaign) {
      localStorage.setItem(`dismissed-flash-sale-${activeCampaign.id || activeCampaign.name}`, "true");
    }
  };

  const isStarted = activeCampaign?.start_date ? new Date(activeCampaign.start_date).getTime() <= new Date().getTime() : false;
  
  useEffect(() => {
    const targetDate = isStarted ? activeCampaign?.end_date : activeCampaign?.start_date;
    if (targetDate) {
      const interval = setInterval(() => {
        const end = new Date(targetDate).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeCampaign, isStarted]);

  if (!isVisible || !activeCampaign) return null;

  const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`${isStarted ? 'bg-red-600' : 'bg-slate-900'} text-white relative z-[110] overflow-hidden`}
      >
        <div className="section-padding py-2.5 md:py-3">
          <div className="section-container flex items-center justify-center gap-4 md:gap-8 flex-wrap text-center">
            <div className="flex items-center gap-2">
              <Zap className={`w-3.5 h-3.5 fill-current ${isStarted ? 'animate-pulse text-yellow-300' : 'text-slate-400'}`} />
              <span className="font-display font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] italic">
                {activeCampaign.name} {isStarted ? 'LAGI GAS!' : 'BENTAR LAGI'}
              </span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 border-x border-white/20 px-4 md:px-8">
              <span className="font-body text-[9px] font-bold uppercase tracking-widest text-white/60">
                {isStarted ? 'Berakhir dalam' : 'Mulai dalam'}
              </span>
              <div className="flex items-center gap-1 font-display font-black text-xs md:text-sm">
                <span className="bg-black/20 px-1.5 py-0.5 rounded-md min-w-[24px]">{h}</span>
                <span className="opacity-40">:</span>
                <span className="bg-black/20 px-1.5 py-0.5 rounded-md min-w-[24px]">{m}</span>
                <span className="opacity-40">:</span>
                <span className="bg-black/20 px-1.5 py-0.5 rounded-md min-w-[24px]">{s}</span>
              </div>
            </div>

            <Link 
              to="/store" 
              className="group flex items-center gap-1.5 font-display font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:text-yellow-300 transition-colors"
            >
              Gas Sikat Promonya <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button 
              onClick={handleClose}
              className="absolute right-4 p-1 opacity-40 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Animated scanning light effect */}
        <motion.div 
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full pointer-events-none"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
