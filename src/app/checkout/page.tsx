"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, ArrowLeft, Shield, X, Loader2, Banknote } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { orderApi, paymentApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams.get("promo") || undefined;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">("ONLINE");
  
  const [address, setAddress] = useState({
    line1: user?.addressLine1 || "",
    line2: user?.addressLine2 || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "India",
    pincode: user?.pincode || "",
    name: user ? `${user.firstName} ${user.lastName}` : "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    const rzpPaymentId = searchParams.get("razorpay_payment_id");
    const rzpOrderId = searchParams.get("razorpay_order_id");
    const rzpSignature = searchParams.get("razorpay_signature");
    
    if (rzpPaymentId && rzpOrderId && rzpSignature) {
      setLoading(true);
      paymentApi.verify({
        razorpay_order_id: rzpOrderId,
        razorpay_payment_id: rzpPaymentId,
        razorpay_signature: rzpSignature,
      }).then(() => {
        clearCart();
        router.push(`/checkout/status?rzp_order_id=${rzpOrderId}`);
      }).catch((err: any) => {
        setError(err.message || "Payment verification failed");
        setLoading(false);
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/account/");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;
  
  // Prevent redirect if we are currently loading/verifying payment from query params
  const isVerifying = searchParams.get("razorpay_payment_id") !== null;
  if (items.length === 0 && !isVerifying) { router.push("/cart/"); return null; }

  const handlePayment = async () => {
    setLoading(true); setError("");
    try {
      const orderData = await orderApi.create(promoCode, address, paymentMethod);
      const orderId = orderData.order.id;
      
      if (paymentMethod === "COD") {
        clearCart();
        router.push(`/checkout/status?order_id=${orderId}&method=COD`);
        return;
      }
      
      const payData = await paymentApi.create(orderId);
      
      if (!payData.razorpayOrderId) {
        setError("Payment creation failed. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: payData.keyId || process.env.NEXT_PUBLIC_RZP_KEY || "", 
        amount: payData.amount,
        currency: payData.currency || "INR",
        name: "Solanki Vastra Bhandar",
        description: "Order Payment",
        order_id: payData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            setLoading(true);
            await paymentApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            router.push(`/checkout/status?order_id=${orderId}`);
          } catch (err: any) {
            setError(err.message || "Payment verification failed");
            setLoading(false);
          }
        },
        prefill: {
          name: address.name,
          email: user?.email,
          contact: address.phone,
        },
        theme: {
          color: "#C5A47E", // Golden theme color
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError("Payment was cancelled. Please try again.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setError("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false); 
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="container-premium max-w-3xl mx-auto">
          <button onClick={() => router.push("/cart/")} className="flex items-center gap-1 text-plum/50 hover:text-plum text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>

          <h1 className="font-display text-3xl font-bold text-plum mb-8">Checkout</h1>

          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 shadow-sm">{error}</div>}

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-5">
              {/* Delivery Address */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 border border-plum/5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-lg font-bold text-plum flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-gold" /> Delivery Address
                  </h2>
                  <button onClick={() => setEditAddress(!editAddress)} className="text-xs font-semibold text-rose-gold hover:text-plum transition-colors">
                    {editAddress ? "Done" : "Edit"}
                  </button>
                </div>
                {editAddress ? (
                  <div className="space-y-3">
                    <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Full Name" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                    <input type="text" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Phone" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                    <input type="text" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Address Line 1" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                    <input type="text" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Address Line 2 (Optional)" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                      <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                    </div>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="Pincode" className="w-full px-4 py-3 bg-ivory border border-plum/10 rounded-xl text-sm focus:outline-none focus:border-rose-gold/50 transition-colors" />
                  </div>
                ) : (
                  <div className="text-sm text-plum/70 space-y-1 bg-ivory p-4 rounded-2xl">
                    <p className="font-semibold text-plum">{address.name}</p>
                    <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.country} • <span className="font-medium text-plum">{address.phone}</span></p>
                  </div>
                )}
              </motion.div>

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 border border-plum/5 shadow-sm">
                <h2 className="font-display text-lg font-bold text-plum flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-rose-gold" /> Payment Method
                </h2>
                
                <div className="space-y-4">
                  {/* Razorpay Option */}
                  <div 
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "ONLINE" ? "bg-gradient-to-br from-ivory to-white border-[#C5A47E] shadow-sm" : "bg-transparent border-plum/10 hover:border-plum/20"
                    }`}
                  >
                    <div className="w-16 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1896 401" className="w-full h-full object-contain"><path fill="#3395FF" d="M122.63 105.7l-15.75 57.97 90.15-58.3-58.96 219.98 59.88.05L285.05.48"/><path fill="#072654" d="M25.6 232.92L.8 325.4h122.73l50.22-188.13L25.6 232.92m426.32-81.42c-3 11.15-8.78 19.34-17.4 24.57-8.6 5.22-20.67 7.84-36.25 7.84h-49.5l17.38-64.8h49.5c15.56 0 26.25 2.6 32.05 7.9 5.8 5.3 7.2 13.4 4.22 24.6m51.25-1.4c6.3-23.4 3.7-41.4-7.82-54-11.5-12.5-31.68-18.8-60.48-18.8H324.4l-66.5 248.1h53.67l26.8-100h35.2c7.9 0 14.12 1.3 18.66 3.8 4.55 2.6 7.22 7.1 8.04 13.6l9.58 82.6h57.5l-9.32-77c-1.9-17.2-9.77-27.3-23.6-30.3 17.63-5.1 32.4-13.6 44.3-25.4a92.6 92.6 0 0 0 24.44-42.5m130.46 86.4c-4.5 16.8-11.4 29.5-20.73 38.4-9.34 8.9-20.5 13.3-33.52 13.3-13.26 0-22.25-4.3-27-13-4.76-8.7-4.92-21.3-.5-37.8 4.42-16.5 11.47-29.4 21.17-38.7 9.7-9.3 21.04-13.95 34.06-13.95 13 0 21.9 4.5 26.4 13.43 4.6 8.97 4.7 21.8.2 38.5zm23.52-87.8l-6.72 25.1c-2.9-9-8.53-16.2-16.85-21.6-8.34-5.3-18.66-8-30.97-8-15.1 0-29.6 3.9-43.5 11.7-13.9 7.8-26.1 18.8-36.5 33-10.4 14.2-18 30.3-22.9 48.4-4.8 18.2-5.8 34.1-2.9 47.9 3 13.9 9.3 24.5 19 31.9 9.8 7.5 22.3 11.2 37.6 11.2a82.4 82.4 0 0 0 35.2-7.7 82.11 82.11 0 0 0 28.4-21.2l-7 26.16h51.9L709.3 149h-52zm238.65 0H744.87l-10.55 39.4h87.82l-116.1 100.3-9.92 37h155.8l10.55-39.4h-94.1l117.88-101.8m142.4 52c-4.67 17.4-11.6 30.48-20.75 39-9.15 8.6-20.23 12.9-33.24 12.9-27.2 0-36.14-17.3-26.86-51.9 4.6-17.2 11.56-30.13 20.86-38.84 9.3-8.74 20.57-13.1 33.82-13.1 13 0 21.78 4.33 26.3 13.05 4.52 8.7 4.48 21.67-.13 38.87m30.38-80.83c-11.95-7.44-27.2-11.16-45.8-11.16-18.83 0-36.26 3.7-52.3 11.1a113.09 113.09 0 0 0-41 32.06c-11.3 13.9-19.43 30.2-24.42 48.8-4.9 18.53-5.5 34.8-1.7 48.73 3.8 13.9 11.8 24.6 23.8 32 12.1 7.46 27.5 11.17 46.4 11.17 18.6 0 35.9-3.74 51.8-11.18 15.9-7.48 29.5-18.1 40.8-32.1 11.3-13.94 19.4-30.2 24.4-48.8 5-18.6 5.6-34.84 1.8-48.8-3.8-13.9-11.7-24.6-23.6-32.05m185.1 40.8l13.3-48.1c-4.5-2.3-10.4-3.5-17.8-3.5-11.9 0-23.3 2.94-34.3 8.9-9.46 5.06-17.5 12.2-24.3 21.14l6.9-25.9-15.07.06h-37l-47.7 176.7h52.63l24.75-92.37c3.6-13.43 10.08-24 19.43-31.5 9.3-7.53 20.9-11.3 34.9-11.3 8.6 0 16.6 1.97 24.2 5.9m146.5 41.1c-4.5 16.5-11.3 29.1-20.6 37.8-9.3 8.74-20.5 13.1-33.5 13.1s-21.9-4.4-26.6-13.2c-4.8-8.85-4.9-21.6-.4-38.36 4.5-16.75 11.4-29.6 20.9-38.5 9.5-8.97 20.7-13.45 33.7-13.45 12.8 0 21.4 4.6 26 13.9 4.6 9.3 4.7 22.2.28 38.7m36.8-81.4c-9.75-7.8-22.2-11.7-37.3-11.7-13.23 0-25.84 3-37.8 9.06-11.95 6.05-21.65 14.3-29.1 24.74l.18-1.2 8.83-28.1h-51.4l-13.1 48.9-.4 1.7-54 201.44h52.7l27.2-101.4c2.7 9.02 8.2 16.1 16.6 21.22 8.4 5.1 18.77 7.63 31.1 7.63 15.3 0 29.9-3.7 43.75-11.1 13.9-7.42 25.9-18.1 36.1-31.9 10.2-13.8 17.77-29.8 22.6-47.9 4.9-18.13 5.9-34.3 3.1-48.45-2.85-14.17-9.16-25.14-18.9-32.9m174.65 80.65c-4.5 16.7-11.4 29.5-20.7 38.3-9.3 8.86-20.5 13.27-33.5 13.27-13.3 0-22.3-4.3-27-13-4.8-8.7-4.9-21.3-.5-37.8 4.4-16.5 11.42-29.4 21.12-38.7 9.7-9.3 21.05-13.94 34.07-13.94 13 0 21.8 4.5 26.4 13.4 4.6 8.93 4.63 21.76.15 38.5zm23.5-87.85l-6.73 25.1c-2.9-9.05-8.5-16.25-16.8-21.6-8.4-5.34-18.7-8-31-8-15.1 0-29.68 3.9-43.6 11.7-13.9 7.8-26.1 18.74-36.5 32.9-10.4 14.16-18 30.3-22.9 48.4-4.85 18.17-5.8 34.1-2.9 47.96 2.93 13.8 9.24 24.46 19 31.9 9.74 7.4 22.3 11.14 37.6 11.14 12.3 0 24.05-2.56 35.2-7.7a82.3 82.3 0 0 0 28.33-21.23l-7 26.18h51.9l47.38-176.7h-51.9zm269.87.06l.03-.05h-31.9c-1.02 0-1.92.05-2.85.07h-16.55l-8.5 11.8-2.1 2.8-.9 1.4-67.25 93.68-13.9-109.7h-55.08l27.9 166.7-61.6 85.3h54.9l14.9-21.13c.42-.62.8-1.14 1.3-1.8l17.4-24.7.5-.7 77.93-110.5 65.7-93 .1-.06h-.03z"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#111111]">Razorpay (Online)</p>
                      <p className="text-xs text-[#111111]/60">Pay via UPI, Cards, NetBanking, Wallets</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${paymentMethod === "ONLINE" ? "border-[#C5A47E] bg-white" : "border-plum/20 bg-transparent"}`} />
                  </div>

                  {/* COD Option */}
                  <div 
                    onClick={() => setPaymentMethod("COD")}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === "COD" ? "bg-gradient-to-br from-ivory to-white border-[#C5A47E] shadow-sm" : "bg-transparent border-plum/10 hover:border-plum/20"
                    }`}
                  >
                    <div className="w-16 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-rose-gold p-2">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#111111]">Cash on Delivery (COD)</p>
                      <p className="text-xs text-[#111111]/60">Pay when your order arrives (+₹100 Shipping)</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-4 flex items-center justify-center ${paymentMethod === "COD" ? "border-[#C5A47E] bg-white" : "border-plum/20 bg-transparent"}`} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#111111] rounded-3xl p-6 sticky top-28 shadow-xl text-white">
                <h2 className="font-display text-lg font-bold mb-5 text-[#C5A47E]">Order Summary</h2>
                <div className="space-y-4 text-sm mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3 truncate max-w-[70%]">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="truncate text-white/70 group-hover:text-white transition-colors">{item.product.name} × {item.quantity}</span>
                      </div>
                      <span className="font-medium">₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex justify-between text-white/60">
                      <span>Shipping</span>
                      {paymentMethod === "COD" ? (
                        <span className="text-white font-medium">+ ₹100</span>
                      ) : (
                        <span className="text-rose-gold font-medium">FREE</span>
                      )}
                    </div>
                    {promoCode && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Promo: {promoCode}</span><span>Applied</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between font-display text-xl font-bold">
                      <span className="text-[#C5A47E]">Total</span><span>₹{(paymentMethod === "COD" ? total + 100 : total).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePayment} 
                  disabled={loading || !address.name || !address.phone || !address.line1 || !address.city || !address.pincode} 
                  className="w-full py-4 bg-gradient-to-r from-[#C5A47E] to-[#B38D64] text-[#111111] rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin text-[#111111]" /> <span className="loading-dots">Processing</span></>
                  ) : paymentMethod === "COD" ? (
                    "Place Order"
                  ) : (
                    "Place Order & Pay"
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  <Shield className="w-3 h-3" /> 100% Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center"><div className="w-8 h-8 border-2 border-plum border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
