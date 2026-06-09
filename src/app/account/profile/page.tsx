"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProfilePage() {
  const { user, isLoggedIn, refreshProfile } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    firstName: user?.firstName || "", lastName: user?.lastName || "",
    altPhone: user?.altPhone || "", addressLine1: user?.addressLine1 || "",
    addressLine2: user?.addressLine2 || "", city: user?.city || "",
    state: user?.state || "", pincode: user?.pincode || "",
  });

  if (!isLoggedIn) { router.push("/account/"); return null; }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await authApi.updateProfile(form);
      await refreshProfile();
      setEditing(false); setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {} finally { setSaving(false); }
  };

  const fieldClass = "w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose-gold/20";

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-lg mx-auto">
      <h1 className="font-display text-3xl font-bold text-plum mb-8">My Profile</h1>
      {success && <div className="bg-green-50 text-green-600 text-xs px-4 py-2.5 rounded-lg mb-4">{success}</div>}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-gold to-lavender flex items-center justify-center">
            <span className="text-white font-display text-xl font-bold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
          </div>
          <div>
            <h2 className="font-semibold text-plum">{user?.firstName} {user?.lastName}</h2>
            <p className="text-xs text-plum/40">{user?.email}</p>
          </div>
        </div>
        {!editing ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 py-2 border-b border-plum/5"><Phone className="w-4 h-4 text-plum/30" /><span className="text-plum/60">{user?.phone}</span></div>
            {user?.altPhone && <div className="flex items-center gap-3 py-2 border-b border-plum/5"><Phone className="w-4 h-4 text-plum/30" /><span className="text-plum/60">{user?.altPhone}</span></div>}
            {user?.addressLine1 && <div className="flex items-start gap-3 py-2 border-b border-plum/5"><MapPin className="w-4 h-4 text-plum/30 mt-0.5" /><span className="text-plum/60">{user?.addressLine1}{user?.addressLine2 ? `, ${user.addressLine2}` : ""}, {user?.city}, {user?.state} - {user?.pincode}</span></div>}
            <button onClick={() => setEditing(true)} className="w-full mt-4 py-3 bg-plum text-white rounded-xl text-sm font-medium">Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First Name" className={fieldClass} />
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last Name" className={fieldClass} />
            </div>
            <input value={form.altPhone} onChange={(e) => setForm({ ...form, altPhone: e.target.value })} placeholder="Alternate Phone" className={fieldClass} />
            <input value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} placeholder="Address Line 1" className={fieldClass} />
            <input value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} placeholder="Address Line 2" className={fieldClass} />
            <div className="grid grid-cols-2 gap-3">
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className={fieldClass} />
              <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className={fieldClass} />
            </div>
            <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" className={fieldClass} />
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 py-3 border border-plum/10 text-plum rounded-xl text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}</button>
            </div>
          </form>
        )}
      </motion.div>
    </div></main><Footer /></>
  );
}
