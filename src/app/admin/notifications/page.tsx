"use client";
import { useState, useEffect } from "react";
import { Bell, CheckCheck, Package, CreditCard, Users, Settings } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";

const typeIcons: Record<string, any> = { ORDER: Package, PAYMENT: CreditCard, USER: Users, SYSTEM: Settings };

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    adminApi.notifications().then((d) => { setNotifications(d.notifications); setUnreadCount(d.unreadCount); }).catch(() => {});
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    await adminApi.markRead(id); fetchNotifications();
  };

  const markAllRead = async () => {
    await adminApi.markAllRead(); fetchNotifications();
  };

  return (
    <AdminLayout title="Notifications" subtitle={unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
      actions={
        unreadCount > 0 && (
          <button onClick={markAllRead} className="px-4 py-2.5 bg-[#111111]/5 text-[#111111] rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-[#111111]/10 transition-colors">
            <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
          </button>
        )
      }
    >
      <div className="space-y-2 max-w-3xl">
        {notifications.map((n, i) => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => !n.read && markRead(n.id)} className={`bg-white rounded-2xl p-4 flex items-start gap-4 border shadow-sm transition-all cursor-pointer ${n.read ? "border-[#111111]/[0.03]" : "border-[#C5A47E]/30 bg-[#C5A47E]/[0.02]"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.read ? "bg-[#F8F6F3]" : "bg-[#C5A47E]/10"}`}>
                <Icon className={`w-5 h-5 ${n.read ? "text-[#111111]/30" : "text-[#C5A47E]"}`} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className={`text-sm font-semibold ${n.read ? "text-[#111111]/60" : "text-[#111111]"}`}>{n.title}</p>
                <p className={`text-xs mt-1 ${n.read ? "text-[#111111]/40" : "text-[#111111]/70"}`}>{n.message}</p>
                <p className="text-[10px] text-[#111111]/30 mt-2">{new Date(n.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-[#C5A47E] shadow-[0_0_8px_rgba(197,143,122,0.5)] flex-shrink-0 mt-2" />}
            </motion.div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#111111]/[0.03]">
            <Bell className="w-10 h-10 text-[#111111]/5 mx-auto mb-2" />
            <p className="text-xs text-[#111111]/25">No notifications yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
