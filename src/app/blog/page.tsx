"use client";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const posts = [
  { id: 1, title: "How to Style a Silk Saree for a Modern Look", excerpt: "Discover contemporary ways to drape and accessorize your silk saree for a chic, modern appearance that turns heads at every occasion.", date: "May 28, 2026", category: "Style Tips" },
  { id: 2, title: "The Art of Choosing the Perfect Wedding Saree", excerpt: "Your wedding day deserves the perfect saree. Learn how to choose the right fabric, color, and design that complements your personality.", date: "May 15, 2026", category: "Wedding" },
  { id: 3, title: "Saree Care 101: Maintaining Your Premium Collection", excerpt: "Expert tips on washing, storing, and maintaining your premium sarees to keep them looking gorgeous for years to come.", date: "Apr 30, 2026", category: "Care Guide" },
  { id: 4, title: "Trending Saree Fabrics for Summer 2026", excerpt: "From breathable cotton to lightweight chiffon, explore the most comfortable and stylish saree fabrics perfect for the summer season.", date: "Apr 12, 2026", category: "Trends" },
  { id: 5, title: "Office Wear Sarees: Professional Yet Elegant", excerpt: "Make a statement at work with our curated guide to choosing sarees that are both professional and effortlessly elegant.", date: "Mar 28, 2026", category: "Work Wear" },
  { id: 6, title: "Understanding Saree Fabrics: A Complete Guide", excerpt: "From silk to organza, from cotton to georgette — learn about different saree fabrics and which one suits your occasion best.", date: "Mar 10, 2026", category: "Education" },
];

export default function BlogPage() {
  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">Our Blog</motion.h1>
        <p className="text-plum/40 text-sm mt-2">Stories, tips, and inspiration from the world of sarees</p>
      </div>
      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.article key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-glass p-5 sm:p-6 group hover:border-rose-gold/15 transition-colors cursor-pointer">
            <span className="text-[10px] font-semibold text-rose-gold uppercase tracking-wider">{post.category}</span>
            <h2 className="font-display text-lg font-bold text-plum mt-1 group-hover:text-rose-gold transition-colors">{post.title}</h2>
            <p className="text-sm text-plum/50 mt-2 leading-relaxed">{post.excerpt}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5 text-xs text-plum/30"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
              <span className="text-xs font-medium text-rose-gold flex items-center gap-1">Read More <ArrowRight className="w-3 h-3" /></span>
            </div>
          </motion.article>
        ))}
      </div>
    </div></main><Footer /></>
  );
}
