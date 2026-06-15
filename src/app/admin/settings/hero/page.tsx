"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, uploadApi } from "@/lib/api";
import { Save, Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface HeroSlide {
  id: string;
  subtitle: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  image: string;
  bgGradient: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: "1",
    subtitle: "Timeless Elegance, Crafted for You",
    title: "Discover Grace in Every",
    highlight: "Drape",
    description: "Premium sarees crafted with love, tradition & perfection. Explore our curated collection of handpicked designer pieces.",
    cta: "Shop Now",
    image: "/images/hero/hero-1.png",
    bgGradient: "from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2]",
  },
  {
    id: "2",
    subtitle: "New Collection 2026",
    title: "Where Tradition Meets",
    highlight: "Modernity",
    description: "Unveiling our latest collection — a perfect blend of heritage artistry and contemporary design for the modern woman.",
    cta: "Explore Collection",
    image: "/images/hero/hero-2.png",
    bgGradient: "from-[#F8F0F5] via-[#FAF7F2] to-[#F5EFE6]",
  }
];

export default function HeroSettingsPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    adminApi.getSettings().then((data) => {
      if (data.settings?.hero_slides) {
        try {
          const parsed = JSON.parse(data.settings.hero_slides);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSlides(parsed);
          } else {
            setSlides(defaultSlides);
          }
        } catch (e) {
          console.error("Failed to parse hero_slides", e);
          setSlides(defaultSlides);
        }
      } else {
        setSlides(defaultSlides);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings({ hero_slides: JSON.stringify(slides) });
      alert("Hero settings updated successfully!");
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
      const newSlides = [...slides];
      newSlides[index].image = url;
      setSlides(newSlides);
    } catch (error) {
      alert("Upload failed");
    }
    setUploadingIdx(null);
  };

  const updateSlide = (index: number, key: keyof HeroSlide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [key]: value };
    setSlides(newSlides);
  };

  const addSlide = () => {
    setSlides([
      ...slides,
      {
        id: Date.now().toString(),
        subtitle: "New Subtitle",
        title: "New Title",
        highlight: "Highlight",
        description: "New description...",
        cta: "Shop Now",
        image: "",
        bgGradient: "from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2]",
      }
    ]);
  };

  const removeSlide = (index: number) => {
    if (slides.length === 1) {
      alert("You must have at least one hero slide.");
      return;
    }
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
  };

  if (loading) return <AdminLayout title="Hero Banner"><div className="p-8 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout
      title="Hero Banner"
      subtitle="Manage the rotating slides on the homepage hero section."
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
      <div className="space-y-8 max-w-5xl">
        <div className="flex justify-end mb-4">
          <button onClick={addSlide} className="flex items-center gap-2 px-4 py-2 border border-plum text-plum rounded-lg text-sm font-semibold hover:bg-plum/5">
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>

        {slides.map((slide, idx) => (
          <div key={slide.id} className="bg-white p-6 rounded-2xl border border-plum/10 shadow-sm relative">
            <div className="flex justify-between items-center mb-4 border-b border-plum/5 pb-2">
              <h3 className="text-lg font-bold text-plum">Slide {idx + 1}</h3>
              <button onClick={() => removeSlide(idx)} className="text-red-500 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
              {/* Image Column */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-plum">Slide Image</label>
                <div className="relative aspect-[3/4] bg-ivory rounded-xl border-2 border-dashed border-plum/20 flex flex-col items-center justify-center overflow-hidden">
                  {slide.image ? (
                    <>
                      <Image src={slide.image.startsWith("http") ? slide.image : `https://Solanki-Vastra-backend.onrender.com${slide.image}`} alt="Slide" fill className="object-cover" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Subtitle</label>
                    <input type="text" value={slide.subtitle} onChange={(e) => updateSlide(idx, "subtitle", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">CTA Button Text</label>
                    <input type="text" value={slide.cta} onChange={(e) => updateSlide(idx, "cta", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Main Title</label>
                    <input type="text" value={slide.title} onChange={(e) => updateSlide(idx, "title", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Highlighted Title</label>
                    <input type="text" value={slide.highlight} onChange={(e) => updateSlide(idx, "highlight", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-plum mb-1">Description</label>
                  <textarea value={slide.description} onChange={(e) => updateSlide(idx, "description", e.target.value)} rows={3} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold resize-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-plum mb-1">Background Gradient Tailwind Classes</label>
                  <input type="text" value={slide.bgGradient} onChange={(e) => updateSlide(idx, "bgGradient", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm font-mono text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  <p className="text-xs text-plum/50 mt-1">E.g., from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2]</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

