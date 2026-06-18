"use client";
import { useState, useEffect } from "react";
import { adminApi, productApi } from "@/lib/api";
import { Loader2, Save, ShoppingBag, Search } from "lucide-react";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function BestSellersAdminPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // Track changes to bestSeller status locally before saving
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productApi.list({ limit: "200" });
      if (data.status) {
        setProducts(data.products);
        const initialToggled: Record<string, boolean> = {};
        data.products.forEach((p: any) => {
          initialToggled[p.id] = !!p.isBestSeller;
        });
        setToggled(initialToggled);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (id: string, isBestSeller: boolean) => {
    setToggled((prev) => ({ ...prev, [id]: isBestSeller }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Find all products where local toggle state differs from their current state
      const updates = products.filter(p => !!p.isBestSeller !== toggled[p.id]);
      
      for (const p of updates) {
        await adminApi.updateProduct(p.id, { isBestSeller: toggled[p.id] });
      }
      
      alert("Best Sellers updated successfully!");
      await fetchProducts(); // Refresh
    } catch (error) {
      console.error(error);
      alert("Failed to update best sellers");
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.fabric || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImg = (media: any[]) => {
    if (!media || media.length === 0) return null;
    const img = media[0];
    const url = typeof img === "string" ? img : img.url;
    return url?.startsWith("http") ? url : `${API_URL}${url}`;
  };

  if (loading) {
    return (
      <AdminLayout title="Best Sellers">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#111111]/40" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Best Sellers" subtitle="Select the products you want to feature in the Our Best Sellers homepage section.">
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Selection"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Include in Best Sellers</th>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => {
                  const imgUrl = getImg(p.media);
                  const isSelected = toggled[p.id] || false;
                  
                  return (
                    <tr key={p.id} className={`transition-colors ${isSelected ? "bg-amber-50/30" : "hover:bg-gray-50/50"}`}>
                      <td className="px-6 py-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleToggle(p.id, e.target.checked)}
                              className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-amber-700" : "text-gray-500"}`}>
                            {isSelected ? "Featured" : "Not Featured"}
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                            {imgUrl ? (
                              <Image src={imgUrl} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-gray-300" /></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.fabric || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">₹{Number(p.price).toLocaleString("en-IN")}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

