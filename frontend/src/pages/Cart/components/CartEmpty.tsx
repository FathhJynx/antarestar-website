import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CartEmpty = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
        <ShoppingBag className="w-10 h-10 text-white/20" />
      </div>
      <h2 className="font-display font-bold text-2xl md:text-3xl text-white uppercase tracking-tight mb-4 text-center px-4">
        Tas lo masih kosong nih 😄
      </h2>
      <p className="font-bold text-white/40 text-sm uppercase tracking-widest max-w-[280px] mb-10 italic text-center">
        Yuk isi dulu sebelum berangkat
      </p>
      <Button asChild className="bg-orange-600 hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest px-10 py-6 rounded-xl transition-all group h-auto active:scale-95 shadow-lg">
        <Link to="/store" className="flex items-center gap-3">
          Jelajah Gear <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </Button>
    </motion.div>
  );
};

export default CartEmpty;
