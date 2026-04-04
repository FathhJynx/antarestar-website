import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Flame, Star, Users, BadgePercent } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import promoBg from "@/assets/promo-flash-sale-bg.png";

const valmoraJacketImg = "https://antarestar.com/wp-content/uploads/2025/12/LAYOUT-THUMBNAIL-BARU-JACKET-VALMORA-1.png";

const INITIAL_SECONDS = 12 * 3600 + 45 * 60 + 30;

const DiscountCTA = () => {
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-primary">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={promoBg} alt="" className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/50" />
      </div>

      <div className="section-padding relative z-10">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* ── Left: Copywriting ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Urgency eyebrow */}
              <div className="flex items-center gap-2 mb-5">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                  <Flame className="w-5 h-5 text-orange-400" />
                </motion.div>
                <span className="font-body text-xs font-black text-orange-400 tracking-[0.25em] uppercase">
                  Promo habis dalam {h}:{m}:{s}
                </span>
              </div>

              {/* Big Headline */}
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-4 uppercase">
                Jangan <br />
                <span className="text-accent italic">Menyesal</span>
                <br />Besok.
              </h2>
              <p className="font-body text-white/60 text-base md:text-lg mb-6 max-w-md leading-relaxed">
                Lebih dari <span className="text-white font-bold">10.000 adventurer</span> sudah memilih perlengkapan Antarestar. Dapatkan harga <strong className="text-accent">hingga 50% lebih murah</strong> sebelum stok habis.
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: Star, text: "Rating 4.8 / 5.0", sub: "dari 20K+ ulasan" },
                  { icon: Users, text: "10.000+ Pembeli", sub: "bulan ini" },
                  { icon: BadgePercent, text: "Up to 50% OFF", sub: "semua kategori" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                    <item.icon className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="font-display font-bold text-xs text-white">{item.text}</p>
                      <p className="font-body text-[10px] text-white/50">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Countdown in compact form */}
              <div className="flex items-center gap-3 mb-8">
                <p className="font-body text-xs font-bold uppercase tracking-widest text-white/50">Penawaran berakhir dalam:</p>
                <div className="flex items-center gap-1.5 font-display font-black text-2xl">
                  {[h, m, s].map((unit, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="bg-accent/20 border border-accent/30 text-accent px-3 py-1 rounded-lg">{unit}</span>
                      {i < 2 && <span className="text-white/30">:</span>}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" className="rounded-xl uppercase tracking-wider font-black text-sm px-8 shadow-[0_0_30px_hsl(var(--accent)/0.4)]" asChild><Link to="/store?sort=Popular" className="group">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Belanja Sekarang
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link></Button>
                <Button variant="hero-outline" size="xl" className="rounded-xl uppercase tracking-wider font-bold text-sm px-8 border-white/20 text-white hover:bg-white/5" asChild><Link to="/store">Katalog Sale</Link></Button>
              </div>
            </motion.div>

            {/* ── Right: Featured Product Card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="hidden lg:block"
            >
              <div className="relative glass p-6 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden group">
                {/* Discount ribbon */}
                <div className="absolute top-0 right-0 bg-accent text-white px-6 py-2.5 rounded-bl-3xl font-display font-black text-xl z-20 shadow-lg">
                  -43%
                </div>

                {/* Product image */}
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-white flex items-center justify-center p-4 mb-6">
                  <img src={valmoraJacketImg} alt="Valmora Windbreaker" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-xl" />
                </div>

                {/* Product info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= 5 ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                      ))}
                    </div>
                    <span className="font-body text-xs text-white/60">4.8 (1.247 ulasan)</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white leading-tight">ANTARESTAR Jaket Crinkle Valmora</h3>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-3xl font-black text-accent">Rp 425.000</span>
                    <span className="font-body text-white/40 line-through text-sm">Rp 750.000</span>
                  </div>
                  {/* Sizes quick picker */}
                  <div className="flex gap-2 pt-1">
                    {["S", "M", "L", "XL", "XXL"].map((sz) => (
                      <span key={sz} className="w-9 h-9 border border-white/20 rounded-lg flex items-center justify-center text-xs font-bold text-white/70 font-display hover:border-accent hover:text-accent transition-colors cursor-pointer">
                        {sz}
                      </span>
                    ))}
                  </div>
                  <Link to="/product/1" className="flex items-center justify-center gap-2 w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors mt-2">
                    <ShoppingBag className="w-4 h-4" /> Tambah ke Keranjang
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountCTA;
