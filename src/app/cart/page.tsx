"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { promoApi } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function CartPage() {
  const { items, total, count, loading, updateQuantity, removeFromCart } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoError, setPromoError] = useState("");

  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-ivory pt-28 pb-20 flex items-center justify-center">
          <div className="text-center card-glass p-10 max-w-sm">
            <ShoppingBag className="w-12 h-12 text-plum/20 mx-auto mb-4" />
            <h1 className="font-display text-xl text-plum mb-2">Sign in to view your cart</h1>
            <button onClick={() => router.push("/account/")} className="mt-4 px-6 py-3 bg-plum text-white rounded-xl text-sm font-medium hover:bg-plum/90 transition-colors">
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleApplyPromo = async () => {
    setPromoError("");
    try {
      const data = await promoApi.validate(promoCode, total);
      setPromoApplied(data.promo);
    } catch (err: any) {
      setPromoError(err.message); setPromoApplied(null);
    }
  };

  const discount = promoApplied ? (total * promoApplied.discountPercent) / 100 : 0;
  const finalTotal = total - discount;

  const getImgUrl = (media: any[]) => {
    if (!media || media.length === 0) return "/images/products/product-1.png";
    const img = media[0];
    const url = typeof img === "string" ? img : img.url;
    return url?.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="container-premium max-w-4xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-plum mb-8">
            Shopping Cart {count > 0 && <span className="text-plum/30 text-lg">({count} items)</span>}
          </h1>

          {items.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 card-glass">
              <ShoppingBag className="w-16 h-16 text-plum/10 mx-auto mb-4" />
              <h2 className="font-display text-xl text-plum mb-2">Your cart is empty</h2>
              <p className="text-plum/40 text-sm mb-6">Add some beautiful sarees to your cart!</p>
              <button onClick={() => router.push("/sarees/")} className="px-6 py-3 bg-plum text-white rounded-xl text-sm font-medium">
                Browse Sarees
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-3">
                {items.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-glass p-4 flex gap-4">
                    <div className="relative w-20 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-ivory">
                      <Image src={getImgUrl(item.product.media)} alt={item.product.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-plum truncate">{item.product.name}</h3>
                      {item.product.fabric && <p className="text-xs text-plum/40 mt-0.5">{item.product.fabric}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-plum">₹{Number(item.product.price).toLocaleString("en-IN")}</span>
                        <div className="flex items-center gap-1 bg-ivory rounded-lg border border-plum/10">
                          <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center">
                            <Minus className="w-3 h-3 text-plum/50" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-plum">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-plum/50" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-plum/40">Total: ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-glass p-5 sticky top-28">
                  <h2 className="font-display text-lg font-bold text-plum mb-4">Order Summary</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-plum/60">
                      <span>Subtotal ({count} items)</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-plum/60">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({promoApplied.code})</span>
                        <span>-₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="border-t border-plum/5 pt-2 flex justify-between font-bold text-plum text-base">
                      <span>Total</span>
                      <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
                        <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Promo code" className="w-full pl-9 pr-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-1 focus:ring-rose-gold/30" />
                      </div>
                      <button onClick={handleApplyPromo} className="px-4 py-2.5 bg-plum/5 text-plum text-xs font-medium rounded-lg hover:bg-plum/10 transition-colors">Apply</button>
                    </div>
                    {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                    {promoApplied && <p className="text-green-600 text-xs mt-1">✓ {promoApplied.discountPercent}% discount applied!</p>}
                  </div>

                  <button onClick={() => router.push(`/checkout/${promoApplied ? `?promo=${promoApplied.code}` : ""}`)} className="w-full mt-4 py-3.5 bg-gradient-to-r from-rose-gold to-rose-gold/80 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

