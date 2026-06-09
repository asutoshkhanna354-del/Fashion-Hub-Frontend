"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Shield, X, Save } from "lucide-react";
import { adminApi } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminManagementPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "sub_admin" });

  useEffect(() => { adminApi.listAdmins().then((d) => setAdmins(d.admins)).catch(() => router.push("/admin/login/")); }, [router]);

  const handleCreate = async () => {
    try { await adminApi.createAdmin(form); const d = await adminApi.listAdmins(); setAdmins(d.admins); setShowForm(false); setForm({ username: "", password: "", role: "sub_admin" }); } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this admin?")) return;
    try { await adminApi.deleteAdmin(id); setAdmins(admins.filter((a) => a.id !== id)); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Admin Management</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-plum text-white rounded-xl text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Sub-Admin</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4"><h2 className="font-display text-lg font-bold text-plum">New Sub-Admin</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-plum/40" /></button></div>
            <div className="space-y-3">
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" className="w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm" />
              <button onClick={handleCreate} className="w-full py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Create</button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="space-y-2">
        {admins.map((a) => (
          <div key={a.id} className="bg-white rounded-xl p-4 flex items-center justify-between border border-plum/5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.role === "main_admin" ? "bg-plum/10" : "bg-rose-gold/10"}`}>
                <Shield className={`w-5 h-5 ${a.role === "main_admin" ? "text-plum" : "text-rose-gold"}`} />
              </div>
              <div>
                <p className="font-medium text-plum text-sm">{a.username}</p>
                <p className="text-xs text-plum/40">{a.role === "main_admin" ? "Main Admin" : "Sub Admin"} • {a.email || "No email"}</p>
              </div>
            </div>
            {a.role !== "main_admin" && (
              <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
