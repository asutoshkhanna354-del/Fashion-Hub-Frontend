"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/lib/contexts/wishlist-context";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  media: any[];
  fabric?: string;
  rating: number;
  reviewCount: number;
  section?: { name: string };
}

export default function ProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const getImg = (media: any[]) => {
    if (!media || media.length === 0) return "/images/products/product-1.png";
    const img = media[0];
    const url = typeof img === "string" ? img : img.url;
    return url?.startsWith("http") ? url : `${API_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-plum/5 rounded-2xl mb-3" />
            <div className="h-4 bg-plum/5 rounded w-3/4 mb-2" />
            <div className="h-4 bg-plum/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-12 h-12 text-plum/10 mx-auto mb-3" />
        <p className="text-plum/40 text-sm">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product, i) => (
        <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="group">
          <Link href={`/sarees/${product.id}/`} className="block">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white mb-3">
              <Image src={getImg(product.media)} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              {product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{product.discountPercent}% OFF</span>
              )}
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isLoggedIn) { router.push("/account/"); return; } toggleWishlist(product.id); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-rose-gold text-rose-gold" : "text-plum/50"}`} />
              </button>
              <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isLoggedIn) { router.push("/account/"); return; } addToCart(product.id); }} className="w-full py-2.5 bg-plum/90 backdrop-blur-sm text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 hover:bg-plum transition-colors">
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          </Link>
          <Link href={`/sarees/${product.id}/`}>
            {product.section && <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-wider mb-0.5">{product.section.name}</p>}
            <h3 className="text-sm font-semibold text-plum truncate group-hover:text-rose-gold transition-colors">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-3 h-3 ${s <= Math.round(Number(product.rating)) ? "text-amber-400 fill-amber-400" : "text-plum/10"}`} />
              ))}
              <span className="text-[10px] text-plum/30 ml-0.5">({product.reviewCount})</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-bold text-plum">₹{Number(product.price).toLocaleString("en-IN")}</span>
              {Number(product.originalPrice) > Number(product.price) && (
                <span className="text-xs text-plum/30 line-through">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
