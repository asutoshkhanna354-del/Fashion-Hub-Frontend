"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { footerLinks } from "@/data";
import { useSettings } from "@/lib/contexts/settings-context";

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="bg-white border-t border-rose-gold/10">
      {/* Main Footer */}
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-5">
              {settings?.store_logo_url ? (
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center border border-rose-gold/20">
                   <img 
                     src={settings.store_logo_url.startsWith("http") ? settings.store_logo_url : `https://Solanki-Vastra-backend.onrender.com${settings.store_logo_url}`} 
                     alt={settings.store_name} 
                     className="w-full h-full object-contain" 
                   />
                </div>
              ) : (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 44 44"
                  fill="none"
                >
                  <circle cx="22" cy="22" r="20" stroke="#C58F7A" strokeWidth="1.5" fill="none" />
                  <path
                    d="M22 8c-2 4-6 8-6 14s4 10 6 14c2-4 6-8 6-14s-4-10-6-14z"
                    fill="#C58F7A"
                    opacity="0.15"
                    stroke="#C58F7A"
                    strokeWidth="1"
                  />
                  <path
                    d="M10 22c4-2 8-6 14-6s10 4 14 6c-4 2-8 6-14 6s-10-4-14-6z"
                    fill="#B89CCF"
                    opacity="0.15"
                    stroke="#B89CCF"
                    strokeWidth="1"
                  />
                  <circle cx="22" cy="22" r="3" fill="#C58F7A" />
                </svg>
              )}
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-plum tracking-wide leading-none">
                  {settings?.store_name?.split(" ")[0] || "NOOR"}
                </span>
                <span className="text-[9px] tracking-[0.3em] text-rose-gold font-medium uppercase">
                  {settings?.store_name?.split(" ").slice(1).join(" ") || "SILK SAREES"}
                </span>
              </div>
            </a>
            <p className="text-sm text-plum/60 mb-6 leading-relaxed">
              Curating timeless elegance since 2018. Every saree tells a story
              of tradition, craftsmanship, and modern grace.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-plum/60">
              {settings?.store_address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-rose-gold flex-shrink-0" />
                  <span className="whitespace-pre-line">{settings.store_address}</span>
                </div>
              )}
              {settings?.store_phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-rose-gold flex-shrink-0" />
                  <span>{settings.store_phone}</span>
                </div>
              )}
              {settings?.store_email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-rose-gold flex-shrink-0" />
                  <span>{settings.store_email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-plum mb-5">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-plum/55 hover:text-rose-gold transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-plum mb-5">
              Customer
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-plum/55 hover:text-rose-gold transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-plum mb-5">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-plum/55 hover:text-rose-gold transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-plum mb-5">
              Help
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-plum/55 hover:text-rose-gold transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-rose-gold/10">
        <div className="container-premium py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-plum/40 text-center sm:text-left">
            © {new Date().getFullYear()} {settings?.store_name || "Solanki Vastra"}. All rights reserved.
            Made with ♥ in India.
          </p>

          <div className="flex items-center gap-3">
            <span className="text-xs text-plum/40 mr-2 hidden sm:inline">
              Follow Us
            </span>
            {[
              {
                label: "Instagram",
                href: "#",
                svg: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                ),
              },
              {
                label: "Facebook",
                href: "#",
                svg: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                ),
              },
              {
                label: "YouTube",
                href: "#",
                svg: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                ),
              },
            ].map(({ label, href, svg }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-ivory flex items-center justify-center text-plum/50 hover:bg-rose-gold hover:text-white transition-all duration-300"
                aria-label={label}
              >
                {svg}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-plum/40">Secure Payments</span>
            <div className="flex items-center gap-2">
              {["VISA", "MC", "UPI", "RuPay"].map((method) => (
                <div
                  key={method}
                  className="px-2 py-1 bg-ivory rounded text-[10px] font-semibold text-plum/40"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

