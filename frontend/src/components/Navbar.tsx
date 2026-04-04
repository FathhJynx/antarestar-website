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

  const heroPaths = ["/", "/store", "/about", "/corporate", "/blog", "/affiliate"];
  const currentPath = location.pathname.replace(/\/$/, "") || "/";
  const isHeroPage = heroPaths.includes(currentPath) || location.pathname.startsWith("/blog/");
  const useGlass = scrolled || !isHeroPage;

  const navLinks = [
    { label: "Beranda", to: "/" },
    { label: "Toko", to: "/store" },
    { label: "Tentang", to: "/about" },
    { label: "Korporat", to: "/corporate" },
    { label: "Blog", to: "/blog" },
    { label: "Afiliasi", to: "/affiliate" },
  ];

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown on click outside or navigation
  useEffect(() => {
    setShowUserMenu(false);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col pointer-events-none">
      <div className="pointer-events-auto">
        <AnnouncementBanner />
      </div>
      <motion.nav
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`relative pointer-events-auto h-16 md:h-20 transition-all duration-300 ${
          useGlass
            ? "glass border-b border-white/10 shadow-lg shadow-black/10"
            : "bg-gradient-to-b from-black/40 to-transparent"
        }`}
      >
        <div className="section-padding h-full">
          <div className="section-container flex items-center justify-between h-full">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <img
                  src="/logo.webp"
                  alt="Antarestar Logo"
                  className="h-9 sm:h-11 md:h-15 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  draggable={false}
                />
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="relative px-6 py-2 group"
                  >
                    <span className={`font-display text-[13px] tracking-[0.15em] font-bold uppercase transition-colors duration-300 ${
                      location.pathname === link.to
                        ? "text-accent"
                        : useGlass
                          ? "text-primary-foreground/80 group-hover:text-primary-foreground"
                          : "text-white/90 group-hover:text-white"
                    }`}>
                      {link.label}
                    </span>
                    {location.pathname === link.to && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[20px] h-[3px] bg-accent rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2.5 rounded-full transition-colors duration-200 hover:text-accent ${
                  useGlass
                    ? "text-primary-foreground/70 hover:bg-primary-foreground/8"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Search className="w-[18px] h-[18px]" />
              </motion.button>
              
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2.5 rounded-full transition-colors duration-200 hover:text-accent relative ${
                    useGlass
                      ? "text-primary-foreground/70 hover:bg-primary-foreground/8"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-background"
                    >
                      {totalItems > 99 ? "99+" : totalItems}
                    </motion.span>
                  )}
                </motion.button>
              </Link>
              
              {/* User Dropdown or Login */}
              <div className="relative group hidden md:block">
                {isAuthenticated ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onMouseEnter={() => setShowUserMenu(true)}
                      className={`p-2.5 rounded-full transition-colors duration-200 hover:text-accent relative ${
                        useGlass
                          ? "text-primary-foreground/70 hover:bg-primary-foreground/8"
                          : "text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <User className="w-[18px] h-[18px]" />
                    </motion.button>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          onMouseEnter={() => setShowUserMenu(true)}
                          onMouseLeave={() => setShowUserMenu(false)}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-0 pt-2 w-48 z-50"
                        >
                          <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden p-1.5">
                            <div className="px-4 py-2 border-b border-border mb-1">
                              <p className="text-[10px] font-bold text-accent uppercase tracking-widest truncate">{user?.name || "User"}</p>
                              <p className="text-[8px] text-muted-foreground truncate">{user?.email}</p>
                            </div>
                            <Link 
                              to="/member" 
                              className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                            >
                              <User className="w-4 h-4" />
                              Profil Saya
                            </Link>
                            <Link 
                              to="/orders" 
                              className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              Pesanan Saya
                            </Link>
                            <div className="h-px bg-border my-1.5 mx-2" />
                            <button 
                              onClick={logout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <LogIn className="w-4 h-4 rotate-180" />
                              Keluar
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full font-display text-[10px] font-black uppercase tracking-widest transition-all ${
                        useGlass
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      Masuk
                    </motion.button>
                  </Link>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`md:hidden p-2.5 rounded-full transition-colors duration-200 ${
                  useGlass ? "text-primary-foreground/70" : "text-white/80"
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {!mobileOpen && <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] bg-primary md:hidden overflow-hidden"
          >
            {/* Header inside Sidebar (Safe area top padding) */}
            <div className="absolute top-0 left-0 right-0 pt-5 pb-6 px-6 grid grid-cols-3 items-center z-[120]">
              <div className="flex justify-start">
                 <button 
                   onClick={() => setMobileOpen(false)}
                   className="p-2 -ml-2 text-primary-foreground/40 hover:text-white transition-colors flex items-center gap-2 group"
                 >
                   <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                   <span className="font-display font-black text-[9px] uppercase tracking-[0.2em] hidden sm:inline">Kembali</span>
                 </button>
              </div>
              
              
            </div>

            <div className="h-full flex flex-col items-center justify-start px-8 gap-5 pt-28 overflow-y-auto">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-display text-2xl font-bold tracking-wider uppercase transition-colors ${
                      location.pathname === link.to ? "text-accent" : "text-primary-foreground/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 + navLinks.length * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 pt-8 border-t border-primary-foreground/10 w-full max-w-[200px] flex flex-col items-center gap-6"
                  >
                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className={`font-display text-[10px] font-black tracking-widest uppercase transition-colors flex items-center gap-3 ${
                        location.pathname === "/orders" ? "text-accent" : "text-primary-foreground/50"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Pesanan Saya
                    </Link>
                    <Link
                      to="/member"
                      onClick={() => setMobileOpen(false)}
                      className={`font-display text-[10px] font-black tracking-widest uppercase transition-colors flex items-center gap-3 ${
                        location.pathname === "/member" ? "text-accent" : "text-primary-foreground/50"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="font-display text-[10px] font-black tracking-widest uppercase text-red-500 flex items-center gap-3"
                    >
                      <LogIn className="w-4 h-4 rotate-180" />
                      Keluar
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 + navLinks.length * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-4 pt-8 border-t border-primary-foreground/10 w-full max-w-[200px] flex flex-col items-center"
                  >
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full h-12 bg-accent text-white font-display font-black text-sm uppercase tracking-widest rounded-xl flex items-center justify-center gap-3"
                    >
                      <LogIn className="w-4 h-4" />
                      Masuk
                    </Link>
                  </motion.div>
                )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="pt-20 text-primary-foreground/30 font-body text-xs tracking-widest uppercase"
              >
                Where First Step Matter
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
