import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // PRECISE SCROLL LOCK PROTOCOL
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)'; // Prevent layout shift
      
      // Auto-focus the core scroll container
      setTimeout(() => {
        scrollRef.current?.focus();
      }, 200);
    } else {
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const modalVariants = isMobile 
    ? { hidden: { y: "100%" }, visible: { y: 0 }, exit: { y: "100%" } }
    : { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden">
          {/* Backdrop Layer */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />
          
          {/* Modal Architecture */}
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 28, stiffness: 300, mass: 1 }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className={`
              relative w-full bg-[#0D0D0D] z-[101] shadow-2xl flex flex-col border-t md:border border-white/10
              ${isMobile ? "rounded-t-[2.5rem] h-[85vh]" : "max-w-xl rounded-2xl max-h-[85vh]"}
            `}
          >
            {/* Header Core */}
            <div className="flex items-center justify-between px-6 py-6 md:p-8 border-b border-white/5 shrink-0 bg-black/20">
               <div className="space-y-1">
                  <p className="font-bold text-[9px] uppercase tracking-[0.4em] text-orange-600">MISSION OPERATIONS</p>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-white uppercase tracking-tight leading-none">{title}</h3>
               </div>
               <button 
                 onClick={onClose} 
                 className="p-3 bg-white/5 hover:bg-orange-600 text-white/40 hover:text-white rounded-xl transition-all active:scale-95"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            {/* Tactical Scroll Container */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 py-8 md:px-10 scrollbar-stealth outline-none overscroll-contain"
              tabIndex={0}
            >
               <div className="pb-16">{children}</div>
            </div>
            
            {/* Mobile Safety Pad */}
            {isMobile && <div className="h-6 shrink-0 bg-black/10" />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
