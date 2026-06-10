"use client";
import { useState, useEffect } from "react";
import { Search, Users } from "lucide-react";
import { adminApi } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (p = 1, s = "") => {
    const params: Record<string, string> = { page: String(p), limit: "20" };
    if (s) params.search = s;
    adminApi.users(params).then((d) => { setUsers(d.users); setTotalPages(d.totalPages); setPage(p); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <AdminLayout title="Customers" subtitle={`${users.length} registered users`}
      actions={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1E1533]/20" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); fetchUsers(1, e.target.value); }} placeholder="Search..." className="pl-9 pr-4 py-2.5 bg-white border border-[#1E1533]/[0.04] rounded-xl text-xs w-48 focus:outline-none focus:border-[#C58F7A]/30" />
        </div>
      }
    >
      <div className="bg-white rounded-2xl border border-[#1E1533]/[0.03] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-[#1E1533]/30 uppercase tracking-wider border-b border-[#1E1533]/[0.03]">
                <th className="text-left px-6 py-3 font-semibold">Name</th><th className="text-left px-6 py-3 font-semibold">Email</th><th className="text-left px-6 py-3 font-semibold">Phone</th><th className="text-left px-6 py-3 font-semibold">Verified</th><th className="text-left px-6 py-3 font-semibold">Orders</th><th className="text-left px-6 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[#1E1533]/[0.02] hover:bg-[#F8F6F3]/50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C58F7A]/20 to-[#B89CCF]/20 flex items-center justify-center text-[10px] font-bold text-[#1E1533]/40">{u.firstName?.charAt(0)}{u.lastName?.charAt(0)}</div>
                      <span className="font-semibold text-[#1E1533] text-xs">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#1E1533]/40">{u.email}</td>
                  <td className="px-6 py-3.5 text-xs text-[#1E1533]/40">{u.phone}</td>
                  <td className="px-6 py-3.5"><span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${u.emailVerified ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>{u.emailVerified ? "Verified" : "Pending"}</span></td>
                  <td className="px-6 py-3.5 text-xs text-[#1E1533]/40">{u._count?.orders || 0}</td>
                  <td className="px-6 py-3.5 text-[10px] text-[#1E1533]/25">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <div className="text-center py-16"><Users className="w-10 h-10 text-[#1E1533]/5 mx-auto mb-2" /><p className="text-xs text-[#1E1533]/25">No users found</p></div>}
      </div>
      {totalPages > 1 && <div className="flex justify-center gap-1.5 mt-6">{Array.from({ length: totalPages }, (_, i) => (<button key={i} onClick={() => fetchUsers(i + 1, search)} className={`w-8 h-8 rounded-lg text-xs font-semibold ${page === i + 1 ? "bg-[#1E1533] text-white" : "bg-white text-[#1E1533]/30 border border-[#1E1533]/[0.04]"}`}>{i + 1}</button>))}</div>}
    </AdminLayout>
  );
}
