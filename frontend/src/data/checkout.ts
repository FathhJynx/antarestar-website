import { Wallet, Building, CreditCard, Smartphone } from "lucide-react";

export const SHIPPING_METHODS = [
  { id: 'reg', name: 'Reguler', courier: 'SiCepat / J&T', price: 15000, eta: '2 - 4 Hari' },
  { id: 'hem', name: 'Hemat', courier: 'JNE Ekonomi', price: 9000, eta: '5 - 8 Hari' },
  { id: 'kargo', name: 'Kargo', courier: 'JNE Trucking', price: 45000, eta: '6 - 10 Hari' },
  { id: 'inst', name: 'Instan', courier: 'Grab/Gojek', price: 25000, eta: '2 Jam' },
];

export const PAYMENT_METHODS = [
  { id: 'gopay', name: 'GoPay', type: 'E-Wallet', icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'bca', name: 'BCA Virtual Account', type: 'Transfer Bank', icon: Building, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', type: 'Transfer Bank', icon: Building, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'cc', name: 'Kartu Kredit / Debit', type: 'Bank', icon: CreditCard, color: 'text-gray-700', bg: 'bg-gray-100' },
  { id: 'ovo', name: 'OVO', type: 'E-Wallet', icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'shopeepay', name: 'ShopeePay', type: 'E-Wallet', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
  { id: 'cod', name: 'Bayar Di Tempat (COD)', type: 'Lainnya', icon: Smartphone, color: 'text-orange-500', bg: 'bg-orange-50' },
];
