"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { sectionApi, productApi } from "@/lib/api";
import ProductGrid from "@/components/ui/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CollectionDetailPage() {
  const { id } = useParams();
  const [section, setSection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      sectionApi.get(id as string),
      productApi.list({ section: id as string, limit: "100" }),
    ]).then(([sData, pData]) => {
      setSection(sData.section);
      setProducts(pData.products || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20">
      <div className="container-premium">
        <div className="text-center mb-10">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">{section?.name || "Collection"}</motion.h1>
          {section?.description && <p className="text-plum/40 text-sm mt-2 max-w-lg mx-auto">{section.description}</p>}
        </div>
        <ProductGrid products={products} loading={loading} />
      </div>
    </main><Footer /></>
  );
}
