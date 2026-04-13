import React from "react";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersTabProps {
  orders: any[];
}

const OrdersTab = ({ orders }: OrdersTabProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <h3 className="font-display font-black text-4xl uppercase tracking-tighter italic border-b-2 border-white pb-4 text-white">RIWAYAT PESANAN</h3>
      <div className="space-y-4">
         {orders.length > 0 ? (
           orders.map((order: any) => (
             <div key={order.id} className="p-8 bg-white/5 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-orange-600 transition-colors">
                <div className="flex items-center gap-6 text-white">
                   <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {order.items?.[0]?.product_variant?.product?.primary_image?.url ? (
                        <img src={order.items[0].product_variant.product.primary_image.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      ) : (
                        <Truck className="w-8 h-8 text-white/20 group-hover:text-orange-600 transition-colors" />
                      )}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1 italic">#ORD-{order.id.toString().substring(0, 8).toUpperCase()}</p>
                      <h4 className="font-display font-black text-lg uppercase tracking-tight">STATUS: {order.status?.toUpperCase() || 'DIPROSES'}</h4>
                      <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">
                         {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} ITEMS
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="font-display font-black text-xl italic text-white/80">
                      Rp {(parseInt(order.total_price) || 0).toLocaleString('id-ID')}
                   </span>
                   <Button variant="outline" className="rounded-none border-white/20 h-12 px-8 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all text-white">
                      LIHAT DETAIL
                   </Button>
                </div>
             </div>
           ))
         ) : (
           <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 opacity-20 text-white">
              <Truck className="w-12 h-12 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Belum ada pesanan aktif.</p>
           </div>
         )}
      </div>
    </motion.div>
  );
};

export default OrdersTab;
