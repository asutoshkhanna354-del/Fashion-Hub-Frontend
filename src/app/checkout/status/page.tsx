"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Package, Printer, MapPin, ChevronRight, FileText } from "lucide-react";
import { paymentApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

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
      .total{font-size:20px;font-weight:700;margin-top:12px}
      </style></head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const statusConfig: Record<string, any> = {
    SUCCESS: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", label: "Payment Successful!", desc: "Your order has been confirmed and is being processed." },
    PENDING: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Payment Processing", desc: "Please wait while we confirm your payment." },
    FAILED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Payment Failed", desc: "Something went wrong. Please try again or contact support." },
  };

  const status = order?.paymentStatus || "PENDING";
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  const addr = order?.shippingAddress ? (typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress) : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F6F3] pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-[#1E1533]/[0.03] overflow-hidden">
            
            {/* Status Header */}
            <div className={`p-8 text-center border-b border-[#1E1533]/[0.04] ${status === 'SUCCESS' ? 'bg-emerald-50/50' : status === 'FAILED' ? 'bg-red-50/50' : 'bg-amber-50/50'}`}>
              <div className={`w-20 h-20 rounded-2xl ${config.bg} mx-auto mb-5 flex items-center justify-center shadow-sm`}>
                <Icon className={`w-10 h-10 ${config.color}`} />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#1E1533] mb-2">{config.label}</h1>
              <p className="text-[#1E1533]/60 text-sm max-w-sm mx-auto">{config.desc}</p>
            </div>

            {loading ? (
              <div className="p-8 animate-pulse space-y-6">
                <div className="h-4 bg-[#1E1533]/5 rounded w-1/3" />
                <div className="space-y-3">
                  <div className="h-16 bg-[#1E1533]/5 rounded-xl" />
                  <div className="h-16 bg-[#1E1533]/5 rounded-xl" />
                </div>
              </div>
            ) : order ? (
              <div className="p-8">
                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                  {status === "SUCCESS" && (
                    <>
                      <button onClick={handlePrint} className="flex-1 py-3 bg-[#F8F6F3] text-[#1E1533] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#1E1533]/5 transition-colors">
                        <Printer className="w-4 h-4" /> Print Receipt
                      </button>
                      <button onClick={() => router.push(`/account/orders/${order.id}`)} className="flex-1 py-3 bg-[#1E1533] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        View Order <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {status === "FAILED" && (
                    <button onClick={() => router.push("/checkout")} className="w-full py-3 bg-[#1E1533] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                      Try Again
                    </button>
                  )}
                </div>

                {/* Printable Receipt Area */}
                <div ref={printRef} className="space-y-6">
                  <div className="header hidden print:block">
                    <h1 style={{ fontSize: "24px", fontWeight: 700 }}>ADITI FASHION HUB</h1>
                    <p>Order Receipt • #{order.orderNumber}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <div>
                      <h3 className="text-xs font-bold text-[#1E1533]/40 uppercase tracking-wider mb-3">Order Info</h3>
                      <div className="bg-[#F8F6F3] rounded-2xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[#1E1533]/60">Order No:</span><span className="font-semibold text-[#1E1533]">{order.orderNumber}</span></div>
                        <div className="flex justify-between"><span className="text-[#1E1533]/60">Date:</span><span className="font-medium text-[#1E1533]">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span></div>
                        <div className="flex justify-between"><span className="text-[#1E1533]/60">Payment:</span><span className={`font-semibold ${config.color}`}>{status}</span></div>
                        {order.utr && <div className="flex justify-between"><span className="text-[#1E1533]/60">UTR:</span><span className="font-mono text-xs">{order.utr}</span></div>}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {addr && (
                      <div>
                        <h3 className="text-xs font-bold text-[#1E1533]/40 uppercase tracking-wider mb-3">Shipping To</h3>
                        <div className="bg-[#F8F6F3] rounded-2xl p-4 text-sm text-[#1E1533]/70 flex gap-3 h-[120px]">
                          <MapPin className="w-4 h-4 text-[#C58F7A] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[#1E1533] mb-1">{addr.name}</p>
                            <p className="text-xs">{addr.line1}</p>
                            {addr.line2 && <p className="text-xs">{addr.line2}</p>}
                            <p className="text-xs">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-xs mt-1 text-[#1E1533]/50">{addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-xs font-bold text-[#1E1533]/40 uppercase tracking-wider mb-3">Items</h3>
                    <div className="space-y-2">
                      {order.orderItems?.map((item: any, i: number) => (
                        <div key={i} className="bg-white border border-[#1E1533]/[0.04] rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#F8F6F3] flex items-center justify-center">
                              <Package className="w-4 h-4 text-[#1E1533]/20" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#1E1533]">{item.product?.name || "Product"}</p>
                              <p className="text-[10px] text-[#1E1533]/50">Qty: {item.quantity} • ₹{Number(item.price).toLocaleString("en-IN")} each</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-[#1E1533]">₹{Number(item.total).toLocaleString("en-IN")}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-[#1E1533]/[0.06] pt-4 mt-2">
                    <div className="w-full max-w-xs ml-auto space-y-2 text-sm">
                      <div className="flex justify-between text-[#1E1533]/60"><span>Subtotal</span><span>₹{(Number(order.totalAmount) + Number(order.discountAmount)).toLocaleString("en-IN")}</span></div>
                      {Number(order.discountAmount) > 0 && (
                        <div className="flex justify-between text-emerald-600 font-medium"><span>Discount</span><span>-₹{Number(order.discountAmount).toLocaleString("en-IN")}</span></div>
                      )}
                      <div className="flex justify-between text-[#1E1533]/60"><span>Shipping</span><span className="text-emerald-600">FREE</span></div>
                      <div className="border-t border-[#1E1533]/[0.06] pt-2 mt-2 flex justify-between text-lg font-bold text-[#1E1533]">
                        <span>Total Paid</span><span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : null}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#1E1533] border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
