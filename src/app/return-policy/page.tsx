"use client";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/lib/contexts/settings-context";

export default function ReturnPolicyPage() {
  const { settings } = useSettings();

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <RotateCcw className="w-10 h-10 text-rose-gold mx-auto mb-3" />
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-plum">Return & Refund Policy</motion.h1>
      </div>
      <div className="card-glass p-6 sm:p-8 text-sm text-plum/60 leading-relaxed space-y-4 whitespace-pre-wrap">
        {settings?.policy_return ? (
          settings.policy_return
        ) : (
          <>
            <h2 className="font-display text-lg font-bold text-plum">Return Window</h2>
            <p>We offer a <strong>7-day return policy</strong> from the date of delivery. Items must be in unused, unwashed condition with all original tags attached.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">How to Return</h2>
            <ol className="list-decimal list-inside space-y-1"><li>Go to &quot;My Orders&quot; in your account</li><li>Select the order you wish to return</li><li>Contact us via email or WhatsApp with your order number</li><li>We will arrange a pickup from your address</li></ol>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Refund Process</h2>
            <p>Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Exchange</h2>
            <p>We also offer exchanges within the 7-day window. If the replacement is available, we will ship it within 3-5 business days after receiving the returned item.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Non-Returnable Items</h2>
            <ul className="list-disc list-inside space-y-1"><li>Customized or altered sarees</li><li>Items with removed tags</li><li>Used or washed items</li></ul>
          </>
        )}
      </div>
    </div></main><Footer /></>
  );
}
