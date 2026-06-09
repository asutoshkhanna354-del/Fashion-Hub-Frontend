"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { productApi } from "@/lib/api";
import ProductGrid from "@/components/ui/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { productApi.list({ newArrival: "true", limit: "40" }).then((d) => setProducts(d.products || [])).catch(() => {}).finally(() => setLoading(false)); }, []);
  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium">
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">New Arrivals</motion.h1>
        <p className="text-plum/40 text-sm mt-2">The latest additions to our collection</p>
      </div>
      <ProductGrid products={products} loading={loading} />
    </div></main><Footer /></>
  );
}
