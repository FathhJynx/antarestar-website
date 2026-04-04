import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Award, Gift, Phone } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

const BizCTAStrip = () => (
  <section className="py-16 md:py-20 section-padding bg-background">
    <div className="section-container">
      <Reveal>
        <p className="font-body text-xs font-black uppercase tracking-[0.3em] text-accent text-center mb-3">
          Lebih dari sekadar toko
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl text-center uppercase tracking-tight text-foreground mb-10">
          Ekosistem Antarestar
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Corporate Order */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-1"
        >
          <Link
            to="/corporate"
            className="group flex flex-col h-full bg-card border-2 border-border hover:border-accent/40 rounded-3xl p-7 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
              <Building2 className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
            </div>
            <h3 className="font-display font-black text-xl text-foreground uppercase mb-3 tracking-tight">
              Corporate Order
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
              Seragam tim, merchandise event, atau perlengkapan lapangan. Mulai <strong className="text-foreground">10 pcs</strong> dengan harga grosir & logo custom.
            </p>
            <ul className="space-y-1.5 mb-6">
              {["Harga grosir mulai 10 pcs", "Custom bordir logo perusahaan", "Pengiriman ke seluruh Indonesia"].map(t => (
                <li key={t} className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 font-display font-black text-sm text-accent uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
              <Phone className="w-4 h-4" /> Konsultasi Gratis <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        {/* Affiliate */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/affiliate"
            className="group flex flex-col h-full bg-primary border-2 border-white/10 hover:border-accent/40 rounded-3xl p-7 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="w-12 h-12 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center mb-5">
              <Award className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-black text-xl text-white uppercase mb-3 tracking-tight">
              Affiliate Program
            </h3>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-5 flex-1">
              Share link, dapat komisi. Hasilkan hingga <strong className="text-white">15% per transaksi</strong> tanpa modal dan tanpa target.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { n: "15%", l: "Komisi per sale" },
                { n: "Rp0", l: "Biaya daftar" },
              ].map(s => (
                <div key={s.n} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="font-display font-black text-xl text-accent">{s.n}</p>
                  <p className="font-body text-[10px] text-white/50 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 font-display font-black text-sm text-accent uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
              Daftar Affiliate <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

        {/* Member Club */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/member"
            className="group flex flex-col h-full bg-primary border-2 border-white/10 hover:border-accent/40 rounded-3xl p-7 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-accent/8 rounded-full blur-[60px] pointer-events-none" />
            <div className="w-12 h-12 bg-accent/20 border border-accent/30 rounded-2xl flex items-center justify-center mb-5">
              <Gift className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-black text-xl text-white uppercase mb-3 tracking-tight">
              Member Club
            </h3>
            <p className="font-body text-sm text-white/60 leading-relaxed mb-5 flex-1">
              Kumpulkan poin dari setiap pembelian, naik tier dari <strong className="text-white">Explorer → Summit</strong> dan nikmati diskon eksklusif + hadiah.
            </p>
            <div className="flex gap-2 mb-6">
              {[
                { tier: "Explorer", color: "bg-emerald-500" },
                { tier: "Pioneer", color: "bg-blue-500" },
                { tier: "Summit", color: "bg-amber-400" },
              ].map(t => (
                <div key={t.tier} className="flex-1 bg-white/5 rounded-xl p-2 text-center">
                  <div className={`w-3 h-3 ${t.color} rounded-full mx-auto mb-1`} />
                  <p className="font-body text-[9px] text-white/50">{t.tier}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 font-display font-black text-sm text-accent uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
              Gabung Sekarang <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

      </div>
    </div>
  </section>
);

export default BizCTAStrip;
