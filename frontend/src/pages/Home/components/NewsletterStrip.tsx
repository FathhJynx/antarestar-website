import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import FadeIn from "@/components/common/FadeIn";

const NewsletterStrip = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section className="py-16 md:py-20 bg-primary border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-accent mb-3">Stay Updated</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase mb-4 tracking-tight">
            Jangan Ketinggalan<br />Promo Eksklusif
          </h2>
          <p className="font-body text-sm text-white/50 mb-8">Subscribe dan dapatkan notifikasi flash sale, produk baru, dan kode diskon langsung ke email kamu.</p>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 h-12 text-accent font-display font-bold">
                <Check className="w-5 h-5" /> Terima kasih! Kamu sudah terdaftar.
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 1 }}
                onSubmit={e => { e.preventDefault(); if (email) setSent(true); }}
                className="flex gap-3 max-w-md mx-auto">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com" required
                  className="flex-1 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 font-body text-sm focus:outline-none focus:border-accent transition-colors" />
                <button type="submit"
                  className="h-12 px-6 bg-accent hover:bg-accent/90 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-colors shrink-0">
                  Subscribe
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeIn>
      </div>
    </section>
  );
};

export default NewsletterStrip;
