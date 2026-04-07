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
  backendItemId?: string | number;
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
  removeFromCart: (productId: string, size?: string, color?: string, variantId?: string) => void;
  updateQuantity: (productId: string, qty: number, size?: string, color?: string, variantId?: string) => void;
  clearCart: () => void;
  refreshCart: () => Promise<CartItem[]>;
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

  // Sync with DB: Merging Local -> Remote on Auth
  const syncCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      const res = await api.get("/cart");
      const backendItems = res.data?.data?.items || res.data?.data || [];
      
      for (const localItem of state.items) {
         const exists = backendItems.find((bi: any) => 
           String(bi.product_variant_id || bi.product_id) === String(localItem.variantId || localItem.productId)
         );
         if (!exists) {
           await api.post("/cart/items", {
             product_variant_id: localItem.variantId || localItem.productId,
             quantity: localItem.qty
           }).catch(() => {});
         }
      }

      const finalRes = await api.get("/cart");
      const mergedItems = finalRes.data?.data?.items || finalRes.data?.data || [];
      
      const mapped: CartItem[] = mergedItems.map((item: any) => {
        const variant = item.product_variant || item.variant;
        const product = variant?.product || {};
        return {
          productId: String(product?.id || item.product_id || ''),
          variantId: String(variant?.id || item.product_variant_id || ''),
          name: product?.name || 'Gear Antarestar',
          image: product?.primary_image?.image_url || product?.images?.[0]?.image_url || '',
          price: Number(variant?.is_on_flash_sale ? variant.flash_sale_price : variant?.price || 0),
          qty: item.quantity || 1,
          size: variant?.size,
          color: variant?.color_name,
          backendItemId: item.id
        };
      });
      
      dispatch({ type: "SET_CART", payload: mapped });
      return mapped;
    } catch (err) {
      console.error("Cart Sync Failed:", err);
      return state.items;
    }
  };

  useEffect(() => {
    syncCart();
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const addToCart = async (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
    if (isAuthenticated) {
      try {
        await api.post("/cart/items", {
          product_variant_id: item.variantId || item.productId,
          quantity: item.qty
        });
        // Optional: Re-sync to get the backendItemId for the new item
      } catch (error) {
        console.error("Failed to add to remote cart", error);
      }
    }
  };
  
  const removeFromCart = async (productId: string, size?: string, color?: string, variantId?: string) => {
    // Find the item to get its backend ID
    const target = state.items.find(i => 
      variantId ? i.variantId === variantId : (i.productId === productId && i.size === size && i.color === color)
    );
    
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId, size, color, variantId } });
    
    if (isAuthenticated && target) {
      try {
        // Use backendItemId if available, else fallback to variant/product ID
        const delId = target.backendItemId || variantId || productId;
        await api.delete(`/cart/items/${delId}`);
      } catch (error) {
        console.error("Failed to remove from remote cart", error);
      }
    }
  };

  const updateQuantity = async (productId: string, qty: number, size?: string, color?: string, variantId?: string) => {
    const target = state.items.find(i => 
      variantId ? i.variantId === variantId : (i.productId === productId && i.size === size && i.color === color)
    );

    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, color, qty, variantId } });
    
    if (isAuthenticated && target) {
      try {
        const upId = target.backendItemId || variantId || productId;
        await api.put(`/cart/items/${upId}`, { quantity: qty });
      } catch (error) {
        console.error("Failed to update remote cart", error);
      }
    }
  };
  
  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    if (isAuthenticated) {
      try {
        await api.delete("/cart");
      } catch (error) {
        console.error("Failed to clear remote cart", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart: syncCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
