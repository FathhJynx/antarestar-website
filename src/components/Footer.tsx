import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mountain, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";

const footerLinks = {
  shop: [
    { label: "All Products", to: "/store" },
    { label: "Jackets", to: "/store?category=Jackets" },
    { label: "Bags", to: "/store?category=Bags" },
    { label: "Footwear", to: "/store?category=Footwear" },
    { label: "Accessories", to: "/store?category=Accessories" },
  ],
  company: [
    { label: "About Us", to: "#brand-story" },
    { label: "Careers", to: "#" },
    { label: "B2B / Reseller", to: "#" },
    { label: "Contact", to: "#" },
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
    <footer className="bg-primary text-primary-foreground section-padding pt-20 pb-8 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          {/* Brand */}
          <Reveal className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <Mountain className="w-6 h-6 text-accent" />
              <span className="font-display font-bold text-xl tracking-[0.15em]">ANTARESTAR</span>
            </div>
            <p className="font-body text-sm text-primary-foreground/50 leading-relaxed max-w-xs mb-6">
              Where First Step Matter. Premium outdoor gear crafted for Indonesian adventurers since 2019.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {footerLinks.social.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.to}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/40 hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </Reveal>

          {/* Shop */}
          <Reveal delay={0.1} className="md:col-span-3">
            <h4 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/40">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors duration-300 reveal-line pb-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Company */}
          <Reveal delay={0.2} className="md:col-span-3">
            <h4 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/40">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    className="font-body text-sm text-primary-foreground/60 hover:text-accent transition-colors duration-300 reveal-line pb-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Newsletter mini */}
          <Reveal delay={0.3} className="col-span-2 md:col-span-2">
            <h4 className="font-display font-semibold text-xs tracking-[0.2em] uppercase mb-5 text-primary-foreground/40">Connect</h4>
            <p className="font-body text-sm text-primary-foreground/50 leading-relaxed">
              Follow our adventure on social media for the latest drops and stories.
            </p>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[11px] text-primary-foreground/30 tracking-wide">
            © 2025 Antarestar. All rights reserved.
          </p>
          <div className="flex gap-8 font-body text-[11px] text-primary-foreground/30">
            <a href="#" className="hover:text-accent transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors duration-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
