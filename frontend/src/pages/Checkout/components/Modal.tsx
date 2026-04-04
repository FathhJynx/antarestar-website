import React, { useState, useEffect } from "react";
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
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 20 }} 
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }} 
            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, mass: 1 }}
            className={`
              relative w-full bg-background z-[101] shadow-2xl overflow-hidden border-t md:border border-border
              ${isMobile ? "rounded-t-[2.5rem] rounded-b-none" : "max-w-xl rounded-[2rem]"}
            `}
          >
            {isMobile && (
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-muted rounded-full" />
              </div>
            )}

            <div className="flex items-center justify-between px-6 py-4 md:p-6 border-b border-border">
              <h3 className="font-display font-black text-base md:text-lg uppercase tracking-tight">{title}</h3>
              <button 
                onClick={onClose} 
                className="p-2.5 hover:bg-muted rounded-full transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[85vh] md:max-h-[70vh] overflow-y-auto p-4 md:p-8">
              {children}
            </div>
            
            {isMobile && <div className="h-6" />}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
