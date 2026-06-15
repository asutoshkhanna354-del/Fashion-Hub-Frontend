"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Shield } from "lucide-react";
import { adminApi } from "@/lib/api";

import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPoliciesSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    policy_shipping: "",
    policy_return: "",
    policy_privacy: "",
    policy_terms: "",
  });

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      const s = res.settings;
      if (s) {
        setForm({
          policy_shipping: s.policy_shipping || "",
          policy_return: s.policy_return || "",
          policy_privacy: s.policy_privacy || "",
          policy_terms: s.policy_terms || "",
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(form);
      alert("Policies updated successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to update policies");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Store Policies" subtitle="Manage Shipping, Returns, Privacy, and Terms of Service.">
      <div className="space-y-6 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-plum" /></div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-plum/10 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-plum mb-2">Shipping Policy</label>
              <textarea
                value={form.policy_shipping}
                onChange={(e) => setForm({ ...form, policy_shipping: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm"
                placeholder="Enter your shipping policy here..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plum mb-2">Return & Refund Policy</label>
              <textarea
                value={form.policy_return}
                onChange={(e) => setForm({ ...form, policy_return: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm"
                placeholder="Enter your return policy here..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plum mb-2">Privacy Policy</label>
              <textarea
                value={form.policy_privacy}
                onChange={(e) => setForm({ ...form, policy_privacy: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm"
                placeholder="Enter your privacy policy here..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-plum mb-2">Terms of Service</label>
              <textarea
                value={form.policy_terms}
                onChange={(e) => setForm({ ...form, policy_terms: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm"
                placeholder="Enter your terms of service here..."
              />
            </div>
            <div className="pt-4 border-t border-plum/10 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Policies
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
