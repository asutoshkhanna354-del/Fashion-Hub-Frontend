"use client";

import { motion } from "framer-motion";
import { Truck, CreditCard, RotateCcw, X, Info, Tag } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/lib/contexts/settings-context";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const { settings } = useSettings();

  if (!isVisible) return null;

  const bannerTitle = settings?.banner_title || "SALE 🚨";
  const bannerText = settings?.banner_text || "Free Shipping on Prepaid Orders above ₹1999";
  const bannerType = settings?.banner_type || "Sale";

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-plum via-plum-light to-plum text-white text-xs sm:text-sm"
    >
      <div className="container-premium flex items-center justify-center gap-4 sm:gap-8 py-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {bannerType === "Sale" ? (
            <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-gold-light" />
          ) : (
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-gold-light" />
          )}
          <span className="font-bold text-rose-gold-light tracking-wide">{bannerTitle}</span>
          <span className="hidden sm:inline text-white/30 ml-2 mr-2">|</span>
          <span className="font-medium">{bannerText}</span>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Close announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
