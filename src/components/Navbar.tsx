import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, Mountain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavbarScroll } from "@/hooks/useScrollAnimations";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { scrolled, hidden } = useNavbarScroll();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Store", to: "/store" },
  ];

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-primary-foreground/10 shadow-lg shadow-foreground/5"
            : "bg-transparent"
        }`}
      >
        <div className="section-padding">
          <div className="section-container flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 12 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Mountain className="w-7 h-7 text-accent" />
              </motion.div>
              <span className="font-display font-bold text-lg md:text-xl tracking-[0.15em] text-primary-foreground">
                ANTARESTAR
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative px-5 py-2 group"
                >
                  <span className={`font-body text-sm tracking-wider uppercase transition-colors duration-300 ${
                    location.pathname === link.to
                      ? "text-accent font-semibold"
                      : "text-primary-foreground/70 group-hover:text-primary-foreground"
                  }`}>
                    {link.label}
                  </span>
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full"
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
                className="p-2.5 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/5 transition-colors"
              >
                <Search className="w-[18px] h-[18px]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full text-primary-foreground/70 hover:text-accent hover:bg-primary-foreground/5 transition-colors relative"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-primary/80">
                  0
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2.5 rounded-full text-primary-foreground/70"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="fixed inset-0 z-40 bg-primary md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
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
                    className={`font-display text-4xl font-bold tracking-wider uppercase transition-colors ${
                      location.pathname === link.to ? "text-accent" : "text-primary-foreground/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-10 text-primary-foreground/30 font-body text-xs tracking-widest uppercase"
              >
                Where First Step Matter
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
