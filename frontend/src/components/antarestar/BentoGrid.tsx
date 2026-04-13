import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ease = [0.16, 1, 0.3, 1] as const;

const gridItems = [
  {
    id: 'hero',
    span: 'md:col-span-2 md:row-span-2',
    height: 'h-[420px] md:h-auto',
    img: 'https://images.unsplash.com/photo-1551632811-561f5505ee69?q=80&w=2670&auto=format&fit=crop',
    label: 'Inovasi',
    title: 'Tahan Cuaca\nEkstrem',
    desc: 'Didesain buat nerjang suhu beku sama angin kencang tanpa bikin gerak lo kaku.',
    accent: true,
  },
  {
    id: 'material',
    span: 'md:col-span-2',
    height: 'h-[280px] md:h-auto',
    img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2603&auto=format&fit=crop',
    label: 'Material',
    title: 'Ketahanan\nTanpa Tanding',
    desc: null,
    accent: false,
  },
  {
    id: 'waterproof',
    span: '',
    height: 'h-[280px] md:h-auto',
    img: null,
    label: null,
    title: '100%',
    desc: 'Anti Air',
    accent: true,
    isStat: true,
  },
  {
    id: 'lightweight',
    span: '',
    height: 'h-[280px] md:h-auto',
    img: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=2670&auto=format&fit=crop',
    label: null,
    title: 'Super\nEnteng',
    desc: null,
    accent: false,
    hasBar: true,
  },
];

const BentoGrid = () => (
  <section className="py-24 md:py-32 bg-black px-4 md:px-8 lg:px-12">
    <div className="max-w-7xl mx-auto">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mb-12 md:mb-16"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-[1px] bg-orange-500" />
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-orange-500 font-bold">DNA Produk</p>
        </div>
        <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight leading-none">
          Dibuat Beda
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 md:h-[680px]">
        {gridItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease }}
            className={`${item.span} ${item.height} relative rounded-2xl overflow-hidden group ${
              item.isStat ? 'bg-orange-600' : 'bg-zinc-900'
            } border border-white/[0.06]`}
          >
            {/* Image bg */}
            {item.img && (
              <img
                src={item.img}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06] opacity-40 mix-blend-luminosity"
              />
            )}

            {/* Gradient */}
            {item.img && (
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
            )}

            {/* Content */}
            <div className={`absolute inset-0 flex flex-col ${
              item.isStat ? 'items-center justify-center' : 'justify-end p-6 md:p-8'
            }`}>
              {item.isStat ? (
                <>
                  <h3 className="font-display font-black text-4xl md:text-6xl text-white mb-2 leading-none">{item.title}</h3>
                  <p className="font-display font-bold text-black/60 uppercase tracking-[0.2em] text-sm bg-white/20 px-5 py-1.5 rounded-full backdrop-blur-sm">{item.desc}</p>
                </>
              ) : (
                <>
                  {item.label && (
                    <p className="font-body text-orange-500 uppercase tracking-[0.3em] text-[9px] mb-3 font-bold">{item.label}</p>
                  )}
                  <h3 className={`font-display font-black text-white uppercase leading-[0.95] tracking-tight whitespace-pre-line ${
                    item.accent ? 'text-3xl md:text-[2.8rem]' : 'text-2xl md:text-3xl'
                  }`}>
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className="font-body text-white/50 text-sm mt-3 max-w-sm leading-relaxed">{item.desc}</p>
                  )}
                  {item.hasBar && (
                    <div className="mt-auto pt-6">
                      <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-orange-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: "88%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3, ease }}
                        />
                      </div>
                      <p className="font-body text-white/30 uppercase tracking-[0.3em] text-[8px] mt-2 font-medium">Indeks Performa</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Hover arrow */}
            {item.img && !item.isStat && (
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500">
                <svg className="w-4 h-4 text-black -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BentoGrid;
