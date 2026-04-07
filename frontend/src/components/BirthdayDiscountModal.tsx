import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

const BirthdayDiscountModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [promoData, setPromoData] = useState<{ code: string; discount: string; message: string } | null>(null);

  useEffect(() => {
    const hasSeenModal = localStorage.getItem('hasSeenBirthdayModal');
    if (hasSeenModal) return;

    // Check backend for active birthday promotion for this user
    api.get('/promotions/birthday-reward')
      .then(res => {
        const data = res.data?.data;
        if (data && data.is_eligible) {
          setPromoData({
            code: data.voucher_code || 'HBDANTAR',
            discount: data.discount_label || '25%',
            message: data.message || 'Nikmati diskon ulang tahun spesialmu!'
          });
          setTimeout(() => {
            setIsOpen(true);
            localStorage.setItem('hasSeenBirthdayModal', 'true');
          }, 3000);
        }
      })
      .catch(() => {
        // No birthday promo available — silently skip
      });
  }, []);

  const handleCopyCode = () => {
    if (!promoData) return;
    navigator.clipboard.writeText(promoData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!promoData) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-card rounded-2xl shadow-2xl overflow-hidden z-[51] border border-border"
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-md"
            >
               <X className="w-4 h-4" />
            </button>

            {/* Header / Graphic Area */}
            <div className="relative h-48 bg-accent overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('@/assets/lifestyle-camping.jpg')] bg-cover bg-center opacity-30 mix-blend-overlay" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="relative z-10 text-center"
               >
                 <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] mb-4">
                    <Gift className="w-8 h-8 text-accent" />
                 </div>
                 <h2 className="font-display font-black text-3xl uppercase tracking-tight text-white drop-shadow-md">
                   Happy Birthday!
                 </h2>
               </motion.div>
            </div>

            {/* Content Area */}
            <div className="p-8 text-center bg-background">
              <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                {promoData.message} Diskon spesial <strong className="text-foreground">{promoData.discount}</strong> untuk semua perlengkapan <em>outdoor</em> favoritmu!
              </p>

              {/* Voucher Code Box */}
              <div className="bg-muted border border-border rounded-xl p-4 flex items-center justify-between mb-8 shadow-inner">
                 <div className="flex flex-col items-start">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Voucher Code</span>
                   <span className="font-display font-black text-2xl text-foreground tracking-wider">{promoData.code}</span>
                 </div>
                 <Button 
                   onClick={handleCopyCode}
                   variant={copied ? "default" : "outline"}
                   className={`shrink-0 transition-all ${copied ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : ''}`}
                 >
                   {copied ? (
                     <><CheckCircle2 className="w-4 h-4 mr-2" /> Copied</>
                   ) : (
                     <><Copy className="w-4 h-4 mr-2" /> Copy Code</>
                   )}
                 </Button>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 text-base font-bold uppercase tracking-wide bg-accent hover:bg-accent/90 text-white"
                >
                  Belanja Sekarang
                </Button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Nanti saja
                </button>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BirthdayDiscountModal;
