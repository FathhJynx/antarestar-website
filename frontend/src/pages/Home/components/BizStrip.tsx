import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Award, Gift, ArrowRight, Check } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";

const ease = [0.16, 1, 0.3, 1] as const;

const BizStrip = () => (
  <section className="py-16 md:py-24 bg-primary">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
      <FadeIn className="mb-10 md:mb-12 text-center">
        <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-accent mb-3">Lebih dari sekadar toko</p>
        <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase leading-tight tracking-tight">
          Ekosistem Antarestar
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            to: "/corporate",
            icon: Building2,
            title: "Corporate Order",
            desc: "Seragam tim, merchandise event, perlengkapan lapangan. Mulai 10 pcs dengan harga grosir & logo custom.",
            points: ["Harga grosir mulai 10 pcs", "Custom bordir logo", "Pengiriman ke 34 provinsi"],
            cta: "Konsultasi Gratis",
            dark: false,
          },
          {
            to: "/affiliate",
            icon: Award,
            title: "Affiliate Program",
            desc: "Share link produk favorit dan earn komisi hingga 15% per transaksi. Daftar gratis, tanpa target.",
            points: ["Komisi 15% per sale", "Daftar 100% gratis", "Dashboard real-time"],
            cta: "Daftar Affiliate",
            dark: true,
          },
          {
            to: "/member",
            icon: Gift,
            title: "Member Club",
            desc: "Kumpulkan poin dari setiap pembelian, naik tier Explorer → Summit, dan nikmati keuntungan eksklusif.",
            points: ["Poin dari setiap transaksi", "Diskon tier eksklusif", "Hadiah ulang tahun"],
            cta: "Gabung Sekarang",
            dark: true,
          },
        ].map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.65, delay: i * 0.1, ease }}>
            <Link to={card.to} className={`group flex flex-col h-full rounded-3xl p-6 md:p-8 border-2 transition-all duration-300 hover:border-accent/50
              ${card.dark ? "bg-white/5 border-white/10" : "bg-background border-border hover:shadow-lg hover:shadow-black/20"}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-colors
                ${card.dark ? "bg-accent/20 border border-accent/30" : "bg-accent/10 border border-accent/20 group-hover:bg-accent"}`}>
                <card.icon className={`w-5 h-5 transition-colors ${card.dark ? "text-accent" : "text-accent group-hover:text-white"}`} />
              </div>
              <h3 className={`font-display font-black text-xl uppercase tracking-tight mb-3 ${card.dark ? "text-white" : "text-foreground"}`}>{card.title}</h3>
              <p className={`font-body text-sm leading-relaxed mb-5 flex-1 ${card.dark ? "text-white/60" : "text-muted-foreground"}`}>{card.desc}</p>
              <ul className="space-y-2 mb-6">
                {card.points.map(pt => (
                  <li key={pt} className={`flex items-center gap-2.5 font-body text-xs ${card.dark ? "text-white/70" : "text-muted-foreground"}`}>
                    <Check className="w-3.5 h-3.5 text-accent shrink-0" />{pt}
                  </li>
                ))}
              </ul>
              <div className={`flex items-center gap-2 font-display font-bold text-sm uppercase tracking-wider
                text-accent group-hover:gap-3 transition-all duration-300`}>
                {card.cta} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BizStrip;
