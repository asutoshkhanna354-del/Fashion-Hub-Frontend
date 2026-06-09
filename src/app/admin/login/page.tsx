"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, AlertTriangle } from "lucide-react";
import { adminApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const data = await adminApi.login(username, password);
      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_info", JSON.stringify(data.admin));
      if (data.warnings?.length) setWarnings(data.warnings);
      setTimeout(() => router.push("/admin/"), 500);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-plum via-plum/90 to-plum/80 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-plum to-plum/80 mx-auto mb-3 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-plum">Admin Panel</h1>
          <p className="text-plum/40 text-sm mt-1">Aditi Fashion Hub</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-lg mb-4">{error}</div>}
        {warnings.map((w, i) => (
          <div key={i} className="bg-amber-50 text-amber-600 text-xs px-4 py-2 rounded-lg mb-2 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5" /> {w}</div>
        ))}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full pl-10 pr-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm text-plum" required autoFocus />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full pl-10 pr-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm text-plum" required />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-plum to-plum/80 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"} {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
