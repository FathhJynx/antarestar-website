import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, User, LogIn, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarScroll } from "@/hooks/useScrollAnimations";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AnnouncementBanner from "./AnnouncementBanner";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { scrolled, hidden } = useNavbarScroll();
  const { totalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { label: "Beranda", to: "/" },
    { label: "Toko", to: "/store" },
    { label: "Tentang", to: "/about" },
    { label: "Affialiasi", to: "/affiliate" },
    { label: "Corporate", to: "/corporate" },
    { label: "Blog", to: "/blog" },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    setShowUserMenu(false);
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none">
      {/* Banner Segment - Persistent in DOM for stability */}
      <motion.div 
        animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }}
        className="pointer-events-auto w-full overflow-hidden"
      >
        <AnnouncementBanner />
      </motion.div>

      {/* Premium Navbar */}
      <motion.nav
        initial={false}
        animate={{ 
          y: hidden ? -100 : 0,
          backgroundColor: scrolled ? "rgba(11, 11, 11, 0.98)" : "rgba(0, 0, 0, 0)",
          borderColor: scrolled ? "rgba(31, 31, 31, 1)" : "rgba(0, 0, 0, 0)",
          backdropFilter: scrolled ? "blur(24px)" : "blur(0px)"
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-full h-[88px] border-b"
      >
        <div className="section-container section-padding h-full flex items-center justify-between relative py-4">
          
          {/* Logo - Left */}
          <Link to="/" className="flex items-center group shrink-0">
             <img src="/logo.webp" alt="Antarestar" className="h-6 md:h-8 w-auto object-contain brightness-200 group-hover:opacity-80 transition-opacity duration-300" />
          </Link>

          {/* Nav menu - Center (Desktop) */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 h-full">
             {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                   <Link key={link.to} to={link.to} className="relative py-2 group transition-all">
                      {isActive && (
                         <motion.div 
                           layoutId="navbar-underline" 
                           className="absolute -bottom-1 left-0 right-0 h-px bg-orange-600 z-0" 
                           transition={{ type: "spring", bounce: 0, duration: 0.8 }} 
                         />
                      )}
                      <span className={`relative z-10 font-display font-black text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                        isActive ? "text-orange-600" : "text-white/40 group-hover:text-white"
                      }`}>
                         {link.label}
                      </span>
                   </Link>
                );
             })}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-6">
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
             <div className="hidden md:block">
                {isAuthenticated ? (
                   <button onMouseEnter={() => setShowUserMenu(true)} className="flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-display font-black text-[10px] uppercase tracking-widest text-white/70 group shadow-sm">
                      <User className="w-4 h-4 text-white/40 group-hover:text-white" /> {user?.name?.split(' ')[0]}
                   </button>
                ) : (
                   <Link to="/login">
                      <button className="px-8 py-3 bg-orange-600 text-white font-display font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all shadow-2xl hover:shadow-orange-600/30 active:scale-95">
                         Masuk
                      </button>
                   </Link>
                )}
             </div>

             {/* Mobile Menu Toggle */}
             <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-white">
                <Menu className="w-6 h-6" />
             </button>
          </div>
        </div>
      </motion.nav>

      {/* User Menu Dropdown (Desktop) */}
      <AnimatePresence>
         {showUserMenu && (
            <motion.div
               onMouseEnter={() => setShowUserMenu(true)}
               onMouseLeave={() => setShowUserMenu(false)}
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
               className="fixed top-[72px] right-8 w-64 bg-[#111111] border border-[#1F1F1F] p-4 rounded-[1.5rem] shadow-2xl z-[110] pointer-events-auto"
            >
               <div className="space-y-4">
                  <div className="px-4 py-2 border-b border-white/5">
                     <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1 font-bold leading-none">Explorer Profile</p>
                     <p className="text-sm font-black text-white truncate">{user?.email}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                     <Link to="/member" className="p-3 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">Profile</Link>
                     <Link to="/orders" className="p-3 text-[11px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">Orders</Link>
                  </div>
                  <button onClick={logout} className="w-full text-left p-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all">Keluar</button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Fullscreen Mobile Menu Overlay */}
      <AnimatePresence>
         {mobileOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[200] flex flex-col p-8 pointer-events-auto overflow-y-auto">
               <div className="flex justify-between items-center mb-16">
                  <img src="/logo.webp" alt="Antarestar" className="h-6 w-auto brightness-200" />
                  <button onClick={() => setMobileOpen(false)} className="p-2 text-white/40 hover:text-white"><X className="w-8 h-8" /></button>
               </div>
               <div className="flex flex-col gap-8">
                  {navLinks.map((l, i) => (
                     <motion.div key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                        <Link to={l.to} onClick={() => setMobileOpen(false)} className="font-display font-black text-4xl uppercase tracking-tighter text-white hover:text-orange-600 transition-colors">{l.label}</Link>
                     </motion.div>
                  ))}
               </div>
               <div className="mt-auto pt-16 flex flex-col gap-6">
                  {isAuthenticated ? (
                     <Link to="/member" className="font-display font-black text-xl uppercase tracking-widest text-gray-500">My Mission</Link>
                  ) : (
                     <Link to="/login" className="h-16 bg-white text-black font-display font-black text-xl flex items-center justify-center uppercase tracking-widest rounded-[1.5rem]">Sign In</Link>
                  )}
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
