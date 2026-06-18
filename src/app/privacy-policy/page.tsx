"use client";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/lib/contexts/settings-context";

export default function PrivacyPolicyPage() {
  const { settings } = useSettings();

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <Shield className="w-10 h-10 text-rose-gold mx-auto mb-3" />
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-plum">Privacy Policy</motion.h1>
      </div>
      <div className="card-glass p-6 sm:p-8 text-sm text-plum/60 leading-relaxed space-y-4 whitespace-pre-wrap">
        {settings?.policy_privacy ? (
          settings.policy_privacy
        ) : (
          <>
            <p>Last updated: June 2026</p>
            <h2 className="font-display text-lg font-bold text-plum">Information We Collect</h2>
            <p>We collect information you provide directly: name, email, phone number, shipping address, and payment information necessary to process your orders.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1"><li>Processing and fulfilling your orders</li><li>Sending order confirmations and shipping updates</li><li>Providing customer support</li><li>Improving our services and user experience</li></ul>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. Payment processing is handled through secure, PCI-compliant payment gateways.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Third-Party Sharing</h2>
            <p>We do not sell or share your personal information with third parties except as necessary for order fulfillment (e.g., shipping partners).</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Contact</h2>
            <p>For privacy-related questions, contact us at hello@solankivastrabhandar.com.</p>
          </>
        )}
      </div>
    </div></main><Footer /></>
  );
}

