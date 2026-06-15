"use client";

import { motion } from "framer-motion";
import ProductCard from "../ui/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface UpsellsSectionProps {
  title: string;
  subtitle?: string;
  products: any[];
}

export default function UpsellsSection({ title, subtitle, products }: UpsellsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-plum/5">
      <div className="container-premium">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-plum">
              {title}
            </h2>
            {subtitle && (
              <p className="text-plum/50 mt-2 font-medium">{subtitle}</p>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/sarees/"
              className="group flex items-center gap-2 text-sm font-semibold text-rose-gold hover:text-plum transition-colors"
            >
              View All Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
          {products.slice(0, 4).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
