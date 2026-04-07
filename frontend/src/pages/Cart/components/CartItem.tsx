import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartItemProps {
  item: {
    productId: string | number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    qty: number;
    size?: string;
    color?: string;
    variantId?: string | number;
  };
  onRemove: (id: string | number, size?: string, color?: string, variantId?: string | number) => void;
  onUpdateQty: (id: string | number, qty: number, size?: string, color?: string, variantId?: string | number) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

const CartItem = ({ item, onRemove, onUpdateQty }: CartItemProps) => {
  return (
    <motion.div
      layout
      className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-[#111111] border border-[#1F1F1F] rounded-3xl hover:border-orange-500/30 transition-all duration-300 transform-gpu"
    >
      {/* Product Image */}
      <div className="shrink-0 relative w-full sm:w-44 h-44 bg-black/40 rounded-2xl overflow-hidden border border-white/5">
        <Link to={`/product/${item.productId}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain grayscale-[15%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3">
             <Link to={`/product/${item.productId}`} className="block">
                <h3 className="font-display font-bold text-xl uppercase italic tracking-tight text-white hover:text-orange-600 transition-colors leading-[1.1]">
                  {item.name}
                </h3>
             </Link>
             <div className="flex flex-wrap gap-4">
                {item.size && (
                    <span className="font-bold text-[10px] uppercase tracking-widest text-white/30 italic">
                        UKURAN: <span className="text-white">{item.size}</span>
                    </span>
                )}
                {item.color && (
                    <span className="font-bold text-[10px] uppercase tracking-widest text-white/30 italic">
                        WARNA: <span className="text-white">{item.color}</span>
                    </span>
                )}
             </div>
          </div>
          
          <button
            onClick={() => onRemove(item.productId, item.size, item.color, (item as any).variantId)}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
            title="Ga jadi ambil"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Action Row: Qty Controls and Price */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between gap-6 mt-6 sm:mt-0">
          <div className="flex flex-col sm:flex-row items-center gap-6">
             <div className="space-y-1">
                <p className="font-bold text-[9px] uppercase tracking-widest text-white/30">
                   {formatPrice(item.price)} / ITEM
                </p>
                <p className="font-bold text-xl text-orange-600 tracking-tight">
                   {formatPrice(item.price * item.qty)}
                </p>
             </div>
             
             {/* Quantity Control */}
              <div className="flex items-center h-10 bg-black border border-white/5 rounded-xl p-0.5 overflow-hidden">
                <button
                   onClick={() => onUpdateQty(item.productId, item.qty - 1, item.size, item.color, item.variantId)}
                   className="w-10 h-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all active:scale-90 disabled:opacity-30"
                   disabled={item.qty <= 1}
                   title="Kurangin dulu?"
                >
                   <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 text-center">
                   <span className="font-display font-black text-lg italic text-white">{item.qty}</span>
                </div>
                <button
                   onClick={() => onUpdateQty(item.productId, item.qty + 1, item.size, item.color, item.variantId)}
                   className="w-10 h-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all active:scale-90"
                   title="Tambah lagi?"
                >
                   <Plus className="w-4 h-4" />
                </button>
              </div>
          </div>

          <div className="hidden sm:block">
             <p className="font-display font-black text-[9px] uppercase tracking-[0.4em] text-white/10 italic">
                SECURED IN CART
             </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
