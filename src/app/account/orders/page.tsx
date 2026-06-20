"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronRight } from "lucide-react";
import { orderApi } from "@/lib/api";
import { useAuth } from "@/lib/contexts/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusIcons: Record<string, any> = {
  PLACED: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  CONFIRMED: { icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50" },
  SHIPPED: { icon: Truck, color: "text-indigo-500", bg: "bg-indigo-50" },
  DELIVERED: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
  CANCELLED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
};

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    orderApi.list().then((d) => setOrders((d.orders || []).filter((o: any) => !(o.paymentMethod === "ONLINE" && (o.paymentStatus === "PENDING" || o.paymentStatus === "FAILED"))))).catch(() => {}).finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) { router.push("/account/"); return null; }

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-premium max-w-3xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-plum mb-8">My Orders</h1>
        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-plum/5 animate-pulse rounded-2xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 card-glass">
            <Package className="w-16 h-16 text-plum/10 mx-auto mb-4" />
            <h2 className="font-display text-xl text-plum mb-2">No orders yet</h2>
            <button onClick={() => router.push("/sarees/")} className="mt-4 px-6 py-3 bg-plum text-white rounded-xl text-sm">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order, i) => {
              const config = statusIcons[order.orderStatus] || statusIcons.PLACED;
              const Icon = config.icon;
              const media = order.orderItems?.[0]?.product?.media;
              const m = Array.isArray(media) ? media[0] : null;
              const url = (typeof m === 'string' ? m : m?.url) || "/placeholder-image.jpg";
              const firstImage = url === "" ? "/placeholder-image.jpg" : url;
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => router.push(`/account/orders/${order.id}`)} className="card-glass p-4 cursor-pointer hover:border-rose-gold/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-16 h-16 shrink-0 bg-plum/5 rounded-lg overflow-hidden relative border border-plum/10">
                        <img src={firstImage} alt="Product" className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-plum truncate">Order #{order.orderNumber}</p>
                        <p className="text-xs text-plum/40 truncate">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2 shrink-0 ml-4">
                      <div>
                        <p className="text-sm font-bold text-plum">₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>
                        <p className={`text-xs font-medium ${config.color}`}>{order.orderStatus}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-plum/20" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-plum/40">{order.orderItems?.length} item{order.orderItems?.length !== 1 ? "s" : ""} • Payment: {order.paymentMethod === "COD" ? "COD" : "PREPAID"}</div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main><Footer /></>
  );
}
