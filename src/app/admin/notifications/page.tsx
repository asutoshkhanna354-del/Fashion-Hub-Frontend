"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, CheckCheck, Package, CreditCard, Users, Settings } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion } from "framer-motion";

const typeIcons: Record<string, any> = { ORDER: Package, PAYMENT: CreditCard, USER: Users, SYSTEM: Settings };

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    adminApi.notifications().then((d) => { setNotifications(d.notifications); setUnreadCount(d.unreadCount); }).catch(() => router.push("/admin/login/"));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    await adminApi.markRead(id); fetchNotifications();
  };

  const markAllRead = async () => {
    await adminApi.markAllRead(); fetchNotifications();
  };

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Notifications {unreadCount > 0 && <span className="text-sm font-normal text-rose-gold">({unreadCount} unread)</span>}</h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-4 py-2 bg-plum/5 text-plum rounded-xl text-xs flex items-center gap-2"><CheckCheck className="w-4 h-4" /> Mark All Read</button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} onClick={() => !n.read && markRead(n.id)} className={`bg-white rounded-xl p-4 flex items-start gap-3 border transition-colors cursor-pointer ${n.read ? "border-plum/5" : "border-rose-gold/20 bg-rose-gold/5"}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${n.read ? "bg-plum/5" : "bg-rose-gold/10"}`}>
                <Icon className={`w-4 h-4 ${n.read ? "text-plum/40" : "text-rose-gold"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${n.read ? "text-plum/60" : "text-plum"}`}>{n.title}</p>
                <p className="text-xs text-plum/40 mt-0.5">{n.message}</p>
                <p className="text-[10px] text-plum/25 mt-1">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-rose-gold flex-shrink-0 mt-1.5" />}
            </motion.div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-16"><Bell className="w-12 h-12 text-plum/10 mx-auto mb-3" /><p className="text-plum/40 text-sm">No notifications yet</p></div>
        )}
      </div>
    </div>
  );
}
