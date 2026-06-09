"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistApi } from "../api";
import { useAuth } from "./auth-context";

interface WishlistItem {
  id: string;
  productId: string;
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

interface WishlistContextType {
  items: WishlistItem[];
  count: number;
  loading: boolean;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (itemId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());

  const refreshWishlist = useCallback(async () => {
    if (!isLoggedIn) { setItems([]); setCount(0); setWishlistedIds(new Set()); return; }
    try {
      setLoading(true);
      const data = await wishlistApi.get();
      setItems(data.items || []);
      setCount(data.count || 0);
      setWishlistedIds(new Set((data.items || []).map((i: WishlistItem) => i.productId)));
    } catch {
      setItems([]); setCount(0); setWishlistedIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => { refreshWishlist(); }, [refreshWishlist]);

  const isWishlisted = (productId: string) => wishlistedIds.has(productId);

  const toggleWishlist = async (productId: string) => {
    await wishlistApi.toggle(productId);
    await refreshWishlist();
  };

  const removeFromWishlist = async (itemId: string) => {
    await wishlistApi.remove(itemId);
    await refreshWishlist();
  };

  return (
    <WishlistContext.Provider value={{ items, count, loading, isWishlisted, toggleWishlist, removeFromWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
