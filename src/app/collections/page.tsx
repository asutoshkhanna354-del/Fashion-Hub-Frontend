"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { sectionApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const API_URL = "https://fashion-hub-backend-13eb.onrender.com";

export default function CollectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sectionApi.list().then((d) => setSections(d.sections || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F6F3] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-[#1E1533]">Our Collections</motion.h1>
            <p className="text-[#1E1533]/50 text-sm mt-2 font-medium tracking-wide">Explore our curated collections of premium sarees</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-[#1E1533]/5 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sections.map((section, i) => (
                <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/collections/${section.id}/`} className="group block">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1E1533]/5 to-[#C58F7A]/5 shadow-sm hover:shadow-xl transition-all duration-300">
                      {section.image && (
                        <Image 
                          src={getImgUrl(section.image) as string} 
                          alt={section.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <h3 className="font-display text-lg font-bold text-white mb-1 drop-shadow-md">{section.name}</h3>
                        <p className="text-white/80 text-xs font-medium">{section._count?.products || 0} Products</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
