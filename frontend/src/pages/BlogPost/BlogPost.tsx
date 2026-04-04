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

      {/* ── READING PROGRESS BAR ── */}
      <motion.div
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-16 md:top-20 left-0 right-0 h-1 bg-accent z-[101] origin-left shadow-[0_2px_10px_rgba(234,88,12,0.3)]"
        style={{ scaleX }}
      />

      <main className="pb-32">
        {/* ── IMMERSIVE HERO ── */}
        <div className="relative w-full min-h-[60svh] lg:min-h-[50svh] flex flex-col justify-end pt-24 md:pt-32 pb-12 md:pb-20 bg-black overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale-[20%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </motion.div>
          </div>

          <div className="relative z-10 section-container px-6 md:px-12 max-w-6xl mx-auto w-full">
             <Reveal>
               <Link to="/blog" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-accent transition-all mb-10 group">
                 <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-2 transition-transform" />
                 Kembali Ke Logbook
               </Link>
               
               <div className="flex flex-wrap items-center gap-4 mb-8">
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent bg-accent/20 border border-accent/30 px-4 py-2 rounded-full backdrop-blur-md">
                   {post.category}
                 </span>
                 <span className="text-[10px] font-black text-white/60 flex items-center gap-2 backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/5">
                   <Clock className="w-3.5 h-3.5" /> {post.readTime}
                 </span>
               </div>

               <h1 className="font-display font-black text-[clamp(2.5rem,8vw,5.5rem)] uppercase tracking-tighter leading-[0.85] text-white drop-shadow-2xl max-w-5xl mb-12">
                 {post.title}
               </h1>

               <div className="flex flex-wrap items-center gap-8 border-t border-white/10 pt-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center p-1 overflow-hidden">
                      <div className="w-full h-full rounded-full bg-accent/10 flex items-center justify-center text-accent"><User className="w-5 h-5" /></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Ditulis Oleh</p>
                      <p className="text-sm font-black text-white uppercase tracking-widest">{post.author}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block h-10 w-px bg-white/10" />
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Tanggal Rilis</p>
                     <p className="text-sm font-black text-white uppercase tracking-widest">{post.date}</p>
                  </div>
               </div>
             </Reveal>
          </div>
        </div>

        {/* ── ARTICLE LAYOUT ── */}
        <div className="section-container max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20 relative">
          
          <div className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
            <div className="flex flex-col gap-6 items-center">
               <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all group" title="Save to Bookmark">
                  <Bookmark className="w-5 h-5 group-hover:fill-current" />
               </button>
               <button className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all" title="Share Article">
                  <Share2 className="w-5 h-5" />
               </button>
            </div>
          </div>

          <article className="lg:col-span-8">
            <Reveal delay={0.2}>
              <div className="prose prose-lg prose-invert prose-orange max-w-none font-body leading-relaxed text-foreground/80">
                <p className="text-2xl font-medium text-foreground leading-tight mb-12 border-l-4 border-accent pl-8 italic py-2">
                  {post.excerpt}
                </p>
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>
            </Reveal>
          </article>

          <div className="lg:col-span-3 space-y-12">
             <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-xl">
                <h4 className="font-display font-black text-xl uppercase tracking-tighter mb-8 flex items-center gap-3">
                   <ShoppingBag className="w-5 h-5 text-accent" />
                   Rekomendasi Gear
                </h4>
                <div className="space-y-8">
                   <Link to="/store" className="group block">
                      <div className="flex gap-4 items-center">
                         <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-muted border border-border">
                            <img src={imgJacketGuide} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">New Release</p>
                            <h5 className="text-[11px] font-black uppercase leading-tight group-hover:text-accent transition-colors">Antarestar Valmora Jacket</h5>
                            <p className="text-[10px] font-bold text-muted-foreground mt-1">Rp 299.000</p>
                         </div>
                      </div>
                   </Link>
                </div>
                <Button asChild variant="outline" className="w-full mt-10 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2"><Link to="/store">Explore More <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
             </div>
          </div>
        </div>
      </main>

      {/* ── RELATED POSTS ── */}
      {relatedPosts.length > 0 && (
        <section className="py-24 bg-card/50 border-t border-border">
           <div className="section-container">
              <Reveal>
                <div className="flex items-center gap-4 mb-12">
                  <h2 className="font-display font-black text-2xl uppercase tracking-widest text-foreground">Cerita Terkait</h2>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                 {relatedPosts.map((rpost) => (
                    <Link key={rpost.id} to={`/blog/${rpost.id}`} className="group block">
                       <div className="space-y-6">
                          <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-border">
                             <img src={rpost.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                          <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase text-accent tracking-widest">{rpost.category}</p>
                             <h3 className="font-display font-black text-xl uppercase leading-tight group-hover:text-accent transition-colors">{rpost.title}</h3>
                          </div>
                       </div>
                    </Link>
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
