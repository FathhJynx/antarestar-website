import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { FileText, Image as ImageIcon, Layout, Settings, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentManagement = () => {
  const sections = [
    { title: 'HERO BANNER', icon: Layout, desc: 'Update homepage banner images and headlines.', status: 'ACTIVE', color: 'text-green-400', border: 'border-green-400/20', bg: 'bg-green-400/10' },
    { title: 'FLASH SALE', icon: Sparkles, desc: 'Manage countdown timers and active discounts.', status: 'LIVE', color: 'text-accent', border: 'border-accent/20', bg: 'bg-accent/10' },
    { title: 'BLOG & NEWS', icon: FileText, desc: 'Publish adventure guides and announcements.', status: 'ACTIVE', color: 'text-blue-400', border: 'border-blue-400/20', bg: 'bg-blue-400/10' },
    { title: 'MEDIA VAULT', icon: ImageIcon, desc: 'Upload and organize site-wide visual assets.', status: 'READY', color: 'text-purple-400', border: 'border-purple-400/20', bg: 'bg-purple-400/10' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="pb-10 border-b border-white/5">
          <h1 className="font-display font-black text-4xl uppercase tracking-tighter mb-3 italic">
            CONTENT <span className="text-accent underline decoration-4 underline-offset-8">CONTROL</span>
          </h1>
          <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Visual narrative and storefront impact management hub</p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 hover:border-accent/20 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-[1.5rem] flex items-center justify-center text-white/20 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                  <section.icon className="w-8 h-8" />
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] ${section.bg} ${section.color} ${section.border}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />{section.status}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="font-display font-black text-xl uppercase tracking-tighter mb-2 text-white group-hover:text-accent transition-colors italic">{section.title}</h3>
                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed mb-6">{section.desc}</p>
                <div className="flex items-center gap-2 text-white/20 group-hover:text-accent transition-colors text-[10px] font-black uppercase tracking-[0.2em]">
                  MANAGE <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Block */}
        <div className="bg-[#111] border border-white/10 rounded-[3rem] p-16 overflow-hidden relative min-h-[320px] flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
          <div className="relative z-10 max-w-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
              className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8"
            >
              <Settings className="w-8 h-8 text-accent" />
            </motion.div>
            <h2 className="font-display font-black text-4xl uppercase tracking-tighter mb-4 italic text-white">
              ADVANCED <span className="text-accent underline decoration-4">CONTROLS</span><br />INCOMING
            </h2>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] leading-[2]">
              We are building next-gen visual control systems<br />to give you full command over every component.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
