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
    if (!url) return "/images/products/product-1.png";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-[#1E1533]/5 rounded-2xl mb-4" />
            <div className="h-4 bg-[#1E1533]/5 rounded w-3/4 mb-2" />
            <div className="h-4 bg-[#1E1533]/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border border-[#1E1533]/[0.03]">
        <ShoppingBag className="w-12 h-12 text-[#1E1533]/10 mx-auto mb-4" />
        <p className="text-[#1E1533]/40 text-sm font-medium tracking-wide">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, i) => (
        <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
          <Link href={`/sarees/${product.id}/`} className="block relative">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F8F6F3] mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300">
              <Image 
                src={getImg(product.media)} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              
              {/* Discount Tag */}
              {product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-[#1E1533] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-sm z-10">
                  {product.discountPercent}% OFF
                </span>
              )}
              
              {/* Wishlist Button */}
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isLoggedIn) { router.push("/account/"); return; } toggleWishlist(product.id); }} 
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? "fill-[#C58F7A] text-[#C58F7A]" : "text-[#1E1533]/50"}`} />
              </button>
              
              {/* Quick Add overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!isLoggedIn) { router.push("/account/"); return; } addToCart(product.id); }} 
                  className="w-full py-3 bg-white/90 backdrop-blur-md text-[#1E1533] text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="px-1">
              {product.section && <p className="text-[10px] font-bold text-[#C58F7A] uppercase tracking-wider mb-1">{product.section.name}</p>}
              <h3 className="text-sm font-semibold text-[#1E1533] truncate group-hover:text-[#C58F7A] transition-colors">{product.name}</h3>
              
              {/* Ratings */}
              <div className="flex items-center gap-1 mt-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${s <= Math.round(Number(product.rating)) ? "text-[#C58F7A] fill-[#C58F7A]" : "text-[#1E1533]/10"}`} />
                ))}
                <span className="text-[10px] text-[#1E1533]/40 ml-1 font-medium">({product.reviewCount})</span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-[#1E1533]">₹{Number(product.price).toLocaleString("en-IN")}</span>
                {Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-xs font-medium text-[#1E1533]/30 line-through">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
