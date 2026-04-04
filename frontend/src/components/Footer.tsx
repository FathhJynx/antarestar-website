import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";

const footerLinks = {
  shop: [
    { label: "Semua Produk", to: "/store" },
    { label: "Jaket", to: "/store?category=Jakets" },
    { label: "Tas", to: "/store?category=Bags" },
    { label: "Alas Kaki", to: "/store?category=Footwear" },
    { label: "Aksesoris", to: "/store?category=Accessories" },
  ],
  company: [
    { label: "Tentang Kami", to: "#brand-story" },
    { label: "Karir", to: "#" },
    { label: "B2B / Reseller", to: "#" },
    { label: "Kontak", to: "#" },
  ],
  social: [
    { label: "Instagram", icon: Instagram, to: "#" },
    { label: "TikTok", icon: MessageCircle, to: "#" },
    { label: "YouTube", icon: Youtube, to: "#" },
    { label: "WhatsApp", icon: MessageCircle, to: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-white section-padding pt-20 pb-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />

      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Brand */}
          <Reveal className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <Mountain className="w-7 h-7 text-accent" />
              <span className="font-display font-black text-2xl tracking-[0.2em] uppercase">ANTARESTAR</span>
            </div>
            <p className="font-body text-[13px] text-white/50 leading-relaxed max-w-sm mb-8 font-medium">
              Kami merancang perlengkapan premium untuk mereka yang tak kenal lelah. Dibuat untuk petualang Indonesia sejak 2019. Dekap alam liar.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-8">
              {footerLinks.social.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.to}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300"
                >
                  <s.icon className="w-[18px] h-[18px]" />
                </motion.a>
              ))}
            </div>
          </Reveal>

          {/* Shop */}
          <Reveal delay={0.1} className="md:col-span-3">
            <h4 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-white/40">Belanja</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-white/60 hover:text-accent transition-colors duration-300 reveal-line pb-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Company */}
          <Reveal delay={0.2} className="md:col-span-3">
            <h4 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-white/40">Perusahaan</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    className="font-body text-sm text-white/60 hover:text-accent transition-colors duration-300 reveal-line pb-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Newsletter mini */}
          <Reveal delay={0.3} className="col-span-2 md:col-span-2">
            <h4 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-white/40">Terhubung</h4>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              Ikuti petualangan kami di media sosial untuk rilisan terbaru dan cerita seru.
            </p>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[11px] text-white/30 tracking-wide">
            © 2026 Antarestar. All rights reserved.
          </p>
          <div className="flex gap-8 font-body text-[11px] text-white/30">
            <a href="#" className="hover:text-accent transition-colors duration-300">Kebijakan Privasi</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Peta Situs</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
