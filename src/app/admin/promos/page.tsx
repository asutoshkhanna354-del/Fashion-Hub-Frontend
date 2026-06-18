"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Tag } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", discountPercent: "", minOrder: "0", maxUses: "100", expiresAt: "" });

  useEffect(() => { adminApi.listPromos().then((d) => setPromos(d.promos)).catch(() => {}); }, []);

  const handleSave = async () => {
    try {
      if (editing) await adminApi.updatePromo(editing.id, form);
      else await adminApi.createPromo(form);
      const d = await adminApi.listPromos(); setPromos(d.promos);
      setShowForm(false); setEditing(null);
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this promo?")) return;
    await adminApi.deletePromo(id); setPromos(promos.filter((p) => p.id !== id));
  };

  const fieldClass = "w-full px-3.5 py-3 bg-[#F8F6F3] border border-[#111111]/[0.06] rounded-xl text-sm text-[#111111] placeholder:text-[#111111]/25 focus:outline-none focus:border-[#C5A47E]/30 transition-all";

  return (
    <AdminLayout title="Promo Codes" subtitle={`${promos.length} active promotions`}
      actions={
        <button onClick={() => { setForm({ code: "", discountPercent: "", minOrder: "0", maxUses: "100", expiresAt: "" }); setEditing(null); setShowForm(true); }} className="px-4 py-2.5 bg-gradient-to-r from-[#C5A47E] to-[#C5A47E] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#C5A47E]/20">
          <Plus className="w-3.5 h-3.5" /> Add Promo
        </button>
      }
    >
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#111111]/[0.04]">
                <h2 className="font-display text-base font-bold text-[#111111]">{editing ? "Edit" : "New"} Promo Code</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-4 h-4 text-[#111111]/30" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Code (e.g. SUMMER20)" className={fieldClass} />
                <input value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="Discount %" type="number" className={fieldClass} />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="Min Order ₹" type="number" className={fieldClass} />
                  <input value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Max Uses" type="number" className={fieldClass} />
                </div>
                <input value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} type="date" className={fieldClass} />
              </div>
              <div className="px-6 py-4 border-t border-[#111111]/[0.04] flex gap-3">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-3 border border-[#111111]/[0.06] text-[#111111]/50 rounded-xl text-sm font-medium">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-[#111111] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {promos.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-[#111111]/[0.03] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A47E]/10 to-[#C5A47E]/10 flex items-center justify-center"><Tag className="w-5 h-5 text-[#C5A47E]" /></div>
              <div>
                <p className="font-bold text-[#111111] text-sm">{p.code}</p>
                <p className="text-[10px] text-[#111111]/30">{p.discountPercent}% off • Min ₹{Number(p.minOrder)} • Used {p.usedCount}/{p.maxUses}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${p.active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{p.active ? "Active" : "Inactive"}</span>
              <button onClick={() => { setForm({ code: p.code, discountPercent: String(p.discountPercent), minOrder: String(p.minOrder), maxUses: String(p.maxUses), expiresAt: p.expiresAt?.split("T")[0] || "" }); setEditing(p); setShowForm(true); }} className="p-2 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      {promos.length === 0 && <div className="text-center py-16 bg-white rounded-2xl border border-[#111111]/[0.03]"><Tag className="w-10 h-10 text-[#111111]/5 mx-auto mb-2" /><p className="text-xs text-[#111111]/25">No promo codes yet</p></div>}
    </AdminLayout>
  );
}
