"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, ArrowLeft, Shield, X, Loader2 } from "lucide-react";
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
        // Extract original orderId from razorpayOrderId if possible, or just send them to status
        // Since we don't have the original orderId in URL, we can fetch it or just pass rzpOrderId
        router.push(`/checkout/status?rzp_order_id=${rzpOrderId}`);
      }).catch((err: any) => {
        setError(err.message || "Payment verification failed");
        setLoading(false);
      });
    }
  }, [searchParams]);

  if (!isLoggedIn) { router.push("/account/"); return null; }
  
  // Prevent redirect if we are currently loading/verifying payment from query params
  const isVerifying = searchParams.get("razorpay_payment_id") !== null;
  if (items.length === 0 && !isVerifying) { router.push("/cart/"); return null; }

  const handlePayment = async () => {
    setLoading(true); setError("");
    try {
      const orderData = await orderApi.create(promoCode, address);
      const orderId = orderData.order.id;
      
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
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-ivory to-white rounded-2xl border-2 border-[#C5A47E] shadow-sm cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#111111] to-[#222222] flex items-center justify-center text-xl font-bold text-[#C5A47E] shadow-inner">₹</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#111111]">Razorpay</p>
                    <p className="text-xs text-[#111111]/60">Pay via UPI, Cards, NetBanking, Wallets</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-4 border-[#C5A47E] flex items-center justify-center bg-white" />
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
                      <span>Shipping</span><span className="text-rose-gold font-medium">FREE</span>
                    </div>
                    {promoCode && (
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Promo: {promoCode}</span><span>Applied</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-3 flex justify-between font-display text-xl font-bold">
                      <span className="text-[#C5A47E]">Total</span><span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePayment} 
                  disabled={loading || !address.name || !address.phone || !address.line1 || !address.city || !address.pincode} 
                  className="w-full py-4 bg-gradient-to-r from-[#C5A47E] to-[#B38D64] text-[#111111] rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin text-[#111111]" /> Processing...</>
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
