import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * THE ULTIMATE MODAL HUB 
 * Uses React Portals to inject the modal at the root of the DOM.
 * This completely isolates it from any dashboard scroll containers.
 */
export const AdminModal: React.FC<AdminModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  maxWidth = 'max-w-5xl' 
}) => {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-12 font-body">
      {/* Dynamic Overlay Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
      />

      {/* Modal Container — Centered & Viewport-Focused */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={`w-full ${maxWidth} max-h-[90vh] bg-[#0B0B0B] border border-white/10 rounded-[3rem] shadow-[0_100px_200px_rgba(0,0,0,1)] relative z-10 flex flex-col overflow-hidden`}
        onWheel={(e) => e.stopPropagation()} // Aggressive Capture
      >
        {children}
      </motion.div>
    </div>,
    document.body
  );
};
