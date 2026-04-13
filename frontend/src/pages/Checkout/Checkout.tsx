import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowRight, StickyNote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { rp } from "@/utils/formatters";
import api from "@/lib/api";

// Data
import { SHIPPING_METHODS, PAYMENT_METHODS } from "@/data/checkout";

// Checkout Components
import CheckoutLayout from "./components/CheckoutLayout";
import CheckoutForm, { CheckoutSection, CheckoutInput } from "./components/CheckoutForm";
import CheckoutModal from "./components/CheckoutModal";
import AddressSection from "./components/AddressSection";
import ProductSection from "./components/ProductSection";
import ShippingSection from "./components/ShippingSection";
import PaymentSection from "./components/PaymentSection";
import OrderSummary from "./components/OrderSummary";
import { Reveal } from "@/components/AnimationPrimitives";

// Modals
import AddressPickerModal from "./components/AddressPickerModal";
import ShippingPickerModal from "./components/ShippingPickerModal";
import PaymentPickerModal from "./components/PaymentPickerModal";
import VoucherPickerModal from "./components/VoucherPickerModal";

const Checkout = () => {
  const { items, refreshCart } = useCart();
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
     confirmLabel?: string;
     cancelLabel?: string;
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
    if (!selectedAddress) {
       toast.error("Waduh, alamat pengirimannya belum dipilih nih 😅");
       setShowAddressModal(true);
       return;
    }
    
    setUiModal({
       isOpen: true,
       type: 'confirmation',
       title: 'PROTOKOL AKHIR 🔥',
       message: 'Semua gear dan koordinat pengiriman udah dicek? Kalau udah gas bayar sekarang!',
       onConfirm: finalizeCheckout,
       confirmLabel: 'Gas Bayar Sekarang',
       cancelLabel: 'Cek Lagi'
    });
  };

  const finalizeCheckout = async () => {
    setUiModal({ isOpen: true, type: 'loading' });
    setIsProcessing(true);
    
    try {
      const orderData = {
        address_id: selectedAddress.id,
        shipping_courier: selectedShipping.courier,
        shipping_service: selectedShipping.name,
        shipping_cost: selectedShipping.price,
        payment_method: selectedPayment.id,
        coupon_code: appliedVoucher?.code || null,
        notes: noteInput,
        buy_now_item: buyNowItem ? {
           product_id: buyNowItem.productId,
           variant_id: buyNowItem.variantId,
           quantity: buyNowItem.qty
        } : null
      };

      const response = await api.post("/orders", orderData);
      const newOrder = response.data.data;
      
      setIsProcessing(false);
      setUiModal({
         isOpen: true,
         type: 'success',
         title: 'Berhasil Cak! 🚀',
         message: `Gear lo lagi diproses. Pantau terus status pengirimannya di log pesanan lo ya!`,
         onConfirm: () => navigate("/orders/" + (newOrder.id || newOrder.order_number)),
         confirmLabel: 'Lihat Pesanan Gue'
      });
    } catch(err: any) {
      setIsProcessing(false);
      const msg = err.response?.data?.message || "Waduh, ada kendala teknis pas buat pesanan lo. Coba lagi ya!";
      setUiModal({
         isOpen: true,
         type: 'error',
         title: 'Waduh, Gagal 😅',
         message: msg
      });
    }
  };

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
        <div className="bg-[#111111]/90 backdrop-blur-3xl border border-white/10 p-6 flex items-center justify-between gap-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <div className="space-y-1">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Total Bayar</p>
              <p className="text-xl font-bold text-white leading-none text-white">{rp(total)}</p>
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

      <AddressPickerModal 
        isOpen={showAddressModal}
        onClose={() => { setShowAddressModal(false); setShowAddAddressForm(false); }}
        showAddAddressForm={showAddAddressForm}
        setShowAddAddressForm={setShowAddAddressForm}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelect={setSelectedAddress}
        fetchAddresses={fetchAddresses}
      />

      <ShippingPickerModal 
        isOpen={showShippingModal}
        onClose={() => setShowShippingModal(false)}
        shippingMethods={SHIPPING_METHODS}
        selectedShipping={selectedShipping}
        onSelect={setSelectedShipping}
      />

      <PaymentPickerModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        paymentMethods={PAYMENT_METHODS}
        selectedPayment={selectedPayment}
        onSelect={setSelectedPayment}
      />

      <VoucherPickerModal 
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        voucherInput={voucherInput}
        setVoucherInput={setVoucherInput}
        onApply={handleApplyPromo}
        vouchers={vouchers}
        onSelect={setAppliedVoucher}
      />

      <CheckoutModal 
        isOpen={uiModal.isOpen}
        onClose={() => setUiModal(prev => ({ ...prev, isOpen: false }))}
        type={uiModal.type}
        title={uiModal.title}
        message={uiModal.message}
        onConfirm={uiModal.onConfirm}
        confirmLabel={uiModal.confirmLabel}
        cancelLabel={uiModal.cancelLabel}
      />
    </CheckoutLayout>
  );
};

export default Checkout;
