import { LayoutDashboard, ShoppingBag, DollarSign, History, Landmark, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/affiliate/dashboard" },
  { icon: ShoppingBag, label: "Produk", to: "/affiliate/dashboard/products" },
  { icon: DollarSign, label: "Komisi", to: "/affiliate/dashboard/commissions" },
  { icon: History, label: "Riwayat", to: "/affiliate/dashboard/history" },
  { icon: Landmark, label: "Withdraw", to: "/affiliate/dashboard/withdraw" },
  { icon: Settings, label: "Setting", to: "/affiliate/dashboard/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-[88px] bottom-0 w-64 bg-black border-r border-white/5 hidden lg:flex flex-col z-50">
      <div className="flex-1 py-8 flex flex-col gap-2 px-4">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link 
              key={item.to}
              to={item.to}
              className={`relative group h-12 flex items-center gap-4 px-4 transition-all ${
                isActive ? "text-orange-600 bg-white/5" : "text-white/40 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-full bg-orange-600"
                />
              )}
              <item.icon className={`w-5 h-5 ${isActive ? "text-orange-600" : "group-hover:text-white"}`} />
              <span className="font-display font-black text-[10px] uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Mini Profile */}
      <div className="p-6 border-t border-white/5 space-y-4">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-none flex items-center justify-center font-display font-black text-xs text-white">F</div>
            <div>
               <p className="text-[10px] font-black uppercase text-white leading-none">FATHAN AGENT</p>
               <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Active Agent</p>
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
