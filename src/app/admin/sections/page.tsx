"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { adminApi, sectionApi } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminSectionsPage() {
  const router = useRouter();
  const [sections, setSections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", sortOrder: "0" });

  useEffect(() => { sectionApi.list().then((d) => setSections(d.sections)).catch(() => router.push("/admin/login/")); }, [router]);

  const handleSave = async () => {
    try {
      if (editing) await adminApi.updateSection(editing.id, form);
      else await adminApi.createSection(form);
      const d = await sectionApi.list(); setSections(d.sections);
      setShowForm(false); setEditing(null); setForm({ name: "", description: "", sortOrder: "0" });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    try { await adminApi.deleteSection(id); setSections(sections.filter((s) => s.id !== id)); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Sections</h1>
        <button onClick={() => { setForm({ name: "", description: "", sortOrder: "0" }); setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-plum text-white rounded-xl text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Section</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-lg font-bold text-plum">{editing ? "Edit" : "Add"} Section</h2><button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-plum/40" /></button></div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Section Name" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm resize-none" />
              <input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} placeholder="Sort Order" type="number" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <button onClick={handleSave} className="w-full py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="space-y-2">
        {sections.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-4 flex items-center justify-between border border-plum/5">
            <div><p className="font-medium text-plum text-sm">{s.name}</p><p className="text-xs text-plum/40">{s._count?.products || 0} products • Order: {s.sortOrder}</p></div>
            <div className="flex gap-1.5">
              <button onClick={() => { setForm({ name: s.name, description: s.description || "", sortOrder: String(s.sortOrder) }); setEditing(s); setShowForm(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
              <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
