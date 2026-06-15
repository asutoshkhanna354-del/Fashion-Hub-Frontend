"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useEffect, useState } from "react";
import { sectionApi } from "@/lib/api";

export default function HomeCollectionsPreview() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sectionApi.list()
      .then(async (data) => {
        if (data.status && data.sections) {
          // Get the first 5 sections
          const topSections = data.sections.slice(0, 5);
          
          // Fetch full section details (which includes products) for each
          const detailedSections = await Promise.all(
            topSections.map((s: any) => sectionApi.get(s.id).catch(() => null))
          );
          
          // Filter out failed requests and sections without products
          const validSections = detailedSections
            .map((res: any) => res?.section)
            .filter((s: any) => s && s.products && s.products.length > 0);
            
          setSections(validSections);
        }
      })
      .catch((err) => console.error("Failed to fetch collections", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-plum/30" />
      </div>
    );
  }

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section, index) => (
        <section 
          key={section.id} 
          className={`py-12 sm:py-16 ${index % 2 === 0 ? "bg-[#FAF7F2]" : "bg-white"}`}
        >
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8"
            >
              <div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-plum mb-2">
                  {section.name}
                </h2>
                <div className="section-divider justify-start">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-rose-gold">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.5"/>
                  </svg>
                </div>
                {section.description && (
                  <p className="text-plum/50 text-sm sm:text-base mt-2 max-w-2xl line-clamp-2">
                    {section.description}
                  </p>
                )}
              </div>

              <motion.a
                whileHover={{ x: 4 }}
                href={`/collections/${section.id}`}
                className="group inline-flex items-center gap-2 px-5 py-2 border border-plum/20 text-plum rounded-full text-xs font-medium uppercase tracking-wider hover:bg-plum hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                View Collection
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {section.products.slice(0, 4).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
