"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Package, Printer, MapPin, CheckCircle, Clock, LifeBuoy, Truck, Star, X, Upload, PlayCircle } from "lucide-react";
import { orderApi, uploadApi } from "@/lib/api";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusTimeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [media, setMedia] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tracking, setTracking] = useState<any>(null);

  useEffect(() => {
    orderApi.list().then(async (res) => {
      const found = res.orders.find((o: any) => o.id === params.id);
      if (found) {
        setOrder(found);
        if (found.trackingId) {
          try {
            const token = localStorage.getItem("token");
            const trkRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/orders/${found.id}/tracking`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const trkData = await trkRes.json();
            if (trkData.status && trkData.tracking) {
              setTracking(trkData.tracking);
            }
          } catch(e) {}
        }
      }
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
      <style>body{font-family:system-ui,-apple-system,sans-serif;padding:40px;color:#111111;font-size:13px}
      table{width:100%;border-collapse:collapse}th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
      th{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px}
      .header{text-align:center;margin-bottom:30px;border-bottom:2px solid #111111;padding-bottom:20px}
      </style></head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadApi.uploadFile(file);
      const isVideo = file.type.startsWith("video/");
      setMedia([...media, { type: isVideo ? "video" : "image", url, thumb: isVideo ? "" : url }]);
    } catch (error) {
      alert("Failed to upload media");
    }
    setUploading(false);
  };

  const submitReview = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://Solanki-Vastra-backend.onrender.com/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: reviewProduct.id,
          rating,
          title,
          comment,
          media
        })
      });
      const data = await res.json();
      if (data.status) {
        alert("Review submitted successfully!");
        setReviewModalOpen(false);
        setReviewProduct(null);
        setTitle("");
        setComment("");
        setRating(5);
        setMedia([]);
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      alert("Error submitting review");
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="flex-1 flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!order) {
    return <div className="flex-1 text-center py-20"><p>Order not found</p></div>;
  }

  const addr = order.shippingAddress ? (typeof order.shippingAddress === "string" ? JSON.parse(order.shippingAddress) : order.shippingAddress) : null;

  return (
    <><Header />
    <main className="min-h-screen bg-[#F8F6F3] pt-28 pb-20">
      <div className="container-premium max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/account/orders")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-[#F8F6F3] transition-colors border border-[#111111]/[0.04]">
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-[#111111]">Order #{order.orderNumber}</h1>
            <p className="text-sm text-[#111111]/50">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="hidden sm:flex px-4 py-2 bg-white border border-[#111111]/[0.06] rounded-xl text-sm font-semibold items-center gap-2 hover:bg-[#F8F6F3] transition-colors">
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <a href="mailto:support@solankivastrabhandar.com" className="px-4 py-2 bg-[#111111] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
            <LifeBuoy className="w-4 h-4" /> Need Help?
          </a>
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        <div className="header hidden print:block">
          <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Solanki Vastra Bhandar</h1>
          <p>Order Receipt • #{order.orderNumber}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
          <h3 className="text-sm font-bold text-[#111111] mb-6">Order Status</h3>
          <div className="flex items-center gap-2 relative">
            {statusTimeline.map((step, i) => {
              const currentIdx = statusTimeline.indexOf(order.orderStatus);
              const isDone = i <= currentIdx;
              const isCancelled = order.orderStatus === "CANCELLED";
              return (
                <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 shadow-sm ${
                    isCancelled ? "bg-red-100 text-red-500" : isDone ? "bg-gradient-to-br from-[#111111] to-[#111111]/90 text-white" : "bg-[#F8F6F3] text-[#111111]/20"
                  }`}>
                    {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <p className={`text-[10px] sm:text-xs font-bold ${isDone ? "text-[#111111]" : "text-[#111111]/30"}`}>{step}</p>
                </div>
              );
            })}
            <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-[#F8F6F3] -z-0">
              <div 
                className="h-full bg-[#111111] transition-all duration-500" 
                style={{ width: `${(Math.max(0, statusTimeline.indexOf(order.orderStatus)) / (statusTimeline.length - 1)) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
              <h3 className="text-sm font-bold text-[#111111] mb-4">Items Ordered</h3>
              <div className="space-y-3">
                {order.orderItems?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-[#111111]/[0.04] last:border-0 last:pb-0">
                    <div className="w-16 h-16 rounded-xl bg-[#F8F6F3] flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#111111]/20" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#111111] text-sm truncate">{item.product?.name || "Product"}</h4>
                      <p className="text-[11px] text-[#111111]/50 mt-0.5">Qty: {item.quantity}</p>
                      {order.orderStatus === "DELIVERED" && (
                        <button 
                          onClick={() => { setReviewProduct(item.product); setReviewModalOpen(true); }}
                          className="mt-2 text-[10px] uppercase tracking-wider font-bold text-[#C5A47E] hover:underline"
                        >
                          Leave a Review
                        </button>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#111111]">₹{Number(item.total).toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-[#111111]/30">₹{Number(item.price).toLocaleString("en-IN")} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-[#111111] rounded-2xl p-6 shadow-sm text-white">
              <h3 className="text-sm font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60"><span>Subtotal</span><span>₹{(Number(order.totalAmount) + Number(order.discountAmount)).toLocaleString("en-IN")}</span></div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-[#C5A47E]"><span>Discount</span><span>-₹{Number(order.discountAmount).toLocaleString("en-IN")}</span></div>
                )}
                <div className="flex justify-between text-white/60"><span>Shipping</span><span className="text-[#C5A47E]">FREE</span></div>
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
              <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-[#C5A47E]" />
                  <h3 className="text-sm font-bold text-[#111111]">Shipping Address</h3>
                </div>
                <div className="text-sm text-[#111111]/70 space-y-1">
                  <p className="font-bold text-[#111111]">{addr.name}</p>
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="pt-2">{addr.phone}</p>
                </div>
              </div>
            )}

            {/* Tracking Widget */}
            {order.trackingId && (
              <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5 text-[#C5A47E]" />
                  <h3 className="text-sm font-bold text-[#111111]">Live Order Tracking</h3>
                </div>
                <div className="bg-[#F8F6F3] rounded-xl p-5 border border-[#111111]/10">
                  <div className="mb-4 pb-4 border-b border-[#111111]/[0.04]">
                    <p className="text-xs text-[#111111]/50 mb-1">Tracking ID: <span className="font-bold text-[#111111]">{order.trackingId}</span></p>
                    <p className="text-sm font-bold text-[#111111]">{tracking ? tracking.statusDescription : "Fetching tracking status..."}</p>
                  </div>
                  {tracking?.events ? (
                    <div className="space-y-4">
                      {tracking.events.map((ev: any, idx: number) => (
                        <div key={idx} className="flex gap-4 relative">
                          {idx !== tracking.events.length - 1 && (
                            <div className="absolute left-[9px] top-6 bottom-[-16px] w-0.5 bg-[#111111]/10" />
                          )}
                          <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${idx === 0 ? "bg-[#C5A47E] shadow-md" : "bg-[#111111]/20"}`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                          <div>
                            <p className={`text-sm font-bold ${idx === 0 ? "text-[#111111]" : "text-[#111111]/60"}`}>{ev.description}</p>
                            <p className="text-[11px] text-[#111111]/40">{new Date(ev.date).toLocaleString()} • {ev.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                     <div className="text-sm text-[#111111]/40 py-4 text-center animate-pulse">Loading tracking history...</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModalOpen && reviewProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-[#111111]/5 flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-[#111111]">Write a Review</h3>
                <button onClick={() => setReviewModalOpen(false)} className="text-[#111111]/40 hover:text-[#111111]"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-[#111111]/60 mb-2">How would you rate {reviewProduct.name}?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)} className="p-1 hover:scale-110 transition-transform">
                        <Star className={`w-8 h-8 ${s <= rating ? "fill-[#C5A47E] text-[#C5A47E]" : "text-[#111111]/10"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1">Review Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summary of your experience" className="w-full px-4 py-2 border border-[#111111]/10 rounded-xl text-sm focus:outline-none focus:border-[#C5A47E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1">Your Review</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="What did you like about this product?" className="w-full px-4 py-2 border border-[#111111]/10 rounded-xl text-sm focus:outline-none focus:border-[#C5A47E] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-2">Add Photo or Video (Optional)</label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {media.map((m, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8F6F3]">
                        {m.type === "video" ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10"><PlayCircle className="w-6 h-6 text-[#111111]/50" /></div>
                        ) : (
                          <Image src={m.url.startsWith("http") ? m.url : `https://Solanki-Vastra-backend.onrender.com${m.url}`} alt="" fill className="object-cover" />
                        )}
                        <button onClick={() => setMedia(media.filter((_, i) => i !== idx))} className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black"><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                    <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#111111]/20 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#F8F6F3] transition-colors flex-shrink-0 text-[#111111]/40 hover:text-[#111111]">
                      {uploading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <><Upload className="w-4 h-4" /><span className="text-[10px] font-bold uppercase">Upload</span></>}
                      <input type="file" className="hidden" accept="image/*,video/*" onChange={handleMediaUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>
                <button onClick={submitReview} disabled={submitting} className="w-full py-3 bg-[#111111] text-white rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-[#111111]/90 transition-colors disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </main>
    <Footer /></>
  );
}
