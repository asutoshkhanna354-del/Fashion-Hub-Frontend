"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/lib/contexts/wishlist-context";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

export default function WishlistPage() {
  const { items, count, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20 flex items-center justify-center">
        <div className="text-center card-glass p-10 max-w-sm">
          <Heart className="w-12 h-12 text-plum/20 mx-auto mb-4" />
          <h1 className="font-display text-xl text-plum mb-2">Sign in to view your wishlist</h1>
          <button onClick={() => router.push("/account/")} className="mt-4 px-6 py-3 bg-plum text-white rounded-xl text-sm">Sign In</button>
        </div>
      </main><Footer /></>
    );
  }

  const getImg = (media: any[]) => {
    if (!media || media.length === 0) return "/images/products/product-1.png";
    const img = media[0];
    const url = typeof img === "string" ? img : img.url;
    return url?.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-premium max-w-4xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-plum mb-8">My Wishlist {count > 0 && <span className="text-plum/30 text-lg">({count})</span>}</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 card-glass">
            <Heart className="w-16 h-16 text-plum/10 mx-auto mb-4" />
            <h2 className="font-display text-xl text-plum mb-2">Your wishlist is empty</h2>
            <button onClick={() => router.push("/sarees/")} className="mt-4 px-6 py-3 bg-plum text-white rounded-xl text-sm">Browse Sarees</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-glass p-3 group">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 cursor-pointer" onClick={() => router.push(`/sarees/${item.productId}/`)}>
                  <Image src={getImg(item.product.media)} alt={item.product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                </div>
                <h3 className="text-sm font-semibold text-plum truncate">{item.product.name}</h3>
                <span className="text-sm font-bold text-plum">₹{Number(item.product.price).toLocaleString("en-IN")}</span>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { addToCart(item.productId); removeFromWishlist(item.id); }} className="flex-1 py-2 bg-plum text-white text-xs rounded-lg flex items-center justify-center gap-1">
                    <ShoppingBag className="w-3 h-3" /> Add to Cart
                  </button>
                  <button onClick={() => removeFromWishlist(item.id)} className="w-9 h-9 border border-plum/10 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main><Footer /></>
  );
}
