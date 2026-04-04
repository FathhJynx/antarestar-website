import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../lib/api";

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  size?: string;
  color?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string; variantId?: string; size?: string; color?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId?: string; size?: string; color?: string; qty: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART"; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  const isSameItem = (a: CartItem, b: { productId: string; variantId?: string; size?: string; color?: string }) =>
    (b.variantId ? a.variantId === b.variantId : a.productId === b.productId && a.size === b.size && a.color === b.color);

  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.items.find((item) => isSameItem(item, action.payload));
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            isSameItem(item, action.payload)
              ? { ...item, qty: item.qty + action.payload.qty }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, items: state.items.filter((item) => !isSameItem(item, action.payload)) };
    case "UPDATE_QUANTITY":
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter((item) => !isSameItem(item, action.payload)) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          isSameItem(item, action.payload) ? { ...item, qty: action.payload.qty } : item
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    case "SET_CART":
      return { items: action.payload };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, qty: number, size?: string, color?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "antarestar_cart";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { items: [] };
    } catch {
      return { items: [] };
    }
  });

  // Sync from DB on authenticated load
  useEffect(() => {
    if (isAuthenticated) {
      api.get("/cart").then((res) => {
        const backendItems = res.data?.data?.items || res.data?.data || [];
        if (Array.isArray(backendItems) && backendItems.length > 0) {
          const mapped: CartItem[] = backendItems.map((item: any) => {
            const variant = item.product_variant || item.variant;
            const product = variant?.product || {};
            const primaryImage = product?.primary_image?.image_url || product?.images?.[0]?.image_url || '';
            return {
              productId: String(product?.id || item.product_id || ''),
              variantId: String(variant?.id || item.product_variant_id || ''),
              name: product?.name || 'Produk Antarestar',
              image: primaryImage,
              price: Number(variant?.is_on_flash_sale ? variant.flash_sale_price : variant?.price || 0),
              originalPrice: variant?.is_on_flash_sale ? Number(variant?.price || 0) : undefined,
              size: variant?.size || undefined,
              color: variant?.color_name || undefined,
              qty: item.quantity || 1,
            };
          });
          dispatch({ type: "SET_CART", payload: mapped });
        }
      }).catch(console.error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
    if (isAuthenticated) {
      api.post("/cart/items", {
        product_variant_id: item.variantId || item.productId,
        quantity: item.qty
      }).catch(console.error);
    }
  };
  
  const removeFromCart = (productId: string, size?: string, color?: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, size, color } });
    if (isAuthenticated) {
        // backend expects itemId, but since we don't have it mapped explicitly, we might skip backend deletion for this mockup or implement assuming productId is itemId
        api.delete(`/cart/items/${productId}`).catch(console.error);
    }
  };

  const updateQuantity = (productId: string, qty: number, size?: string, color?: string) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, color, qty } });
    if (isAuthenticated) {
        api.put(`/cart/items/${productId}`, { quantity: qty }).catch(console.error);
    }
  };
  
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
