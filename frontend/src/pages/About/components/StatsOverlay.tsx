import React from "react";

const StatsOverlay = () => {
  const stats = [
    { val: "2019", label: "TAHUN BERDIRI" },
    { val: "100K+", label: "EKSPLORER" },
    { val: "50+", label: "EKSPEDISI" },
    { val: "128", label: "PRODUK INOVASI" }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-3xl border-y border-white/5 relative z-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center md:text-left">
            <h4 className="font-display font-black text-2xl text-orange-600 italic">{stat.val}</h4>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverlay;
