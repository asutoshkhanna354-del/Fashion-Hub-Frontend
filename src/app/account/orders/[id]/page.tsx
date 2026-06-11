"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Printer, MapPin, CheckCircle, Clock, LifeBuoy, Truck } from "lucide-react";
import { orderApi } from "@/lib/api";

const statusTimeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    orderApi.list().then((res) => {
      const found = res.orders.find((o: any) => o.id === params.id);
      if (found) setOrder(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.id]);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Receipt - ${order?.orderNumber}</title>
      <style>body{font-family:system-ui,-apple-system,sans-serif;padding:40px;color:#1E1533;font-size:13px}
      table{width:100%;border-collapse:collapse}th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
      th{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px}
      .header{text-align:center;margin-bottom:30px;border-bottom:2px solid #1E1533;padding-bottom:20px}
      </style></head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#1E1533] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!order) {
    return <div className="flex-1 text-center py-20"><p>Order not found</p></div>;
  }

  const addr = order.shippingAddress ? (typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress) : null;

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/account/orders")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#F8F6F3] transition-colors border border-[#1E1533]/[0.04]">
            <ArrowLeft className="w-5 h-5 text-[#1E1533]" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1E1533]">Order #{order.orderNumber}</h1>
            <p className="text-sm text-[#1E1533]/50">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="hidden sm:flex px-4 py-2 bg-white border border-[#1E1533]/[0.06] rounded-xl text-sm font-semibold items-center gap-2 hover:bg-[#F8F6F3] transition-colors">
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <a href="mailto:support@aditifashion.com" className="px-4 py-2 bg-[#1E1533] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
            <LifeBuoy className="w-4 h-4" /> Need Help?
          </a>
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        <div className="header hidden print:block">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>ADITI FASHION HUB</h1>
          <p>Order Receipt • #{order.orderNumber}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-[#1E1533]/[0.03] shadow-sm">
          <h3 className="text-sm font-bold text-[#1E1533] mb-6">Order Status</h3>
          <div className="flex items-center gap-2 relative">
            {statusTimeline.map((step, i) => {
              const currentIdx = statusTimeline.indexOf(order.orderStatus);
              const isDone = i <= currentIdx;
              const isCancelled = order.orderStatus === "CANCELLED";
              return (
                <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-sm ${
                    isCancelled ? "bg-red-100 text-red-500" : isDone ? "bg-gradient-to-br from-[#1E1533] to-[#1E1533]/90 text-white" : "bg-[#F8F6F3] text-[#1E1533]/20"
                  }`}>
                    {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <p className={`text-[10px] sm:text-xs font-bold ${isDone ? "text-[#1E1533]" : "text-[#1E1533]/30"}`}>{step}</p>
                </div>
              );
            })}
            <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-[#F8F6F3] -z-0">
              <div 
                className="h-full bg-[#1E1533] transition-all duration-500" 
                style={{ width: `${(Math.max(0, statusTimeline.indexOf(order.orderStatus)) / (statusTimeline.length - 1)) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-2xl p-6 border border-[#1E1533]/[0.03] shadow-sm">
              <h3 className="text-sm font-bold text-[#1E1533] mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.orderItems?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-[#1E1533]/[0.04] last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl bg-[#F8F6F3] flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#1E1533]/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1E1533] text-sm truncate">{item.product?.name || "Product"}</h4>
                      <p className="text-[11px] text-[#1E1533]/50 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1E1533]">₹{Number(item.total).toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-[#1E1533]/30">₹{Number(item.price).toLocaleString("en-IN")} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-[#1E1533] rounded-2xl p-6 shadow-sm text-white">
              <h3 className="text-sm font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60"><span>Subtotal</span><span>₹{(Number(order.totalAmount) + Number(order.discountAmount)).toLocaleString("en-IN")}</span></div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-[#C58F7A]"><span>Discount</span><span>-₹{Number(order.discountAmount).toLocaleString("en-IN")}</span></div>
                )}
                <div className="flex justify-between text-white/60"><span>Shipping</span><span className="text-[#C58F7A]">FREE</span></div>
                <div className="border-t border-white/10 pt-3 mt-1 flex justify-between font-display text-lg font-bold">
                  <span>Total</span><span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40">Payment Status</span>
                  <span className={`font-bold ${order.paymentStatus === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'}`}>{order.paymentStatus}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            {addr && (
              <div className="bg-white rounded-2xl p-6 border border-[#1E1533]/[0.03] shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#C58F7A]" />
                  <h3 className="text-sm font-bold text-[#1E1533]">Shipping Address</h3>
                </div>
                <div className="text-sm text-[#1E1533]/70 space-y-1">
                  <p className="font-bold text-[#1E1533]">{addr.name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="pt-2">{addr.phone}</p>
                </div>
              </div>
            )}

            {/* Tracking Widget */}
            {order.trackingId && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-indigo-900">Track Your Package</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-3 border border-indigo-100/50">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Courier Partner</p>
                    <p className="text-sm font-semibold text-indigo-900">{order.courierName || "Standard Shipping"}</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-indigo-100/50">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Tracking ID (AWB)</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-indigo-900 font-mono tracking-wider">{order.trackingId}</p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingId);
                          alert("Tracking ID copied to clipboard!");
                        }}
                        className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md hover:bg-indigo-200 transition-colors"
                      >
                        COPY
                      </button>
                    </div>
                  </div>
                  <a 
                    href={order.courierName?.toLowerCase().includes("delhivery") ? `https://www.delhivery.com/tracking?id=${order.trackingId}` : order.courierName?.toLowerCase().includes("bluedart") ? `https://www.bluedart.com/tracking` : `https://www.google.com/search?q=${order.courierName}+tracking`}
                    target="_blank" rel="noopener noreferrer"
                    className="block w-full py-3 text-center bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                  >
                    TRACK ON {order.courierName ? order.courierName.toUpperCase() : "COURIER WEBSITE"}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
