"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Sparkles } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section
      className="relative py-16 sm:py-20 bg-gradient-to-r from-plum via-plum-light to-plum overflow-hidden"
      aria-label="Newsletter"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-rose-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-lavender/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full" />
      </div>

      <div className="container-premium relative">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-6">
              <Sparkles className="w-6 h-6 text-rose-gold-light" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Stay Updated with{" "}
              <span className="italic text-rose-gold-light">
                Aditi Fashion Hub
              </span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base mb-8">
              Subscribe to get special offers, latest collections & more.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch gap-3 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full py-3.5 px-5 bg-white/10 border border-white/15 rounded-full text-white placeholder:text-white/35 focus:outline-none focus:border-rose-gold/50 focus:bg-white/15 transition-all duration-300 text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitted}
              className="inline-flex items-center justify-center gap-2 bg-rose-gold text-white px-8 py-3.5 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-rose-gold-dark transition-all duration-300 disabled:opacity-70"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center justify-center gap-6"
          >
            <span className="text-white/30 text-xs">Follow Us</span>
            {["Instagram", "Facebook", "Pinterest", "YouTube"].map(
              (platform) => (
                <a
                  key={platform}
                  href="#"
                  className="text-white/40 hover:text-rose-gold-light text-xs transition-colors duration-200"
                >
                  {platform}
                </a>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
