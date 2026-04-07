import React from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Zap, Shield, Sun, Eye } from "lucide-react";

interface FeatureBentoProps {
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

const iconMap: Record<string, any> = {
  Wind,
  Droplets,
  Zap,
  Shield,
  Sun,
  Eye,
};

const FeatureBento = ({ features }: FeatureBentoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((f, i) => {
        const Icon = iconMap[f.icon] || Shield;
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group relative bg-[#111111] border border-[#1F1F1F] p-10 rounded-none overflow-hidden hover:border-orange-500/20 transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-600/5"
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="space-y-6">
              <div className="w-14 h-14 bg-white/5 border border-white/5 rounded-none flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter leading-none">{f.title}</h3>
                <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-[280px]">
                  {f.description}
                </p>
              </div>
            </div>
            
            {/* Design Edge Detail */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.02] -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-orange-600/10 transition-colors duration-1000" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeatureBento;
