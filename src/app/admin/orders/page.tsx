"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Search, X, Printer, Phone, Mail, MapPin, ChevronDown, FileText, Clock, CheckCircle, Truck, XCircle, Link } from "lucide-react";
import { adminApi } from "@/lib/api";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

const statusColors: Record<string, string> = {
  PLACED: "bg-amber-50 text-amber-600", CONFIRMED: "bg-blue-50 text-blue-600",
  SHIPPED: "bg-indigo-50 text-indigo-600", DELIVERED: "bg-emerald-50 text-emerald-600",
  CANCELLED: "bg-red-50 text-red-500",
};
const payColors: any = {
    SUCCESS: "bg-emerald-50 text-emerald-600",
    PENDING: "bg-amber-50 text-amber-500",
    FAILED: "bg-red-50 text-red-500",
    COD: "bg-blue-50 text-blue-500"
  };

const statusTimeline = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchOrders = (p = 1, status = statusFilter, search = searchQuery) => {
    const params: Record<string, string> = { page: String(p), limit: "20" };
    if (status !== "ALL") params.status = status;
    if (search) params.search = search;
    adminApi.orders(params).then((d) => { setOrders((d.orders || []).filter((o: any) => !(o.paymentMethod === "ONLINE" && (o.paymentStatus === "PENDING" || o.paymentStatus === "FAILED")))); setTotalPages(d.totalPages); setPage(p); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, field: string, value: string) => {
    await adminApi.updateOrderStatus(id, { [field]: value });
    fetchOrders(page);
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, [field]: value });
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Invoice - ${selectedOrder?.orderNumber}</title>
      <style>body{font-family:system-ui,-apple-system,sans-serif;padding:40px;color:#111111;font-size:13px}
      table{width:100%;border-collapse:collapse}th,td{padding:10px;text-align:left;border-bottom:1px solid #eee}
      th{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px}
      .header{text-align:center;margin-bottom:30px;border-bottom:2px solid #111111;padding-bottom:20px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0}
      .label{font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px}
      .total{font-size:20px;font-weight:700;margin-top:12px}
      </style></head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const tabs = ["ALL", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

  const getShippingAddress = (order: any) => {
    const addr = order.shippingAddress;
    if (!addr) return null;
    return typeof addr === "string" ? JSON.parse(addr) : addr;
  };

  return (
    <AdminLayout title="Orders" subtitle={`${orders.length} orders found`}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchOrders(1, statusFilter, searchQuery)}
            placeholder="Search by Order ID or Customer Name... (Press Enter to search)"
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#111111]/[0.06] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A47E]/20"
          />
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setStatusFilter(tab); fetchOrders(1, tab, searchQuery); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab ? "bg-[#111111] text-white shadow-lg" : "bg-white text-[#111111]/40 hover:bg-[#F8F6F3] border border-[#111111]/[0.04]"
              }`}>{tab}</button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#111111]/[0.03] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-[#111111]/30 uppercase tracking-wider border-b border-[#111111]/[0.03]">
                <th className="text-left px-6 py-3 font-semibold">Order</th>
                <th className="text-left px-6 py-3 font-semibold">Customer</th>
                <th className="text-left px-6 py-3 font-semibold">Items</th>
                <th className="text-left px-6 py-3 font-semibold">Amount</th>
                <th className="text-left px-6 py-3 font-semibold">Payment</th>
                <th className="text-left px-6 py-3 font-semibold">Status</th>
                <th className="text-left px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} onClick={() => setSelectedOrder(o)} className="border-b border-[#111111]/[0.02] hover:bg-[#F8F6F3]/50 transition-colors cursor-pointer">
                  <td className="px-6 py-3.5 font-semibold text-[#111111] text-xs">{o.orderNumber}</td>
                  <td className="px-6 py-3.5">
                    {(() => {
                      const addr = getShippingAddress(o);
                      const name = o.user?.firstName ? `${o.user.firstName} ${o.user.lastName || ""}` : (addr?.name || "Guest");
                      const phone = o.user?.phone || addr?.phone || "No Phone";
                      return (
                        <>
                          <p className="text-xs text-[#111111]/70">{name}</p>
                          <p className="text-[10px] text-[#111111]/25">{phone}</p>
                        </>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#111111]/40">{o.orderItems?.length} item{o.orderItems?.length !== 1 ? "s" : ""}</td>
                  <td className="px-6 py-3.5 font-semibold text-[#111111] text-xs">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col items-start gap-1">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${o.paymentMethod === "COD" ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"}`}>
                        {o.paymentMethod === "ONLINE" ? "PREPAID" : o.paymentMethod || "UNKNOWN"}
                      </span>
                      {(() => {
                        const pStat = o.paymentStatus;
                        return <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${payColors[pStat] || ""}`}>{pStat}</span>;
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <select
                      value={o.orderStatus}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => { e.stopPropagation(); updateStatus(o.id, "orderStatus", e.target.value); }}
                      className="text-[10px] px-2.5 py-1.5 rounded-lg bg-[#F8F6F3] border border-[#111111]/[0.06] text-[#111111] cursor-pointer focus:outline-none"
                    >
                      {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-3.5 text-[10px] text-[#111111]/25">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-[#111111]/5 mx-auto mb-2" />
            <p className="text-xs text-[#111111]/25">No orders found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => fetchOrders(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${page === i + 1 ? "bg-[#111111] text-white" : "bg-white text-[#111111]/30 hover:bg-[#F8F6F3] border border-[#111111]/[0.04]"}`}>{i + 1}</button>
          ))}
        </div>
      )}

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="relative w-full max-w-xl bg-white h-full overflow-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#111111]/[0.04] px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="font-display text-base font-bold text-[#111111]">Order {selectedOrder.orderNumber}</h2>
                  <p className="text-[10px] text-[#111111]/30">{new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrint} className="p-2.5 bg-[#F8F6F3] rounded-lg hover:bg-[#111111]/5 transition-colors"><Printer className="w-4 h-4 text-[#111111]/50" /></button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2.5 bg-[#F8F6F3] rounded-lg hover:bg-red-50 transition-colors"><X className="w-4 h-4 text-[#111111]/50" /></button>
                </div>
              </div>

              {/* Printable Content */}
              <div ref={printRef} className="p-6 space-y-6">
                {/* Store Header (for print) */}
                <div className="header hidden print:block">
                  <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Solanki Vastra Bhandar</h1>
                  <p>Invoice #{selectedOrder.orderNumber}</p>
                </div>

                {/* Status Timeline */}
                <div className="bg-[#F8F6F3] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[#111111]">Order Status</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${selectedOrder.paymentMethod === "COD" ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"}`}>
                        {selectedOrder.paymentMethod === "ONLINE" ? "PREPAID" : selectedOrder.paymentMethod || "UNKNOWN"}
                      </span>
                      {(() => {
                        const pStat = selectedOrder.paymentStatus;
                        return <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${payColors[pStat] || ""}`}>{pStat}</span>;
                      })()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {statusTimeline.map((step, i) => {
                      const currentIdx = statusTimeline.indexOf(selectedOrder.orderStatus);
                      const isDone = i <= currentIdx;
                      const isCancelled = selectedOrder.orderStatus === "CANCELLED";
                      return (
                        <div key={step} className="flex-1 flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCancelled ? "bg-red-100 text-red-500" : isDone ? "bg-[#111111] text-white" : "bg-[#111111]/5 text-[#111111]/20"
                          }`}>{i + 1}</div>
                          <p className={`text-[9px] mt-1 font-medium ${isDone ? "text-[#111111]" : "text-[#111111]/20"}`}>{step}</p>
                          {i < statusTimeline.length - 1 && <div className={`h-0.5 w-full ${isDone && i < currentIdx ? "bg-[#111111]" : "bg-[#111111]/5"}`} />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#111111]/[0.04]">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1 block">Tracking ID (AWB)</label>
                        <input
                          type="text"
                          value={selectedOrder.trackingId || ""}
                          onChange={(e) => setSelectedOrder({ ...selectedOrder, trackingId: e.target.value })}
                          onBlur={() => updateStatus(selectedOrder.id, "trackingId", selectedOrder.trackingId)}
                          placeholder="Tracking Number"
                          className="w-full text-xs px-3 py-2 rounded-lg border border-[#111111]/[0.06] bg-white focus:outline-none focus:ring-1 focus:ring-[#C5A47E]/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {(() => {
                  const addr = getShippingAddress(selectedOrder);
                  const firstName = selectedOrder.user?.firstName || addr?.name?.split(" ")[0] || "Guest";
                  const lastName = selectedOrder.user?.lastName || addr?.name?.split(" ").slice(1).join(" ") || "";
                  const email = selectedOrder.user?.email || addr?.email || "No Email";
                  const phone = selectedOrder.user?.phone || addr?.phone || "No Phone";
                  
                  return (
                    <div>
                      <h3 className="text-xs font-bold text-[#111111] mb-3">Customer Details</h3>
                      <div className="bg-[#F8F6F3] rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C5A47E] to-[#C5A47E] flex items-center justify-center text-white text-xs font-bold uppercase">
                            {firstName.charAt(0)}{lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111111]">{firstName} {lastName}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-2 text-[#111111]/50"><Mail className="w-3 h-3" /> {email}</div>
                          <div className="flex items-center gap-2 text-[#111111]/50"><Phone className="w-3 h-3" /> {phone}</div>
                          {selectedOrder.user?.altPhone && <div className="flex items-center gap-2 text-[#111111]/50"><Phone className="w-3 h-3" /> {selectedOrder.user.altPhone} (alt)</div>}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Shipping Address */}
                {(() => {
                  const addr = getShippingAddress(selectedOrder);
                  if (!addr) return null;
                  return (
                    <div>
                      <h3 className="text-xs font-bold text-[#111111] mb-3">Shipping Address</h3>
                      <div className="bg-[#F8F6F3] rounded-2xl p-4 text-[11px] text-[#111111]/60 flex gap-3">
                        <MapPin className="w-4 h-4 text-[#C5A47E] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#111111]">{addr.name}</p>
                          <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                          <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p>{addr.country} • {addr.phone}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Order Items */}
                <div>
                  <h3 className="text-xs font-bold text-[#111111] mb-3">Items Ordered</h3>
                  <div className="space-y-2">
                    {selectedOrder.orderItems?.map((item: any, i: number) => (
                      <div key={i} className="bg-[#F8F6F3] rounded-xl p-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border border-[#111111]/[0.04] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                          {item.product?.media?.[0] ? (
                            <Image src={item.product.media[0].url.startsWith("http") ? item.product.media[0].url : `https://fashion-hub-backend-13eb.onrender.com${item.product.media[0].url}`} alt="" fill className="object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#111111]/10" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <a href={`/product/${item.productId}`} target="_blank" className="flex items-center gap-1 group">
                            <p className="text-xs font-semibold text-[#111111] truncate group-hover:underline">{item.product?.name || "Product"}</p>
                            <Link className="w-3 h-3 text-[#111111]/30 group-hover:text-[#C5A47E]" />
                          </a>
                          <p className="text-[10px] text-[#111111]/30">{item.product?.fabric || ""} • Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#111111]">₹{Number(item.total).toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-[#111111]/25">₹{Number(item.price).toLocaleString("en-IN")} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-[#111111] rounded-2xl p-5 text-white">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/50"><span>Subtotal</span><span>₹{(Number(selectedOrder.totalAmount) + Number(selectedOrder.discountAmount)).toLocaleString("en-IN")}</span></div>
                    {Number(selectedOrder.discountAmount) > 0 && (
                      <div className="flex justify-between text-emerald-400"><span>Discount {selectedOrder.promoCode ? `(${selectedOrder.promoCode})` : ""}</span><span>-₹{Number(selectedOrder.discountAmount).toLocaleString("en-IN")}</span></div>
                    )}
                    <div className="flex justify-between text-white/50"><span>Shipping</span><span className="text-emerald-400">FREE</span></div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span><span>₹{Number(selectedOrder.totalAmount).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  {selectedOrder.utr && (
                    <p className="text-[10px] text-white/30 mt-3">UTR: {selectedOrder.utr}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

