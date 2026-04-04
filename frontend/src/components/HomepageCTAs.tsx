import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Users, Award, Truck, ShieldCheck, Gift } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

/* ─── Corporate Order CTA ───────────────────────────────── */
const CorporateCTA = () => (
  <section className="py-20 md:py-28 section-padding bg-primary relative overflow-hidden">
    {/* Decorative */}
    <div className="absolute inset-0 grain opacity-20" />
    <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

    <div className="section-container relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Copy */}
        <Reveal direction="left">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent" />
              </div>
              <span className="font-body text-xs font-black tracking-[0.25em] uppercase text-accent">Corporate & Bulk Order</span>
            </div>

            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight uppercase mb-5">
              Seragam Tim <br />
              <span className="text-accent">Lebih Hemat</span>
              <br />& Lebih Keren.
            </h2>

            <p className="font-body text-white/60 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Dari seragam lapangan, merchandise event, hingga perlengkapan ekspedisi tim. Kami melayani order <strong className="text-white">mulai 10 pcs</strong> dengan harga grosir dan custom branding logo perusahaan Anda.
            </p>

            {/* Perks */}
            <ul className="space-y-3 mb-10">
              {[
                { icon: Award, text: "Harga khusus grosir mulai 10 unit" },
                { icon: ShieldCheck, text: "Custom logo & bordir nama tim" },
                { icon: Truck, text: "Pengiriman ke seluruh Indonesia" },
                { icon: Gift, text: "Free sample sebelum produksi massal" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 font-body text-sm text-white/80">
                  <item.icon className="w-4 h-4 text-accent shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/corporate"
                className="group inline-flex items-center gap-2 h-12 px-7 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-black text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_30px_hsl(var(--accent)/0.3)]"
              >
                Hubungi Kami <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 h-12 px-7 border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-all duration-300"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Right: Stats grid */}
        <Reveal direction="right" delay={0.15}>
          <div className="grid grid-cols-2 gap-5">
            {[
              { value: "500+", label: "Perusahaan & Komunitas", desc: "telah mempercayakan seragam mereka kepada Antarestar" },
              { value: "50K+", label: "Unit Terproduksi", desc: "berbagai jenis pakaian dan perlengkapan outdoor" },
              { value: "34", label: "Provinsi di Indonesia", desc: "jangkauan pengiriman resmi kami" },
              { value: "4.9★", label: "Rating Corporate", desc: "dari ratusan klien korporat yang puas" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-accent/30 transition-all duration-300"
              >
                <p className="font-display font-black text-3xl md:text-4xl text-accent mb-1">{stat.value}</p>
                <p className="font-display font-bold text-sm text-white mb-1.5">{stat.label}</p>
                <p className="font-body text-[11px] text-white/40 leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ─── Value Props Strip ─────────────────────────────────── */
const ValuePropsStrip = () => {
  const props = [
    { icon: Truck, title: "Gratis Ongkir", desc: "Untuk pesanan di atas Rp 100.000 ke seluruh Indonesia" },
    { icon: ShieldCheck, title: "Garansi Resmi", desc: "Semua produk bergaransi 1 tahun langsung dari Antarestar" },
    { icon: Award, title: "Kualitas Premium", desc: "Bahan outdoor grade dengan sertifikasi quality control ketat" },
    { icon: Users, title: "50.000+ Pembeli", desc: "Komunitas adventurer Antarestar terus bertumbuh setiap harinya" },
  ];

  return (
    <section className="py-12 md:py-16 section-padding bg-card border-y border-border">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {props.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                  <item.icon className="w-5 h-5 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-foreground mb-1">{item.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Affiliate & Member CTA (split horizontal) ─────────── */
const AffiliateAndMemberCTA = () => (
  <section className="py-16 md:py-20 section-padding bg-background">
    <div className="section-container">
      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {/* Affiliate */}
        <Reveal direction="left">
          <Link
            to="/affiliate"
            className="group relative flex flex-col justify-between gap-6 bg-primary border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden hover:border-accent/40 transition-all duration-300"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
            <div>
              <div className="w-12 h-12 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center mb-5">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight mb-3">
                Jadi Affiliator<br /><span className="text-accent">& Hasilkan Income</span>
              </h3>
              <p className="font-body text-white/60 text-sm leading-relaxed max-w-sm">
                Bagikan link produk favoritmu dan earn komisi hingga <strong className="text-white">15%</strong> setiap transaksi yang berhasil. Daftar gratis, tidak ada target khusus.
              </p>
            </div>
            <div className="flex items-center gap-2 font-display font-bold text-sm text-accent uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
              Daftar Affiliate <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </Reveal>

        {/* Member */}
        <Reveal direction="right" delay={0.1}>
          <Link
            to="/member"
            className="group relative flex flex-col justify-between gap-6 bg-primary border border-white/10 rounded-3xl p-8 md:p-10 overflow-hidden hover:border-accent/40 transition-all duration-300"
          >
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
            <div>
              <div className="w-12 h-12 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center mb-5">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight mb-3">
                Member Club<br /><span className="text-accent">& Kumpulkan Poin</span>
              </h3>
              <p className="font-body text-white/60 text-sm leading-relaxed max-w-sm">
                Setiap pembelian menghasilkan poin yang bisa ditukar diskon. Naik tier dari Explorer → Pioneer → Summit dan nikmati keuntungan eksklusif.
              </p>
            </div>
            <div className="flex items-center gap-2 font-display font-bold text-sm text-accent uppercase tracking-wider group-hover:gap-4 transition-all duration-300">
              Join Member <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </Reveal>
      </div>
    </div>
  </section>
);

export { CorporateCTA, ValuePropsStrip, AffiliateAndMemberCTA };
