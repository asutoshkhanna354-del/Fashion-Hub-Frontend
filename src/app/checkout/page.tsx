"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, CreditCard, ArrowLeft, Shield } from "lucide-react";
import { useCart } from "@/lib/contexts/cart-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { orderApi, paymentApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function CheckoutContent() {
  const { items, total } = useCart();
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

  if (!isLoggedIn) { router.push("/account/"); return null; }
  if (items.length === 0) { router.push("/cart/"); return null; }

  const handlePayment = async () => {
    setLoading(true); setError("");
    try {
      const orderData = await orderApi.create(promoCode, address);
      const orderId = orderData.order.id;
      const payData = await paymentApi.create(orderId);
      if (payData.paymentUrl) {
        window.location.href = payData.paymentUrl;
      } else {
        setError("Payment creation failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="container-premium max-w-3xl mx-auto">
          <button onClick={() => router.push("/cart/")} className="flex items-center gap-1 text-plum/50 hover:text-plum text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </button>

          <h1 className="font-display text-3xl font-bold text-plum mb-8">Checkout</h1>

          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-5">
              {/* Delivery Address */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-bold text-plum flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-gold" /> Delivery Address
                  </h2>
                  <button onClick={() => setEditAddress(!editAddress)} className="text-xs text-rose-gold hover:underline">
                    {editAddress ? "Done" : "Edit"}
                  </button>
                </div>
                {editAddress ? (
                  <div className="space-y-3">
                    <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Full Name" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                    <input type="text" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Phone" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                    <input type="text" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Address Line 1" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                    <input type="text" value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Address Line 2 (Optional)" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                      <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                    </div>
                    <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="Pincode" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                  </div>
                ) : (
                  <div className="text-sm text-plum/70 space-y-0.5">
                    <p className="font-semibold text-plum">{address.name}</p>
                    <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.country} • {address.phone}</p>
                  </div>
                )}
              </motion.div>

              {/* Payment Method */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glass p-5">
                <h2 className="font-display text-lg font-bold text-plum flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-rose-gold" /> Payment Method
                </h2>
                <div className="flex items-center gap-3 p-3 bg-ivory/60 rounded-xl border-2 border-rose-gold/20">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl font-bold text-plum">₹</div>
                  <div>
                    <p className="text-sm font-semibold text-plum">UPI — Pay by any UPI App</p>
                    <p className="text-xs text-plum/40">Google Pay, PhonePe, Paytm, BHIM & more</p>
                  </div>
                  <div className="ml-auto w-5 h-5 rounded-full border-2 border-rose-gold flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-rose-gold" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="card-glass p-5 sticky top-28">
                <h2 className="font-display text-lg font-bold text-plum mb-3">Order Summary</h2>
                <div className="space-y-2 text-sm mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-plum/60">
                      <span className="truncate max-w-[60%]">{item.product.name} × {item.quantity}</span>
                      <span>₹{(Number(item.product.price) * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <div className="border-t border-plum/5 pt-2 flex justify-between text-plum/60">
                    <span>Shipping</span><span className="text-green-600">FREE</span>
                  </div>
                  {promoCode && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo: {promoCode}</span><span>Applied</span>
                    </div>
                  )}
                  <div className="border-t border-plum/5 pt-2 flex justify-between font-bold text-plum text-lg">
                    <span>Total</span><span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button onClick={handlePayment} disabled={loading} className="w-full py-4 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg">
                  {loading ? "Processing..." : "Pay with UPI"}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-plum/30">
                  <Shield className="w-3 h-3" /> Secure & encrypted payment
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
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-plum border-t-transparent rounded-full" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
