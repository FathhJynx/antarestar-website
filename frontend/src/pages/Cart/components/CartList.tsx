import React from "react";
import CartItem from "./CartItem";
import { motion, AnimatePresence } from "framer-motion";

interface CartListProps {
  items: any[];
  onRemove: (id: string | number, size?: string, color?: string, variantId?: string) => void;
  onUpdateQty: (id: string | number, qty: number, size?: string, color?: string, variantId?: string) => void;
}

const CartList = ({ items, onRemove, onUpdateQty }: CartListProps) => {
  return (
    <div className="flex flex-col gap-6">
      <AnimatePresence mode="popLayout" initial={false}>
        {items.map((item, idx) => (
          <CartItem 
            key={`${item.productId}-${item.size || ''}-${item.color || ''}`}
            item={item} 
            onRemove={onRemove}
            onUpdateQty={onUpdateQty}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CartList;
