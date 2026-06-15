"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useEffect, useState } from "react";
import { productApi } from "@/lib/api";

export default function BestSellersSection() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.list({ bestSeller: "true", limit: "6" })
      .then((data) => {
        if (data.status) {
          setBestSellers(data.products);
        }
      })
      .catch((err) => console.error("Failed to fetch best sellers", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && bestSellers.length === 0) {
    return null; // Don't show the section if no best sellers exist
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white" aria-label="Best Sellers">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-plum mb-2">
              Our Best Sellers
            </h2>
            <div className="section-divider justify-start">
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
            <p className="text-plum/50 text-sm sm:text-base mt-2">
              Most loved sarees by our customers
            </p>
          </div>

          <motion.a
            whileHover={{ x: 4 }}
            href="/best-sellers"
            className="group inline-flex items-center gap-2 px-6 py-2.5 border-2 border-plum text-plum rounded-full text-sm font-medium uppercase tracking-wider hover:bg-plum hover:text-white transition-all duration-300"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-plum/30" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
