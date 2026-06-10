"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, X, Save } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "sub_admin" });

  useEffect(() => { adminApi.listAdmins().then((d) => setAdmins(d.admins)).catch(() => {}); }, []);

  const handleCreate = async () => {
    try { await adminApi.createAdmin(form); const d = await adminApi.listAdmins(); setAdmins(d.admins); setShowForm(false); setForm({ username: "", password: "", role: "sub_admin" }); } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this admin?")) return;
    try { await adminApi.deleteAdmin(id); setAdmins(admins.filter((a) => a.id !== id)); } catch (e: any) { alert(e.message); }
  };

  const fieldClass = "w-full px-3.5 py-3 bg-[#F8F6F3] border border-[#1E1533]/[0.06] rounded-xl text-sm text-[#1E1533] placeholder:text-[#1E1533]/25 focus:outline-none focus:border-[#C58F7A]/30 focus:ring-1 focus:ring-[#C58F7A]/10 transition-all";

  return (
    <AdminLayout title="Admin Team" subtitle={`${admins.length} team members`}
      actions={
        <button onClick={() => setShowForm(true)} className="px-4 py-2.5 bg-gradient-to-r from-[#C58F7A] to-[#B89CCF] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#C58F7A]/20 hover:shadow-xl transition-shadow">
          <Plus className="w-3.5 h-3.5" /> Add Sub-Admin
        </button>
      }
    >
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1533]/[0.04]">
                <h2 className="font-display text-base font-bold text-[#1E1533]">New Sub-Admin</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-[#F8F6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#1E1533]/30" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="block text-[11px] font-semibold text-[#1E1533]/40 uppercase tracking-wider mb-1.5">Username</label><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Enter username" className={fieldClass} /></div>
                <div><label className="block text-[11px] font-semibold text-[#1E1533]/40 uppercase tracking-wider mb-1.5">Password</label><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter password" type="password" className={fieldClass} /></div>
              </div>
              <div className="px-6 py-4 border-t border-[#1E1533]/[0.04] flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#1E1533]/[0.06] text-[#1E1533]/50 rounded-xl text-sm font-medium hover:bg-[#F8F6F3] transition-colors">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3 bg-[#1E1533] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"><Save className="w-4 h-4" /> Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
        {admins.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-5 border border-[#1E1533]/[0.03] shadow-sm flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${a.role === "main_admin" ? "bg-gradient-to-br from-[#1E1533] to-[#1E1533]/80" : "bg-gradient-to-br from-[#C58F7A]/20 to-[#B89CCF]/20"}`}>
                <Shield className={`w-5 h-5 ${a.role === "main_admin" ? "text-white" : "text-[#C58F7A]"}`} />
              </div>
              <div>
                <p className="font-semibold text-[#1E1533] text-sm">{a.username}</p>
                <p className="text-[10px] text-[#1E1533]/40 mt-0.5">{a.role === "main_admin" ? "Main Admin" : "Sub Admin"}</p>
              </div>
            </div>
            {a.role !== "main_admin" && (
              <button onClick={() => handleDelete(a.id)} className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
