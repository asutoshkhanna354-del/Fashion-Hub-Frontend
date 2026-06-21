"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { useState } from "react";
import { promoApi } from "@/lib/api";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, total, count, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = async () => {
    setPromoError("");
    try {
      const data = await promoApi.validate(promoCode, total);
      setPromoApplied(data.promo);
    } catch (err: any) {
      setPromoError(err.message);
      setPromoApplied(null);
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

  const freeShippingThreshold = 5000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - total);
  const progressPercent = Math.min(100, (total / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-plum/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[450px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-plum/10 bg-ivory/30">
              <h2 className="font-display text-2xl font-bold text-plum flex items-center gap-2">
                Your Cart
                {count > 0 && (
                  <span className="text-sm font-medium bg-plum/10 text-plum px-2.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-plum/60 hover:text-plum hover:bg-plum/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {count > 0 && (
              <div className="bg-plum/5 p-4 border-b border-plum/10">
                <p className="text-xs text-center text-plum font-medium mb-2">
                  {amountToFreeShipping > 0
                    ? `Add ₹${amountToFreeShipping.toLocaleString("en-IN")} more for FREE Shipping`
                    : "🎉 You've unlocked FREE Shipping!"}
                </p>
                <div className="w-full h-1.5 bg-plum/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-rose-gold rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-ivory rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-plum/30" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-plum mb-2">Your cart is empty</h3>
                    <p className="text-sm text-plum/50">Discover our luxury collection and add something beautiful.</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/collections/");
                    }}
                    className="px-8 py-3 bg-plum text-white text-sm font-medium hover:bg-plum/90 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden bg-plum/5 cursor-pointer flex-shrink-0" onClick={() => { onClose(); router.push(`/sarees/${item.product.id}`); }}>
                        <Image src={getImgUrl(item.product.media)} alt={item.product.name} fill className="object-cover" sizes="96px" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-sm font-bold text-plum line-clamp-2 leading-tight">
                              {item.product.name}
                            </h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-plum/30 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {item.product.fabric && (
                            <p className="text-xs text-plum/50 mt-1">{item.product.fabric}</p>
                          )}
                          {item.color && (
                            <p className="text-xs text-plum/50 mt-0.5">Color: <span className="font-semibold text-plum">{item.color}</span></p>
                          )}
                        </div>
                        
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center gap-3 bg-ivory px-2 py-1 border border-plum/10">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="text-plum/50 hover:text-plum transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-plum w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-plum/50 hover:text-plum transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-plum text-sm">
                            ₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-plum/10 bg-ivory/50 p-5 space-y-4">
                {/* Promo Code */}
                <div className="bg-white p-1 flex items-center border border-plum/10">
                  <Tag className="w-4 h-4 text-plum/40 ml-3" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className="flex-1 bg-transparent border-none text-sm text-plum px-3 py-2 focus:outline-none placeholder:text-plum/30 uppercase"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-plum/5 text-plum text-xs font-bold hover:bg-plum/10 transition-colors uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-xs px-1">{promoError}</p>}
                {promoApplied && <p className="text-green-600 text-xs px-1">✓ {promoApplied.discountPercent}% discount applied!</p>}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm text-plum/60">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-plum/60">
                    <span>Shipping</span>
                    <span>{amountToFreeShipping <= 0 ? "FREE" : "Calculated at checkout"}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-plum pt-2 border-t border-plum/10">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/checkout/${promoApplied ? `?promo=${promoApplied.code}` : ""}`);
                    }}
                    className="w-full py-4 bg-plum text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-plum/90 transition-all shadow-lg hover:shadow-xl group"
                  >
                    Secure Checkout
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <div className="flex items-center justify-center gap-2 mt-4 text-plum/40">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-semibold">100% Secure Payment</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

