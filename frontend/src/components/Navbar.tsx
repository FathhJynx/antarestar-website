import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  User, 
  Home, 
  DollarSign, 
  Building2, 
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarScroll } from "@/hooks/useScrollAnimations";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AnnouncementBanner from "@/pages/Home/components/AnnouncementBanner";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { hidden, scrolled } = useNavbarScroll();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { label: "Beranda", to: "/", icon: Home },
    { label: "Toko", to: "/store", icon: ShoppingBag },
    { label: "Affiliasi", to: "/affiliate", icon: DollarSign },
    { label: "Corporate", to: "/corporate", icon: Building2 },
    { label: "Blog", to: "/blog", icon: BookOpen },
  ];

  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  return (
    <>
      {/* ── TOPBAR: Logo & Auth ── */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none">
        {/* Banner Segment */}
        <motion.div 
          animate={{ height: hidden ? 0 : "auto", opacity: hidden ? 0 : 1 }}
          className="pointer-events-auto w-full overflow-hidden"
        >
          <AnnouncementBanner />
        </motion.div>

        {/* Top Navigation - Truly Transparent when not scrolled */}
        <motion.nav
          initial={false}
          animate={{ 
            y: hidden ? -100 : 0,
            backgroundColor: scrolled ? "rgba(11, 11, 11, 0.8)" : "rgba(0, 0, 0, 0)",
            backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto w-full h-[72px] md:h-[88px] transition-colors ${scrolled ? 'border-b border-white/5' : 'border-b border-transparent'}`}
        >
          <div className="section-container section-padding h-full flex items-center justify-between relative">
            
            {/* Logo - Left */}
            <Link to="/" className="flex items-center group shrink-0">
               <img src="/logo.webp" alt="Antarestar" className="h-6 md:h-7 w-auto object-contain brightness-200 group-hover:opacity-80 transition-opacity duration-300" />
            </Link>

            {/* Right controls */}
            <div className="flex items-center gap-4 md:gap-6">
               <button className="p-2 text-white/40 hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
               </button>

               <Link to="/cart" className="relative p-2 text-white/40 hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-black shadow-lg shadow-orange-600/30">{totalItems}</span>
                  )}
               </Link>

               <div className="h-4 w-px bg-white/10 mx-1 hidden md:block" />

               {/* Auth controls */}
               <div className="">
                  {isAuthenticated ? (
                     <button 
                        onMouseEnter={() => setShowUserMenu(true)} 
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 px-4 md:px-5 py-2 md:py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-display font-black text-[10px] uppercase tracking-widest text-white/70 group shadow-sm"
                     >
                        <User className="w-4 h-4 text-white/40 group-hover:text-white" /> 
                        <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                     </button>
                  ) : (
                     <Link to="/login">
                        <button className="px-6 md:px-8 py-2 md:py-3 bg-orange-600 text-white font-display font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all shadow-2xl hover:shadow-orange-600/30 active:scale-95">
                           Gas Masuk
                        </button>
                     </Link>
                  )}
               </div>
            </div>
          </div>
        </motion.nav>

        {/* User Menu Dropdown (Desktop) */}
        <AnimatePresence>
           {showUserMenu && (
              <motion.div
                 onMouseEnter={() => setShowUserMenu(true)}
                 onMouseLeave={() => setShowUserMenu(false)}
                 initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                 animate={{ opacity: 1, y: 0, scale: 1 }} 
                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                 className="fixed top-[72px] md:top-[88px] right-8 w-64 bg-[#111111] border border-[#1F1F1F] p-4 rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[110] pointer-events-auto"
              >
                 <div className="space-y-4">
                    <div className="px-4 py-2 border-b border-white/5">
                       <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1 font-bold leading-none">Profil Explorer</p>
                       <p className="text-sm font-black text-white truncate">{user?.email}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                       <Link to="/member" className="p-3 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">Akun Gue</Link>
                       <Link to="/orders" className="p-3 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">Pesanan Gue</Link>
                    </div>
                    <button onClick={logout} className="w-full text-left p-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all">Keluar</button>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>
      </div>

      {/* ── FLOATING DOCK: Main Navigation ── */}
      <div className="fixed bottom-8 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.5 }}
          className="pointer-events-auto px-3 py-3 bg-[#0F0F0F]/80 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-3 mx-4"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link 
                key={link.to} 
                to={link.to} 
                className="relative group"
              >
                {/* Tooltip Label - Top */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                   <div className="bg-black/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                        {link.label}
                      </span>
                   </div>
                   {/* Tiny arrow */}
                   <div className="w-2 h-2 bg-black border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                </div>

                {/* Pill Body */}
                <motion.div
                  layout
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`h-12 flex items-center justify-center rounded-full relative overflow-hidden transition-all duration-500 ${
                    isActive 
                      ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] px-6" 
                      : "bg-transparent text-white/40 hover:text-white w-12"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 relative z-10" />
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2.5 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
