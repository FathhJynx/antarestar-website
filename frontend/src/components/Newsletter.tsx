import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/AnimationPrimitives";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-24 md:py-32 section-padding bg-earth relative grain overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="section-container relative z-10">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="section-divider mx-auto mb-6" />
            <p className="text-accent font-body text-sm tracking-[0.25em] uppercase mb-4">Stay Connected</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-earth-foreground mb-5 text-balance">
              Join the Adventure
            </h2>
            <p className="font-body text-earth-foreground/60 mb-10 text-[15px] leading-relaxed max-w-md mx-auto">
              Get exclusive drops, adventure stories, and gear guides delivered to your inbox.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="flex-1 relative group">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-13 px-5 rounded-xl bg-earth-foreground/5 border border-earth-foreground/15 text-earth-foreground placeholder:text-earth-foreground/30 font-body text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                  />
                </div>
                <Button variant="hero" size="lg" type="submit" className="rounded-xl">
                  Subscribe <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 text-accent font-body"
              >
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-accent" />
                </div>
                <span className="text-earth-foreground font-medium">Welcome to the adventure!</span>
              </motion.div>
            )}

            <p className="font-body text-[11px] text-earth-foreground/30 mt-4">
              No spam, unsubscribe anytime. Join 10,000+ adventurers.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Newsletter;
