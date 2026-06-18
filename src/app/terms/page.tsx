"use client";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/lib/contexts/settings-context";

export default function TermsPage() {
  const { settings } = useSettings();

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <FileText className="w-10 h-10 text-rose-gold mx-auto mb-3" />
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-plum">Terms & Conditions</motion.h1>
      </div>
      <div className="card-glass p-6 sm:p-8 text-sm text-plum/60 leading-relaxed space-y-4 whitespace-pre-wrap">
        {settings?.policy_terms ? (
          settings.policy_terms
        ) : (
          <>
            <p>Last updated: June 2026</p>
            <h2 className="font-display text-lg font-bold text-plum">Acceptance of Terms</h2>
            <p>By accessing and using Solanki Vastra Bhandar, you accept and agree to be bound by these Terms and Conditions.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Products & Pricing</h2>
            <p>All prices are listed in Indian Rupees (INR). We reserve the right to modify prices without prior notice. Product images are for reference; actual colors may vary slightly due to screen settings.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Orders & Payment</h2>
            <p>All orders are subject to availability. Payment is required at the time of placing an order via UPI. We reserve the right to cancel orders in case of pricing errors or stock unavailability.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Intellectual Property</h2>
            <p>All content on this website, including images, text, and designs, is the property of Solanki Vastra Bhandar and may not be reproduced without permission.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Limitation of Liability</h2>
            <p>Solanki Vastra Bhandar shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or products.</p>
            <h2 className="font-display text-lg font-bold text-plum mt-6">Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of India.</p>
          </>
        )}
      </div>
    </div></main><Footer /></>
  );
}

