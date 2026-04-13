import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Youtube, MessageCircle } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const footerLinks = {
  shop: [
    { label: "Semua Gear", to: "/store" },
    { label: "Jaket", to: "/store?category=Jakets" },
    { label: "Tas", to: "/store?category=Bags" },
    { label: "Alas Kaki", to: "/store?category=Footwear" },
    { label: "Aksesoris", to: "/store?category=Accessories" },
  ],
  company: [
    { label: "Tentang Kita", to: "/about" },
    { label: "Jurnal", to: "/blog" },
    { label: "Misi Cuan", to: "/affiliate" },
    { label: "Kerjasama", to: "/corporate" },
  ],
  support: [
    { label: "Cek Status Paket", to: "/tracking" },
    { label: "Basecamp Member", to: "/member" },
    { label: "Hubungi Kita", to: "#" },
  ],
  social: [
    { label: "Instagram", icon: Instagram, to: "#" },
    { label: "TikTok", icon: MessageCircle, to: "#" },
    { label: "YouTube", icon: Youtube, to: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-black text-white relative overflow-hidden border-t border-white/[0.06] pb-32 lg:pb-40">
      {/* Large brand text */}
      <div className="overflow-hidden py-16 md:py-24 border-b border-white/[0.06]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="px-8 md:px-20 lg:px-32"
        >
          <h2 className="font-display font-black text-[clamp(2rem,8vw,7rem)] uppercase tracking-[-0.05em] leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white/15 to-white/[0.03]">
            Antarestar
          </h2>
        </motion.div>
      </div>

      {/* Links grid */}
      <div className="px-8 md:px-20 lg:px-32 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <img
              src="/logo.webp"
              alt="Antarestar"
              className="h-10 w-auto object-contain brightness-200 invert mb-6"
              draggable={false}
            />
            <p className="font-body text-[13px] text-white/35 leading-relaxed max-w-sm mb-8">
              Kita bikin gear premium buat lo yang nggak bisa diem. Temen setia petualang Indonesia dari 2019.
            </p>
            <div className="flex gap-2">
              {footerLinks.social.map((s) => (
                <a
                  key={s.label}
                  href={s.to}
                  className="w-10 h-10 rounded-full border border-white/[0.08] flex items-center justify-center text-white/30 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-body text-[9px] uppercase tracking-[0.4em] text-white/25 font-medium mb-6">Gas Belanja</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-[13px] text-white/40 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="font-body text-[9px] uppercase tracking-[0.4em] text-white/25 font-medium mb-6">Tentang Kita</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-[13px] text-white/40 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h4 className="font-body text-[9px] uppercase tracking-[0.4em] text-white/25 font-medium mb-6">Butuh Bantuan?</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="font-body text-[13px] text-white/40 hover:text-white transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 md:px-20 lg:px-32 py-6 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-[10px] text-white/20 tracking-[0.1em]">
          © 2026 Antarestar. All rights reserved.
        </p>
        <div className="flex gap-8 font-body text-[10px] text-white/20 tracking-[0.1em]">
          <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
          <a href="#" className="hover:text-white/50 transition-colors">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
