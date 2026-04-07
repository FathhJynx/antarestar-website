import React from "react";

const MemberAreaSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col lg:flex-row pt-20 overflow-hidden">
      
      {/* ── SIDEBAR SKELETON ── */}
      <aside className="w-full lg:w-80 lg:min-h-screen border-r border-white/5 bg-[#0B0B0B] p-8 space-y-12">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="w-16 h-16 bg-white/5" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/5" />
            <div className="h-2 w-12 bg-white/5" />
          </div>
        </div>

        <nav className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full bg-white/5 animate-pulse" />
          ))}
        </nav>

        <div className="pt-12">
          <div className="h-2 w-20 bg-white/5 mb-4" />
          <div className="h-12 w-full bg-white/5 animate-pulse" />
        </div>
      </aside>

      {/* ── CONTENT SKELETON ── */}
      <section className="flex-1 bg-[#0B0B0B]">
        
        {/* HERO SKELETON */}
        <div className="h-[400px] bg-black/50 border-b border-white/5 flex items-end p-12">
          <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4 animate-pulse w-full md:w-1/2">
              <div className="h-3 w-32 bg-white/5" />
              <div className="h-16 w-full bg-white/5 lg:h-24" />
            </div>
            <div className="h-40 w-full md:w-[320px] bg-white/5 animate-pulse" />
          </div>
        </div>

        <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12">
          {/* BENTO STATS SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-8 animate-pulse">
              <div className="h-8 w-40 bg-white/10" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 w-full bg-white/5" />
                ))}
              </div>
            </div>
            <div className="space-y-12 animate-pulse">
              <div className="h-64 w-full bg-white/10" />
              <div className="h-40 w-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default MemberAreaSkeleton;
