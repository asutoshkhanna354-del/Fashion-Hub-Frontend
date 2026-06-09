"use client";

import { motion } from "framer-motion";
import { Truck, CreditCard, RotateCcw, X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

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
          <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-gold-light" />
          <span className="font-medium">Free Shipping on Prepaid Orders above ₹1999</span>
        </div>
        <span className="hidden sm:inline text-white/30">|</span>
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-gold-light" />
          <span className="font-medium">COD Available</span>
        </div>
        <span className="hidden sm:inline text-white/30">|</span>
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-gold-light" />
          <span className="font-medium">Easy Returns</span>
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
