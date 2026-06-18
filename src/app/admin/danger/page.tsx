"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";

export default function DangerZonePage() {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string, label: string) => {
    const confirmation = prompt(`Are you absolutely sure you want to ${label}? This action CANNOT be undone. Type "CONFIRM" to proceed.`);
    if (confirmation !== "CONFIRM") return;

    setLoading(true);
    try {
      const data = await adminApi.dangerAction(action);
      if (data.status) {
        alert("Success: " + data.message);
        window.location.reload();
      } else {
        alert("Error: " + data.message);
      }
    } catch (e: any) {
      alert("An error occurred while executing the action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Danger Zone" subtitle="Destructive store operations">
      <div className="max-w-3xl border border-red-500/20 bg-red-50/50 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-red-500/10">
          <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
            <p className="text-sm text-red-700/80">These actions are destructive and permanent. Please proceed with extreme caution.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-red-100 shadow-sm">
            <div>
              <h3 className="font-semibold text-gray-900">Clear Store Stats</h3>
              <p className="text-xs text-gray-500 mt-1">This will permanently delete all notifications and messages.</p>
            </div>
            <button
              onClick={() => handleAction("clear-stats", "clear store stats")}
              disabled={loading}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Clear Stats
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-red-100 shadow-sm">
            <div>
              <h3 className="font-semibold text-gray-900">Clear All Orders</h3>
              <p className="text-xs text-gray-500 mt-1">This will permanently delete every order placed on the store.</p>
            </div>
            <button
              onClick={() => handleAction("clear-orders", "clear all orders")}
              disabled={loading}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Orders
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-red-100 shadow-sm">
            <div>
              <h3 className="font-semibold text-gray-900">Clear All Products</h3>
              <p className="text-xs text-gray-500 mt-1">This will permanently delete all products, cart items, and wishlist items.</p>
            </div>
            <button
              onClick={() => handleAction("clear-products", "clear all products")}
              disabled={loading}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Products
            </button>
          </div>

          <div className="flex items-center justify-between p-5 bg-red-50 rounded-xl border border-red-200 shadow-sm">
            <div>
              <h3 className="font-semibold text-red-900">Factory Reset Store</h3>
              <p className="text-xs text-red-700/80 mt-1">This will delete all orders, products, cart items, reviews, notifications, and messages.</p>
            </div>
            <button
              onClick={() => handleAction("clear-all", "factory reset store")}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20 font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Factory Reset
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
