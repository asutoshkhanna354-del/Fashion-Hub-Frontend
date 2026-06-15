"use client";
import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { Loader2, Save, Plus, Trash2, Edit2, MapPin, X } from "lucide-react";
import MediaUploader from "@/components/admin/MediaUploader";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";

export default function StoresManagerPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyForm = {
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    mapSrc: "",
    instagramLink: "",
    youtubeLink: "",
    media: [] as any[],
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminApi.getSettings();
      if (data.status && data.settings && data.settings.stores_data) {
        try {
          const parsed = JSON.parse(data.settings.stores_data);
          setStores(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error("Failed to parse stores_data");
          setStores([]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveData = async (newStores: any[]) => {
    setSaving(true);
    try {
      await adminApi.updateSettings({ stores_data: JSON.stringify(newStores) });
      setStores(newStores);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save stores");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForm = () => {
    if (!form.name || !form.address) {
      alert("Name and Address are required!");
      return;
    }

    const currentStore = {
      ...form,
      id: form.id || Date.now().toString(),
    };

    let updatedStores;
    if (editingId) {
      updatedStores = stores.map((s) => (s.id === editingId ? currentStore : s));
    } else {
      updatedStores = [...stores, currentStore];
    }

    handleSaveData(updatedStores);
  };

  const handleEdit = (store: any) => {
    setForm(store);
    setEditingId(store.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this boutique?")) {
      const updatedStores = stores.filter((s) => s.id !== id);
      handleSaveData(updatedStores);
    }
  };

  const openNewForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <AdminLayout title="Boutiques & Stores">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Boutiques & Stores" subtitle="Manage physical store locations, hours, maps, and gallery media."
      actions={
        <button
          onClick={openNewForm}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" /> Add Boutique
        </button>
      }
    >
      <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-100 relative">
              {store.media && store.media.length > 0 ? (
                <Image
                  src={typeof store.media[0] === 'string' ? store.media[0] : store.media[0].url}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{store.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{store.address}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">{store.media?.length || 0} Media files</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(store)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(store.id)} disabled={saving} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No boutiques added yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">Add your physical store locations here to display them on the website.</p>
          <button onClick={openNewForm} className="text-black font-semibold text-sm hover:underline">
            + Add First Boutique
          </button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-4xl my-8 shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-display text-lg font-bold text-gray-900">{editingId ? "Edit Boutique" : "New Boutique"}</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 overflow-auto max-h-[75vh] grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Info Column */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Location Details</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Store Name</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="e.g. The Varanasi Flagship" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black h-20 resize-none" placeholder="Full store address..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                      <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="+91 800..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="store@noorsilk.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Opening Hours</label>
                    <input type="text" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="Monday - Sunday: 10:00 AM - 8:30 PM" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Google Maps Embed URL</label>
                    <input type="text" value={form.mapSrc} onChange={(e) => setForm({ ...form, mapSrc: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="https://www.google.com/maps/embed?pb=..." />
                    <p className="text-[10px] text-gray-400 mt-1">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy HTML and extract the src URL.</p>
                  </div>
                </div>

                {/* Media Column */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Media & Social Links</h3>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Instagram Post Link (Optional)</label>
                    <input type="text" value={form.instagramLink} onChange={(e) => setForm({ ...form, instagramLink: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="https://instagram.com/p/..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">YouTube Video Link (Optional)</label>
                    <input type="text" value={form.youtubeLink} onChange={(e) => setForm({ ...form, youtubeLink: e.target.value })} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black" placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Store Photos & Videos</label>
                    <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                      <MediaUploader
                        media={form.media || []}
                        onChange={(media) => setForm({ ...form, media })}
                        label="Upload Gallery Media"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Upload high-quality images and video tours of your boutique.</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleSubmitForm} disabled={saving} className="flex-1 py-2.5 bg-black text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? "Update Boutique" : "Save Boutique"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </AdminLayout>
  );
}
