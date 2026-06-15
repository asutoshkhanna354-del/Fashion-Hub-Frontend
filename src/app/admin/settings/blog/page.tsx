"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { adminApi, blogApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import MediaUploader from "@/components/admin/MediaUploader";
import Image from "next/image";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: "General", author: "Solanki Vastra Editorial", image: "", featured: false
  });
  const [imageMedia, setImageMedia] = useState<any[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    blogApi.list()
      .then((res) => setPosts(res.posts || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const handleSave = async () => {
    try {
      const data = { ...form, image: imageMedia[0]?.url || form.image || null };
      if (editing) await adminApi.updateBlogPost(editing.id, data);
      else await adminApi.createBlogPost(data);
      fetchPosts();
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (e: any) { alert(e.message || "Error saving post"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await adminApi.deleteBlogPost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (e: any) { alert(e.message); }
  };

  const resetForm = () => {
    setForm({ title: "", excerpt: "", content: "", category: "General", author: "Solanki Vastra Editorial", image: "", featured: false });
    setImageMedia([]);
  };

  const fieldClass = "w-full px-3.5 py-3 bg-[#F8F6F3] border border-[#1E1533]/[0.06] rounded-xl text-sm text-[#1E1533] placeholder:text-[#1E1533]/25 focus:outline-none focus:border-[#C58F7A]/30 focus:ring-1 focus:ring-[#C58F7A]/10 transition-all";
  const labelClass = "block text-[11px] font-semibold text-[#1E1533]/40 uppercase tracking-wider mb-1.5";

  return (
    <AdminLayout
      title="Blog & Journal"
      subtitle={`${posts.length} posts`}
      actions={
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} className="px-4 py-2.5 bg-gradient-to-r from-[#C58F7A] to-[#B89CCF] text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-[#C58F7A]/20">
          <Plus className="w-3.5 h-3.5" /> Add Post
        </button>
      }
    >
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1533]/[0.04]">
                <h2 className="font-display text-base font-bold text-[#1E1533]">{editing ? "Edit" : "New"} Post</h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg hover:bg-[#F8F6F3] flex items-center justify-center"><X className="w-4 h-4 text-[#1E1533]/30" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className={labelClass}>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post Title" className={fieldClass} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className={labelClass}>Category</label>
                    <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Heritage" className={fieldClass} />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Author</label>
                    <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author Name" className={fieldClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description..." rows={2} className={`${fieldClass} resize-none`} />
                </div>
                <div>
                  <label className={labelClass}>Content</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full content..." rows={5} className={`${fieldClass} resize-none`} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm text-[#1E1533] font-medium cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded text-[#C58F7A] focus:ring-[#C58F7A]" />
                    Featured Post (Displays large on blog page)
                  </label>
                </div>
                <MediaUploader media={imageMedia} onChange={(m) => setImageMedia(m)} single={true} label="Cover Image" />
              </div>
              <div className="px-6 py-4 border-t border-[#1E1533]/[0.04] flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-[#1E1533]/[0.06] text-[#1E1533]/50 rounded-xl text-sm font-medium hover:bg-[#F8F6F3]">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 bg-gradient-to-r from-[#1E1533] to-[#1E1533]/90 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#1E1533]/20" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((s) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[#1E1533]/[0.03] shadow-sm overflow-hidden group">
              <div className="relative h-36 bg-gradient-to-br from-[#F8F6F3] to-[#EDE8E0]">
                {s.image ? (
                  <Image src={s.image} alt={s.title} fill className="object-cover" sizes="400px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-[#1E1533]/5" />
                  </div>
                )}
                {s.featured && (
                  <div className="absolute top-2 left-2 bg-[#C58F7A] text-white text-[10px] px-2 py-0.5 rounded font-medium uppercase">
                    Featured
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between h-[120px]">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1533] line-clamp-1">{s.title}</h3>
                  <p className="text-[11px] text-[#1E1533]/50 line-clamp-2 mt-1">{s.excerpt}</p>
                  <p className="text-[10px] text-[#1E1533]/30 mt-2">{s.category} • {new Date(s.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1 self-end mt-2">
                  <button onClick={() => {
                    setForm({ title: s.title, excerpt: s.excerpt, content: s.content || "", category: s.category, author: s.author, image: s.image || "", featured: s.featured });
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
          {posts.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-[#1E1533]/[0.03]">
              <p className="text-sm text-[#1E1533]/40">No posts yet. Add your first post!</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

