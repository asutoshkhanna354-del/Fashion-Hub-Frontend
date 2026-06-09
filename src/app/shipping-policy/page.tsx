"use client";
import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ShippingPolicyPage() {
  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <Truck className="w-10 h-10 text-rose-gold mx-auto mb-3" />
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-plum">Shipping Policy</motion.h1>
      </div>
      <div className="card-glass p-6 sm:p-8 prose-plum text-sm text-plum/60 leading-relaxed space-y-4">
        <h2 className="font-display text-lg font-bold text-plum">Domestic Shipping</h2>
        <p>We offer <strong>free shipping</strong> on all orders across India. No minimum order value required.</p>
        <ul className="list-disc list-inside space-y-1"><li>Metro cities: 3-5 business days</li><li>Tier 2/3 cities: 5-7 business days</li><li>Remote areas: 7-10 business days</li></ul>
        <h2 className="font-display text-lg font-bold text-plum mt-6">Order Processing</h2>
        <p>Orders are processed within 1-2 business days after payment confirmation. You will receive a tracking number via email once your order is shipped.</p>
        <h2 className="font-display text-lg font-bold text-plum mt-6">Tracking Your Order</h2>
        <p>Track your order status anytime through the &quot;My Orders&quot; section in your account or use the tracking link sent to your registered email address.</p>
        <h2 className="font-display text-lg font-bold text-plum mt-6">Packaging</h2>
        <p>All sarees are carefully packed in premium packaging to ensure they reach you in perfect condition. Each piece is wrapped in tissue paper and placed in a branded gift box.</p>
      </div>
    </div></main><Footer /></>
  );
}
