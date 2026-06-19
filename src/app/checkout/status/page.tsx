"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Package, Printer, MapPin, ChevronRight, FileText } from "lucide-react";
import Image from "next/image";
import { paymentApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusTimeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id") || searchParams.get("rzp_order_id");
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
      <style>body{font-family:system-ui,-apple-system,sans-serif;padding:40px;color:#111111;font-size:13px}
      table{width:100%;border-collapse:collapse}th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
      th{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px}
      .header{text-align:center;margin-bottom:30px;border-bottom:2px solid #111111;padding-bottom:20px}
      .total{font-size:20px;font-weight:700;margin-top:12px}
      </style></head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const statusConfig: Record<string, any> = {
    SUCCESS: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", label: "Payment Successful!", desc: "Your order has been confirmed and is being processed." },
    COD: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", label: "Order Placed Successfully!", desc: "Your COD order has been confirmed and will be shipped soon." },
    PENDING: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Payment Processing", desc: "Please wait while we confirm your payment." },
    FAILED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Payment Failed", desc: "Something went wrong. Please try again or contact support." },
  };

  let status = order?.paymentStatus || "PENDING";
  // Force COD status if URL param is present
  if (searchParams.get("method") === "COD") {
    status = "COD";
  } else if (status === "PENDING" && order?.orderStatus === "CONFIRMED") {
    status = "COD";
  }
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  const addr = order?.shippingAddress ? (typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress) : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F6F3] pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-[#111111]/[0.03] overflow-hidden">
            
            {/* Status Header */}
            <div className={`p-8 text-center border-b border-[#111111]/[0.04] ${status === 'SUCCESS' ? 'bg-emerald-50/50' : status === 'FAILED' ? 'bg-red-50/50' : 'bg-amber-50/50'}`}>
              <div className={`w-20 h-20 rounded-2xl ${config.bg} mx-auto mb-5 flex items-center justify-center shadow-sm`}>
                <Icon className={`w-10 h-10 ${config.color}`} />
              </div>
              <h1 className="font-display text-2xl font-bold text-[#111111] mb-2">{config.label}</h1>
              <p className="text-[#111111]/60 text-sm max-w-sm mx-auto">{config.desc}</p>
            </div>

            {loading ? (
              <div className="p-8 animate-pulse space-y-6">
                <div className="h-4 bg-[#111111]/5 rounded w-1/3" />
                <div className="space-y-3">
                  <div className="h-16 bg-[#111111]/5 rounded-xl" />
                  <div className="h-16 bg-[#111111]/5 rounded-xl" />
                </div>
              </div>
            ) : order ? (
              <div className="p-8">
                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                  {(status === "SUCCESS" || status === "COD") && (
                    <>
                      <button onClick={handlePrint} className="flex-1 py-3 bg-[#F8F6F3] text-[#111111] rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#111111]/5 transition-colors">
                        <Printer className="w-4 h-4" /> Print Receipt
                      </button>
                      <button onClick={() => router.push(`/account/orders/${order.id}`)} className="flex-1 py-3 bg-[#111111] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                        View Order <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {status === "FAILED" && (
                    <button onClick={() => router.push("/checkout")} className="w-full py-3 bg-[#111111] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                      Try Again
                    </button>
                  )}
                </div>

                {/* Printable Receipt Area */}
                <div ref={printRef} className="space-y-6">
                  <div className="header hidden print:block">
                    <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Solanki Vastra Bhandar</h1>
                    <p>Order Receipt • #{order.orderNumber}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Order Info */}
                    <div>
                      <h3 className="text-xs font-bold text-[#111111]/40 uppercase tracking-wider mb-3">Order Info</h3>
                      <div className="bg-[#F8F6F3] rounded-2xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-[#111111]/60">Order No:</span><span className="font-semibold text-[#111111]">{order.orderNumber}</span></div>
                        <div className="flex justify-between"><span className="text-[#111111]/60">Date:</span><span className="font-medium text-[#111111]">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span></div>
                        <div className="flex justify-between"><span className="text-[#111111]/60">Payment:</span><span className={`font-semibold ${config.color}`}>{status}</span></div>
                        {order.utr && <div className="flex justify-between"><span className="text-[#111111]/60">UTR:</span><span className="font-mono text-xs">{order.utr}</span></div>}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {addr && (
                      <div>
                        <h3 className="text-xs font-bold text-[#111111]/40 uppercase tracking-wider mb-3">Shipping To</h3>
                        <div className="bg-[#F8F6F3] rounded-2xl p-4 text-sm text-[#111111]/70 flex gap-3 h-full">
                          <MapPin className="w-4 h-4 text-[#C5A47E] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-[#111111] mb-1">{addr.name}</p>
                            <p className="text-xs">{addr.line1}</p>
                            {addr.line2 && <p className="text-xs">{addr.line2}</p>}
                            <p className="text-xs">{addr.city}, {addr.state} - {addr.pincode}</p>
                            <p className="text-xs mt-1 text-[#111111]/50">{addr.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status Timeline */}
                  <div>
                    <h3 className="text-xs font-bold text-[#111111]/40 uppercase tracking-wider mb-3">Order Status</h3>
                    <div className="bg-[#F8F6F3] rounded-2xl p-4 sm:p-6 relative">
                      <div className="flex items-center justify-between relative z-10 px-2 sm:px-6">
                        {statusTimeline.map((step, i) => {
                          const dispStatus = (status === "COD" && order?.orderStatus === "PLACED") ? "CONFIRMED" : order?.orderStatus || "PLACED";
                          const currentIdx = statusTimeline.indexOf(dispStatus);
                          const isDone = i <= currentIdx;
                          const isCancelled = dispStatus === "CANCELLED";
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold mb-2 shadow-sm ${
                                isCancelled ? "bg-red-100 text-red-500" : isDone ? "bg-gradient-to-br from-[#111111] to-[#111111]/90 text-white" : "bg-white text-[#111111]/20 border border-[#111111]/[0.06]"
                              }`}>
                                {isDone ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : i + 1}
                              </div>
                              <p className={`text-[9px] sm:text-[10px] font-bold ${isDone ? "text-[#111111]" : "text-[#111111]/30"}`}>{step}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute top-7 sm:top-10 left-[15%] right-[15%] sm:left-[12%] sm:right-[12%] h-0.5 bg-white -z-0">
                        {(() => {
                          const dispStatus = (status === "COD" && order?.orderStatus === "PLACED") ? "CONFIRMED" : order?.orderStatus || "PLACED";
                          const currentIdx = Math.max(0, statusTimeline.indexOf(dispStatus));
                          return (
                            <div 
                              className="h-full bg-[#111111] transition-all duration-500" 
                              style={{ width: `${(currentIdx / (statusTimeline.length - 1)) * 100}%` }} 
                            />
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-xs font-bold text-[#111111]/40 uppercase tracking-wider mb-3">Items</h3>
                    <div className="space-y-2">
                      {order.orderItems?.map((item: any, i: number) => (
                        <div key={i} className="bg-white border border-[#111111]/[0.04] rounded-xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F8F6F3] flex items-center justify-center relative flex-shrink-0">
                              {item.product?.media && item.product.media.length > 0 ? (() => {
                                const m = Array.isArray(item.product.media) ? item.product.media[0] : null;
                                const url = (typeof m === 'string' ? m : m?.url) || '';
                                const fullUrl = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${url}`;
                                return <Image src={fullUrl} alt="" fill className="object-cover" sizes="40px" />;
                              })() : (
                                <Package className="w-4 h-4 text-[#111111]/20" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[#111111]">{item.product?.name || "Product"}</p>
                              <p className="text-[10px] text-[#111111]/50">Qty: {item.quantity} • ₹{Number(item.price).toLocaleString("en-IN")} each</p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-[#111111]">₹{Number(item.total).toLocaleString("en-IN")}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-[#111111]/[0.06] pt-4 mt-2">
                    <div className="w-full max-w-xs ml-auto space-y-2 text-sm">
                      {(() => {
                        const isCOD = status === "COD";
                        const subtotal = order.orderItems?.reduce((acc: number, item: any) => acc + Number(item.total), 0) || (Number(order.totalAmount) + Number(order.discountAmount || 0));
                        const shipping = isCOD ? 100 : 0;
                        const totalDisp = subtotal + shipping - Number(order.discountAmount || 0);
                        return (
                          <>
                            <div className="flex justify-between text-[#111111]/60">
                              <span>Subtotal</span>
                              <span className="font-medium text-[#111111]">₹{subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            {Number(order.discountAmount) > 0 && (
                              <div className="flex justify-between text-emerald-600 font-medium">
                                <span>Discount</span><span>-₹{Number(order.discountAmount).toLocaleString("en-IN")}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-[#111111]/60">
                              <span>Shipping</span>
                              {shipping > 0 ? (
                                <span className="font-medium text-[#111111]">₹{shipping}</span>
                              ) : (
                                <span className="font-medium text-emerald-600">FREE</span>
                              )}
                            </div>
                            <div className="border-t border-[#111111]/[0.06] pt-2 mt-2 flex justify-between text-lg font-bold text-[#111111]">
                              <span>{isCOD ? "Total Amount" : "Total Paid"}</span><span>₹{totalDisp.toLocaleString("en-IN")}</span>
                            </div>
                          </>
                        );
                      })()}
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
    <Suspense fallback={<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}

