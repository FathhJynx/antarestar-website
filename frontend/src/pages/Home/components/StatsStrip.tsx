import FadeIn from "@/components/common/FadeIn";

const STATS = [
  { n: "50 K+",  l: "Produk Terjual" },
  { n: "4.8 ★",  l: "Rating Rata-rata" },
  { n: "500+",   l: "Korporat Terlayani" },
  { n: "7 Thn",  l: "Pengalaman Brand" },
];

const StatsStrip = () => (
  <div className="bg-primary border-b border-white/10">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {STATS.map((s, i) => (
          <FadeIn key={s.l} delay={i * 0.08}>
            <div className="text-center">
              <p className="font-display font-black text-3xl md:text-4xl text-accent mb-1 leading-none">{s.n}</p>
              <p className="font-body text-xs md:text-sm text-white/50 uppercase tracking-widest">{s.l}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </div>
);

export default StatsStrip;
