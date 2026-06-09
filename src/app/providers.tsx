"use client";

import { AuthProvider } from "@/lib/contexts/auth-context";
import { CartProvider } from "@/lib/contexts/cart-context";
import { WishlistProvider } from "@/lib/contexts/wishlist-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
