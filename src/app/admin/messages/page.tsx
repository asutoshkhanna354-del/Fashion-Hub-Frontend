"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Trash2, Mail, MessageCircle } from "lucide-react";
import { adminApi } from "@/lib/api";

import AdminLayout from "@/components/admin/AdminLayout";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await adminApi.listMessages();
      setMessages(res.messages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await adminApi.deleteMessage(id);
      fetchMessages();
    } catch (error) {
      alert("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Messages" subtitle="Manage customer inquiries and contact forms.">
      <div className="space-y-6">
        {loading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#111111]" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#111111]/10 overflow-hidden">
            <div className="p-4 border-b border-[#111111]/10 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/40" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#F8F6F3] border border-[#111111]/10 rounded-xl text-sm focus:outline-none focus:border-[#C5A47E] transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F6F3] border-b border-[#111111]/10 text-xs uppercase tracking-wider text-[#111111]/50 font-semibold">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/10">
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-[#111111]/50">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20 text-[#111111]" />
                        <p>No messages found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-[#F8F6F3]/50 transition-colors">
                        <td className="px-6 py-4 align-top">
                          <div className="font-semibold text-[#111111] text-sm">{msg.name}</div>
                          <div className="text-xs text-[#111111]/60 mt-0.5 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${msg.email}`} className="hover:text-[#C5A47E] transition-colors">
                              {msg.email}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-top">
                          <p className="text-sm text-[#111111]/70 whitespace-pre-wrap max-w-xl">{msg.message}</p>
                        </td>
                        <td className="px-6 py-4 align-top text-xs text-[#111111]/60 whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 align-top text-right">
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
