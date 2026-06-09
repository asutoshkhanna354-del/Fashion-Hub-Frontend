"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Users } from "lucide-react";
import { adminApi } from "@/lib/api";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (p = 1, s = "") => {
    const params: Record<string, string> = { page: String(p), limit: "20" };
    if (s) params.search = s;
    adminApi.users(params).then((d) => { setUsers(d.users); setTotalPages(d.totalPages); setPage(p); }).catch(() => router.push("/admin/login/")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/")} className="text-plum/40 hover:text-plum"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="font-display text-2xl font-bold text-plum flex-1">Users</h1>
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" /><input value={search} onChange={(e) => { setSearch(e.target.value); fetchUsers(1, e.target.value); }} placeholder="Search users..." className="pl-9 pr-4 py-2 bg-white border border-plum/10 rounded-xl text-sm w-48" /></div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-plum/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-ivory/50 text-xs text-plum/40 border-b border-plum/5">
              <th className="text-left p-3 font-medium">Name</th><th className="text-left p-3 font-medium">Email</th><th className="text-left p-3 font-medium">Phone</th><th className="text-left p-3 font-medium">Verified</th><th className="text-left p-3 font-medium">Orders</th><th className="text-left p-3 font-medium">Joined</th>
            </tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-plum/5 last:border-0 hover:bg-ivory/30">
                  <td className="p-3 font-medium text-plum">{u.firstName} {u.lastName}</td>
                  <td className="p-3 text-plum/60">{u.email}</td>
                  <td className="p-3 text-plum/60">{u.phone}</td>
                  <td className="p-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.emailVerified ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{u.emailVerified ? "Yes" : "No"}</span></td>
                  <td className="p-3 text-plum/60">{u._count?.orders || 0}</td>
                  <td className="p-3 text-xs text-plum/40">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
