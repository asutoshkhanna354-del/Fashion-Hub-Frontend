"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { productApi, sectionApi } from "@/lib/api";
import ProductGrid from "@/components/ui/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SareesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    sectionApi.list().then((d) => setSections(d.sections || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page: page.toString(), limit: "20", sort };
    if (search) params.search = search;
    if (selectedSection) params.section = selectedSection;

    productApi.list(params)
      .then((d) => { setProducts(d.products || []); setTotalPages(d.totalPages || 1); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, selectedSection, sort, page]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="container-premium">
          <div className="text-center mb-10">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">
              Our Sarees
            </motion.h1>
            <p className="text-plum/40 text-sm mt-2">Discover our curated collection of premium sarees</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30" />
              <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search sarees..." className="w-full pl-10 pr-8 py-2.5 bg-white border border-plum/10 rounded-xl text-sm text-plum placeholder-plum/30 focus:outline-none focus:ring-2 focus:ring-rose-gold/20" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-plum/30" /></button>}
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="py-2.5 px-4 bg-white border border-plum/10 rounded-xl text-sm text-plum focus:outline-none focus:ring-2 focus:ring-rose-gold/20 appearance-none cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)} className="py-2.5 px-4 bg-white border border-plum/10 rounded-xl text-sm text-plum flex items-center gap-2 hover:bg-plum/5 transition-colors">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mb-6 overflow-hidden">
              <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-plum/5">
                <button onClick={() => { setSelectedSection(""); setPage(1); }} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${!selectedSection ? "bg-plum text-white" : "bg-ivory text-plum/60 hover:bg-plum/5"}`}>
                  All
                </button>
                {sections.map((s: any) => (
                  <button key={s.id} onClick={() => { setSelectedSection(s.id); setPage(1); }} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${selectedSection === s.id ? "bg-plum text-white" : "bg-ivory text-plum/60 hover:bg-plum/5"}`}>
                    {s.name} ({s._count.products})
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? "bg-plum text-white" : "bg-white text-plum/50 hover:bg-plum/5"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
