"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, uploadApi } from "@/lib/api";
import { Save, Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  link: string;
  image: string;
  bgColor: string;
  textColor: string;
  position: "left" | "right";
}

const defaultBanners: PromoBanner[] = [
  {
    id: "1",
    title: "Summer Breeze",
    subtitle: "New Collection",
    description: "Light, Colorful, Beautiful. Perfect for the season ahead.",
    cta: "Explore Collection",
    link: "/collections/summer",
    image: "/images/banners/summer.png",
    bgColor: "from-sage/15 via-sage-light/10 to-ivory",
    textColor: "text-plum",
    position: "left",
  },
  {
    id: "2",
    title: "Celebrate in Style & Color",
    subtitle: "Festive Special",
    description: "Up to 30% Off. Limited time festive collection offer.",
    cta: "Shop Festive",
    link: "/collections/festive",
    image: "/images/banners/summer.png",
    bgColor: "from-plum via-plum-light to-plum",
    textColor: "text-white",
    position: "right",
  },
  {
    id: "3",
    title: "Wedding Season",
    subtitle: "Special Occasion",
    description: "Exquisite bridal & trousseau collection",
    cta: "Shop Now",
    link: "/collections/wedding",
    image: "",
    bgColor: "from-rose-gold/10 via-lavender/10 to-rose-gold/5",
    textColor: "text-plum",
    position: "left",
  },
  {
    id: "4",
    title: "Designer Picks",
    subtitle: "Curated For You",
    description: "Handpicked designer sarees for every taste",
    cta: "Explore",
    link: "/collections/designer",
    image: "",
    bgColor: "from-lavender/10 via-plum/5 to-lavender/10",
    textColor: "text-plum",
    position: "right",
  }
];

export default function PromoBannersSettingsPage() {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    adminApi.getSettings().then((data) => {
      if (data.settings?.promo_banners) {
        try {
          const parsed = JSON.parse(data.settings.promo_banners);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const padded = [...parsed];
            while (padded.length < 4) {
              padded.push(defaultBanners[padded.length]);
            }
            setBanners(padded);
          } else {
            setBanners(defaultBanners);
          }
        } catch (e) {
          console.error("Failed to parse promo_banners", e);
          setBanners(defaultBanners);
        }
      } else {
        setBanners(defaultBanners);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings({ promo_banners: JSON.stringify(banners) });
      alert("Promo banners updated successfully!");
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
      const newBanners = [...banners];
      newBanners[index].image = url;
      setBanners(newBanners);
    } catch (error) {
      alert("Upload failed");
    }
    setUploadingIdx(null);
  };

  const updateBanner = (index: number, key: keyof PromoBanner, value: string) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [key]: value };
    setBanners(newBanners);
  };

  const addBanner = () => {
    if (banners.length >= 4) {
      alert("You can only have up to 4 banners.");
      return;
    }
    setBanners([
      ...banners,
      {
        id: Date.now().toString(),
        subtitle: "New Subtitle",
        title: "New Banner Title",
        description: "Banner description...",
        cta: "Shop Now",
        link: "/collections/new",
        image: "",
        bgColor: "from-sage/15 via-sage-light/10 to-ivory",
        textColor: "text-plum",
        position: "left",
      }
    ]);
  };

  const removeBanner = (index: number) => {
    if (banners.length === 1) {
      alert("You must have at least one banner.");
      return;
    }
    const newBanners = banners.filter((_, i) => i !== index);
    setBanners(newBanners);
  };

  if (loading) return <AdminLayout title="Promo Banners"><div className="p-8 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout
      title="Promo Banners"
      subtitle="Manage the promotional banners shown on the homepage."
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
          <button onClick={addBanner} className="flex items-center gap-2 px-4 py-2 border border-plum text-plum rounded-lg text-sm font-semibold hover:bg-plum/5">
            <Plus className="w-4 h-4" /> Add Banner
          </button>
        </div>

        {banners.map((banner, idx) => (
          <div key={banner.id} className="bg-white p-6 rounded-2xl border border-plum/10 shadow-sm relative">
            <div className="flex justify-between items-center mb-4 border-b border-plum/5 pb-2">
              <h3 className="text-lg font-bold text-plum">Banner {idx + 1} {idx >= 2 ? "(Secondary Small Banner)" : "(Main Large Banner)"}</h3>
              <button onClick={() => removeBanner(idx)} className="text-red-500 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-[1fr_2fr] gap-8">
              {/* Image Column */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-plum">Banner Image / Background</label>
                <div className={`relative aspect-[4/3] bg-ivory rounded-xl border-2 border-dashed border-plum/20 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br ${banner.bgColor}`}>
                  {banner.image ? (
                    <>
                      <Image src={banner.image.startsWith("http") ? banner.image : `https://Solanki-Vastra-backend.onrender.com${banner.image}`} alt="Banner" fill className="object-cover opacity-60 mix-blend-multiply" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-plum px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Change Image
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, idx)} disabled={uploadingIdx === idx} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-plum hover:text-plum transition-colors relative z-10 bg-white/80 p-4 rounded-xl">
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
                    <input type="text" value={banner.subtitle} onChange={(e) => updateBanner(idx, "subtitle", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Main Title</label>
                    <input type="text" value={banner.title} onChange={(e) => updateBanner(idx, "title", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-plum mb-1">Description</label>
                  <textarea value={banner.description} onChange={(e) => updateBanner(idx, "description", e.target.value)} rows={2} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Button Text</label>
                    <input type="text" value={banner.cta} onChange={(e) => updateBanner(idx, "cta", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Button Link URL</label>
                    <input type="text" value={banner.link} onChange={(e) => updateBanner(idx, "link", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Background Gradient Tailwind Classes</label>
                    <input type="text" value={banner.bgColor} onChange={(e) => updateBanner(idx, "bgColor", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm font-mono text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold" />
                    <p className="text-[10px] text-plum/50 mt-1 leading-tight">E.g., `from-sage/15 to-ivory` or `from-[#8B5A2B] to-[#D2B48C]`</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-plum mb-1">Text Color Class</label>
                    <select value={banner.textColor} onChange={(e) => updateBanner(idx, "textColor", e.target.value)} className="w-full px-4 py-2 bg-white border border-plum/20 rounded-lg text-sm text-plum focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold">
                      <option value="text-plum">Dark Plum (Light Backgrounds)</option>
                      <option value="text-white">White (Dark Backgrounds)</option>
                      <option value="text-sage-dark">Dark Sage</option>
                      <option value="text-rose-gold-dark">Dark Rose Gold</option>
                    </select>
                  </div>
                </div>

                {idx < 2 && (
                  <div>
                     <label className="block text-sm font-medium text-plum mb-1">Text Position</label>
                     <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-sm text-plum cursor-pointer">
                         <input type="radio" checked={banner.position === "left"} onChange={() => updateBanner(idx, "position", "left")} /> Left
                       </label>
                       <label className="flex items-center gap-2 text-sm text-plum cursor-pointer">
                         <input type="radio" checked={banner.position === "right"} onChange={() => updateBanner(idx, "position", "right")} /> Right
                       </label>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

