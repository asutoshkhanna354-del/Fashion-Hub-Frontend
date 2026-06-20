"use client";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { adminApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => { adminApi.getSettings().then((d) => setSettings(d.settings)).catch(() => {}); }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await adminApi.updateSettings(settings); setSuccess("Settings saved successfully!"); setTimeout(() => setSuccess(""), 3000); } catch {}
    setSaving(false);
  };

  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });
  const fieldClass = "w-full px-3.5 py-3 bg-[#F8F6F3] border border-[#111111]/[0.06] rounded-xl text-sm text-[#111111] placeholder:text-[#111111]/25 focus:outline-none focus:border-[#C5A47E]/30 focus:ring-1 focus:ring-[#C5A47E]/10 transition-all";
  const labelClass = "block text-[11px] font-semibold text-[#111111]/40 uppercase tracking-wider mb-1.5";

  return (
    <AdminLayout title="Store Settings" subtitle="Manage your store's global configuration">
      {success && <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-4 py-3 rounded-xl mb-6 shadow-sm">{success}</div>}
      
      <div className="space-y-6 max-w-4xl">
        {/* Store Info */}
        <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#111111] mb-5">Store Information</h3>
          <div className="space-y-4">
            <div><label className={labelClass}>Store Name</label><input value={settings.store_name || ""} onChange={(e) => update("store_name", e.target.value)} className={fieldClass} /></div>
            
            <div>
              <label className={labelClass}>Store Logo / Favicon</label>
              <div className="p-4 border border-dashed border-[#111111]/[0.06] rounded-xl bg-[#F8F6F3]">
                <MediaUploader
                  media={settings.store_logo_url ? [{ url: settings.store_logo_url, type: 'image' }] : []}
                  onChange={(media) => update("store_logo_url", media.length > 0 ? media[0].url : "")}
                  single={true}
                  label={settings.store_logo_url ? "Change Logo" : "Upload Logo"}
                />
              </div>
            </div>

            <div><label className={labelClass}>Address</label><input value={settings.store_address || ""} onChange={(e) => update("store_address", e.target.value)} className={fieldClass} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>Phone</label><input value={settings.store_phone || ""} onChange={(e) => update("store_phone", e.target.value)} className={fieldClass} /></div>
              <div><label className={labelClass}>Email</label><input value={settings.store_email || ""} onChange={(e) => update("store_email", e.target.value)} className={fieldClass} /></div>
            </div>
            <div><label className={labelClass}>GSTIN (Optional)</label><input value={settings.store_gstin || ""} onChange={(e) => update("store_gstin", e.target.value)} className={fieldClass} placeholder="e.g. 22AAAAA0000A1Z5" /></div>
          </div>
        </div>


        {/* Support Links */}
        <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#111111] mb-5">Support Links</h3>
          <div className="space-y-4">
            <div><label className={labelClass}>WhatsApp Link</label><input value={settings.whatsapp_link || ""} onChange={(e) => update("whatsapp_link", e.target.value)} className={fieldClass} placeholder="https://wa.me/919876543210" /></div>
            <div><label className={labelClass}>Telegram Link</label><input value={settings.telegram_link || ""} onChange={(e) => update("telegram_link", e.target.value)} className={fieldClass} placeholder="https://t.me/noorsilksareeshub" /></div>
            <div><label className={labelClass}>Instagram Link</label><input value={settings.instagram_link || ""} onChange={(e) => update("instagram_link", e.target.value)} className={fieldClass} placeholder="https://instagram.com/noorsilksareeshub" /></div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm">
          <h3 className="font-display text-sm font-bold text-[#111111] mb-5">Promotional Banner (Top of site)</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2.5 text-sm text-[#111111]/60 cursor-pointer select-none">
              <input type="checkbox" checked={settings.banner_enabled === "true"} onChange={(e) => update("banner_enabled", e.target.checked ? "true" : "false")} className="w-4 h-4 rounded border-[#111111]/15 text-[#C5A47E] focus:ring-[#C5A47E]/20" /> Enable Promotional Banner
            </label>
            <div><label className={labelClass}>Banner Type</label>
              <select value={settings.banner_type || "news"} onChange={(e) => update("banner_type", e.target.value)} className={fieldClass}><option value="news">News</option><option value="sale">Sale</option><option value="info">Info</option></select>
            </div>
            <div><label className={labelClass}>Banner Title</label><input value={settings.banner_title || ""} onChange={(e) => update("banner_title", e.target.value)} className={fieldClass} /></div>
            <div><label className={labelClass}>Banner Text</label><input value={settings.banner_text || ""} onChange={(e) => update("banner_text", e.target.value)} className={fieldClass} /></div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-gradient-to-r from-[#111111] to-[#111111]/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all w-full sm:w-auto">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </AdminLayout>
  );
}
