import React from "react";
import { Reveal } from "@/components/AnimationPrimitives";
import aboutStory1 from "@/assets/hero-outdoor.jpg";

const TheManifesto = () => {
  return (
    <section className="py-24 md:py-48 bg-[#0B0B0B] relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          {/* Left Detail Image */}
          <div className="lg:col-span-5 space-y-12">
              <Reveal direction="left">
                  <div className="relative aspect-[4/5] overflow-hidden group">
                     <img 
                      src={aboutStory1} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                      alt="Outdoor Expedition" 
                     />
                     <div className="absolute inset-0 bg-orange-600/10 mix-blend-overlay" />
                     <div className="absolute top-8 left-8 bg-orange-600 text-white p-6 font-display font-black italic text-xl tracking-tighter">
                        "READY FOR <br /> ANYTHING"
                     </div>
                  </div>
              </Reveal>
          </div>

          {/* Right Narrative Text */}
          <div className="lg:col-span-7 space-y-16">
              <Reveal>
                  <h2 className="font-display font-black text-[clamp(2.5rem,9vw,6rem)] uppercase tracking-tighter italic leading-[0.85] mb-12 text-white">
                      DARI <span className="text-orange-600 text-transparent stroke-orange-600 stroke-1" style={{ WebkitTextStroke: '1px #ea580c' }}>FRUSTRASI</span> <br /> KE PUNCAK DUNIA.
                  </h2>
                  <div className="space-y-8 text-white/50 font-body text-lg md:text-xl leading-relaxed max-w-2xl">
                      <p className="first-letter:text-7xl first-letter:font-black first-letter:text-orange-600 first-letter:mr-4 first-letter:float-left drop-shadow-2xl">
                          Antarestar lahir di tahun 2019 bukan sebagai sekadar bisnis, tapi sebuah jawaban. Di kaki Gede Pangrango, kami merasa sulitnya mencari perlengkapan taktis yang tahan banting namun tetap memiliki estetika modern.
                      </p>
                      <div className="p-8 border-l-2 border-orange-600 bg-white/5 backdrop-blur-md text-white font-bold italic text-xl">
                          "Bukan cuma soal naik gunung, ini soal mentalitas penjelajah dalam menghadapi segala tantangan."
                      </div>
                  </div>
              </Reveal>
          </div>
      </div>
    </section>
  );
};

export default TheManifesto;
