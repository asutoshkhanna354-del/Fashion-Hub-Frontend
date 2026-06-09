"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Tag } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminPromosPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ code: "", discountPercent: "", minOrder: "0", maxUses: "100", expiresAt: "" });

  useEffect(() => { adminApi.listPromos().then((d) => setPromos(d.promos)).catch(() => router.push("/admin/login/")); }, [router]);

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

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Promo Codes</h1>
        <button onClick={() => { setForm({ code: "", discountPercent: "", minOrder: "0", maxUses: "100", expiresAt: "" }); setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-plum text-white rounded-xl text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Promo</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-lg font-bold text-plum">{editing ? "Edit" : "Add"} Promo Code</h2><button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-plum/40" /></button></div>
            <div className="space-y-3">
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Code (e.g. SUMMER20)" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <input value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="Discount %" type="number" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} placeholder="Min Order ₹" type="number" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
                <input value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="Max Uses" type="number" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              </div>
              <input value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} type="date" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <button onClick={handleSave} className="w-full py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="space-y-2">
        {promos.map((p) => (
          <div key={p.id} className="bg-white rounded-xl p-4 flex items-center justify-between border border-plum/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-gold/10 flex items-center justify-center"><Tag className="w-5 h-5 text-rose-gold" /></div>
              <div>
                <p className="font-bold text-plum text-sm">{p.code}</p>
                <p className="text-xs text-plum/40">{p.discountPercent}% off • Min ₹{Number(p.minOrder)} • Used {p.usedCount}/{p.maxUses}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{p.active ? "Active" : "Inactive"}</span>
              <button onClick={() => { setForm({ code: p.code, discountPercent: String(p.discountPercent), minOrder: String(p.minOrder), maxUses: String(p.maxUses), expiresAt: p.expiresAt?.split("T")[0] || "" }); setEditing(p); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
