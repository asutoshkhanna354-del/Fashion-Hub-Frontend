"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, Search, ImageIcon } from "lucide-react";
import { adminApi, productApi, sectionApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import MediaUploader from "@/components/admin/MediaUploader";
import Image from "next/image";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    name: "", description: "", fabric: "", price: "", originalPrice: "",
    discountPercent: "0", features: "", colors: "", sectionId: "", stock: "0",
    isBestSeller: false, isNewArrival: false, media: [] as any[], videoUrl: "",
  });

  useEffect(() => {
    Promise.all([productApi.list({ limit: "200" }), sectionApi.list()])
      .then(([p, s]) => { setProducts(p.products); setSections(s.sections); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => setForm({
    name: "", description: "", fabric: "", price: "", originalPrice: "",
    discountPercent: "0", features: "", colors: "", sectionId: sections[0]?.id || "", stock: "0",
    isBestSeller: false, isNewArrival: false, media: [], videoUrl: "",
  });

  const handleSave = async () => {
    try {
      const data = { ...form, media: form.media };
      if (editing) { await adminApi.updateProduct(editing.id, data); }
      else { await adminApi.createProduct(data); }
      const p = await productApi.list({ limit: "200" }); setProducts(p.products);
      setShowForm(false); setEditing(null); resetForm();
    } catch (e: any) { alert(e.message || "Error saving product"); }
  };

  const handleEdit = (p: any) => {
    const media = Array.isArray(p.media) ? p.media : [];
    setForm({
      name: p.name, description: p.description || "", fabric: p.fabric || "",
      price: String(p.price), originalPrice: String(p.originalPrice),
      discountPercent: String(p.discountPercent), features: p.features || "", colors: p.colors || "",
      sectionId: p.sectionId, stock: String(p.stock),
      isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival, media, videoUrl: p.videoUrl || "",
    });
    setEditing(p); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await adminApi.deleteProduct(id);
    setProducts(products.filter((p) => p.id !== id));
  };

  const getImg = (media: any[]) => {
    if (!media || media.length === 0) return null;
    const img = media[0];
    const url = typeof img === "string" ? img : img.url;
    return url?.startsWith("http") ? url : `${API_URL}${url}`;
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.fabric || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fieldClass = "w-full px-3.5 py-3 bg-[#F8F6F3] border border-[#111111]/[0.06] rounded-xl text-sm text-[#111111] placeholder:text-[#111111]/25 focus:outline-none focus:border-[#C5A47E]/30 focus:ring-1 focus:ring-[#C5A47E]/10 transition-all";
  const labelClass = "block text-[11px] font-semibold text-[#111111]/40 uppercase tracking-wider mb-1.5";

  return (
    <AdminLayout
      title="Products"
      subtitle={`${products.length} products in store`}
      actions={
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="px-4 py-2.5 bg-gradient-to-r from-[#C5A47E] to-[#C5A47E] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#C5A47E]/20 hover:shadow-xl transition-shadow">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      }
    >
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/20" />
        <input
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name or fabric..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#111111]/[0.04] rounded-xl text-sm text-[#111111] placeholder:text-[#111111]/20 focus:outline-none focus:border-[#C5A47E]/30 shadow-sm"
        />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:max-w-2xl max-h-[100dvh] sm:max-h-[90vh] shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#111111]/[0.04] flex-shrink-0">
                <h2 className="font-display text-base font-bold text-[#111111]">{editing ? "Edit" : "New"} Product</h2>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="w-8 h-8 rounded-lg hover:bg-[#F8F6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#111111]/30" /></button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className={labelClass}>Product Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Royal Silk Saree" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detailed product description..." rows={3} className={`${fieldClass} resize-none`} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Fabric</label><input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="e.g. Pure Silk" className={fieldClass} /></div>
                  <div><label className={labelClass}>Section</label>
                    <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} className={fieldClass}>
                      <option value="">Select section</option>
                      {sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Selling Price (₹)</label><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2999" type="number" className={fieldClass} /></div>
                  <div><label className={labelClass}>Original Price (₹)</label><input value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="4999" type="number" className={fieldClass} /></div>
                  <div><label className={labelClass}>Discount %</label><input value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} type="number" className={fieldClass} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Stock Quantity</label><input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} type="number" className={fieldClass} /></div>
                  <div><label className={labelClass}>Colors (comma-separated)</label><input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="Red, Blue, Green" className={fieldClass} /></div>
                </div>
                <div><label className={labelClass}>Features (comma-separated)</label><input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Handwoven, Zari work" className={fieldClass} /></div>
                <div>
                  <label className={labelClass}>External Video URL (Optional)</label>
                  <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="e.g. YouTube or direct MP4 link" className={fieldClass} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <label className="flex items-center gap-2.5 text-sm text-[#111111]/60 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="w-4 h-4 rounded border-[#111111]/15 text-[#C5A47E] focus:ring-[#C5A47E]/20" /> Best Seller
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-[#111111]/60 cursor-pointer select-none">
                    <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} className="w-4 h-4 rounded border-[#111111]/15 text-[#C5A47E] focus:ring-[#C5A47E]/20" /> New Arrival
                  </label>
                </div>

                <MediaUploader
                  media={form.media}
                  onChange={(media) => setForm({ ...form, media })}
                  label="Product Images & Videos"
                />
              </div>
              <div className="px-6 py-4 border-t border-[#111111]/[0.04] flex gap-3 flex-shrink-0">
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 py-3 border border-[#111111]/[0.06] text-[#111111]/50 rounded-xl text-sm font-medium hover:bg-[#F8F6F3] transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-[#111111] to-[#111111]/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                  <Save className="w-4 h-4" /> {editing ? "Update" : "Create"} Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#111111]/[0.03] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-[#111111]/30 uppercase tracking-wider border-b border-[#111111]/[0.03]">
                <th className="text-left px-6 py-3 font-semibold">Product</th>
                <th className="text-left px-6 py-3 font-semibold">Section</th>
                <th className="text-left px-6 py-3 font-semibold">Price</th>
                <th className="text-left px-6 py-3 font-semibold">Stock</th>
                <th className="text-left px-6 py-3 font-semibold">Tags</th>
                <th className="text-right px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const imgUrl = getImg(p.media);
                return (
                  <tr key={p.id} className="border-b border-[#111111]/[0.02] hover:bg-[#F8F6F3]/50 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F8F6F3] overflow-hidden flex-shrink-0 border border-[#111111]/[0.04]">
                          {imgUrl ? (
                            <Image src={imgUrl} alt="" width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-[#111111]/10" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#111111] text-xs">{p.name}</p>
                          <p className="text-[10px] text-[#111111]/30">{p.fabric || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#111111]/40">{p.section?.name || "—"}</td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-[#111111] text-xs">₹{Number(p.price).toLocaleString("en-IN")}</p>
                      {Number(p.originalPrice) > Number(p.price) && <p className="text-[10px] text-[#111111]/25 line-through">₹{Number(p.originalPrice).toLocaleString("en-IN")}</p>}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${p.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex gap-1">
                        {p.isBestSeller && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-semibold">Best</span>}
                        {p.isNewArrival && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">New</span>}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => handleEdit(p)} className="p-2 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5 text-blue-500" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-10 h-10 text-[#111111]/5 mx-auto mb-2" />
            <p className="text-xs text-[#111111]/25">{searchQuery ? "No products match your search" : "No products yet"}</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

