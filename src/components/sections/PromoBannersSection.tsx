"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function PromoBannersSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-ivory" aria-label="Promotional Banners">
      <div className="container-premium">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Banner 1 - Summer Collection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="group relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] bg-gradient-to-br from-sage/15 via-sage-light/10 to-ivory"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/banners/summer.png"
                alt="Summer Collection"
                fill
                className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center p-8 sm:p-10 lg:p-12">
              <div className="max-w-sm">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-sage-dark text-xs font-bold uppercase tracking-[0.2em] mb-3"
                >
                  New Collection
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-plum mb-3 leading-tight"
                >
                  Summer{" "}
                  <span className="italic text-sage-dark">Breeze</span>
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-plum/60 text-sm sm:text-base mb-6"
                >
                  Light, Colorful, Beautiful. Perfect for the season ahead.
                </motion.p>
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ x: 4 }}
                  href="/collections/summer"
                  className="group/btn inline-flex items-center gap-2 bg-sage text-white px-6 py-3 rounded-sm text-sm font-medium uppercase tracking-wider hover:bg-sage-dark transition-all duration-300"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Banner 2 - Festive Edit */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="group relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] bg-gradient-to-br from-plum via-plum-light to-plum"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/banners/summer.png"
                alt="Festive Collection"
                fill
                className="object-cover opacity-20 group-hover:opacity-25 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-plum/80 via-plum/70 to-transparent" />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-20 h-20 border border-rose-gold/20 rounded-full" />
            <div className="absolute bottom-8 right-12 w-32 h-32 border border-lavender/10 rounded-full" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-end p-8 sm:p-10 lg:p-12">
              <div className="max-w-sm text-right">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-rose-gold-light text-xs font-bold uppercase tracking-[0.2em] mb-3"
                >
                  Festive Special
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight"
                >
                  Celebrate in{" "}
                  <span className="italic text-rose-gold-light">
                    Style & Color
                  </span>
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-white/60 text-lg sm:text-xl mb-1"
                >
                  Up to 30% Off
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 }}
                  className="text-white/40 text-sm mb-6"
                >
                  Limited time festive collection offer
                </motion.p>
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ x: 4 }}
                  href="/collections/festive"
                  className="group/btn inline-flex items-center gap-2 bg-rose-gold text-white px-6 py-3 rounded-sm text-sm font-medium uppercase tracking-wider hover:bg-rose-gold-dark transition-all duration-300"
                >
                  Shop Festive
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary Banners Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
          {/* Wedding Season Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-2xl overflow-hidden min-h-[200px] bg-gradient-to-r from-rose-gold/10 via-lavender/10 to-rose-gold/5 border border-rose-gold/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(184,156,207,0.15),transparent)]" />
            <div className="relative h-full flex items-center p-8">
              <div>
                <span className="text-rose-gold text-xs font-bold uppercase tracking-[0.2em]">
                  Special Occasion
                </span>
                <h4 className="font-display text-2xl sm:text-3xl font-bold text-plum mt-2 mb-2">
                  Wedding Season
                </h4>
                <p className="text-plum/50 text-sm mb-4">
                  Exquisite bridal & trousseau collection
                </p>
                <a
                  href="/collections/wedding"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-gold hover:text-rose-gold-dark transition-colors group/link"
                >
                  Shop Now
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Designer Picks Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative rounded-2xl overflow-hidden min-h-[200px] bg-gradient-to-r from-lavender/10 via-plum/5 to-lavender/10 border border-lavender/15"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(197,143,122,0.1),transparent)]" />
            <div className="relative h-full flex items-center justify-end p-8 text-right">
              <div>
                <span className="text-lavender text-xs font-bold uppercase tracking-[0.2em]">
                  Curated For You
                </span>
                <h4 className="font-display text-2xl sm:text-3xl font-bold text-plum mt-2 mb-2">
                  Designer Picks
                </h4>
                <p className="text-plum/50 text-sm mb-4">
                  Handpicked designer sarees for every taste
                </p>
                <a
                  href="/collections/designer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-lavender hover:text-plum transition-colors group/link"
                >
                  Explore
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
