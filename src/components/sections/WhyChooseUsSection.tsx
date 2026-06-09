"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  Lock,
  Headphones,
} from "lucide-react";
import { features } from "@/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  Lock,
  Headphones,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function WhyChooseUsSection() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-ivory to-white"
      aria-label="Why Choose Us"
    >
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-plum mb-3">
            Why Choose{" "}
            <span className="gradient-text">Aditi Fashion Hub</span>
          </h2>
          <div className="section-divider">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-rose-gold"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
          </div>
          <p className="text-plum/50 text-sm sm:text-base max-w-lg mx-auto mt-3">
            We go above and beyond to ensure your shopping experience is nothing
            short of exceptional
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6"
        >
          {features.map((feature) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                className="group text-center"
              >
                <div className="card-glass p-5 sm:p-6 h-full flex flex-col items-center">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-gold/10 to-lavender/10 flex items-center justify-center group-hover:from-rose-gold/20 group-hover:to-lavender/20 transition-all duration-500">
                      {IconComponent && (
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-rose-gold group-hover:scale-110 transition-transform duration-300" />
                      )}
                    </div>
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-rose-gold/0 group-hover:bg-rose-gold/5 blur-xl transition-all duration-500" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-sm sm:text-base font-semibold text-plum mb-1.5 leading-tight">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-plum/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
