"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { sectionApi } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CollectionsSection() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sectionApi.list()
      .then((d) => setSections((d.sections || []).filter((s: any) => s.type !== "occasion").slice(0, 8))) // Limit to 8 for the homepage grid
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return "/images/collections/new.png"; // Fallback image
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  if (loading && sections.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F6F3]" aria-label="Shop by Collection">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-pulse">
            <div className="h-10 bg-[#111111]/5 rounded w-64 mx-auto mb-4" />
            <div className="h-4 bg-[#111111]/5 rounded w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-[#111111]/5 mb-3" />
                <div className="h-3 bg-[#111111]/5 rounded w-16 mb-1" />
                <div className="h-2 bg-[#111111]/5 rounded w-10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (sections.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F6F3]" aria-label="Shop by Collection">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] mb-3">
            Shop By Collection
          </h2>
          <div className="flex items-center justify-center gap-2 text-[#C5A47E] mb-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C5A47E]/50" />
            <div className="w-2 h-2 rotate-45 border border-[#C5A47E]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C5A47E]/50" />
          </div>
          <p className="text-[#111111]/50 text-sm sm:text-base max-w-lg mx-auto font-medium tracking-wide">
            Explore our handpicked categories of premium sarees
          </p>
        </motion.div>

        {/* Collection Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-8"
        >
          {sections.map((section) => (
            <motion.a
              key={section.id}
              variants={itemVariants}
              href={`/collections/${section.id}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Circular Image */}
              <div className="relative mb-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border border-[#C5A47E]/15 group-hover:border-[#C5A47E]/40 transition-all duration-500 shadow-sm group-hover:shadow-lg bg-white p-1">
                  <div className="w-full h-full rounded-full overflow-hidden transform transition-transform duration-700 ease-out group-hover:scale-110 relative bg-[#F8F6F3]">
                    <Image
                      src={getImgUrl(section.image)}
                      alt={section.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100px, 120px"
                    />
                  </div>
                </div>
                {/* Hover ring */}
                <div className="absolute -inset-1 rounded-full border border-[#C5A47E]/0 group-hover:border-[#C5A47E]/30 transition-all duration-500 group-hover:scale-[1.08]" />
              </div>

              {/* Collection Name */}
              <h3 className="font-display text-xs sm:text-sm font-bold text-gray-900 group-hover:text-rose-gold transition-colors duration-300 leading-tight">
                {section.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 font-medium">
                {section._count?.products || 0} items
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

