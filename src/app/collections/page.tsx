"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { sectionApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const collectionImages = [
  "/images/collections/silk.png", "/images/collections/cotton.png", "/images/collections/chiffon.png",
  "/images/collections/organza.png", "/images/collections/designer.png", "/images/collections/party.png",
  "/images/collections/floral.png", "/images/collections/new.png",
];

export default function CollectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sectionApi.list().then((d) => setSections(d.sections || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-premium">
        <div className="text-center mb-10">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">Our Collections</motion.h1>
          <p className="text-plum/40 text-sm mt-2">Explore our curated collections of premium sarees</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-plum/5 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sections.map((section, i) => (
              <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/collections/${section.id}/`} className="group block">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-plum/5 to-rose-gold/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-plum/60 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                      <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-rose-gold transition-colors">{section.name}</h3>
                      <p className="text-white/70 text-xs">{section._count?.products || 0} Products</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main><Footer /></>
  );
}
