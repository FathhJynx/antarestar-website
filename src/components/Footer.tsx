import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground section-padding py-16">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display font-bold text-xl mb-4">
              <span className="text-accent">A</span> ANTARESTAR
            </h3>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
              Where First Step Matter. Premium outdoor gear for Indonesian adventurers.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Shop</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/60">
              <li><Link to="/store" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link to="/store?category=Jackets" className="hover:text-accent transition-colors">Jackets</Link></li>
              <li><Link to="/store?category=Bags" className="hover:text-accent transition-colors">Bags</Link></li>
              <li><Link to="/store?category=Footwear" className="hover:text-accent transition-colors">Footwear</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/60">
              <li><a href="#brand-story" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">B2B / Reseller</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Connect</h4>
            <ul className="space-y-2 font-body text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">TikTok</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-primary-foreground/40">
            © 2025 Antarestar. All rights reserved.
          </p>
          <div className="flex gap-6 font-body text-xs text-primary-foreground/40">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
