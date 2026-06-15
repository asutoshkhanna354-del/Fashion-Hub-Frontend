"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Layers, ImageIcon } from "lucide-react";
import { adminApi, sectionApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import MediaUploader from "@/components/admin/MediaUploader";
import Image from "next/image";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", sortOrder: "0", image: "", videoUrl: "", type: "collection" });
  const [imageMedia, setImageMedia] = useState<any[]>([]);

  useEffect(() => {
    sectionApi.list().then((d) => setSections(d.sections)).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      const data = { ...form, image: imageMedia[0]?.url || form.image || null };
      if (editing) await adminApi.updateSection(editing.id, data);
      else await adminApi.createSection(data);
      const d = await sectionApi.list(); setSections(d.sections);
      setShowForm(false); setEditing(null);
      setForm({ name: "", description: "", sortOrder: "0", image: "", videoUrl: "", type: "collection" });
      setImageMedia([]);
    } catch (e: any) { alert(e.message || "Error"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    try { await adminApi.deleteSection(id); setSections(sections.filter((s) => s.id !== id)); }
    catch (e: any) { alert(e.message); }
  };

  const fieldClass = "w-full px-3.5 py-3 bg-[#F8F6F3] border border-[#1E1533]/[0.06] rounded-xl text-sm text-[#1E1533] placeholder:text-[#1E1533]/25 focus:outline-none focus:border-[#C58F7A]/30 focus:ring-1 focus:ring-[#C58F7A]/10 transition-all";
  const labelClass = "block text-[11px] font-semibold text-[#1E1533]/40 uppercase tracking-wider mb-1.5";

  return (
    <AdminLayout
      title="Sections"
      subtitle={`${sections.length} collection categories`}
      actions={
        <button onClick={() => { setForm({ name: "", description: "", sortOrder: "0", image: "", videoUrl: "", type: "collection" }); setImageMedia([]); setEditing(null); setShowForm(true); }} className="px-4 py-2.5 bg-gradient-to-r from-[#C58F7A] to-[#B89CCF] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#C58F7A]/20">
          <Plus className="w-3.5 h-3.5" /> Add Section
        </button>
      }
    >
      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1533]/[0.04]">
                <h2 className="font-display text-base font-bold text-[#1E1533]">{editing ? "Edit" : "New"} Section</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="w-8 h-8 rounded-lg hover:bg-[#F8F6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#1E1533]/30" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelClass}>Section Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Silk Sarees or Diwali Special" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={fieldClass}>
                    <option value="collection">Shop By Collection</option>
                    <option value="occasion">Shop By Occasion (Festive)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description..." rows={2} className={`${fieldClass} resize-none`} />
                </div>
                <div>
                  <label className={labelClass}>Sort Order</label>
                  <input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} type="number" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>External Video URL (Optional)</label>
                  <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="e.g. YouTube or direct MP4 link" className={fieldClass} />
                </div>

                {/* Cover Image */}
                <MediaUploader
                  media={imageMedia}
                  onChange={(m) => setImageMedia(m)}
                  single={true}
                  label="Cover Image"
                />
              </div>
              <div className="px-6 py-4 border-t border-[#1E1533]/[0.04] flex gap-3">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-3 border border-[#1E1533]/[0.06] text-[#1E1533]/50 rounded-xl text-sm font-medium hover:bg-[#F8F6F3]">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-[#1E1533] to-[#1E1533]/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sections Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#1E1533]/[0.03] shadow-sm overflow-hidden group">
            {/* Cover Image */}
            <div className="relative h-36 bg-gradient-to-br from-[#F8F6F3] to-[#EDE8E0]">
              {s.image ? (
                <Image src={s.image} alt={s.name} fill className="object-cover" sizes="400px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-[#1E1533]/5" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="text-sm font-bold text-white">{s.name}</h3>
                <p className="text-[10px] text-white/60">{s._count?.products || 0} products</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                {s.description && <p className="text-[11px] text-[#1E1533]/35 truncate max-w-[200px]">{s.description}</p>}
                <p className="text-[10px] text-[#1E1533]/20 mt-0.5">Sort: {s.sortOrder}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => {
                  setForm({ name: s.name, description: s.description || "", sortOrder: String(s.sortOrder), image: s.image || "", videoUrl: s.videoUrl || "", type: s.type || "collection" });
                  setImageMedia(s.image ? [{ url: s.image, type: "image" as const }] : []);
                  setEditing(s); setShowForm(true);
                }} className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                </button>
                <button onClick={() => handleDelete(s.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#1E1533]/[0.03]">
          <Layers className="w-10 h-10 text-[#1E1533]/5 mx-auto mb-2" />
          <p className="text-xs text-[#1E1533]/25">No sections yet. Add your first collection!</p>
        </div>
      )}
    </AdminLayout>
  );
}
