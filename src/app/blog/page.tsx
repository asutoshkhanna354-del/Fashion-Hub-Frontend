"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useState, useEffect } from "react";
import { blogApi } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogApi.list()
      .then((res) => setPosts(res.posts || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getImgUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1596401057658-3e53288f01b0?q=80&w=1200&auto=format&fit=crop";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  const featuredPost = posts.find(p => p.featured) || posts[0];
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id);

  return (
    <div className="bg-[#F8F6F3] min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] mb-4">
              Journal
            </h1>
            <p className="text-[#111111]/60 max-w-2xl mx-auto text-sm sm:text-base">
              Stories of heritage, style guides, and the artistry behind our collections.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-10 h-10 animate-spin text-[#C5A47E]" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#111111]/50">No blog posts found.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16 lg:mb-24"
                >
                  <a href={`/blog/${featuredPost.id}`} className="group block relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-[2.5/1]">
                    <Image
                      src={getImgUrl(featuredPost.image)}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-6 sm:p-10 lg:p-16 max-w-3xl">
                      <div className="flex items-center gap-3 text-white/80 text-xs font-medium uppercase tracking-wider mb-4">
                        <span>{featuredPost.category}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-white/70 text-sm sm:text-base mb-6 line-clamp-2">
                        {featuredPost.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-white font-medium group-hover:text-[#C5A47E] transition-colors">
                        Read Story <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </a>
                </motion.article>
              )}

              {/* Grid Posts */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {regularPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a href={`/blog/${post.id}`} className="group block">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                        <Image
                          src={getImgUrl(post.image)}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[#111111]/40 text-[11px] font-medium uppercase tracking-wider mb-3">
                        <span className="text-[#C5A47E]">{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-[#111111]/20" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#111111] mb-3 group-hover:text-[#C5A47E] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-[#111111]/60 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] group-hover:text-[#C5A47E] transition-colors">
                        Read More <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </a>
                  </motion.article>
                ))}
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

