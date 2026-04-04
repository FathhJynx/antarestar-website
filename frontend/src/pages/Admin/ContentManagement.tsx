import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { FileText, Image as ImageIcon, Layout, Settings, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentManagement = () => {
  const sections = [
    { title: 'Banner Utama', icon: Layout, desc: 'Perbarui gambar dan teks banner beranda.' },
    { title: 'Flash Sale', icon: Sparkles, desc: 'Kelola hitung mundur dan diskon aktif.' },
    { title: 'Blog & Berita', icon: FileText, desc: 'Terbitkan panduan petualangan dan berita baru.' },
    { title: 'Galeri Media', icon: ImageIcon, desc: 'Unggah dan organisir aset seluruh situs.' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="font-display font-black text-3xl uppercase tracking-tighter mb-2 italic">
            Pengaturan <span className="text-accent text-lg">Visual</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Kontrol narasi dan dampak visual dari etalase toko Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-accent group-hover:bg-accent/5 transition-all">
                     <section.icon className="w-8 h-8" />
                  </div>
                  <div>
                     <h3 className="font-display font-black text-xl uppercase tracking-tighter mb-1 group-hover:text-accent transition-colors">{section.title}</h3>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{section.desc}</p>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative min-h-[300px] flex items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
            <div className="relative z-10 max-w-lg">
               <Settings className="w-12 h-12 mx-auto mb-6 text-accent animate-spin-slow" />
               <h2 className="font-display font-black text-3xl uppercase tracking-tighter mb-4 italic">Kustomisasi Lanjutan <br/> Segera Hadir</h2>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">Kami sedang membangun mesin visual tingkat lanjut untuk memberi Anda kontrol penuh atas setiap komponen.</p>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContentManagement;
