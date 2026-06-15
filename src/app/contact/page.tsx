"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/lib/contexts/settings-context";
import { messageApi } from "@/lib/api";

export default function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    if (!name || !email || !message) return;
    setLoading(true);
    try {
      await messageApi.create({ name, email, message });
      setSent(true); 
    } catch (err) {
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">Contact Us</motion.h1>
        <p className="text-plum/40 text-sm mt-2">We&apos;d love to hear from you</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: settings?.store_email || "hello@solankivastra.com", link: settings?.store_email ? `mailto:${settings.store_email}` : "#" },
            { icon: Phone, label: "Phone", value: settings?.store_phone || "+91 98765 43210", link: settings?.store_phone ? `tel:${settings.store_phone}` : "#" },
            { icon: MapPin, label: "Address", value: settings?.store_address || "Fashion District, Mumbai, Maharashtra 400001", link: "#" },
            { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", link: settings?.whatsapp_link || "#" },
          ].map(({ icon: Icon, label, value, link }) => (
            <a key={label} href={link} target={label === "WhatsApp" ? "_blank" : "_self"} rel="noreferrer" className="card-glass p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-gold/10 flex items-center justify-center"><Icon className="w-5 h-5 text-rose-gold" /></div>
              <div><p className="text-xs text-plum/40">{label}</p><p className="text-sm font-semibold text-plum">{value}</p></div>
            </a>
          ))}
        </div>
        <div className="card-glass p-6">
          {sent ? (
            <div className="text-center py-8"><Send className="w-10 h-10 text-green-500 mx-auto mb-3" /><h3 className="font-display text-lg font-bold text-plum">Message Sent!</h3><p className="text-sm text-plum/50 mt-1">We&apos;ll get back to you shortly.</p></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="font-display text-lg font-bold text-plum mb-2">Send a Message</h3>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm" required disabled={loading} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm" required disabled={loading} />
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your Message" rows={4} className="w-full px-4 py-3 bg-ivory/50 border border-plum/10 rounded-xl text-sm resize-none" required disabled={loading} />
              <button type="submit" disabled={loading} className="w-full py-3.5 bg-plum text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div></main><Footer /></>
  );
}

