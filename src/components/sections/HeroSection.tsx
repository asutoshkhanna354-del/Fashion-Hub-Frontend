"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { heroSlides as defaultHeroSlides, HeroSlide } from "@/data";
import { useSettings } from "@/lib/contexts/settings-context";

export default function HeroSection() {
  const { settings, loading } = useSettings();
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  let slides: HeroSlide[] = defaultHeroSlides;
  if (settings?.hero_slides) {
    try {
      const parsed = JSON.parse(settings.hero_slides);
      if (Array.isArray(parsed) && parsed.length > 0) {
        slides = parsed;
      }
    } catch (e) {}
  }

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Prevent flash of default slides if custom ones are loading
  if (loading && !settings?.hero_slides) {
    return (
      <section className="relative overflow-hidden bg-[#F5EFE6] min-h-[500px] md:min-h-[600px] animate-pulse">
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-ivory via-[#F5EFE6] to-ivory"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      aria-label="Hero banner"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-gold/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-lavender/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-sage/5 rounded-full blur-2xl" />
      </div>

      <div className="container-premium relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px] sm:min-h-[560px] lg:min-h-[620px] items-center py-10 lg:py-0">
          {/* Left Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 text-center lg:text-left"
            >
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-rose-gold text-sm sm:text-base font-medium tracking-wider mb-3 italic font-display"
              >
                {slide.subtitle}
              </motion.p>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-plum leading-[1.1] mb-4"
              >
                {slide.title}{" "}
                <span className="italic gradient-text-plum">
                  {slide.highlight}
                </span>
              </motion.h1>

              {/* Decorative Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="section-divider my-5 lg:justify-start"
              >
                <svg width="20" height="12" viewBox="0 0 20 12" className="text-rose-gold">
                  <path
                    d="M10 0C6.5 0 4 3 2 6c2 3 4.5 6 8 6s5.5-3 8-6c-2-3-4.5-6-8-6zm0 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-plum/60 text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                {slide.description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 justify-center lg:justify-start"
              >
                <a
                  href="/sarees"
                  className="group inline-flex items-center gap-2 bg-plum text-white px-8 py-3.5 rounded-sm text-sm font-medium uppercase tracking-wider hover:bg-plum-light transition-all duration-300 hover:shadow-lg hover:shadow-plum/20"
                >
                  {slide.cta}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="/collections"
                  className="text-sm font-medium text-plum/70 underline underline-offset-4 decoration-rose-gold/30 hover:decoration-rose-gold hover:text-plum transition-all"
                >
                  View Collections
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right - Hero Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-img"}
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[400px] lg:max-w-[480px] xl:max-w-[520px]">
                {/* Decorative ring behind image */}
                <div className="absolute -inset-4 lg:-inset-6 border border-rose-gold/10 rounded-[40px] rotate-3" />
                <div className="absolute -inset-8 lg:-inset-12 border border-lavender/8 rounded-[50px] -rotate-2" />

                <div className="relative rounded-[30px] overflow-hidden shadow-premium-lg aspect-[3/4]">
                  <Image
                    src={slide.image.startsWith("http") || slide.image.startsWith("/images") ? slide.image : `https://Solanki-Vastra-backend.onrender.com${slide.image}`}
                    alt="Fashion model wearing designer saree"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 400px, 520px"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ivory/20 to-transparent" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slider Dots */}
        <div className="flex items-center justify-center lg:justify-start gap-3 pb-8 lg:pb-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-8 h-2.5 bg-rose-gold"
                  : "w-2.5 h-2.5 bg-plum/20 hover:bg-plum/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Trust Badges (floating card on desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="hidden xl:block absolute bottom-16 right-16 z-20"
      >
        <div className="glass rounded-2xl p-5 shadow-glass-lg">
          <div className="flex items-center gap-6">
            {[
              { label: "Premium Quality", sub: "Assured" },
              { label: "Free Shipping", sub: "Above ₹1999" },
              { label: "Secure Payment", sub: "100% Safe" },
            ].map((badge) => (
              <div key={badge.label} className="text-center">
                <div className="w-10 h-10 mx-auto mb-1.5 bg-rose-gold/10 rounded-full flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C58F7A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <p className="text-[11px] font-semibold text-plum leading-tight">
                  {badge.label}
                </p>
                <p className="text-[10px] text-plum/50">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

