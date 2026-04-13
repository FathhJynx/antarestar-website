import React from "react";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/AnimationPrimitives";
import { Mountain, Shield, Users, Globe } from "lucide-react";

const values = [
  {
      icon: <Mountain className="w-8 h-8" />,
      title: "EKsPLORASI TANPA BATAS",
      desc: "Kami diciptakan untuk mereka yang menolak diam. Menjelajah batas alam dan diri sendiri.",
      accent: "bg-orange-600"
  },
  {
      icon: <Shield className="w-8 h-8" />,
      title: "KUALITAS TAKTIKAL",
      desc: "Setiap jahitan diuji di medan tropis ekstrem untuk menjamin ketahanan seumur hidup.",
      accent: "bg-white"
  },
  {
      icon: <Users className="w-8 h-8" />,
      title: "KOMUNITAS TANGGUH",
      desc: "Bukan sekadar brand, kami adalah wadah bagi ribuan petualang untuk saling menginspirasi.",
      accent: "bg-orange-600"
  },
  {
      icon: <Globe className="w-8 h-8" />,
      title: "PENJAGA BUMI",
      desc: "Berkomitmen pada praktik berkelanjutan untuk menjaga taman bermain kita tetap hijau.",
      accent: "bg-white"
  },
];

const ValuesGrid = () => {
  return (
    <section className="py-20 md:py-48 bg-white text-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal className="mb-12 md:mb-24">
              <h2 className="font-display font-black text-[clamp(2.5rem,10vw,7.5rem)] uppercase tracking-tighter italic leading-none">
                  FUNDAMENTAL <br /> <span className="text-orange-600">EXPLORERS.</span>
              </h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-black/5 p-0.5 md:p-1 border border-black/10">
              {values.map((v, i) => (
                  <StaggerItem key={i} className="bg-white p-8 md:p-12 space-y-6 md:space-y-8 group hover:bg-orange-600 transition-all duration-500 cursor-default border border-black/5">
                      <div className="flex justify-between items-start">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-black text-white flex items-center justify-center p-3 md:p-4 group-hover:bg-white group-hover:text-orange-600 transition-all">
                              {v.icon}
                          </div>
                          <span className="font-display font-black text-4xl md:text-6xl italic text-black/5 group-hover:text-white/20 transition-all">0{i+1}</span>
                      </div>
                      <div className="space-y-4">
                          <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight group-hover:text-white transition-all">{v.title}</h3>
                          <p className="text-base md:text-lg font-bold text-black/50 leading-relaxed group-hover:text-white transition-all italic">
                              {v.desc}
                          </p>
                      </div>
                  </StaggerItem>
              ))}
          </StaggerContainer>
      </div>
    </section>
  );
};

export default ValuesGrid;
