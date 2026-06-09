"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Package, ArrowLeft, Save, X } from "lucide-react";
import { adminApi, productApi, sectionApi } from "@/lib/api";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", fabric: "", price: "", originalPrice: "", discountPercent: "0", features: "", sectionId: "", stock: "0", isBestSeller: false, isNewArrival: false });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login/"); return; }
    Promise.all([productApi.list({ limit: "100" }), sectionApi.list()]).then(([p, s]) => { setProducts(p.products); setSections(s.sections); }).finally(() => setLoading(false));
  }, [router]);

  const resetForm = () => setForm({ name: "", description: "", fabric: "", price: "", originalPrice: "", discountPercent: "0", features: "", sectionId: sections[0]?.id || "", stock: "0", isBestSeller: false, isNewArrival: false });

  const handleSave = async () => {
    try {
      if (editing) { await adminApi.updateProduct(editing.id, form); }
      else { await adminApi.createProduct(form); }
      const p = await productApi.list({ limit: "100" }); setProducts(p.products);
      setShowForm(false); setEditing(null); resetForm();
    } catch {}
  };

  const handleEdit = (p: any) => {
    setForm({ name: p.name, description: p.description || "", fabric: p.fabric || "", price: String(p.price), originalPrice: String(p.originalPrice), discountPercent: String(p.discountPercent), features: p.features || "", sectionId: p.sectionId, stock: String(p.stock), isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival });
    setEditing(p); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await adminApi.deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const fieldClass = "w-full px-3 py-2.5 bg-ivory/50 border border-plum/10 rounded-lg text-sm";

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Products</h1>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-plum text-white rounded-xl text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-plum">{editing ? "Edit" : "Add"} Product</h2>
              <button onClick={() => { setShowForm(false); setEditing(null); }}><X className="w-5 h-5 text-plum/40" /></button>
            </div>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name" className={fieldClass} />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className={`${fieldClass} resize-none`} />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="Fabric" className={fieldClass} />
                <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} className={fieldClass}>
                  <option value="">Select Section</option>
                  {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (₹)" type="number" className={fieldClass} />
                <input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Original Price" type="number" className={fieldClass} />
                <input value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="Discount %" type="number" className={fieldClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" type="number" className={fieldClass} />
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (comma-separated)" className={fieldClass} />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-plum/60 cursor-pointer">
                  <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="rounded border-plum/20" /> Best Seller
                </label>
                <label className="flex items-center gap-2 text-sm text-plum/60 cursor-pointer">
                  <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="rounded border-plum/20" /> New Arrival
                </label>
              </div>
              <button onClick={handleSave} className="w-full py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Save className="w-4 h-4" /> {editing ? "Update" : "Create"} Product</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-plum/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-ivory/50 text-xs text-plum/40 border-b border-plum/5">
              <th className="text-left p-3 font-medium">Product</th><th className="text-left p-3 font-medium">Section</th><th className="text-left p-3 font-medium">Price</th><th className="text-left p-3 font-medium">Stock</th><th className="text-left p-3 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-plum/5 last:border-0 hover:bg-ivory/30">
                  <td className="p-3">
                    <p className="font-medium text-plum">{p.name}</p>
                    <p className="text-xs text-plum/40">{p.fabric}</p>
                  </td>
                  <td className="p-3 text-plum/60">{p.section?.name}</td>
                  <td className="p-3 font-medium text-plum">₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{p.stock}</span></td>
                  <td className="p-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-blue-50 rounded-lg"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
