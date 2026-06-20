"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../api";
import { useAuth } from "./auth-context";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  color: string;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discountPercent: number;
    media: any[];
    fabric?: string;
    section?: { name: string };
  };
}

interface CartContextType {
  items: CartItem[];
  total: number;
  count: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) { setItems([]); setTotal(0); setCount(0); return; }
    try {
      setLoading(true);
      const data = await cartApi.get();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setCount(data.count || 0);
    } catch {
      setItems([]); setTotal(0); setCount(0);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1, color = "") => {
    await cartApi.add(productId, quantity, color);
    await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await cartApi.update(itemId, quantity);
    await refreshCart();
  };

  const removeFromCart = async (itemId: string) => {
    await cartApi.remove(itemId);
    await refreshCart();
  };

  const clearCart = async () => {
    await cartApi.clear();
    await refreshCart();
  };

  return (
    <CartContext.Provider value={{ items, total, count, loading, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
