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

function CheckoutContent() {
  const { items, total, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoCode = searchParams.get("promo") || undefined;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  
  // Payment Modal State
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  
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

  // Poll for payment status when modal is open
  useEffect(() => {
    if (!activeOrderId || !paymentUrl) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await paymentApi.status(activeOrderId);
        const status = res.order?.paymentStatus;
        
        if (status === "SUCCESS" || status === "FAILED") {
          clearInterval(intervalId);
          setPaymentUrl(null);
          clearCart();
          router.push(`/checkout/status?order_id=${activeOrderId}`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeOrderId, paymentUrl, router, clearCart]);

  if (!isLoggedIn) { router.push("/account/"); return null; }
  if (items.length === 0 && !activeOrderId) { router.push("/cart/"); return null; }

  const handlePayment = async () => {
    setLoading(true); setError("");
    try {
      const orderData = await orderApi.create(promoCode, address);
      const orderId = orderData.order.id;
      setActiveOrderId(orderId);
      
      const payData = await paymentApi.create(orderId);
      if (payData.paymentUrl) {
        setPaymentUrl(payData.paymentUrl);
      } else {
        setError("Payment creation failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
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
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-ivory to-white rounded-2xl border-2 border-plum shadow-sm cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-plum to-plum/80 flex items-center justify-center text-xl font-bold text-white shadow-inner">₹</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-plum">UPI / QR Code</p>
                    <p className="text-xs text-plum/50">Pay via Google Pay, PhonePe, Paytm</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-4 border-plum flex items-center justify-center bg-white" />
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="bg-plum rounded-3xl p-6 sticky top-28 shadow-xl text-white">
                <h2 className="font-display text-lg font-bold mb-5 text-white">Order Summary</h2>
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
                      <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePayment} 
                  disabled={loading || !address.name || !address.phone || !address.line1 || !address.city || !address.pincode} 
                  className="w-full py-4 bg-gradient-to-r from-rose-gold to-[#B89CCF] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
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

      {/* Payment Iframe Modal */}
      <AnimatePresence>
        {paymentUrl && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
              style={{ height: '85vh', maxHeight: '700px' }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#1E1533]/[0.04] flex items-center justify-between bg-[#F8F6F3]">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h3 className="font-display font-bold text-[#1E1533] text-sm">Secure Checkout</h3>
                    <p className="text-[10px] text-[#1E1533]/40">Waiting for payment confirmation...</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel the payment?")) {
                      setPaymentUrl(null);
                      router.push(`/checkout/status?order_id=${activeOrderId}`);
                    }
                  }} 
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-red-50 text-[#1E1533]/40 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 relative bg-white">
                {/* Fallback text if iframe doesn't load/is blocked */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-0">
                  <Loader2 className="w-8 h-8 text-rose-gold animate-spin mb-4" />
                  <p className="text-sm font-semibold text-plum">Loading Payment Gateway</p>
                  <p className="text-xs text-plum/50 mt-2 max-w-[250px]">If the payment page doesn't appear, your browser might be blocking iframes.</p>
                  <a 
                    href={paymentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-6 px-5 py-2.5 bg-plum text-white rounded-xl text-xs font-semibold"
                    onClick={(e) => {
                      // Don't let the link close the modal immediately, keep polling
                    }}
                  >
                    Open Payment in New Tab
                  </a>
                </div>

                <iframe 
                  src={paymentUrl} 
                  className="absolute inset-0 w-full h-full z-10 border-none bg-white"
                  title="Secure Payment"
                  allow="payment"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
