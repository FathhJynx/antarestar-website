import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 md:py-28 section-padding bg-earth">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <p className="text-accent font-body text-sm tracking-[0.2em] uppercase mb-3">Stay Connected</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-earth-foreground mb-4">
            Join the Adventure
          </h2>
          <p className="font-body text-earth-foreground/70 mb-8">
            Get exclusive drops, adventure stories, and gear guides delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 px-4 rounded-lg bg-earth-foreground/10 border border-earth-foreground/20 text-earth-foreground placeholder:text-earth-foreground/40 font-body text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <Button variant="hero" size="lg">
              Subscribe <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
