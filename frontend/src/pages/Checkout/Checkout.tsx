import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, ShoppingBag, Truck, CreditCard, 
  Search, Clock, TicketPercent, Check, Building, Wallet, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { rp } from "@/utils/formatters";
import api from "@/lib/api";

// Checkout Components
import Modal from "./components/Modal";
import AddressSection from "./components/AddressSection";
import ProductSection from "./components/ProductSection";
import PaymentSection from "./components/PaymentSection";
import OrderSummary from "./components/OrderSummary";
import AddressForm from "./components/AddressForm";

// --- Mock Data ---
const SHIPPING_METHODS = [
  { id: 'reg', name: 'Reguler', courier: 'SiCepat / J&T', price: 15000, eta: '2 - 4 Apr' },
  { id: 'hem', name: 'Hemat', courier: 'JNE Ekonomi', price: 9000, eta: '5 - 8 Apr' },
  { id: 'kargo', name: 'Kargo', courier: 'JNE Trucking', price: 45000, eta: '6 - 10 Apr' },
  { id: 'inst', name: 'Instan', courier: 'Grab/Gojek', price: 25000, eta: '2 Jam' },
];

const PAYMENT_METHODS = [
  { id: 'gopay', name: 'GoPay', type: 'E-Wallet', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'bca', name: 'BCA Virtual Account', type: 'Transfer Bank', icon: Building, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'Transfer Bank', icon: Building, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'cc', name: 'Kartu Kredit / Debit', type: 'Bank', icon: CreditCard, color: 'text-gray-700', bg: 'bg-gray-100' },
  { id: 'ovo', name: 'OVO', type: 'E-Wallet', icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'shopeepay', name: 'ShopeePay', type: 'E-Wallet', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'cod', name: 'Bayar Di Tempat (COD)', type: 'Lainnya', icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-50' },
];

// All addresses and vouchers are fetched from backend API

const Checkout = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  
  const checkoutItems = buyNowItem ? [buyNowItem] : items;

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[1]);
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<any | null>(null);
  const [voucherInput, setVoucherInput] = useState('');

  // Modal States
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/user/addresses");
      const userAddresses = res.data?.data || [];
      if (userAddresses.length > 0) {
          setAddresses(userAddresses);
          return userAddresses;
      }
      return [];
    } catch (err) {
      console.warn("Failed to fetch addresses");
      return [];
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAddresses().then(userAddresses => {
       if (userAddresses && userAddresses.length > 0) {
           setSelectedAddress(userAddresses.find((a: any) => a.is_default) || userAddresses[0]);
       } else {
           setAddresses([]);
           setSelectedAddress(null);
       }
    }).catch(() => {
       setAddresses([]);
       setSelectedAddress(null);
    });
    
    api.get("/promotions/coupons").then(res => {
       const userCoupons = res.data?.data || [];
       if (userCoupons.length > 0) {
           setVouchers(userCoupons.map((c: any) => ({
             id: c.id,
             code: c.code,
             name: c.description || c.code,
             disc: c.type === 'percentage' ? c.value / 100 : c.value,
             type: c.type === 'shipping' ? 'shipping' : 'discount',
             minSpend: c.min_purchase || 0
           })));
       }
    }).catch(console.warn);
  }, []);

  const subtotal = checkoutItems.reduce((acc, item: any) => acc + item.price * (item.qty || item.quantity || 1), 0);
  const insuranceFee = 2500;
  const serviceFee = 1000;
  
  const discount = appliedVoucher 
    ? (appliedVoucher.type === 'shipping' ? 0 : (appliedVoucher.disc < 1 ? subtotal * appliedVoucher.disc : appliedVoucher.disc)) 
    : 0;
  
  const shippingDiscount = (appliedVoucher?.type === 'shipping') 
    ? Math.min(selectedShipping.price, appliedVoucher.disc < 1 ? selectedShipping.price : appliedVoucher.disc) 
    : 0;

  const total = subtotal + selectedShipping.price + insuranceFee + serviceFee - discount - shippingDiscount;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Alamat belum dipilih", {
        description: "Silakan tambahkan alamat pengiriman terlebih dahulu."
      });
      return;
    }

    setIsProcessing(true);
    try {
      if (buyNowItem) {
        await api.post("/cart/items", { 
          product_variant_id: buyNowItem.variantId || buyNowItem.id, 
          quantity: buyNowItem.qty || 1 
        });
      }

      const orderResponse = await api.post("/orders", { 
         address_id: selectedAddress.id, 
         payment_method: selectedPayment.id,
         shipping_courier: selectedShipping.courier,
         shipping_service: selectedShipping.name,
         shipping_cost: selectedShipping.price,
         coupon_code: appliedVoucher?.code || null
      });

      const newOrder = orderResponse.data.data;

      setIsProcessing(false);
      toast.success("Pesanan Berhasil Dibuat!", {
        description: `Nomor Pesanan: ${newOrder.id.substring(0, 8).toUpperCase()}.`,
      });
      
      if (!buyNowItem) {
        clearCart();
      }
      
      navigate("/member");
    } catch(err: any) {
      setIsProcessing(false);
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const firstError = Object.values(errorData.errors)[0] as string[];
        toast.error("Validasi Gagal", {
           description: firstError[0]
        });
      } else {
        toast.error(errorData?.message || "Terjadi kesalahan saat membuat pesanan.");
      }
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-800">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-accent" />
          </div>
          <h1 className="font-display font-black text-3xl uppercase mb-3">Checkout Kosong</h1>
          <p className="text-muted-foreground mb-8 max-w-sm font-body font-medium">Keranjang belanja Anda kosong. Yuk, tambahkan gear favoritmu dulu!</p>
          <Button asChild size="lg" className="rounded-xl px-10 h-14 uppercase tracking-widest font-black text-xs shadow-xl shadow-accent/20"><Link to="/store">Belanja Sekarang</Link></Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1 pt-24 md:pt-32 pb-20">
        <div className="section-container max-w-6xl">
          <div className="flex items-center gap-4 mb-10">
            <Link to="/cart" className="p-2 hover:bg-white rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </Link>
            <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4 text-slate-800">
              <AddressSection 
                selectedAddress={selectedAddress} 
                onEdit={() => setShowAddressModal(true)} 
              />
              <ProductSection 
                checkoutItems={checkoutItems} 
                selectedShipping={selectedShipping} 
                onOpenShippingModal={() => setShowShippingModal(true)} 
              />
              <PaymentSection 
                paymentMethods={PAYMENT_METHODS} 
                selectedPayment={selectedPayment} 
                onSelect={(pm) => setSelectedPayment(pm)} 
                onShowAll={() => setShowPaymentModal(true)} 
              />
            </div>

            <OrderSummary 
              checkoutItemsCount={checkoutItems.length}
              subtotal={subtotal}
              shippingPrice={selectedShipping.price}
              shippingDiscount={shippingDiscount}
              insuranceFee={insuranceFee}
              serviceFee={serviceFee}
              discount={discount}
              total={total}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
              appliedVoucher={appliedVoucher}
              onShowVoucherModal={() => setShowVoucherModal(true)}
            />
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}
      
      <Modal 
        isOpen={showAddressModal} 
        onClose={() => { setShowAddressModal(false); setShowAddAddressForm(false); }} 
        title={showAddAddressForm ? "Tambah Alamat Baru" : "Pilih Alamat Pengiriman"}
      >
        {showAddAddressForm ? (
          <AddressForm 
            onCancel={() => setShowAddAddressForm(false)}
            onSuccess={async (newAddr) => {
               const freshAddresses = await fetchAddresses();
               // Find the address from fresh list to get all relations (city/province names)
               const matched = freshAddresses.find((a: any) => a.id === newAddr.id) || newAddr;
               setSelectedAddress(matched);
               setShowAddAddressForm(false);
               setShowAddressModal(false);
            }}
          />
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all group ${
                  selectedAddress?.id === addr.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-accent/40"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-sm uppercase">{addr.recipient_name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">{addr.label || 'Alamat'}</span>
                  </div>
                  {selectedAddress?.id === addr.id && <Check className="w-5 h-5 text-accent" />}
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{addr.phone}</p>
                <p className="text-xs text-foreground/80 font-body leading-relaxed mt-1">{addr.address}</p>
              </button>
            ))}
            {addresses.length === 0 && (
              <p className="text-center py-10 text-muted-foreground text-sm">Belum ada alamat tersimpan.</p>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowAddAddressForm(true)}
              className="w-full h-12 rounded-xl border-dashed border-2 hover:bg-accent/5 gap-2 group mt-2"
            >
              <span className="text-xs font-black uppercase tracking-widest">Tambah Alamat Baru</span>
            </Button>
          </div>
        )}
      </Modal>

      <Modal 
        isOpen={showShippingModal} 
        onClose={() => setShowShippingModal(false)} 
        title="Pilih Pengiriman"
      >
        <div className="space-y-3">
          {SHIPPING_METHODS.map((sm) => (
            <button
              key={sm.id}
              onClick={() => { setSelectedShipping(sm); setShowShippingModal(false); }}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                selectedShipping.id === sm.id ? "border-accent bg-accent/5" : "border-border/50 hover:border-accent/40"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-black text-sm uppercase">{sm.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${sm.id === 'inst' ? 'bg-orange-100 text-orange-600' : 'bg-muted text-muted-foreground'}`}>
                    {sm.courier}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                   <Clock className="w-3.5 h-3.5" />
                   <span>Estimasi tiba {sm.eta}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-sm text-accent">{rp(sm.price)}</p>
                {selectedShipping.id === sm.id && <div className="mt-1 flex justify-end"><Check className="w-4 h-4 text-accent" /></div>}
              </div>
            </button>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        title="Metode Pembayaran"
      >
        <div className="space-y-6">
          {['E-Wallet', 'Transfer Bank', 'Lainnya'].map((group) => (
            <div key={group} className="space-y-3">
              <h4 className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">{group}</h4>
              <div className="grid grid-cols-1 gap-2">
                {PAYMENT_METHODS.filter(p => p.type === group).map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => { setSelectedPayment(pm); setShowPaymentModal(false); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                      selectedPayment.id === pm.id ? "border-accent bg-accent/5 shadow-sm" : "border-border/50 hover:border-accent/40 bg-muted/5"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${pm.bg} ${pm.color}`}>
                        <pm.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wide">{pm.name}</span>
                    </div>
                    {selectedPayment.id === pm.id && <Check className="w-5 h-5 text-accent" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={showVoucherModal} 
        onClose={() => setShowVoucherModal(false)} 
        title="Voucher Belanja"
      >
        <div className="space-y-6">
          <div className="flex gap-2">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input 
                 placeholder="Ketik kode voucher..." 
                 value={voucherInput}
                 onChange={e => setVoucherInput(e.target.value)}
                 className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-body font-medium outline-none focus:ring-2 focus:ring-accent/20"
               />
             </div>
             <Button 
                onClick={async () => {
                   if (!voucherInput) return;
                   const params = { code: voucherInput, order_amount: subtotal };
                   try {
                     const res = await api.post('/promotions/coupons/validate', params);
                     if (res.data?.success) {
                       const c = res.data.data;
                       setAppliedVoucher({
                          id: c.id, code: c.code, name: c.description || c.code,
                          disc: c.type === 'percentage' ? c.value / 100 : c.value,
                          type: c.type === 'shipping' ? 'shipping' : 'discount'
                       });
                       toast.success("Voucher berhasil digunakan!");
                       setShowVoucherModal(false);
                     } else {
                       toast.error(res.data?.message || "Voucher tidak valid");
                     }
                   } catch(err: any) {
                     toast.error(err.response?.data?.message || "Gagal validasi voucher");
                   }
                }}
                className="rounded-xl px-6 font-black uppercase text-xs"
             >
                Cek
             </Button>
          </div>

          <div className="space-y-4">
             <h4 className="font-display font-black text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Voucher Tersedia</h4>
             {vouchers.map((v) => {
               const isEligible = !v.minSpend || subtotal >= v.minSpend;
               return (
                 <button
                   key={v.id}
                   disabled={!isEligible}
                   onClick={() => { setAppliedVoucher(v); setShowVoucherModal(false); toast.success(`Voucher ${v.code} terpasang`); }}
                   className={`w-full text-left overflow-hidden rounded-2xl border-2 transition-all flex h-24 ${
                     appliedVoucher?.id === v.id 
                       ? "border-accent bg-accent/5" 
                       : isEligible ? "border-border/50 hover:border-accent/40" : "border-border/20 opacity-50 grayscale"
                   }`}
                 >
                   <div className={`w-24 flex flex-col items-center justify-center border-r border-dashed border-border/60 ${v.type === 'shipping' ? 'bg-blue-500' : 'bg-accent'} text-white p-2`}>
                      <TicketPercent className="w-8 h-8 mb-1" />
                      <span className="text-[8px] font-black uppercase tracking-tighter text-center leading-none">{v.type === 'shipping' ? 'Gratis Ongkir' : 'Diskon'}</span>
                   </div>
                   <div className="flex-1 p-4 flex flex-col justify-center">
                     <p className="font-display font-black text-xs uppercase mb-0.5">{v.name}</p>
                     <p className="text-[10px] text-muted-foreground font-body font-medium">Min. Belanja {rp(v.minSpend || 0)}</p>
                     <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] font-body text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">Aktif</span>
                        {appliedVoucher?.id === v.id && <Check className="w-4 h-4 text-accent" />}
                     </div>
                   </div>
                 </button>
               );
             })}
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Checkout;
