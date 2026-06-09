"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, ChevronDown, FileText } from "lucide-react";
import { adminApi } from "@/lib/api";

const statusColors: Record<string, string> = {
  PLACED: "bg-amber-50 text-amber-600", CONFIRMED: "bg-blue-50 text-blue-600", SHIPPED: "bg-indigo-50 text-indigo-600", DELIVERED: "bg-green-50 text-green-600", CANCELLED: "bg-red-50 text-red-600",
};
const payColors: Record<string, string> = { SUCCESS: "bg-green-50 text-green-600", PENDING: "bg-amber-50 text-amber-600", FAILED: "bg-red-50 text-red-600" };

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = (p = 1) => {
    adminApi.orders({ page: String(p), limit: "20" }).then((d) => { setOrders(d.orders); setTotalPages(d.totalPages); setPage(p); }).catch(() => router.push("/admin/login/")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, field: string, value: string) => {
    await adminApi.updateOrderStatus(id, { [field]: value });
    fetchOrders(page);
  };

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Orders</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-plum/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-ivory/50 text-xs text-plum/40 border-b border-plum/5">
              <th className="text-left p-3 font-medium">Order</th><th className="text-left p-3 font-medium">Customer</th><th className="text-left p-3 font-medium">Amount</th><th className="text-left p-3 font-medium">Payment</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Date</th><th className="text-left p-3 font-medium">Invoice</th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-plum/5 last:border-0 hover:bg-ivory/30">
                  <td className="p-3 font-medium text-plum">{o.orderNumber}</td>
                  <td className="p-3 text-plum/60">{o.user?.firstName} {o.user?.lastName}</td>
                  <td className="p-3 font-medium text-plum">₹{Number(o.totalAmount).toLocaleString("en-IN")}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${payColors[o.paymentStatus] || ""}`}>{o.paymentStatus}</span></td>
                  <td className="p-3">
                    <select value={o.orderStatus} onChange={(e) => updateStatus(o.id, "orderStatus", e.target.value)} className="text-xs px-2 py-1 rounded-lg bg-ivory border border-plum/10 text-plum cursor-pointer">
                      {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-plum/40">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="p-3"><button onClick={() => window.open(`/admin/orders/?invoice=${o.id}`, "_blank")} className="p-1.5 hover:bg-plum/5 rounded-lg"><FileText className="w-4 h-4 text-plum/40" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => fetchOrders(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-medium ${page === i + 1 ? "bg-plum text-white" : "bg-white text-plum/50"}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
