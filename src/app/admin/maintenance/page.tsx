"use client";
import { useState, useEffect } from "react";
import { Save, Wrench } from "lucide-react";
import { adminApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

export default function MaintenanceModePage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => { 
    adminApi.getSettings().then((d) => setSettings(d.settings)).catch(() => {}); 
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { 
      await adminApi.updateSettings(settings); 
      setSuccess("Maintenance settings saved successfully!"); 
      setTimeout(() => setSuccess(""), 3000); 
    } catch {}
    setSaving(false);
  };

  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });

  return (
    <AdminLayout title="Maintenance Mode" subtitle="Manage store visibility and payment modes">
      {success && <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs px-4 py-3 rounded-xl mb-6 shadow-sm">{success}</div>}
      
      <div className="space-y-6 max-w-4xl">
        <div className="bg-white rounded-2xl p-6 border border-[#111111]/[0.03] shadow-sm border-l-4 border-l-rose-gold">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-gold/10 flex items-center justify-center text-rose-gold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-[#111111]">Maintenance Mode</h3>
              <p className="text-xs text-[#111111]/60">
                Hide your website from customers while making updates.
              </p>
            </div>
          </div>
          
          <div className="bg-[#F8F6F3] p-4 rounded-xl border border-[#111111]/[0.06] mb-6">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div>
                <span className="block text-sm font-semibold text-[#111111] mb-1">
                  Enable Maintenance Mode
                </span>
                <span className="block text-xs text-[#111111]/60 max-w-[90%]">
                  When enabled, normal visitors will see an "Updating" screen. Payments will automatically switch to Test Mode. 
                  Developers can bypass this screen by clicking the store logo 3 times fast.
                </span>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={settings.maintenance_mode === "true"} 
                  onChange={(e) => update("maintenance_mode", e.target.checked ? "true" : "false")} 
                  className="sr-only peer" 
                />
                <div className="w-12 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A47E]"></div>
              </div>
            </label>
          </div>

          <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-[#111111] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-[#111111]/90 transition-all">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
