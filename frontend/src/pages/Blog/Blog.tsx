import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/AnimationPrimitives";
import FadeIn from "@/components/common/FadeIn";
import { Clock, User, ArrowRight, Search, Hash, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";

import blogHero from "@/assets/blog-hero-editorial.png";
import heroBg from "@/assets/lifestyle-hiker.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

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

/* ───────────────────────────────── BLOG PAGE ───────────────────────────────── */
const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    api.get("/articles").then((res) => {
      const data = res.data?.data?.data || [];
      if (data.length > 0) {
        setBlogPosts(
          data.map((a: any, i: number) => ({
            id: a.slug,
            fullId: a.id,
            title: a.title,
            excerpt: a.content.substring(0, 150) + "...",
            category: a.category || "Artikel",
            author: "Admin",
            date: new Date(a.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            readTime: Math.ceil(a.content.length / 500) + " min",
            image: a.image_url,
            featured: i === 0,
          }))
        );
      }
    }).catch(console.warn);
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(blogPosts.map((p) => p.category)));
    return ["All", ...cats];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, blogPosts]);

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0] || FALLBACK_POST;
  const displayPosts = filteredPosts.filter(
    (post) => post.id !== (activeCategory === "All" && !searchQuery ? featuredPost.id : "")
  );

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-body">
      <Navbar />

      {/* ═══════════════════ HERO — EDITORIAL IMMERSIVE ═══════════════════ */}
      <section className="relative w-full h-[70vh] sm:h-[75vh] md:h-[85vh] overflow-hidden bg-black">
        {/* Background Image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.55 }}
          transition={{ duration: 2.5, ease }}
          className="absolute inset-0"
        >
          <img src={blogHero} alt="" className="w-full h-full object-cover" />
        </motion.div>

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Content — bottom aligned like Nike campaign pages */}
        <div className="relative z-10 h-full flex flex-col justify-end section-container section-padding pb-16 sm:pb-20 md:pb-28">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="w-10 h-px bg-accent" />
            <span className="font-display font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-accent">
              Jurnal Petualang
            </span>
          </motion.div>

          {/* Headline — Awwwards style massive typog */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9, ease }}
            className="font-display font-black text-[clamp(2.5rem,10vw,7rem)] uppercase tracking-tighter leading-[0.85] text-white mb-6"
          >
            The Explorer<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
              Logbook
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7, ease }}
            className="font-body text-white/50 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed"
          >
            Panduan gear, tips bertahan di alam liar, dan destinasi tersembunyi untuk misi selanjutnya.
          </motion.p>
        </div>

        {/* Bottom scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
          />
        </div>
      </section>

      {/* ═══════════════════ MARQUEE TYPOGRAPHY ═══════════════════ */}
      <section className="relative overflow-hidden py-5 md:py-6 border-b border-border bg-background">
        <div className="flex whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" } }}
            className="flex shrink-0"
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {["STORIES", "◆", "GUIDES", "◆", "EXPEDITION", "◆", "JOURNAL", "◆", "OUTDOOR", "◆", "LOGBOOK", "◆"].map(
                  (word, i) => (
                    <span
                      key={`${copy}-${i}`}
                      className={`font-display font-black uppercase mx-4 md:mx-6 select-none ${
                        word === "◆"
                          ? "text-accent/40 text-xs"
                          : "text-foreground/[0.04] text-5xl sm:text-6xl md:text-7xl tracking-tighter"
                      }`}
                    >
                      {word}
                    </span>
                  )
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ FILTER & SEARCH ═══════════════════ */}
      <div className="sticky top-[88px] z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="section-container section-padding py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Pills — BROTALIST SHARP */}
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 border border-transparent ${
                  activeCategory === cat
                    ? "bg-accent text-white"
                    : "text-muted-foreground hover:text-white border-border/0 hover:border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search — SHARP */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="SEARCH ARTICLES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-border rounded-none pl-11 pr-5 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-accent transition-all placeholder:text-white/20"
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════ FEATURED STORY — BRUTALIST EDITORIAL ═══════════════════ */}
      {activeCategory === "All" && !searchQuery && (
        <section className="section-container pt-16 md:pt-24 pb-12">
          <FadeIn>
            <Link to={`/blog/${featuredPost.id}`} className="block group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-y border-border group-hover:border-accent transition-colors duration-500">
                {/* Image — Left */}
                <div className="aspect-[16/10] lg:aspect-auto lg:min-h-[550px] overflow-hidden relative">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-transform duration-[2s] ease-out"
                  />
                  <div className="absolute top-0 left-0 bg-accent text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3">
                    {featuredPost.category}
                  </div>
                </div>

                {/* Content — Right */}
                <div className="p-8 sm:p-10 md:p-12 lg:p-16 flex flex-col justify-center bg-black border-l border-border group-hover:border-accent/30 transition-colors duration-500">
                  <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-8">
                    <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{featuredPost.date}</span>
                    <span className="w-1.5 h-1.5 bg-accent" />
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <p className="font-display font-black text-[11px] uppercase tracking-[0.4em] text-accent mb-4">
                    MUST READ
                  </p>

                  <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.85] text-white group-hover:text-accent transition-colors duration-500 mb-8">
                    {featuredPost.title}
                  </h2>

                  <p className="font-body text-white/50 text-base md:text-lg leading-relaxed mb-10 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 font-display font-black text-[11px] uppercase tracking-[0.2em] text-white group-hover:gap-6 transition-all">
                    BACA SELENGKAPNYA <ArrowRight className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        </section>
      )}

      {/* ═══════════════════ ARTICLES GRID — SHARP CARD SYSTEM ═══════════════════ */}
      <section className="section-container py-12 md:py-24">
        {/* Section Header */}
        <FadeIn className="mb-12 md:mb-20">
          <div className="flex items-end justify-between border-b border-border pb-6">
            <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tighter text-white">
              {activeCategory === "All" ? "LATEST STORIES" : activeCategory.toUpperCase()}
            </h2>
            <span className="font-display font-black text-[11px] text-muted-foreground uppercase tracking-widest">
              {displayPosts.length} POSTS
            </span>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {displayPosts.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-border"
            >
              {displayPosts.map((post, i) => (
                <article key={post.id} className="border-r border-b border-border group hover:bg-white/5 transition-colors duration-500">
                  <Link to={`/blog/${post.id}`} className="block h-full">
                    <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-3 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 bg-accent" />
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-white group-hover:text-accent transition-colors duration-300 mb-4 line-clamp-2 leading-[0.95]">
                        {post.title}
                      </h3>

                      <p className="text-white/40 text-sm leading-relaxed line-clamp-2 mb-8 flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="font-display font-black text-[10px] uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                          VIEW STORY
                        </span>
                        <ArrowUpRight className="w-5 h-5 text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-black border border-border p-20 text-center flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 bg-accent/10 flex items-center justify-center mb-6 border border-accent/20">
                <Hash className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-display font-black text-3xl uppercase mb-2 tracking-tighter">EMPTY LOG</h2>
              <p className="text-muted-foreground text-base max-w-xs mb-8">
                No signal found for your search query.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="font-display font-black text-[12px] uppercase tracking-widest text-accent hover:text-white transition-colors"
              >
                — BACK TO ALL
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ═══════════════════ NEWSLETTER CTA — SHARP BRUTALIST ═══════════════════ */}
      <section className="border-t-2 border-accent bg-black">
        <div className="section-container py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-display font-black text-[12px] uppercase tracking-[0.5em] text-accent mb-6">
                JOIN THE LOGBOOK
              </p>
              <h2 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.85] text-white">
                NEW STORIES <br />
                <span className="text-white/30 truncate">DIRECTLY.</span>
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="font-body text-white/50 text-lg leading-relaxed max-w-sm">
                Get first-hand guides, gear reviews, and exclusive expeditions directly in your inbox.
              </p>
              <div className="flex flex-col gap-0 border-l border-white/20 pl-6">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  className="w-full bg-transparent border-b border-white/20 py-4 text-xl font-display font-black uppercase tracking-tighter outline-none focus:border-accent transition-colors"
                />
                <button className="w-fit mt-6 py-4 px-10 bg-accent text-white font-display font-black text-[12px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                  SUBSCRIBE NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
