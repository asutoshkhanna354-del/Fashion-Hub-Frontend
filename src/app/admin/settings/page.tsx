"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Settings } from "lucide-react";
import { adminApi } from "@/lib/api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => { adminApi.getSettings().then((d) => setSettings(d.settings)).catch(() => router.push("/admin/login/")); }, [router]);

  const handleSave = async () => {
    setSaving(true);
    try { await adminApi.updateSettings(settings); setSuccess("Settings saved!"); setTimeout(() => setSuccess(""), 3000); } catch {}
    setSaving(false);
  };

  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });
  const fieldClass = "w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm text-plum";

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Store Settings</h1>
      </div>
      {success && <div className="bg-green-50 text-green-600 text-xs px-4 py-2.5 rounded-lg mb-4">{success}</div>}
      <div className="space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl p-5 border border-plum/5">
          <h3 className="font-display text-base font-bold text-plum mb-4">Store Information</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-plum/50 mb-1 block">Store Name</label><input value={settings.store_name || ""} onChange={(e) => update("store_name", e.target.value)} className={fieldClass} /></div>
            <div><label className="text-xs text-plum/50 mb-1 block">Address</label><input value={settings.store_address || ""} onChange={(e) => update("store_address", e.target.value)} className={fieldClass} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-plum/50 mb-1 block">Phone</label><input value={settings.store_phone || ""} onChange={(e) => update("store_phone", e.target.value)} className={fieldClass} /></div>
              <div><label className="text-xs text-plum/50 mb-1 block">Email</label><input value={settings.store_email || ""} onChange={(e) => update("store_email", e.target.value)} className={fieldClass} /></div>
            </div>
            <div><label className="text-xs text-plum/50 mb-1 block">GSTIN</label><input value={settings.store_gstin || ""} onChange={(e) => update("store_gstin", e.target.value)} className={fieldClass} placeholder="Optional" /></div>
          </div>
        </div>
        {/* Support Links */}
        <div className="bg-white rounded-2xl p-5 border border-plum/5">
          <h3 className="font-display text-base font-bold text-plum mb-4">Support Links</h3>
          <div className="space-y-3">
            <div><label className="text-xs text-plum/50 mb-1 block">WhatsApp Link</label><input value={settings.whatsapp_link || ""} onChange={(e) => update("whatsapp_link", e.target.value)} className={fieldClass} placeholder="https://wa.me/919876543210" /></div>
            <div><label className="text-xs text-plum/50 mb-1 block">Telegram Link</label><input value={settings.telegram_link || ""} onChange={(e) => update("telegram_link", e.target.value)} className={fieldClass} placeholder="https://t.me/aditifashionhub" /></div>
            <div><label className="text-xs text-plum/50 mb-1 block">Instagram Link</label><input value={settings.instagram_link || ""} onChange={(e) => update("instagram_link", e.target.value)} className={fieldClass} placeholder="https://instagram.com/aditifashionhub" /></div>
          </div>
        </div>
        {/* Promo Banner */}
        <div className="bg-white rounded-2xl p-5 border border-plum/5">
          <h3 className="font-display text-base font-bold text-plum mb-4">Promotional Banner</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-plum/60 cursor-pointer">
              <input type="checkbox" checked={settings.banner_enabled === "true"} onChange={(e) => update("banner_enabled", e.target.checked ? "true" : "false")} className="rounded" /> Enable Promotional Banner
            </label>
            <div><label className="text-xs text-plum/50 mb-1 block">Banner Type</label>
              <select value={settings.banner_type || "news"} onChange={(e) => update("banner_type", e.target.value)} className={fieldClass}><option value="news">News</option><option value="sale">Sale</option><option value="info">Info</option></select>
            </div>
            <div><label className="text-xs text-plum/50 mb-1 block">Banner Title</label><input value={settings.banner_title || ""} onChange={(e) => update("banner_title", e.target.value)} className={fieldClass} /></div>
            <div><label className="text-xs text-plum/50 mb-1 block">Banner Text</label><input value={settings.banner_text || ""} onChange={(e) => update("banner_text", e.target.value)} className={fieldClass} /></div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}</button>
      </div>
    </div>
  );
}
