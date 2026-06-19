"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Users, Package, ShoppingBag, TrendingUp, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard()
      .then((d) => setDashboard(d.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Overview of your store">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="w-10 h-10 bg-[#111111]/5 rounded-xl mb-3" />
              <div className="h-7 bg-[#111111]/5 rounded w-1/2 mb-1" />
              <div className="h-3 bg-[#111111]/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    { label: "Total Revenue", value: `₹${(dashboard?.totalRevenue || 0).toLocaleString("en-IN")}`, icon: DollarSign, gradient: "from-emerald-500 to-green-600", bgLight: "bg-emerald-50", trend: "+12%" },
    { label: "Total Orders", value: dashboard?.totalOrders || 0, icon: Package, gradient: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", trend: "+8%" },
    { label: "Customers", value: dashboard?.totalUsers || 0, icon: Users, gradient: "from-violet-500 to-purple-600", bgLight: "bg-violet-50", trend: "+5%" },
    { label: "Products", value: dashboard?.totalProducts || 0, icon: ShoppingBag, gradient: "from-[#C5A47E] to-rose-500", bgLight: "bg-rose-50", trend: "—" },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back! Here's your store overview.">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-[#111111]/[0.03] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-[#111111] tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-[#111111]/35 mt-0.5 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-sm font-bold text-[#111111]">Revenue Overview</h3>
              <p className="text-[11px] text-[#111111]/30 mt-0.5">Monthly revenue breakdown</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#C5A47E] font-medium bg-[#C5A47E]/5 px-2 py-1 rounded-lg">
              <TrendingUp className="w-3 h-3" /> Last 6 months
            </div>
          </div>
          <div className="flex items-end gap-1.5 h-44">
            {dashboard?.monthlyRevenue && dashboard.monthlyRevenue.length > 0 ? (
              dashboard.monthlyRevenue.slice(-6).map((m: any, i: number) => {
                const displayMonths = dashboard.monthlyRevenue.slice(-6);
                const maxRev = Math.max(...displayMonths.map((r: any) => r.revenue), 1000);
                const height = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 group relative h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-10 bg-[#111111] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <p className="font-bold">₹{m.revenue.toLocaleString("en-IN")}</p>
                      <p className="text-white/60">{m.orders} orders</p>
                    </div>
                    
                    <span className="text-[9px] text-[#111111]/25 font-medium">₹{(m.revenue / 1000).toFixed(0)}k</span>
                    <div className="w-full relative rounded-t-lg overflow-hidden transition-all duration-500 bg-[#F8F6F3]" style={{ height: `${Math.max(height, 2)}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#C5A47E] to-[#C5A47E]/40 group-hover:from-[#111111] group-hover:to-[#111111]/80 transition-colors" />
                    </div>
                    <span className="text-[9px] text-[#111111]/40 font-bold truncate w-full text-center">{m.month?.split(" ")[0]}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#111111]/40">
                No revenue data available
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm"
        >
          <h3 className="font-display text-sm font-bold text-[#111111] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Add New Product", href: "/admin/products/", color: "from-[#C5A47E] to-rose-500" },
              { label: "View All Orders", href: "/admin/orders/", color: "from-blue-500 to-indigo-500" },
              { label: "Manage Sections", href: "/admin/sections/", color: "from-violet-500 to-purple-500" },
              { label: "Create Promo Code", href: "/admin/promos/", color: "from-amber-500 to-orange-500" },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8F6F3] transition-colors group">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-[#111111]/70 group-hover:text-[#111111] transition-colors">{action.label}</span>
                <ChevronRight className="w-4 h-4 text-[#111111]/15 ml-auto group-hover:text-[#111111]/30" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-[#111111]/[0.03] shadow-sm mt-6"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#111111]/[0.03]">
          <h3 className="font-display text-sm font-bold text-[#111111]">Recent Orders</h3>
          <Link href="/admin/orders/" className="text-xs text-[#C5A47E] font-medium flex items-center gap-1 hover:underline">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-[#111111]/30 uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-semibold">Order</th>
                <th className="text-left px-6 py-3 font-semibold">Customer</th>
                <th className="text-left px-6 py-3 font-semibold">Amount</th>
                <th className="text-left px-6 py-3 font-semibold">Payment</th>
                <th className="text-left px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {(dashboard?.recentOrders || []).slice(0, 5).map((order: any) => (
                <tr key={order.id} className="border-t border-[#111111]/[0.03] hover:bg-[#F8F6F3]/50 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-[#111111] text-xs">{order.orderNumber}</td>
                  <td className="px-6 py-3.5 text-[#111111]/50 text-xs">{order.user?.firstName} {order.user?.lastName}</td>
                  <td className="px-6 py-3.5 font-semibold text-[#111111] text-xs">₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-3.5">
                    {(() => {
                      const payStat = (order.paymentStatus === "PENDING" && !order.pay0OrderId && !order.paymentUrl) ? "COD" : order.paymentStatus;
                      return (
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                          payStat === "SUCCESS" ? "bg-emerald-50 text-emerald-600" :
                          payStat === "COD" ? "bg-blue-50 text-blue-500" :
                          payStat === "FAILED" ? "bg-red-50 text-red-500" :
                          "bg-amber-50 text-amber-500"
                        }`}>{payStat}</span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                      order.orderStatus === "DELIVERED" ? "bg-emerald-50 text-emerald-600" :
                      order.orderStatus === "SHIPPED" ? "bg-blue-50 text-blue-600" :
                      order.orderStatus === "CONFIRMED" ? "bg-indigo-50 text-indigo-600" :
                      order.orderStatus === "CANCELLED" ? "bg-red-50 text-red-500" :
                      "bg-amber-50 text-amber-600"
                    }`}>{order.orderStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
