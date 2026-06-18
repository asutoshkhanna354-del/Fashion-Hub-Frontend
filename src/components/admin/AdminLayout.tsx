"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { adminApi } from "@/lib/api";
import {
  LayoutDashboard, Package, ShoppingBag, Layers, Users, Tag, Bell,
  Settings, Shield, LogOut, Menu, X, ChevronRight, Search, MapPin,
  Folders, ShoppingCart, MessageCircle
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/sections", label: "Categories & Occasions", icon: Folders },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/promos", label: "Promo Codes", icon: Tag },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle },
];

const settingsItems = [
  { href: "/admin/settings/", icon: Settings, label: "Store Settings" },
  { href: "/admin/settings/hero/", icon: Layers, label: "Hero Banner" },
  { href: "/admin/settings/promo-banners/", icon: Layers, label: "Promo Banners" },
  { href: "/admin/settings/policies/", icon: Shield, label: "Store Policies" },
  { href: "/admin/settings/blog/", icon: Layers, label: "Blog & Journal" },
  { href: "/admin/settings/stores/", icon: MapPin, label: "Boutiques" },
  { href: "/admin/settings/bestsellers/", icon: ShoppingBag, label: "Best Sellers" },
  { href: "/admin/settings/story/", icon: Layers, label: "Homepage Story" },
  { href: "/admin/notifications/", icon: Bell, label: "Notifications" },
  { href: "/admin/admins/", icon: Shield, label: "Admin Team" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login/"); return; }
    const info = localStorage.getItem("admin_info");
    if (info) setAdminInfo(JSON.parse(info));
    
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      setPushEnabled(true);
    }
  }, [router]);

  const enablePush = async () => {
    try {
      if (!("Notification" in window)) return;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
      
      const registration = await navigator.serviceWorker.register("/sw.js");
      const { publicKey } = await adminApi.getVapidKey();
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      });
      
      await adminApi.subscribePush(subscription);
      setPushEnabled(true);
      alert("Push notifications enabled!");
    } catch (error) {
      console.error(error);
      alert("Failed to enable push notifications");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_info");
    router.push("/admin/login/");
  };

  const isActive = (href: string) => {
    if (href === "/admin/") return pathname === "/admin" || pathname === "/admin/";
    return pathname?.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <div className="min-h-screen bg-[#F8F6F3] flex">
      {/* Sidebar */}
      <aside className={`flex-shrink-0 fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-[#111111] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-[17px] font-bold text-white tracking-wide">SOLANKI</h1>
              <p className="text-[9px] text-[#C5A47E] tracking-[3px] font-medium -mt-0.5">VASTRA BHANDAR</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-auto px-3">
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-3 mb-2 mt-1">Menu</p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 mb-0.5 ${
                  active
                    ? "bg-[#C5A47E]/15 text-[#C5A47E]"
                    : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${active ? "text-[#C5A47E]" : ""}`} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C5A47E]" />
                )}
              </Link>
            );
          })}

          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-3 mb-2 mt-6">Settings</p>
          {settingsItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 mb-0.5 ${
                  active
                    ? "bg-[#C5A47E]/15 text-[#C5A47E]"
                    : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${active ? "text-[#C5A47E]" : ""}`} />
                {item.label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C5A47E]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Profile & Logout */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A47E] to-[#C5A47E] flex items-center justify-center text-white text-xs font-bold">
              {adminInfo?.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">{adminInfo?.username || "Admin"}</p>
              <p className="text-[10px] text-white/30 capitalize">{adminInfo?.role?.replace("_", " ") || "Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full"
          >
            <LogOut className="w-[18px] h-[18px]" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 bg-[#F8F6F3]/80 backdrop-blur-xl border-b border-[#111111]/[0.04] px-4 sm:px-6 lg:px-8 z-30">
          <div className="flex items-center gap-4 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#111111]/5">
              <Menu className="w-5 h-5 text-[#111111]" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg font-bold text-[#111111] truncate">{title}</h2>
              {subtitle && <p className="text-xs text-[#111111]/40 -mt-0.5 truncate">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              {actions}
              {!pushEnabled && (
                <button onClick={enablePush} className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-semibold transition-colors border border-amber-200/50">
                  <Bell className="w-3.5 h-3.5" /> Enable Notifications
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
