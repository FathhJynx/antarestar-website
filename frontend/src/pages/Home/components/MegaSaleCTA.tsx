import { Link } from "react-router-dom";
import { Timer, ShoppingBag, ArrowRight, Star, Users, ShieldCheck, Truck } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";
import { useCountdown } from "@/hooks/useCountdown";

const MegaSaleCTA = () => {
  const { h, m, s } = useCountdown(12 * 3600 + 45 * 60);
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="relative bg-primary rounded-3xl overflow-hidden px-6 py-12 md:px-14 md:py-16">
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <FadeIn>
              <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">Mega Sale — Hari ini saja</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-tight tracking-tight mb-5">
                Hemat<br /><span className="text-accent">Hingga<br />50% OFF</span>
              </h2>
              <p className="font-body text-white/60 text-sm md:text-base leading-relaxed mb-7 max-w-md">
                Lebih dari <strong className="text-white">10.000 adventurer</strong> sudah memilih Antarestar. Jangan jadi yang terakhir — stok terbatas untuk setiap item.
              </p>
              <div className="flex items-center gap-3 mb-8">
                <Timer className="w-4 h-4 text-white/40" />
                <p className="font-body text-xs text-white/40 uppercase tracking-widest">Promo berakhir dalam</p>
                <div className="flex items-center gap-1.5 font-display font-black text-xl">
                  {[h, m, s].map((u, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <span className="bg-accent/20 border border-accent/30 text-accent px-2.5 py-0.5 rounded-lg">{u}</span>
                      {i < 2 && <span className="text-white/30">:</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/store?sort=Popular"
                  className="group inline-flex items-center gap-2 h-12 px-7 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_28px_hsl(18_85%_52%/0.35)]">
                  <ShoppingBag className="w-4 h-4" /> Belanja Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link to="/store" className="inline-flex items-center gap-2 h-12 px-7 border border-white/20 text-white hover:bg-white/5 font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors">
                  Katalog Sale
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Star,        n: "4.8/5",   l: "Rating rata-rata dari 20K+ ulasan" },
                  { icon: Users,       n: "50K+",    l: "Pembeli aktif bulan ini" },
                  { icon: ShieldCheck, n: "100%",    l: "Produk bergaransi resmi" },
                  { icon: Truck,       n: "1–3 Hari",l: "Estimasi pengiriman nasional" },
                ].map((s, i) => (
                  <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <s.icon className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="font-display font-black text-xl md:text-2xl text-white">{s.n}</p>
                    <p className="font-body text-[11px] text-white/50 leading-snug mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MegaSaleCTA;
