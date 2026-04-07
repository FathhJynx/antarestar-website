import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/AnimationPrimitives";
import { 
  ChevronLeft, Clock, User, Share2, 
  Facebook, Twitter, Link2, 
  ArrowRight, ShoppingBag, Bookmark, MessageCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavbarScroll } from "@/hooks/useScrollAnimations";
import api from "@/lib/api";

import imgJacketGuide from "@/assets/community-2.jpg";
import imgShoesReview from "@/assets/community-4.jpg";

const ease = [0.16, 1, 0.3, 1] as const;

const FALLBACK_POST = {
  id: "",
  title: "Memuat Cerita...",
  content: "Tunggu sebentar...",
  excerpt: "...",
  category: "Adventure",
  author: "Admin",
  date: "Hari ini",
  readTime: "0 min read",
  image: imgJacketGuide,
};

const BlogPost = () => {
  const { id } = useParams(); // id is actually the slug
  const [post, setPost] = useState<any>(FALLBACK_POST);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    
    api.get(`/articles/slug/${id}`).then(res => {
      const a = res.data?.data;
      if (a) {
        setPost({
          id: a.slug,
          fullId: a.id,
          title: a.title,
          content: a.content,
          excerpt: a.content.substring(0, 150) + "...",
          category: "Adventure",
          author: "Admin",
          date: new Date(a.created_at).toLocaleDateString(),
          readTime: Math.ceil(a.content.length / 500) + " min read",
          image: a.image_url || imgJacketGuide,
        });
      }
    }).catch(console.warn).finally(() => setIsLoading(false));

    // Fetch related
    api.get('/articles').then(res => {
      const data = res.data?.data?.data || [];
      setRelatedPosts(data.filter((a: any) => a.slug !== id).slice(0, 3).map((a: any, i: number) => ({
          id: a.slug,
          title: a.title,
          category: ["Tips & Trik", "Destinasi", "Review"][i % 3], 
          image: a.image_url || imgJacketGuide,
      })));
    }).catch(console.warn);
  }, [id]);

  const { scrolled, hidden } = useNavbarScroll();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-body">
      <Navbar />

      {/* ── READING PROGRESS BAR — SHARP ── */}
      <motion.div
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.4, ease }}
        className="fixed top-16 md:top-20 left-0 right-0 h-1.5 bg-accent z-[101] origin-left"
        style={{ scaleX }}
      />

      <main className="pb-32">
        {/* ── IMMERSIVE HERO — SHARP EDITORIAL ── */}
        <div className="relative w-full min-h-[70svh] flex flex-col justify-end pt-24 pb-16 md:pb-24 bg-black overflow-hidden border-b border-border">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.45 }}
              transition={{ duration: 2.5, ease }}
              className="w-full h-full"
            >
              <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </motion.div>
          </div>

          <div className="relative z-10 section-container max-w-7xl">
             <Reveal>
               <Link to="/blog" className="inline-flex items-center text-[11px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-accent transition-colors mb-12 group">
                 <ArrowRight className="w-5 h-5 mr-3 rotate-180 group-hover:-translate-x-3 transition-transform" />
                 BACK TO LOGBOOK
               </Link>
               
               <div className="flex flex-wrap items-center gap-6 mb-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white bg-accent px-6 py-2">
                   {post.category.toUpperCase()}
                 </span>
                 <span className="text-[10px] font-black text-white/50 flex items-center gap-3 bg-white/5 px-6 py-2 border border-white/10 uppercase tracking-widest">
                   <Clock className="w-4 h-4 text-accent" /> {post.readTime}
                 </span>
               </div>

               <h1 className="font-display font-black text-[clamp(2.5rem,10vw,7rem)] uppercase tracking-tighter leading-[0.82] text-white mb-16 max-w-6xl">
                 {post.title}
               </h1>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12 items-end">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-accent/20 border border-accent/40 flex items-center justify-center grayscale overflow-hidden">
                       <User className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">AUTHOR</p>
                      <p className="text-sm font-black text-white uppercase tracking-widest">{post.author}</p>
                    </div>
                  </div>
                  
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">PUBLISHED</p>
                     <p className="text-sm font-black text-white uppercase tracking-widest">{post.date}</p>
                  </div>

                  <div className="flex justify-start md:justify-end gap-4">
                     <button className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                        <Share2 className="w-5 h-5 text-white" />
                     </button>
                     <button className="w-12 h-12 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-colors">
                        <Bookmark className="w-5 h-5 text-white" />
                     </button>
                  </div>
               </div>
             </Reveal>
          </div>
        </div>

        {/* ── ARTICLE CONTENT — BRUTALIST GRID ── */}
        <div className="section-container max-w-7xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-0 border-x border-border min-h-screen">
          
          {/* Main Article */}
          <article className="lg:col-span-8 p-8 md:p-12 lg:p-16 border-r border-border">
            <Reveal delay={0.2}>
              <div className="prose prose-xl prose-invert prose-orange max-w-none font-body leading-relaxed text-white/70">
                <p className="text-2xl sm:text-3xl font-display font-black text-white leading-tight mb-16 border-l-8 border-accent pl-10 uppercase tracking-tighter">
                  {post.excerpt}
                </p>
                <div className="whitespace-pre-wrap selection:bg-accent selection:text-white article-content">
                  {post.content}
                </div>
              </div>

              {/* Share Bottom */}
              <div className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-8">
                <p className="font-display font-black text-[11px] uppercase tracking-[0.4em] text-white/40">SHARE THIS STORY</p>
                <div className="flex gap-4">
                   {['FACEBOOK', 'TWITTER', 'LINKEDIN'].map(social => (
                     <button key={social} className="px-6 py-3 border border-border text-[10px] font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors">
                       {social}
                     </button>
                   ))}
                </div>
              </div>
            </Reveal>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 p-8 md:p-12 lg:p-16 bg-white/[0.02]">
             <div className="sticky top-40 space-y-20">
                {/* Related Gear */}
                <div className="space-y-10">
                   <h4 className="font-display font-black text-xl uppercase tracking-tighter border-b-2 border-accent pb-4 flex items-center gap-4">
                      <ShoppingBag className="w-6 h-6 text-accent" />
                      GEAR SELECTION
                   </h4>
                   <div className="space-y-1">
                      <Link to="/store" className="group block border border-border p-5 hover:border-accent transition-colors bg-black">
                         <div className="flex gap-6 items-center">
                            <div className="w-24 h-24 overflow-hidden flex-shrink-0 bg-muted grayscale group-hover:grayscale-0 transition-all">
                               <img src={imgJacketGuide} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">RECOMMENDED</p>
                               <h5 className="text-xs font-black uppercase leading-tight text-white group-hover:text-accent transition-colors mb-2">Antarestar Valmora Jacket</h5>
                               <p className="text-[11px] font-black text-white/50 tracking-widest">Rp 299.000</p>
                            </div>
                         </div>
                      </Link>
                   </div>
                   <Button asChild variant="outline" className="w-full h-16 rounded-none font-display font-black uppercase text-[11px] tracking-widest border-2 border-white/10 hover:border-accent hover:bg-accent transition-all group">
                     <Link to="/store" className="flex items-center justify-center gap-3">
                       VISIT STORE <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                     </Link>
                   </Button>
                </div>

                {/* Tags / Categories */}
                <div className="space-y-6">
                   <h4 className="font-display font-black text-xs uppercase tracking-[0.3em] text-white/30">EXPLORE MORE</h4>
                   <div className="flex flex-wrap gap-2">
                      {['ADVENTURE', 'GUIDES', 'EQUIPMENT', 'MISSION'].map(tag => (
                        <Link key={tag} to="/blog" className="px-5 py-2 border border-border text-[10px] font-black uppercase tracking-widest hover:border-accent hover:text-accent transition-colors">
                          #{tag}
                        </Link>
                      ))}
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </main>

      {/* ── RELATED POSTS — SHARP GRID ── */}
      {relatedPosts.length > 0 && (
        <section className="bg-black border-t-2 border-border">
           <div className="section-container pt-24 pb-32">
              <Reveal>
                <div className="flex items-center justify-between border-b border-border pb-10 mb-16">
                  <h2 className="font-display font-black text-3xl uppercase tracking-tighter text-white leading-none">CONTINUE READING</h2>
                  <Link to="/blog" className="font-display font-black text-[11px] uppercase tracking-widest text-accent hover:text-white transition-colors">— VIEW ALL</Link>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-border">
                 {relatedPosts.map((rpost) => (
                    <article key={rpost.id} className="border-r border-b border-border group hover:bg-white/5 transition-colors duration-500">
                      <Link to={`/blog/${rpost.id}`} className="block">
                         <div className="aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={rpost.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                         </div>
                         <div className="p-8">
                            <p className="text-[10px] font-black uppercase text-accent tracking-[0.3em] mb-4">{rpost.category}</p>
                            <h3 className="font-display font-black text-2xl uppercase tracking-tighter leading-[0.95] text-white group-hover:text-accent transition-colors duration-300">{rpost.title}</h3>
                         </div>
                      </Link>
                    </article>
                 ))}
              </div>
           </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
