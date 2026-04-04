import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, ChevronRight, 
  Package, Truck, CheckCircle2, 
  Clock, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { rp } from "@/utils/formatters";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Orders Components
import OrderCard from "./components/OrderCard";
import CancelModal from "./components/CancelModal";
import RatingModal from "./components/RatingModal";

// Order status configuration
const ORDER_STATUSES = [
  { id: 'all', label: 'Semua' },
  { id: 'unpaid', label: 'Belum Bayar' },
  { id: 'processing', label: 'Dikemas' },
  { id: 'shipping', label: 'Dikirim' },
  { id: 'completed', label: 'Selesai' },
  { id: 'cancelled', label: 'Dibatalkan' },
];



const statusConfig: any = {
  unpaid: { icon: Clock, color: "text-orange-500", bg: "bg-orange-50", label: "Belum Bayar" },
  processing: { icon: Package, color: "text-blue-500", bg: "bg-blue-50", label: "Sedang Dikemas" },
  shipping: { icon: Truck, color: "text-purple-500", bg: "bg-purple-50", label: "Dalam Pengiriman" },
  completed: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Selesai" },
  cancelled: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Dibatalkan" },
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const { isLoading, data: apiOrders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data?.data?.data || res.data?.data || [];
    },
    refetchInterval: 10000, // Background poll every 10 seconds for real-time order status updates
  });

  useEffect(() => {
    if (apiOrders && Array.isArray(apiOrders)) {
      setOrders(apiOrders.map((o: any) => ({
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
           name: i.product_variant?.product?.name || "Produk Antarestar",
           image: i.product_variant?.product?.primary_image?.image_url || i.product_variant?.product?.images?.[0]?.image_url || "https://via.placeholder.com/300",
           price: parseFloat(i.price || 0),
           qty: i.quantity,
           variant: i.product_variant?.name ? i.product_variant.name : (i.product_variant?.color_name ? `${i.product_variant.color_name}${i.product_variant.size ? ' / ' + i.product_variant.size : ''}` : "-")
        })) || []
      })));
    }
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
      setOrders(prev => prev.map(o => o.id === orderToCancel ? { ...o, status: 'cancelled', cancelReason: reason } : o));
      setShowCancelModal(false);
      setOrderToCancel(null);
      toast.error("Pesanan Dibatalkan", {
        description: `Alasan: ${reason}`,
        duration: 4000
      });
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Gagal membatalkan pesanan. Silakan coba lagi.");
    }
  };

  const handleConfirmReceipt = async (orderId: string, rawId: string) => {
    try {
      await api.put(`/orders/${rawId}/status`, { status: 'completed' });
      setOrders(prev => prev.map(o => o.rawId === rawId ? { ...o, status: 'completed' } : o));
      toast.success("Pesanan selesai! Terima kasih telah berbelanja at Antarestar.", {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        duration: 5000
      });
    } catch (err) {
      console.error("Confirm receipt error:", err);
      toast.error("Gagal mengonfirmasi pesanan. Silakan coba lagi.");
    }
  };

  const handleRateOrder = async (orderId: string, rating: number, comment: string) => {
    const order = orders.find(o => o.rawId === orderId);
    if (!order || !order.items.length) return;

    try {
      // Use the first product as the main review target for now
      const productId = order.items[0].productId;
      
      await api.post('/product-reviews', {
        order_id: orderId,
        product_id: productId,
        rating,
        comment
      });

      setOrders(prev => prev.map(o => o.rawId === orderId ? { ...o, isRated: true } : o));
      setShowRatingModal(false);
      
      toast.success("Penilaian Berhasil Dikirim!", {
        description: "Terima kasih atas ulasan Anda. Gear Antarestar siap menemanimu!",
        duration: 5000
      });
    } catch (err: any) {
      console.error("Rating error:", err);
      toast.error(err.response?.data?.message || "Gagal mengirim penilaian.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col font-body">
      <Navbar />

      <main className="section-padding flex-1 pt-24 md:pt-32 pb-20">
        <div className="section-container max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-1">
               <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground font-bold">Pesanan Saya</span>
               </div>
               <div className="mb-8">
            <h1 className="font-display font-black text-2xl md:text-5xl uppercase tracking-tighter mb-2">Pesanan Saya</h1>
            <p className="font-body text-xs md:text-sm text-muted-foreground">Kelola dan lacak gear Antarestar yang sudah kamu pesan.</p>
          </div>
            </div>
            
            <div className="relative w-full md:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input 
                 type="text" placeholder="Cari pesanan atau produk..." value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-body outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm"
               />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-1 mb-8 shadow-sm flex overflow-x-auto no-scrollbar scroll-smooth">
            {ORDER_STATUSES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 rounded-xl font-display font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all duration-300 relative ${
                  activeTab === category.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {activeTab === category.id && ( <motion.div layoutId="activeTab" className="absolute inset-0 bg-accent rounded-xl shadow-lg shadow-accent/25" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} /> )}
                <span className="relative z-10">{category.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-3xl p-12 text-center">
                  <Package className="w-10 h-10 animate-bounce mx-auto text-accent mb-4" />
                  <p className="font-display font-bold uppercase text-sm text-muted-foreground">Memuat Pesanan...</p>
                </motion.div>
              ) : filteredOrders.length > 0 ? (
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
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
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-3xl p-12 md:p-20 text-center flex flex-col items-center justify-center">
                   <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6 text-muted-foreground opacity-40"> <ShoppingBag className="w-12 h-12" /> </div>
                   <h2 className="font-display font-black text-2xl uppercase mb-2 tracking-tight">Tidak Ada Pesanan</h2>
                   <p className="text-muted-foreground text-sm max-w-xs mb-8">Wah, belanjaan kamu masih kosong nih. Yuk, cari gear petualanganmu sekarang!</p>
                   <Button asChild size="lg" className="rounded-2xl px-10 h-14 uppercase tracking-[0.2em] font-black text-xs shadow-xl shadow-accent/30"><Link to="/store">Belanja Sekarang</Link></Button>
                </motion.div>
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
