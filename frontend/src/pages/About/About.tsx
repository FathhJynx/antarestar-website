import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import { Mountain, Users, Shield, Leaf } from "lucide-react";
import heroBg from "@/assets/community-3.jpg"; // Using a community/landscape bg
import aboutStory1 from "@/assets/hero-outdoor.jpg";
import aboutStory2 from "@/assets/community-2.jpg";

const values = [
  {
    icon: <Mountain className="w-6 h-6" />,
    title: "Eksplorasi Tanpa Henti",
    desc: "Kami diciptakan untuk mereka yang menolak diam. Menjelajah batas alam dan diri sendiri.",
  },
  {
    icon: <Quality className="w-6 h-6" />,
    title: "Kualitas Tanpa Kompromi",
    desc: "Setiap jahitan dan material diuji di medan tropis ekstrem untuk menjamin ketahanan seumur hidup.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Utamakan Komunitas",
    desc: "Bukan sekadar brand, kami adalah wadah bagi ribuan petualang Indonesia untuk saling menginspirasi.",
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Penjaga Alam",
    desc: "Berkomitmen pada praktik berkelanjutan untuk menjaga alam yang menjadi taman bermain kita.",
  },
];

// Helper icon
function Quality(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Shield {...props} />
  )
}

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[100svh] w-full bg-[#050505] overflow-hidden flex flex-col justify-between pt-[80px]">
        <div className="absolute inset-0 w-full h-full">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroBg}
            alt="Antarestar Community"
            className="w-full h-full object-cover object-[center_30%]"
          />
          {/* Complex Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/40 to-[#050505]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] to-transparent" />
        </div>

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none z-[1] opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Top Decorative Nav/Eyebrow overlay */}
        <div className="relative z-10 w-full pt-8 px-6 md:px-12 flex justify-between items-center border-b border-white/5 pb-4">
           <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
           >
              <span className="font-body text-[10px] tracking-[0.4em] font-bold uppercase text-accent">
                Manifesto Brand
              </span>
           </motion.div>
           <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
           >
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/50">
                Est. 2019
              </span>
           </motion.div>
        </div>

        <div className="relative z-10 section-padding flex-1 flex flex-col justify-center w-full">
          <div className="section-container relative">
            
            {/* Giant Background Typography */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none mix-blend-overlay opacity-20 hidden md:block">
               <h1 className="font-display font-black text-[15vw] leading-none uppercase tracking-tighter text-white whitespace-nowrap">
                 Antarestar
               </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end w-full">
              {/* Main Title Block */}
              <div className="md:col-span-8 lg:col-span-9 relative">
                {/* Decorative Side Line */}
                <div className="absolute -left-4 md:-left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent to-transparent" />
                
                <h1 className="font-display font-black leading-[0.85] tracking-tighter uppercase mb-6 text-white drop-shadow-2xl">
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-[clamp(4rem,9vw,8rem)]"
                  >
                    Tempa
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-[clamp(4rem,9vw,8rem)] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/70 to-white/10"
                  >
                    Jalanmu
                  </motion.span>
                </h1>
              </div>

              {/* Supporting Text Block */}
              <div className="md:col-span-4 lg:col-span-3 pb-2 md:pb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="space-y-6"
                >
                  <div className="w-12 h-1 bg-accent" />
                  <p className="font-body text-white/80 text-sm md:text-base leading-relaxed font-medium">
                    Lahir dari kerasnya alam tropis Indonesia. Kami merancang perlengkapan luar ruang untuk mereka yang menolak batas konvensional.
                  </p>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THE MANIFESTO ── */}
      <section className="py-24 md:py-40 section-padding bg-background relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/3 h-[80%] bg-muted/30 -z-10" />

        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Story Text (Col 1-5) */}
            <div className="lg:col-span-5 relative z-10">
              <Reveal className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-accent" />
                  <span className="font-body text-[11px] tracking-[0.4em] font-bold uppercase text-accent">
                    Asal Mula
                  </span>
                </div>
                
                <h2 className="font-display font-black text-[clamp(2.5rem,5vw,4.5rem)] uppercase tracking-tighter text-foreground leading-[0.95] drop-shadow-sm">
                  Dari <br/>
                  <span className="text-muted-foreground/30 px-2 line-through decoration-accent/50">Frustrasi</span>
                  <br/> Ke Puncak.
                </h2>

              <div className="font-body text-muted-foreground text-base md:text-lg leading-relaxed space-y-6">
                <p>
                  Didirikan pada tahun 2019 di kaki Gunung Gede Pangrango, Antarestar lahir dari sebuah rasa frustrasi: sulitnya menemukan perlengkapan outdoor lokal yang memiliki standar ketahanan ekstrem namun dengan desain yang modern dan relevan dengan gaya hidup urban.
                </p>
                <p>
                  Kami memulai perjalanan ini bukan hanya sebagai sebuah brand, melainkan sebagai sebuah inovator. Setiap prototipe jaket, tas, dan sepatu kami uji langsung melintasi hutan hujan tropis yang lebat, badai kabut di ketinggian, hingga kerasnya aspal perkotaan.
                </p>
              </div>
              </Reveal>
            </div>

            {/* Story Image (Col 6-12) */}
            <div className="lg:col-span-7 relative">
              <Reveal delay={0.2} className="relative w-full h-[600px] sm:h-[700px] lg:h-[800px]">
                {/* Main large image */}
                <div className="absolute top-0 right-0 w-[85%] h-[80%] rounded-none overflow-hidden bg-muted shadow-2xl">
                  <img 
                    src={aboutStory1} 
                    alt="Antarestar Expedition" 
                    className="w-full h-full object-cover grayscale-[40%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  />
                </div>
                {/* Overlapping small image */}
                <div className="absolute bottom-0 left-0 w-[55%] h-[50%] rounded-none overflow-hidden bg-muted border-[12px] border-background shadow-2xl z-10">
                   <img 
                    src={aboutStory2} 
                    alt="Community Trekking" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                {/* Decorative Element */}
                <div className="absolute bottom-24 -right-6 w-32 h-32 border border-accent/30 rounded-full animate-spin-slow pointer-events-none hidden md:block" />
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── OUR VALUES ── */}
      <section className="py-24 md:py-32 section-padding bg-primary text-white overflow-hidden relative">
        <div className="absolute top-1/2 right-0 w-[50vh] h-[50vh] bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

        <div className="section-container relative z-10">
          <Reveal className="mb-20 md:mb-28 relative">
            <h2 className="font-display font-black text-[clamp(2.5rem,5vw,5rem)] uppercase tracking-tighter mb-4 leading-none">
              <span className="text-white/20 select-none block -mb-6 md:-mb-10 text-[clamp(4rem,8vw,8rem)]">Fondasi</span>
              <span className="relative z-10 drop-shadow-lg">Nilai <span className="text-accent">Utama</span> Kami</span>
            </h2>
            <div className="w-12 h-1 bg-accent mb-6" />
            <p className="font-body text-white/50 text-base md:text-lg leading-relaxed max-w-xl">
              Empat pilar utama yang menyatukan desain utilitas, ketahanan lingkungan, dan semangat eksplorasi di setiap benang Antarestar.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {values.map((v, i) => (
              <StaggerItem key={i} className="flex flex-col group relative">
                <div className="absolute -inset-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-14 h-14 bg-white/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 rounded-sm">
                  {v.icon}
                </div>
                <div className="text-[10px] text-accent tracking-[0.3em] font-bold mb-3 uppercase opacity-60">0{i + 1}</div>
                <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight mb-4 group-hover:text-accent transition-colors duration-300">
                  {v.title}
                </h3>
                <p className="font-body text-[14px] text-white/60 leading-relaxed font-medium">
                  {v.desc}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
