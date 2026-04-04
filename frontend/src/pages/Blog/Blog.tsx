import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import { ChevronRight, Clock, User, ArrowRight, Search, Hash } from "lucide-react";
import api from "@/lib/api";

import heroBg from "@/assets/lifestyle-hiker.jpg";

const CATEGORIES = ["All"];

// Create fallback empty post so type checking does not complain initially
const FALLBACK_POST = {
  id: "",
  title: "Memuat Artikel...",
  excerpt: "...",
  category: "Tips & Trik",
  author: "Antarestar Team",
  date: "Hari Ini",
  readTime: "5 min read",
  image: heroBg,
  featured: true,
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/articles').then(res => {
      const data = res.data?.data?.data || [];
      if (data.length > 0) {
        setBlogPosts(data.map((a: any, i: number) => ({
          id: a.slug,
          fullId: a.id,
          title: a.title,
          excerpt: a.content.substring(0, 150) + "...",
          category: a.category || "Artikel",
          author: "Admin",
          date: new Date(a.created_at).toLocaleDateString(),
          readTime: Math.ceil(a.content.length / 500) + " min read",
          image: a.image_url,
          featured: i === 0
        })));
      }
    }).catch(console.warn);
  }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, blogPosts]);

  const featuredPost = blogPosts.find(post => post.featured) || blogPosts[0] || FALLBACK_POST;
  const displayPosts = filteredPosts.filter(post => post.id !== (activeCategory === "All" ? featuredPost.id : ""));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-body">
      <Navbar />

      {/* ── IMMERSIVE HERO SECTION ── */}
      <section className="relative min-h-[85svh] w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
           <motion.div
             initial={{ scale: 1.1, opacity: 0 }}
             animate={{ scale: 1, opacity: 0.5 }}
             transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
             className="w-full h-full relative"
           >
             <img src={heroBg} alt="" className="w-full h-full object-cover grayscale-[30%]" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
           </motion.div>
        </div>

        <div className="relative z-10 section-padding pt-24 pb-24 md:pt-32 md:pt-32 w-full">
          <div className="section-container max-w-5xl mx-auto flex flex-col items-center text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-white/10 bg-white/5 backdrop-blur-md rounded-full">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Jurnal Petualang</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="font-display font-black leading-[0.85] tracking-tighter uppercase text-white mb-8 text-[clamp(3.5rem,10vw,8rem)]">
                The <span className="text-transparent bg-clip-text bg-gradient-to-b from-accent to-accent/50">Explorer</span> <br /> Logbook.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-white/60 text-base md:text-xl lg:text-2xl max-w-2xl font-medium leading-relaxed mb-12">
                Temukan panduan gear, tips bertahan di alam liar, dan destinasi tersembunyi untuk ekspedisimu selanjutnya.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button className="h-14 px-10 bg-accent hover:bg-accent/90 text-white rounded-full font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-accent/20 flex items-center gap-3">
                  Mulai Membaca <ArrowRight className="w-4 h-4" />
                </button>
                <button className="h-14 px-10 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-black uppercase text-xs tracking-widest transition-all backdrop-blur-md">
                  Lihat Kategori
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Floating elements for visual depth */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </section>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="sticky top-[64px] md:top-[80px] z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="section-container py-4 flex flex-col md:flex-row items-center justify-between gap-6 overflow-x-hidden">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full md:w-auto pb-2 md:pb-0 px-4 md:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {activeCategory === cat && (
                  <motion.div layoutId="catActive" className="absolute inset-0 bg-accent rounded-full -z-0" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 lg:w-96 px-4 md:px-0">
            <Search className="absolute left-7 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-full pl-12 pr-5 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      <section className="py-20 md:py-32 section-padding bg-background">
        <div className="section-container">
          
          {/* ── FEATURED STORY ── */}
          {activeCategory === "All" && !searchQuery && (
            <div className="mb-32">
              <Reveal>
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="font-display font-black text-2xl uppercase tracking-widest text-foreground">Kisah Utama</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <Link to={`/blog/${featuredPost.id}`} className="block group">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-card border border-border rounded-[2.5rem] overflow-hidden hover:border-accent/40 transition-all duration-700 hover:shadow-2xl hover:shadow-accent/5">
                    <div className="lg:col-span-8 aspect-[16/9] lg:aspect-auto lg:h-[600px] overflow-hidden relative">
                       <img 
                         src={featuredPost.image} 
                         alt={featuredPost.title}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[10%] group-hover:grayscale-0"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                       <div className="absolute top-8 left-8 bg-accent text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl">
                         {featuredPost.category}
                       </div>
                    </div>
                    <div className="lg:col-span-4 p-10 md:p-14 space-y-8 flex flex-col justify-center bg-card relative">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <span className="flex items-center gap-2"><Clock className="w-3 h-3" />{featuredPost.date}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                          <span className="flex items-center gap-2"><User className="w-3 h-3" />{featuredPost.author}</span>
                        </div>
                        <h3 className="font-display font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors leading-[0.9]">
                          {featuredPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm lg:text-base leading-relaxed font-medium">
                          {featuredPost.excerpt}
                        </p>
                      </div>
                      <div className="pt-4 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
                         Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-3 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          )}

          {/* ── ARTICLES GRID ── */}
          <div>
            <Reveal>
              <div className="flex items-center gap-4 mb-12">
                <h2 className="font-display font-black text-2xl uppercase tracking-widest text-foreground">
                  {activeCategory === "All" ? "Artikel Terbaru" : activeCategory}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{displayPosts.length} Cerita</span>
              </div>
            </Reveal>

            <AnimatePresence mode="wait">
              {displayPosts.length > 0 ? (
                <motion.div 
                  key={activeCategory + searchQuery}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                >
                  {displayPosts.map((post, i) => (
                    <div key={post.id}>
                      <Link to={`/blog/${post.id}`} className="block group h-full">
                        <div className="flex flex-col h-full bg-card rounded-3xl border border-border hover:border-accent/40 transition-all duration-500 overflow-hidden hover:shadow-xl hover:-translate-y-2 group">
                          <div className="aspect-[4/3] overflow-hidden relative">
                             <img 
                               src={post.image} 
                               alt={post.title}
                               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                             />
                             <div className="absolute top-5 left-5 bg-background/90 backdrop-blur-md text-foreground text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-border shadow-sm">
                               {post.category}
                             </div>
                             <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          </div>
                          <div className="p-8 flex flex-col flex-1 bg-card">
                            <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-6">
                              <span>{post.date}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-border" />
                              <span>{post.readTime}</span>
                            </div>
                            <h3 className="font-display font-black text-xl uppercase tracking-tight text-foreground group-hover:text-accent transition-colors mb-4 line-clamp-2 leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-8 flex-1 font-medium">
                              {post.excerpt}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                               <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-foreground group-hover:text-accent transition-colors">
                                  Baca Detail <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                               </div>
                               <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:text-white" />
                               </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-card border border-border border-dashed rounded-[3rem] p-20 text-center flex flex-col items-center justify-center"
                >
                   <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground/30">
                      <Hash className="w-10 h-10" />
                   </div>
                   <h2 className="font-display font-black text-2xl uppercase mb-2 tracking-tight">Tidak Ada Hasil</h2>
                   <p className="text-muted-foreground text-sm max-w-xs mb-8">Maaf, kami tidak menemukan cerita yang sesuai dengan kata kuncimu.</p>
                   <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="text-xs font-black uppercase tracking-widest text-accent hover:underline">Lihat Semua Artikel</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
