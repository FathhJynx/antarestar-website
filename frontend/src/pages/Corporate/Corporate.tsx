/**
 * Corporate.tsx — Corporate Order & Partnership landing page
 *
 * Sections:
 *   1. Hero        — full-screen dark, massive headline, social proof numbers
 *   2. Process     — how it works (3 steps)
 *   3. Products    — what we supply (categories with images)
 *   4. Why Us      — 4 key differentiators
 *   5. Clients     — logo marquee / trusted by
 *   6. Form + Stores — contact form + 3 offline stores side-by-side
 *   7. FAQ         — common questions accordion
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import {
  Building2, Users, Package, Truck, ShieldCheck, Award,
  ChevronDown, ChevronRight, Phone, Mail, MapPin, Check,
  ArrowRight, Star, Zap, Palette, MessageSquare,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import heroBg    from "@/assets/community-1.jpg";
import storeBg   from "@/assets/hero-outdoor.jpg";
import campImg   from "@/assets/lifestyle-camping.jpg";
import hikeImg   from "@/assets/lifestyle-hiker.jpg";

// ─── shared animation ─────────────────────────────────────
const ease = [0.16, 1, 0.3, 1] as const;
const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Data ─────────────────────────────────────────────────
const STEPS = [
  { n: "01", icon: MessageSquare, title: "Konsultasi Gratis", desc: "Ceritakan kebutuhan tim Anda — budget, jumlah, jenis produk, tenggat waktu. Tim kami siap membantu." },
  { n: "02", icon: Palette, title: "Desain & Custom",    desc: "Kami buat mockup digital dengan logo dan warna brand Anda sebelum produksi dimulai. Gratis revisi hingga OK." },
  { n: "03", icon: Package, title: "Produksi & Kirim",   desc: "Setelah sampel disetujui, produksi dimulai. Pengiriman ke seluruh Indonesia dengan armada logistics terpercaya." },
];

const PRODUCTS = [
  { img: "https://antarestar.com/wp-content/uploads/2025/12/LAYOUT-THUMBNAIL-BARU-JACKET-VALMORA-1.png", bg: heroBg,  name: "Jaket & Windbreaker", desc: "Seragam lapangan premium dengan bordir logo" },
  { img: "https://antarestar.com/wp-content/uploads/2025/11/id-11134207-7ra0k-mbf6nrsvqvyv1e.jpeg", bg: campImg, name: "Apparel Olahraga",    desc: "Kaos, celana, dan set training custom" },
  { img: "https://antarestar.com/wp-content/uploads/2025/11/id-11134207-81ztl-mfnsal8rpfyn37.jpeg", bg: hikeImg, name: "Carrier & Bags",     desc: "Tas lapangan untuk ekspedisi dan tim field" },
  { img: "https://antarestar.com/wp-content/uploads/2025/11/LAYOUT-THUMBNAIL-BARU-JAM-ESSENCE-1.png", bg: storeBg, name: "Gift & Merchandise", desc: "Employee kit, hadiah end-of-year eksklusif" },
];

const WHY = [
  { icon: Award,       title: "Kualitas Premium",    desc: "Semua bahan outdoor grade A dengan quality control ketat sebelum pengiriman." },
  { icon: Zap,         title: "Proses Cepat",        desc: "Dari konsultasi ke delivered, rata-rata 14–21 hari kerja untuk order reguler." },
  { icon: ShieldCheck, title: "Garansi Produksi",    desc: "Jika ada cacat produksi, kami ganti 100% tanpa biaya tambahan." },
  { icon: Truck,       title: "Pengiriman Nasional", desc: "Jangkauan ke 34 provinsi dengan tracking real-time dan asuransi pengiriman." },
];

const FAQS = [
  { q: "Berapa minimum order untuk corporate?",        a: "Minimum order kami adalah 10 pcs per produk untuk mendapatkan harga grosir. Semakin banyak, semakin hemat." },
  { q: "Berapa lama waktu produksi?",                  a: "Untuk order standar (10–100 pcs), estimasi produksi 14–21 hari kerja setelah approval desain. Order massal di atas 500 pcs memerlukan 30–45 hari." },
  { q: "Apakah bisa request desain kustom penuh?",    a: "Bisa! Kami menyediakan layanan full custom — warna, cutting, bordir, printing, label woven, dan packagingnya." },
  { q: "Apakah ada sampel sebelum produksi massal?",  a: "Ya, kami selalu kirim 1 pcs sampel fisik untuk approval sebelum produksi massal dimulai. Biaya sampel dapat direfund saat order." },
  { q: "Metode pembayaran apa yang tersedia?",        a: "Transfer bank (BCA, Mandiri, BRI, BNI), Gopay, OVO, kartu kredit corporate, dan termin net-30 untuk klien terdaftar." },
];

const STORES = [
  { city: "Jakarta",   name: "Flagship Store",  address: "Jl. Senayan Raya No. 12, Kebayoran Baru, Jakarta Selatan", hours: "Sen–Min 10:00–21:00" },
  { city: "Bandung",   name: "Antarestar Hub",  address: "Jl. Riau No. 45, Citarum, Bandung",                        hours: "Sen–Min 09:00–20:00" },
  { city: "Surabaya",  name: "Outpost Store",   address: "Pakuwon Mall Lvl. 2, Babatan, Surabaya",                   hours: "Sen–Min 10:00–22:00" },
];

// ─── FAQ Accordion item ────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left group">
        <span className="font-display font-bold text-sm sm:text-base text-foreground pr-4 group-hover:text-accent transition-colors">{q}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden">
            <p className="font-body text-sm text-muted-foreground leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactForm = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({ 
    name: user?.name || "", 
    company: "", 
    email: user?.email || "",
    phone: "", 
    qty: "", 
    product: "", 
    msg: "" 
  });
  
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast("Otentikasi Diperlukan", {
        description: "Silakan masuk untuk mengajukan permintaan korporat.",
      });
      navigate("/login", { state: { from: { pathname: "/corporate" } } });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fullMessage = `Produk: ${form.product || "-"}\nJumlah: ${form.qty || "-"}\n\nPesan:\n${form.msg}`;
      await api.post("/b2b/inquiries", {
        company_name: form.company,
        contact_name: form.name,
        email: form.email,
        phone: form.phone,
        message: fullMessage
      });
      setSent(true);
    } catch (err) {
      toast.error("Gagal mengirim permintaan", {
        description: "Periksa kembali koneksi Anda atau coba lagi nanti."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = "w-full h-11 px-4 rounded-xl border-2 border-border bg-background font-body text-sm focus:outline-none focus:border-accent transition-colors";
  return sent ? (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
        <Check className="w-8 h-8 text-accent" />
      </div>
      <h3 className="font-display font-black text-2xl text-foreground">Terima Kasih!</h3>
      <p className="font-body text-sm text-muted-foreground max-w-xs">Tim corporate kami akan menghubungi Anda dalam 1×24 jam kerja.</p>
    </motion.div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Nama Lengkap *</label>
          <input required value={form.name} onChange={set("name")} placeholder="Budi Santoso" className={field} />
        </div>
        <div>
          <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Email *</label>
          <input required type="email" value={form.email} onChange={set("email")} placeholder="budi@perusahaan.com" className={field} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Perusahaan / Instansi *</label>
          <input required value={form.company} onChange={set("company")} placeholder="PT Maju Jaya" className={field} />
        </div>
        <div>
          <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">No. WhatsApp *</label>
          <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="0812-xxxx-xxxx" className={field} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Estimasi Jumlah (pcs)</label>
          <input type="number" min="10" value={form.qty} onChange={set("qty")} placeholder="Minimal 10 pcs" className={field} />
        </div>
        <div>
          <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Jenis Produk</label>
          <select value={form.product} onChange={set("product")} className={field + " cursor-pointer"}>
            <option value="">-- Pilih jenis produk --</option>
            <option>Jaket & Windbreaker</option>
            <option>Apparel / Kaos Olahraga</option>
            <option>Carrier & Tas Lapangan</option>
            <option>Corporate Gifting / Merchandise</option>
            <option>Bundle / Mix Produk</option>
          </select>
        </div>
      </div>
      <div>
        <label className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Pesan / Kebutuhan Detail *</label>
        <textarea required value={form.msg} onChange={set("msg")} rows={3} placeholder="Ceritakan kebutuhan Anda: warna, ukuran, deadline, budget, dll."
          className={field + " !h-auto resize-none py-3"} />
      </div>
      <button type="submit" disabled={isSubmitting}
        className={`w-full h-12 ${isSubmitting ? 'bg-accent/50 cursor-not-allowed' : 'bg-accent hover:bg-accent/90'} text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_24px_hsl(18_85%_52%/0.3)]`}>
        {isSubmitting ? 'Mengirim...' : <>Kirim Permintaan <ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-center font-body text-[10px] text-muted-foreground">
        Atau langsung chat via <a href="https://wa.me/62812345678" target="_blank" rel="noreferrer" className="text-accent font-bold hover:underline">WhatsApp</a> ·
        {" "}<a href="mailto:corporate@antarestar.com" className="text-accent font-bold hover:underline">Email</a>
      </p>
    </form>
  );
};

// ─── Main Page ─────────────────────────────────────────────
const Corporate = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCTA = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast("Login Diperlukan", {
        description: "Silakan masuk untuk mengakses layanan pesanan korporat.",
      });
      navigate("/login", { state: { from: { pathname: "/corporate" } } });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100svh] bg-primary flex flex-col justify-center overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover object-center opacity-20 grayscale scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-primary" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent" />
        </div>
        {/* dot grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "28px 28px" }} />

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Copy */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
                className="flex items-center gap-3 mb-6">
                <Building2 className="w-5 h-5 text-accent" />
                <span className="font-body text-xs font-black uppercase tracking-[0.3em] text-accent">Kemitraan Korporat & B2B</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }}
                className="font-display font-black text-white uppercase leading-[0.92] tracking-tight mb-6"
                style={{ fontSize: "clamp(2.6rem, 7vw, 6rem)" }}>
                Lengkapi<br />
                <span className="text-secondary">Tim Anda</span><br />
                <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">Sepenuhnya.</span>
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease }}
                className="font-body text-white/65 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mb-8">
                Dari seragam ekspedisi, corporate gifting, hingga merchandise event berskala besar — Antarestar hadir sebagai mitra gear terpercaya untuk <strong className="text-white font-black">500+ klien korporat</strong> di seluruh Indonesia.
              </motion.p>

              {/* Social proof mini row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 mb-10">
                {[
                  { n: "500+",  l: "Klien Korporat" },
                  { n: "50K+", l: "Unit Terproduksi" },
                  { n: "4.9★", l: "Rating Klien" },
                ].map(s => (
                  <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-left min-w-[120px]">
                    <p className="font-display font-black text-2xl text-white leading-none mb-1">{s.n}</p>
                    <p className="font-body text-[10px] text-white/40 uppercase tracking-widest">{s.l}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, ease }}
                className="flex flex-col sm:flex-row gap-4">
                <a href="#contact"
                  onClick={handleCTA}
                  className="inline-flex items-center justify-center gap-2 h-14 px-10 bg-accent hover:bg-accent/90 text-white font-display font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_28px_hsl(18_85%_52%/0.35)] group">
                  Ajukan Permintaan <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="https://wa.me/62812345678" target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 font-display font-bold text-sm uppercase tracking-wider rounded-2xl transition-all">
                  <Phone className="w-4 h-4" /> Hubungi Sales
                </a>
              </motion.div>
            </div>

            {/* Right: stacked product mockups — hidden on small mobile */}
            <div className="hidden sm:block relative h-[400px] lg:h-[580px]">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 1, ease }}
                className="absolute top-0 right-0 w-[80%] h-[80%] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-white/10 group">
                <img src="https://antarestar.com/wp-content/uploads/2024/09/jersey.png" alt="Custom Uniform"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>
                    <p className="text-white font-display font-black text-lg uppercase">Custom Uniform</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 1, ease }}
                className="absolute bottom-0 left-0 w-[60%] aspect-square rounded-[2rem] overflow-hidden bg-white/10 border border-white/20 shadow-2xl backdrop-blur-xl flex items-center justify-center p-8 group">
                <img src="https://antarestar.com/wp-content/uploads/2025/12/LAYOUT-THUMBNAIL-BARU-JACKET-VALMORA-1.png"
                  alt="Premium Jacket" className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                <div className="absolute top-4 right-4 h-8 px-3 bg-accent text-white text-[10px] font-black uppercase tracking-widest flex items-center rounded-lg">
                  Terbaru
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="font-body text-[10px] text-white/30 uppercase tracking-widest">Explore Partnership</p>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-background relative">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
          <FadeUp className="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
            <p className="font-body text-xs font-bold uppercase tracking-[0.4em] text-accent mb-4">The Process</p>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase text-foreground leading-[0.9] tracking-tighter mb-6">
              Sederhana, <span className="text-muted-foreground/30">Cepat,</span> & Transparan.
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">Kami menyederhanakan rantai pasok Anda dengan proses yang terstruktur dan feedback real-time.</p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <FadeUp key={s.n} delay={i * 0.12}>
                <div className="group relative p-10 rounded-[2.5rem] border-2 border-border bg-card hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 h-full">
                  <span className="font-display font-black text-8xl text-border group-hover:text-accent/10 transition-colors duration-500 leading-none absolute top-4 right-8 pointer-events-none">{s.n}</span>
                  <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:bg-accent group-hover:border-accent transition-all duration-500 group-hover:rotate-6">
                    <s.icon className="w-7 h-7 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display font-black text-2xl text-foreground mb-4 uppercase tracking-tight">{s.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. WHAT WE SUPPLY — Product Categories
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-primary relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-20">
            <FadeUp>
              <p className="font-body text-xs font-bold uppercase tracking-[0.4em] text-accent mb-4">Portfolio Produk</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase text-white leading-[0.9] tracking-tighter">
                Produksi Sesuai <br /> <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">Visi Anda.</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
                <p className="font-body text-white/50 text-sm max-w-sm">Dapatkan akses ke materi grade pendaki untuk tim korporat Anda. Ketahanan lapangan yang tidak tertandingi.</p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.1}>
                <div className="group rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-500">
                  {/* Product image */}
                  <div className="aspect-square bg-white/5 relative overflow-hidden flex items-center justify-center p-8">
                    <img src={p.img} alt={p.name} loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl" />
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="font-display font-black text-white text-lg mb-2 uppercase tracking-tight">{p.name}</h3>
                    <p className="font-body text-xs text-white/40 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. CONTACT FORM + STORES
      ═══════════════════════════════════════════════════════ */}
      <section id="contact" className="py-24 md:py-32 bg-primary relative">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px,white 1px,transparent 0)", backgroundSize: "40px 40px" }} />
          
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Form */}
            <FadeUp>
              <div className="bg-background rounded-[3rem] p-8 md:p-12 border border-border shadow-2xl relative">
                <div className="absolute top-0 right-12 w-20 h-20 bg-accent/10 rounded-b-3xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-display font-black text-3xl text-foreground uppercase tracking-tight mb-2">Mulai Projek.</h3>
                <p className="text-muted-foreground text-sm mb-10">Isi detail kebutuhan Anda dan biarkan tim ahli kami mengurus sisanya.</p>
                <ContactForm />
              </div>
            </FadeUp>

            {/* Content & Stores */}
            <div className="space-y-12">
              <FadeUp delay={0.2}>
                <h2 className="font-display font-black text-4xl sm:text-5xl text-white uppercase leading-[0.95] tracking-tighter mb-8">
                  Lebih Dekat <br /> <span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8">Dengan Kami.</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Phone, val: "+62 812-3456-7890", sub: "WhatsApp Corporate B2B" },
                    { icon: Mail,  val: "b2b@antarestar.com", sub: "Proposal & Inquiries" },
                  ].map(c => (
                    <div key={c.val} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="w-10 h-10 bg-accent/20 border border-accent/30 rounded-xl flex items-center justify-center mb-4">
                        <c.icon className="w-5 h-5 text-accent" />
                      </div>
                      <p className="font-display font-black text-base text-white mb-1 uppercase tracking-tight">{c.val}</p>
                      <p className="font-body text-[10px] text-white/40 uppercase tracking-widest">{c.sub}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>

              <FadeUp delay={0.3} className="space-y-6">
                <p className="font-display font-black text-xl text-white uppercase tracking-tight">Kunjungi Pusat Pengalaman Kami</p>
                <div className="grid grid-cols-1 gap-4">
                  {STORES.map((s, i) => (
                    <div key={s.city} className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-accent/40 rounded-[1.5rem] p-6 transition-all duration-300">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-5">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:border-accent/40">
                             <MapPin className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <p className="font-body text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-1">{s.city}</p>
                            <h4 className="font-display font-black text-xl text-white uppercase tracking-tight">{s.name}</h4>
                            <p className="font-body text-xs text-white/40 mt-2 leading-relaxed max-w-xs">{s.address}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <FadeUp className="mb-16 text-center">
              <p className="font-body text-xs font-bold uppercase tracking-[0.4em] text-accent mb-4">Frequently Asked</p>
              <h2 className="font-display font-black text-4xl sm:text-5xl uppercase text-foreground leading-tight tracking-tighter">Pertanyaan <span className="text-muted-foreground/30">Umum.</span></h2>
            </FadeUp>
            <FadeUp>
              <div className="rounded-[2.5rem] border border-border bg-card divide-y divide-border overflow-hidden px-10 py-6">
                {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Corporate;
