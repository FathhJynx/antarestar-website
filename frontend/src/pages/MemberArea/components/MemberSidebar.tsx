import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Activity, Users, Star, Truck, Settings, LogOut, ChevronRight } from "lucide-react";

interface MemberSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: any;
  handleLogout: () => void;
}

const MemberSidebar = ({ activeTab, setActiveTab, profile, handleLogout }: MemberSidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "MARKAS GUE", icon: Activity },
    { id: "orders", label: "PESANAN GUE", icon: Truck },
    { id: "leaderboard", label: "PAPAN SKOR", icon: Trophy },
    { id: "referral", label: "MISI CUAN", icon: Users },
    { id: "settings", label: "UBAH PROFIL", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-80 lg:min-h-screen border-r border-white/5 bg-[#0B0B0B] relative z-20">
      <div className="lg:sticky lg:top-20 p-8 lg:p-12 space-y-12">
        
        {/* User Mini Profile */}
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-3xl bg-orange-600 flex items-center justify-center border-4 border-black shadow-2xl shadow-orange-600/20">
              <span className="font-display font-black text-2xl text-white uppercase">{profile.name?.[0]}</span>
           </div>
           <div>
              <h4 className="font-display font-black text-lg uppercase tracking-tight text-white">{profile.name}</h4>
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest italic">{profile.tier} LEVEL</p>
           </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 transition-all duration-500 group ${
                activeTab === item.id 
                  ? "bg-white text-black" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-orange-600" : "text-current"}`} />
                <span className="font-display font-black text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-500 ${activeTab === item.id ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
            </button>
          ))}
        </nav>

        {/* Points Quick Card */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-none space-y-4">
           <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-orange-600 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Poin</span>
           </div>
           <p className="font-display font-black text-4xl italic text-white">{profile.points.toLocaleString('id-ID')}</p>
           <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Kumpulin terus buat sikat gear gratis!</p>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all font-display font-black text-[11px] uppercase tracking-[0.2em]"
        >
          <LogOut className="w-4 h-4" />
          <span>KELUAR DARI MARKAS</span>
        </button>
      </div>
    </aside>
  );
};

export default MemberSidebar;
