"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  CreditCard,
  RotateCcw,
  Lock,
} from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, title: "100% Authentic", sub: "Products" },
  { icon: Sparkles, title: "Premium Quality", sub: "Fabrics" },
  { icon: Truck, title: "Free Shipping", sub: "Above ₹1999" },
  { icon: CreditCard, title: "COD", sub: "Available" },
  { icon: RotateCcw, title: "Easy Returns", sub: "7 Days" },
  { icon: Lock, title: "Secure Payment", sub: "100% Safe" },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-rose-gold/8" aria-label="Trust badges">
      <div className="container-premium py-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6"
        >
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-ivory flex items-center justify-center mb-2 group-hover:bg-rose-gold/10 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-rose-gold" />
                </div>
                <p className="text-xs font-semibold text-plum leading-tight">
                  {item.title}
                </p>
                <p className="text-[10px] text-plum/40">{item.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
