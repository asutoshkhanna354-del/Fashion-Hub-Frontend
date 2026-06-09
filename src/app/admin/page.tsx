"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, ShoppingBag, Package, DollarSign, TrendingUp, Bell, Settings, Tag, Layers, Shield, LogOut, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";

const navItems = [
  { href: "/admin/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders/", icon: Package, label: "Orders" },
  { href: "/admin/products/", icon: ShoppingBag, label: "Products" },
  { href: "/admin/sections/", icon: Layers, label: "Sections" },
  { href: "/admin/users/", icon: Users, label: "Users" },
  { href: "/admin/promos/", icon: Tag, label: "Promo Codes" },
  { href: "/admin/notifications/", icon: Bell, label: "Notifications" },
  { href: "/admin/settings/", icon: Settings, label: "Store Settings" },
  { href: "/admin/admins/", icon: Shield, label: "Admin Management" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login/"); return; }
    adminApi.dashboard().then((d) => setDashboard(d.dashboard)).catch(() => router.push("/admin/login/")).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("admin_token"); localStorage.removeItem("admin_info"); router.push("/admin/login/"); };

  if (loading) return <div className="min-h-screen bg-ivory flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-plum border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-plum text-white z-50 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div>
            <h1 className="font-display text-lg font-bold">ADITI</h1>
            <p className="text-[10px] text-white/40 tracking-wider">ADMIN PANEL</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex-1 py-4 overflow-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 px-5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-5 py-4 text-sm text-white/40 hover:text-white hover:bg-white/5 border-t border-white/10">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 bg-ivory/80 backdrop-blur-md border-b border-plum/5 px-4 sm:px-6 py-4 z-30 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-5 h-5 text-plum" /></button>
          <h2 className="font-display text-xl font-bold text-plum">Dashboard</h2>
        </header>

        <div className="p-4 sm:p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Revenue", value: `₹${(dashboard?.totalRevenue || 0).toLocaleString("en-IN")}`, icon: DollarSign, color: "from-green-400 to-emerald-500" },
              { label: "Total Orders", value: dashboard?.totalOrders || 0, icon: Package, color: "from-blue-400 to-indigo-500" },
              { label: "Total Users", value: dashboard?.totalUsers || 0, icon: Users, color: "from-purple-400 to-violet-500" },
              { label: "Products", value: dashboard?.totalProducts || 0, icon: ShoppingBag, color: "from-rose-400 to-pink-500" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-plum/5">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-plum">{stat.value}</p>
                <p className="text-xs text-plum/40 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue Chart (simplified bar chart) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-plum/5 mb-6">
            <h3 className="font-display text-base font-bold text-plum mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-rose-gold" /> Monthly Revenue</h3>
            <div className="flex items-end gap-1 h-40">
              {(dashboard?.monthlyRevenue || []).map((m: any, i: number) => {
                const maxRev = Math.max(...(dashboard?.monthlyRevenue || []).map((r: any) => r.revenue));
                const height = maxRev > 0 ? (m.revenue / maxRev) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-rose-gold to-rose-gold/60 rounded-t-md transition-all" style={{ height: `${Math.max(height, 2)}%` }} title={`₹${m.revenue.toLocaleString()}`} />
                    <span className="text-[8px] text-plum/30 truncate w-full text-center">{m.month.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-plum/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-plum">Recent Orders</h3>
              <Link href="/admin/orders/" className="text-xs text-rose-gold flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-plum/40 border-b border-plum/5">
                  <th className="text-left py-2 font-medium">Order</th><th className="text-left py-2 font-medium">Customer</th><th className="text-left py-2 font-medium">Amount</th><th className="text-left py-2 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {(dashboard?.recentOrders || []).slice(0, 5).map((order: any) => (
                    <tr key={order.id} className="border-b border-plum/5 last:border-0">
                      <td className="py-2.5 text-plum font-medium">{order.orderNumber}</td>
                      <td className="py-2.5 text-plum/60">{order.user?.firstName} {order.user?.lastName}</td>
                      <td className="py-2.5 text-plum font-medium">₹{Number(order.totalAmount).toLocaleString("en-IN")}</td>
                      <td className="py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.paymentStatus === "SUCCESS" ? "bg-green-50 text-green-600" : order.paymentStatus === "FAILED" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>{order.paymentStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
