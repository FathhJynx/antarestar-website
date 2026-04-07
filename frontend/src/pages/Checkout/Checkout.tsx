import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
  Plus, Check, ChevronRight, Truck, 
  CreditCard, Wallet, Landmark, Info, 
  TicketPercent, ArrowRight, X, Phone, 
  User, MapPin, Search, ShoppingBag, ChevronLeft, Building, Smartphone, StickyNote, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { rp } from "@/utils/formatters";
import api from "@/lib/api";

// Checkout Components
import CheckoutLayout from "./components/CheckoutLayout";
import CheckoutForm, { CheckoutSection, CheckoutInput } from "./components/CheckoutForm";
import CheckoutModal from "./components/CheckoutModal";
import AddressSection from "./components/AddressSection";
import ProductSection from "./components/ProductSection";
import ShippingSection from "./components/ShippingSection";
import PaymentSection from "./components/PaymentSection";
import OrderSummary from "./components/OrderSummary";
import AddressForm from "./components/AddressForm";
import { Reveal } from "@/components/AnimationPrimitives";
import CustomModal from "./components/Modal"; // Renamed existing Modal for standard address picking

// --- Mock Data ---
const SHIPPING_METHODS = [
  { id: 'reg', name: 'Reguler', courier: 'SiCepat / J&T', price: 15000, eta: '2 - 4 Hari' },
  { id: 'hem', name: 'Hemat', courier: 'JNE Ekonomi', price: 9000, eta: '5 - 8 Hari' },
  { id: 'kargo', name: 'Kargo', courier: 'JNE Trucking', price: 45000, eta: '6 - 10 Hari' },
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

const Checkout = () => {
  const { items, clearCart, refreshCart } = useCart();
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
  const [noteInput, setNoteInput] = useState('');

  // UI Modal States
  const [uiModal, setUiModal] = useState<{
     isOpen: boolean;
     type: 'success' | 'error' | 'confirmation' | 'loading';
     title?: string;
     message?: string;
     onConfirm?: () => void;
  }>({ isOpen: false, type: 'confirmation' });

  // Functional Modal States
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
      return [];
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Force sync cart to ensure accuracy
    if (!buyNowItem) refreshCart();

    fetchAddresses().then(userAddresses => {
       if (userAddresses && userAddresses.length > 0) {
           setSelectedAddress(userAddresses.find((a: any) => a.is_default) || userAddresses[0]);
       }
    });
    
    api.get("/promotions/coupons").then(res => {
       const userCoupons = res.data?.data || [];
       if (userCoupons.length > 0) {
           setVouchers(userCoupons.map((c: any) => ({
             id: c.id, code: c.code, name: c.description || c.code,
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

  const handleApplyPromo = (code: string) => {
     const upper = code.toUpperCase().trim();
     const voucher = vouchers.find(v => v.code === upper);
     if (voucher) {
        if (subtotal < voucher.minSpend) {
           toast.error(`Duh! Belanjaan lo kurang dikit lagi nih (${rp(voucher.minSpend)} min. belanja) 😅`);
           return;
        }
        setAppliedVoucher(voucher);
        setVoucherInput("");
        setShowVoucherModal(false);
        toast.success(`VOILA! Voucher ${upper} Berhasil Dipasang 👌`);
     } else {
        toast.error("Waduh, kode vouchernya gak valid nih 😅");
     }
  };

  const handlePlaceOrder = () => {
    // Thorough Validation Protocol
    if (!selectedAddress) {
       setUiModal({
          isOpen: true,
          type: 'error',
          title: 'Alamat Hilang 📍',
          message: 'Duh, unit logistik kami bingung nih mau kirim kemana. Isi dulu alamat pengiriman lo!'
       });
       return;
    }

    if (!selectedShipping) {
       setUiModal({
          isOpen: true,
          type: 'error',
          title: 'Kurir Gabut 🚚',
          message: 'Pilih dulu layanan kurir yang lo mau biar barang lo cepet sampe ke basecamp!'
       });
       return;
    }

    if (!selectedPayment) {
       setUiModal({
          isOpen: true,
          type: 'error',
          title: 'Bensin Abis 💳',
          message: 'Lengkapi metode pembayaran biar kita bisa langsung proses gear impian lo!'
       });
       return;
    }

    setUiModal({
       isOpen: true,
       type: 'confirmation',
       title: 'PROTOKOL AKHIR 🔥',
       message: 'Semua gear dan koordinat pengiriman udah dicek? Kalau udah gas bayar sekarang!',
       onConfirm: finalizeCheckout
    });
  };

  const finalizeCheckout = async () => {
    setUiModal({ isOpen: true, type: 'loading' });
    setIsProcessing(true);
    
    try {
      if (buyNowItem) {
        await api.post("/cart/items", { 
          product_variant_id: buyNowItem.variantId || buyNowItem.id, 
          quantity: buyNowItem.qty || 1 
        });
      }

      const res = await api.post("/orders", { 
         address_id: selectedAddress.id, payment_method: selectedPayment.id,
         shipping_courier: selectedShipping.courier, shipping_service: selectedShipping.name,
         shipping_cost: selectedShipping.price, coupon_code: appliedVoucher?.code || null,
         notes: noteInput || null
      });

      const newOrder = res.data.data;
      if (!buyNowItem) await clearCart();

      setUiModal({
         isOpen: true,
         type: 'success',
         title: 'Berhasil Cak! 🚀',
         message: `Gear lo lagi diproses. Pantau terus status pengirimannya di log pesanan lo ya!`,
         onConfirm: () => navigate("/orders/" + (newOrder.id || newOrder.order_number))
      });
    } catch(err: any) {
      setIsProcessing(false);
      setUiModal({
         isOpen: true,
         type: 'error',
         title: 'Waduh, Gagal 😅',
         message: err.response?.data?.message || 'Terjadi gangguan koneksi atau data belom lengkap. Cek lagi ya!'
      });
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-6 text-center">
        <Navbar />
        <div className="w-24 h-24 bg-orange-600/10 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-12 h-12 text-orange-600" />
        </div>
        <h1 className="font-display font-bold text-3xl uppercase mb-4 tracking-tight">Checkout Kosong</h1>
        <p className="text-white/40 mb-10 max-w-sm font-bold text-[10px] uppercase tracking-widest leading-relaxed">Yuk, balik ke store dan ambil gear favorit lo dulu!</p>
        <Button asChild className="bg-orange-600 hover:bg-white hover:text-orange-600 text-white rounded-xl h-16 px-10 font-bold uppercase text-xs tracking-widest">
           <Link to="/store">Gas Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <CheckoutLayout 
      summary={
        <OrderSummary 
           checkoutItemsCount={checkoutItems.length}
           subtotal={subtotal} shippingPrice={selectedShipping.price}
           shippingDiscount={shippingDiscount} insuranceFee={insuranceFee}
           serviceFee={serviceFee} discount={discount}
           total={total} isProcessing={isProcessing}
           onPlaceOrder={handlePlaceOrder} appliedVoucher={appliedVoucher}
           onShowVoucherModal={() => setShowVoucherModal(true)}
        />
      }
      stickyBottom={
        <div className="bg-[#111111] border-t border-white/10 p-6 flex items-center justify-between gap-6">
           <div className="space-y-1">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Total Bayar</p>
              <p className="text-xl font-bold text-white leading-none">{rp(total)}</p>
           </div>
           <Button 
              onClick={handlePlaceOrder}
              className="flex-1 h-14 bg-orange-600 text-white rounded-xl font-bold uppercase text-[12px] tracking-widest active:scale-95"
           >
              Gas Bayar <ArrowRight className="ml-2 w-4 h-4" />
           </Button>
        </div>
      }
    >
      <CheckoutForm>
        <Reveal direction="up" delay={0.1}>
           <AddressSection selectedAddress={selectedAddress} onEdit={() => setShowAddressModal(true)} />
        </Reveal>
        
        <Reveal direction="up" delay={0.2}>
           <ShippingSection selectedShipping={selectedShipping} onOpenShippingModal={() => setShowShippingModal(true)} />
        </Reveal>

        <Reveal direction="up" delay={0.3}>
           <PaymentSection selectedPayment={selectedPayment} onOpenPaymentModal={() => setShowPaymentModal(true)} />
        </Reveal>

        <Reveal direction="up" delay={0.4}>
           <ProductSection 
             checkoutItems={checkoutItems} 
             selectedShipping={selectedShipping} 
             onOpenShippingModal={() => setShowShippingModal(true)} 
           />
        </Reveal>

        <Reveal direction="up" delay={0.5}>
           <CheckoutSection title="Catatan Pesanan" subtitle="Sampaikan pesan buat paket lo" icon={<StickyNote className="w-5 h-5" />}>
              <CheckoutInput 
                 placeholder="Contoh: Titipin ke satpam depan ya bang (biar ga nyasar 😄)"
                 value={noteInput}
                 onChange={(e: any) => setNoteInput(e.target.value)}
              />
           </CheckoutSection>
        </Reveal>
      </CheckoutForm>

      {/* Standard Address Picking Modal */}
      <CustomModal 
        isOpen={showAddressModal} 
        onClose={() => { setShowAddressModal(false); setShowAddAddressForm(false); }} 
        title={showAddAddressForm ? "Tambah Alamat Baru" : "Pilih Alamat Pengiriman"}
      >
        {showAddAddressForm ? (
          <AddressForm 
            onCancel={() => setShowAddAddressForm(false)}
            onSuccess={async (newAddr) => {
               const freshAddresses = await fetchAddresses();
               const matched = freshAddresses.find((a: any) => a.id === newAddr.id) || newAddr;
               setSelectedAddress(matched);
               setShowAddAddressForm(false);
               setShowAddressModal(false);
            }}
          />
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  selectedAddress?.id === addr.id ? "border-orange-600 bg-orange-600/5" : "border-white/5 hover:border-orange-600/40 bg-black/50"
                }`}
              >
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                       <span className="font-display font-bold text-sm uppercase text-white tracking-wide">{addr.recipient_name}</span>
                       <span className="text-[9px] font-bold text-orange-600 bg-orange-600/10 px-2 py-0.5 rounded uppercase tracking-wider">{addr.label || 'Alamat'}</span>
                    </div>
                    {selectedAddress?.id === addr.id && <Check className="w-4 h-4 text-orange-600" />}
                 </div>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{addr.phone}</p>
                 <p className="text-xs text-white/60 font-bold uppercase leading-relaxed mt-2">{addr.address}</p>
              </button>
            ))}
            <Button 
               variant="outline" 
               onClick={() => setShowAddAddressForm(true)} 
               className="w-full h-16 rounded-2xl border-dashed border-white/10 hover:border-orange-600 hover:text-white hover:bg-orange-600/5 text-white/30 font-bold uppercase text-[10px] tracking-[0.2em] gap-3 group transition-all"
            >
               <div className="w-8 h-8 rounded-full border border-current flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-4 h-4" /></div>
               Tambah Alamat Baru
            </Button>
          </div>
        )}
      </CustomModal>

      {/* Shipping Selection Modal */}
      <CustomModal isOpen={showShippingModal} onClose={() => setShowShippingModal(false)} title="Pilih Pengiriman">
         <div className="space-y-4 pb-10">
            {SHIPPING_METHODS.map((sm) => (
               <button
                 key={sm.id}
                 onClick={() => { setSelectedShipping(sm); setShowShippingModal(false); }}
                 className={`group relative text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between overflow-hidden ${
                   selectedShipping.id === sm.id 
                   ? "border-orange-600 bg-orange-600/5 shadow-[0_0_20px_rgba(234,88,12,0.1)]" 
                   : "border-white/5 hover:border-orange-600/40 bg-black/40"
                 }`}
               >
                  <div className="flex items-center gap-6 relative z-10">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        selectedShipping.id === sm.id ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/30 group-hover:text-white'
                     }`}>
                        <Truck className="w-6 h-6" />
                     </div>
                     <div className="space-y-1">
                        <span className="block font-bold text-base text-white uppercase tracking-tight italic leading-none">{sm.name}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{sm.courier}</span>
                           <div className="w-1 h-1 rounded-full bg-white/10" />
                           <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em]">{sm.eta}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end relative z-10">
                     <span className="font-display font-black text-lg text-white leading-none mb-1">{rp(sm.price)}</span>
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Estimasi Biaya</span>
                  </div>
               </button>
            ))}
         </div>
      </CustomModal>

      {/* Payment Selection Modal */}
      <CustomModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Metode Pembayaran">
         <div className="space-y-10 pb-10">
            {['E-Wallet', 'Transfer Bank', 'Lainnya'].map((group) => {
              const methods = PAYMENT_METHODS.filter(p => p.type === group);
              if (methods.length === 0) return null;
              
              return (
                <div key={group} className="space-y-4">
                   <div className="flex items-center gap-3 ml-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{group}</p>
                      <div className="h-px flex-1 bg-white/5" />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {methods.map((pm) => (
                        <button
                          key={pm.id}
                          onClick={() => { setSelectedPayment(pm); setShowPaymentModal(false); }}
                          className={`group relative text-left p-5 rounded-2xl border-2 transition-all overflow-hidden ${
                            selectedPayment.id === pm.id 
                            ? "border-orange-600 bg-orange-600/5" 
                            : "border-white/5 hover:border-orange-600/40 bg-black/40"
                          }`}
                        >
                           <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-xl transition-colors ${selectedPayment.id === pm.id ? 'bg-orange-600 text-white' : 'bg-white/5 text-white/30 group-hover:text-white'}`}>
                                    <pm.icon className="w-5 h-5" />
                                 </div>
                                 <div>
                                    <span className="block font-bold text-xs text-white uppercase tracking-widest leading-none mb-1">{pm.name}</span>
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{pm.type}</span>
                                 </div>
                              </div>
                              {selectedPayment.id === pm.id && <Check className="w-4 h-4 text-orange-600" />}
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              );
            })}
         </div>
      </CustomModal>

      {/* Voucher Modal */}
      <CustomModal isOpen={showVoucherModal} onClose={() => setShowVoucherModal(false)} title="Voucher Belanja">
         <div className="space-y-10 pb-10">
            <div className="relative group">
               <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <TicketPercent className="w-5 h-5 text-white/20 group-focus-within:text-orange-600 transition-colors" />
               </div>
               <input 
                 placeholder="MASUKKAN KODE VOUCHER" 
                 value={voucherInput} onChange={e => setVoucherInput(e.target.value)}
                 className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-32 py-5 text-sm font-bold text-white uppercase outline-none focus:border-orange-600 focus:bg-orange-600/5 transition-all placeholder:text-white/10 italic"
               />
               <button 
                  onClick={() => handleApplyPromo(voucherInput)}
                  className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all active:scale-95"
               >
                  KLAIM
               </button>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 ml-2">Voucher Tersedia</p>
                  <div className="h-px flex-1 bg-white/5" />
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {vouchers.map(v => (
                    <button 
                      key={v.id} 
                      onClick={() => { setAppliedVoucher(v); setShowVoucherModal(false); }} 
                      className="group relative w-full h-28 bg-black border-2 border-white/5 hover:border-orange-600 rounded-2xl flex items-center p-6 transition-all overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-32 h-full bg-orange-600/5 -skew-x-12 translate-x-8 group-hover:translate-x-4 transition-transform" />
                       <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-white/30 group-hover:bg-orange-600 group-hover:text-white transition-all shrink-0">
                          <TicketPercent className="w-8 h-8" />
                       </div>
                       <div className="ml-6 text-left space-y-1 relative z-10">
                          <p className="font-display font-black text-lg text-white uppercase tracking-tighter italic">{v.name}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest">KODE: {v.code}</span>
                             <div className="w-1 h-1 rounded-full bg-white/10" />
                             <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">Min. Belanja {rp(v.minSpend)}</p>
                          </div>
                       </div>
                       <ArrowRight className="ml-auto w-5 h-5 text-white/10 group-hover:text-orange-600 transition-all group-hover:translate-x-1" />
                    </button>
                  ))}
               </div>
            </div>
         </div>
      </CustomModal>

      {/* FEEDBACK MODALS */}
      <CheckoutModal 
        isOpen={uiModal.isOpen}
        onClose={() => setUiModal(prev => ({ ...prev, isOpen: false }))}
        type={uiModal.type}
        title={uiModal.title}
        message={uiModal.message}
        onConfirm={uiModal.onConfirm}
      />
    </CheckoutLayout>
  );
};

export default Checkout;
