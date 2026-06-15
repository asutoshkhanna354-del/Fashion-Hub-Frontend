"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, uploadApi } from "@/lib/api";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";

interface StoryChapter {
  title: string;
  description: string;
  image: string;
  align: "left" | "right";
}

const defaultStories: StoryChapter[] = [
  {
    title: "Crafted in Banaras",
    description: "Every thread tells a story of the ancient city. Woven with devotion in the heart of Varanasi, this masterpiece carries the spiritual and cultural essence of centuries-old traditions.",
    image: "https://images.unsplash.com/photo-1596401057658-3e53288f01b0?q=80&w=1000&auto=format&fit=crop",
    align: "left"
  },
  {
    title: "Handwoven Heritage",
    description: "It takes weeks of meticulous labor on the handloom to create the intricate motifs you see. Our master weavers use techniques passed down through generations.",
    image: "https://images.unsplash.com/photo-1605051410714-3676778f69ea?q=80&w=1000&auto=format&fit=crop",
    align: "right"
  },
  {
    title: "Fabric Story",
    description: "Made from the finest pure silk and authentic zari. The luxurious drape and subtle sheen are testaments to the uncompromising quality of raw materials used.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
    align: "left"
  },
  {
    title: "Artisan Story",
    description: "By choosing this piece, you are supporting the livelihood of traditional artisans and keeping the sacred art of Banarasi weaving alive for future generations.",
    image: "https://images.unsplash.com/photo-1592643534571-002f2320b72a?q=80&w=1000&auto=format&fit=crop",
    align: "right"
  }
];

export default function StorySettingsPage() {
  const [stories, setStories] = useState<StoryChapter[]>(defaultStories);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    adminApi.getSettings().then((data) => {
      if (data.settings?.story_data) {
        try {
          const parsed = JSON.parse(data.settings.story_data);
          if (Array.isArray(parsed) && parsed.length === 4) {
            setStories(parsed);
          }
        } catch (e) {
          console.error("Failed to parse story_data", e);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings({ story_data: JSON.stringify(stories) });
      alert("Story settings updated successfully!");
    } catch (error) {
      alert("Failed to save settings");
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIdx(index);
    try {
      const url = await uploadApi.uploadFile(file);
      const newStories = [...stories];
      newStories[index].image = url;
      setStories(newStories);
    } catch (error) {
      alert("Upload failed");
    }
    setUploadingIdx(null);
  };

  const updateStory = (index: number, key: keyof StoryChapter, value: string) => {
    const newStories = [...stories];
    newStories[index] = { ...newStories[index], [key]: value };
    setStories(newStories);
  };

  if (loading) return <AdminLayout title="Homepage Story"><div className="p-8 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout
      title="Homepage Story"
      subtitle="Manage 'The Story Behind The Silk' section"
      actions={
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-plum text-white rounded-lg font-medium hover:bg-plum/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      }
    >
      <div className="space-y-8 max-w-4xl">
        {stories.map((story, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-plum/10 shadow-sm">
            <h3 className="text-lg font-bold text-plum mb-4 border-b border-plum/5 pb-2">Chapter 0{idx + 1}</h3>
            
            <div className="grid md:grid-cols-[1fr_2fr] gap-6">
              {/* Image Column */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-plum">Chapter Image</label>
                <div className="relative aspect-[4/5] bg-ivory rounded-xl border-2 border-dashed border-plum/20 flex flex-col items-center justify-center overflow-hidden">
                  {story.image ? (
                    <>
                      <Image src={story.image.startsWith("http") ? story.image : `https://Solanki-Vastra-backend.onrender.com${story.image}`} alt={story.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-plum px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Change Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} disabled={uploadingIdx === idx} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-plum/40 hover:text-plum transition-colors">
                      <Upload className="w-6 h-6" />
                      <span className="text-xs font-medium">{uploadingIdx === idx ? "Uploading..." : "Upload Image"}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} disabled={uploadingIdx === idx} />
                    </label>
                  )}
                </div>
              </div>

              {/* Text Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-plum mb-1">Title</label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => updateStory(idx, "title", e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-plum mb-1">Description</label>
                  <textarea
                    value={story.description}
                    onChange={(e) => updateStory(idx, "description", e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

