"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const faqs = [
  { q: "How do I place an order?", a: "Browse our collections, select your saree, add it to cart, and proceed to checkout. Pay securely via UPI and we'll ship your order right away!" },
  { q: "What payment methods do you accept?", a: "We accept all UPI payment methods including Google Pay, PhonePe, Paytm, BHIM, and any other UPI-enabled apps." },
  { q: "How long does delivery take?", a: "We typically deliver within 5-7 business days across India. Metro cities may receive orders in 3-5 days." },
  { q: "Can I return or exchange a saree?", a: "Yes! We offer a 7-day return/exchange policy. Items must be in unused condition with original tags attached." },
  { q: "Are the products authentic?", a: "Absolutely! Every saree is handpicked and quality-checked. We source directly from weavers and certified manufacturers." },
  { q: "Do you offer free shipping?", a: "Yes, we offer free shipping on all orders across India. No minimum order value required!" },
  { q: "How do I track my order?", a: "Once shipped, you'll receive tracking details via email. You can also check your order status in the 'My Orders' section." },
  { q: "Do you ship internationally?", a: "Currently, we ship only within India. International shipping will be available soon!" },
  { q: "How do I use a promo code?", a: "Enter your promo code in the cart page before checkout. Valid codes will automatically apply the discount." },
  { q: "How can I contact customer support?", a: "You can reach us via email at hello@solankivastrabhandar.com, phone at +91 98765 43210, or WhatsApp. We're available Mon-Sat, 10am-7pm." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">FAQs</motion.h1>
        <p className="text-plum/40 text-sm mt-2">Find answers to commonly asked questions</p>
      </div>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="card-glass overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full p-4 text-left flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-plum">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-plum/30 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                  <p className="px-4 pb-4 text-sm text-plum/50 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div></main><Footer /></>
  );
}

