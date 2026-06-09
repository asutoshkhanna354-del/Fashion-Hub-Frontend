"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Package } from "lucide-react";
import { paymentApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const checkStatus = async () => {
      try {
        const data = await paymentApi.status(orderId);
        setOrder(data.order);
      } catch {}
      setLoading(false);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const statusConfig: Record<string, any> = {
    SUCCESS: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Payment Successful!", desc: "Your order has been confirmed." },
    PENDING: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Payment Processing", desc: "Please wait while we confirm your payment." },
    FAILED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Payment Failed", desc: "Something went wrong. Please try again." },
  };

  const status = order?.paymentStatus || "PENDING";
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-glass p-8 max-w-md w-full mx-4 text-center">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="w-16 h-16 bg-plum/5 rounded-full mx-auto" />
              <div className="h-6 bg-plum/5 rounded w-2/3 mx-auto" />
            </div>
          ) : (
            <>
              <div className={`w-20 h-20 rounded-full ${config.bg} mx-auto mb-4 flex items-center justify-center`}>
                <Icon className={`w-10 h-10 ${config.color}`} />
              </div>
              <h1 className="font-display text-2xl font-bold text-plum mb-1">{config.label}</h1>
              <p className="text-plum/50 text-sm mb-6">{config.desc}</p>
              {order && (
                <div className="text-left bg-ivory/60 rounded-xl p-4 mb-6 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-plum/50">Order</span><span className="font-medium text-plum">{order.orderNumber}</span></div>
                  <div className="flex justify-between"><span className="text-plum/50">Amount</span><span className="font-medium text-plum">₹{Number(order.totalAmount).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between"><span className="text-plum/50">Status</span><span className={`font-medium ${config.color}`}>{status}</span></div>
                </div>
              )}
              <div className="space-y-3">
                {status === "SUCCESS" && (
                  <button onClick={() => router.push("/account/orders/")} className="w-full py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                    <Package className="w-4 h-4" /> View My Orders
                  </button>
                )}
                <button onClick={() => router.push("/")} className="w-full py-3 border border-plum/10 text-plum rounded-xl text-sm font-medium hover:bg-ivory transition-colors">
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-plum border-t-transparent rounded-full" /></div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
