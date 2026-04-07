import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, 
  Package, Truck, CheckCircle2, 
  Clock, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { rp } from "@/utils/formatters";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Reveal, StaggerContainer } from "@/components/AnimationPrimitives";

// Orders Components
import OrderCard from "./components/OrderCard";
import CancelModal from "./components/CancelModal";
import RatingModal from "./components/RatingModal";

// Order status configuration
const ORDER_STATUSES = [
  { id: 'all', label: 'SEMUA' },
  { id: 'pending', label: 'PENDING' },
  { id: 'unpaid', label: 'BELUM BAYAR' },
  { id: 'processing', label: 'DIPROSES' },
  { id: 'shipped', label: 'DIKIRIM' },
  { id: 'completed', label: 'SELESAI' },
  { id: 'cancelled', label: 'BATAL' },
];

const statusConfig: any = {
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", label: "PENDING" },
  unpaid: { icon: Clock, color: "text-orange-600", bg: "bg-orange-600/10", label: "BELUM BAYAR" },
  verified: { icon: CheckCircle2, color: "text-cyan-500", bg: "bg-cyan-500/10", label: "TERVERIFIKASI" },
  processing: { icon: Package, color: "text-blue-600", bg: "bg-blue-600/10", label: "DIPROSES" },
  packed: { icon: Package, color: "text-indigo-500", bg: "bg-indigo-500/10", label: "DIKEMAS" },
  shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-600/10", label: "DIKIRIM" },
  shipping: { icon: Truck, color: "text-purple-600", bg: "bg-purple-600/10", label: "DIKIRIM" },
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-600/10", label: "SELESAI" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-600/10", label: "BATAL" },
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { isLoading, data: apiOrders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data?.data?.data || res.data?.data || [];
    },
    refetchInterval: 30000,
  });

  const orders = React.useMemo(() => {
    if (!apiOrders || !Array.isArray(apiOrders)) return [];
    
    return apiOrders.map((o: any) => ({
      id: o.order_number || ("ANT-" + String(o.id).slice(0, 8).toUpperCase()),
      rawId: o.id,
      date: new Date(o.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
      status: o.status,
      total: parseFloat(o.total_price || 0),
      isRated: (o.reviews && o.reviews.length > 0),
      cancelReason: "",
      items: o.items?.map((i: any) => ({
         id: i.id,
         productId: i.product_variant?.product_id || i.product_variant?.product?.id,
         name: i.product_variant?.product?.name || "ANTARESTAR GEAR",
         image: i.product_variant?.product?.primary_image?.image_url || i.product_variant?.product?.images?.[0]?.image_url || "https://via.placeholder.com/300",
         price: parseFloat(i.price || 0),
         qty: i.quantity,
         variant: i.product_variant?.name ? i.product_variant.name : (i.product_variant?.color_name ? `${i.product_variant.color_name}${i.product_variant.size ? ' / ' + i.product_variant.size : ''}` : "-")
      })) || []
    }));
  }, [apiOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancel = async (reason: string) => {
    if (!orderToCancel) return;
    const order = orders.find(o => o.id === orderToCancel);
    if (!order) return;
    
    try {
      await api.put(`/orders/${order.rawId}/status`, { status: 'cancelled', cancel_reason: reason });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowCancelModal(false);
      setOrderToCancel(null);
      toast.error("MISSION ABORTED", {
        description: `Reason: ${reason}`,
        duration: 4000
      });
    } catch (err) {
      toast.error("FAILED TO ABORT MISSION.");
    }
  };

  const handleConfirmReceipt = async (orderId: string, rawId: string) => {
    try {
      await api.put(`/orders/${rawId}/status`, { status: 'completed' });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("MISSION ARCHIVED.", {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        duration: 5000
      });
    } catch (err) {
      toast.error("FAILED TO CONFIRM MISSION.");
    }
  };

  const handleRateOrder = async (orderId: string, rating: number, comment: string) => {
    const order = orders.find(o => o.rawId === orderId);
    if (!order || !order.items.length) return;

    try {
      const productId = order.items[0].productId;
      await api.post('/product-reviews', { order_id: orderId, product_id: productId, rating, comment });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowRatingModal(false);
      toast.success("FEEDBACK SECURED.");
    } catch (err: any) {
      toast.error("FAILED TO SUBMIT FEEDBACK.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col selection:bg-orange-600 font-body">
      <Navbar />

      <main className="flex-1 pt-28 md:pt-40 pb-24 px-4 sm:px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-12 md:mb-20 border-b border-white/10 pb-10 md:pb-12 text-white">
                <div className="space-y-3">
                    <p className="font-bold text-[10px] uppercase tracking-[0.4em] text-orange-600 leading-none">Protokol Pesanan</p>
                    <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tighter text-white leading-tight mb-2">
                        DAFTAR <span className="text-white/10">PESANAN.</span>
                    </h1>
                </div>
                <div className="relative w-full md:w-96 group">
                   <div className="absolute inset-0 bg-white/5 skew-x-[-4deg] group-focus-within:bg-orange-600/10 transition-colors" />
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-600 transition-colors z-10" />
                   <input 
                     type="text" placeholder="CARI PESANAN (ID/GEAR)" value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="relative w-full bg-transparent p-5 pl-14 font-bold uppercase text-xs tracking-widest focus:outline-none transition-all placeholder:text-white/10 z-10"
                   />
                </div>
            </div>
          </Reveal>

          {/* Categories Tab - High End Minimal */}
          <div className="flex overflow-x-auto no-scrollbar gap-10 md:gap-12 mb-12 md:mb-16 border-b border-white/5 pb-2 sticky top-[72px] md:relative bg-[#0B0B0B] z-30">
            {ORDER_STATUSES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex-shrink-0 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all relative py-3 ${
                  activeTab === category.id ? "text-orange-600" : "text-white/20 hover:text-white"
                }`}
              >
                {category.label}
                {activeTab === category.id && (
                    <motion.div layoutId="activeTabOrdersAlt" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="py-32 text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent animate-spin mx-auto" />
                  <p className="font-display font-black uppercase tracking-[0.4em] italic text-white/20">ACCESSING DATABASE...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <StaggerContainer key={activeTab}>
                  {filteredOrders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      statusConfig={statusConfig}
                      handleConfirmReceipt={(id, rawId) => { handleConfirmReceipt(id, rawId); }}
                      handleCancelOrder={handleCancelOrder}
                      onShowRating={(o) => { setSelectedOrder(o); setShowRatingModal(true); }}
                    />
                  ))}
                </StaggerContainer>
              ) : (
                <Reveal direction="scale" className="py-24 text-center space-y-8">
                   <ShoppingBag className="w-24 h-24 text-white/5 mx-auto" />
                   <h2 className="font-display font-bold text-3xl md:text-5xl uppercase tracking-tight text-white leading-none">PESANAN <br /> <span className="text-orange-600">MASIH KOSONG.</span></h2>
                   <Button asChild className="bg-orange-600 hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest px-12 py-6 rounded-none transition-all h-auto text-xs">
                        <Link to="/store">MULAI BELANJA GEAR</Link>
                   </Button>
                </Reveal>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <CancelModal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
      />
      
      <RatingModal 
        isOpen={showRatingModal} 
        onClose={() => setShowRatingModal(false)} 
        order={selectedOrder} 
        onRate={(orderId, rating, comment) => handleRateOrder(orderId, rating, comment)} 
      />

      <Footer />
    </div>
  );
};

export default Orders;
