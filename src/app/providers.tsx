"use client";

import { AuthProvider } from "@/lib/contexts/auth-context";
import { SettingsProvider } from "@/lib/contexts/settings-context";
import { CartProvider } from "@/lib/contexts/cart-context";
import { WishlistProvider } from "@/lib/contexts/wishlist-context";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
