"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, Filter, CheckCircle2, PlayCircle, MessageSquare } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { productApi } from "@/lib/api";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

interface ReviewsSectionProps {
  productId?: string;
}

const defaultReviews = [
  {
    id: "1",
    author: "Priya Sharma",
    date: "12 Oct 2023",
    rating: 5,
    title: "Absolutely Breathtaking",
    content: "The silk is incredibly soft and the zari work is impeccable. I wore this to my brother's wedding and received compliments all night. The drape is effortless.",
    verified: true,
    likes: 14,
    media: [] // removed photos from homepage
  },
  {
    id: "2",
    author: "Anita Desai",
    date: "28 Sep 2023",
    rating: 5,
    title: "Worth Every Penny",
    content: "I was hesitant to buy silk online, but Solanki Vastra exceeded my expectations. The colors are even more vibrant in person. The packaging was so premium!",
    verified: true,
    likes: 8,
    media: [] // removed photos from homepage
  },
  {
    id: "3",
    author: "Meera Reddy",
    date: "15 Sep 2023",
    rating: 4,
    title: "Beautiful Craftsmanship",
    content: "The saree is gorgeous, but the color was slightly darker than the picture. Still keeping it because the quality of Banarasi silk is genuine.",
    verified: true,
    likes: 3,
    media: []
  }
];

const defaultStats = {
  average: 4.8,
  total: 124,
  distribution: [
    { stars: 5, count: 98 },
    { stars: 4, count: 18 },
    { stars: 3, count: 5 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ],
};

export default function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [filter, setFilter] = useState("all");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  
  const [reviews, setReviews] = useState<any[]>(productId ? [] : defaultReviews);
  const [stats, setStats] = useState(productId ? null : defaultStats);
  const [loading, setLoading] = useState(!!productId);

  useEffect(() => {
    if (productId) {
      let isMounted = true;
      const fetchReviews = async () => {
        try {
          const data = await productApi.getReviews(productId);
          if (isMounted && data.status) {
            setReviews(data.reviews);
            // Calculate stats dynamically
            if (data.reviews.length > 0) {
              const total = data.reviews.length;
              const sum = data.reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
              const dist = [5, 4, 3, 2, 1].map(stars => ({
                stars,
                count: data.reviews.filter((r: any) => r.rating === stars).length
              }));
              setStats({ average: Number((sum / total).toFixed(1)), total, distribution: dist });
            }
          }
        } catch (error) {
          // Gracefully ignore fetch failures (e.g. backend offline)
          console.warn("Could not load reviews for product");
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      fetchReviews();
      return () => { isMounted = false; };
    }
  }, [productId]);

  const filteredReviews = reviews.filter((r) => {
    if (filter === "with media") return r.media && r.media.length > 0;
    if (filter === "verified only") return r.verified;
    return true;
  });

  if (loading) {
    return <div className="py-24 text-center text-plum/50">Loading reviews...</div>;
  }

  // If we are on product page and there are no reviews
  if (productId && reviews.length === 0) {
    return (
      <section className="py-20 bg-ivory border-t border-plum/5">
        <div className="container-premium max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 rounded-3xl border border-plum/10 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-gold/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-rose-gold" />
            </div>
            <h3 className="font-display text-2xl font-bold text-plum mb-2">No Reviews Yet</h3>
            <p className="text-plum/60 text-sm max-w-md mx-auto mb-6">
              Be the first one to review and rate this product! You can leave a review from your "My Orders" page after receiving the product.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white border-t border-plum/5">
      <div className="container-premium max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-plum mb-4">
            {productId ? "Customer Reviews" : "Client Diaries"}
          </h2>
          <p className="text-plum/50 font-medium">Stories from the Solanki Vastra family</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          {/* Left Column: Ratings Summary */}
          <div className="space-y-8">
            <div className="bg-ivory/50 rounded-3xl p-8 border border-plum/5">
              <div className="flex items-end gap-4 mb-8">
                <span className="font-display text-6xl font-bold text-plum leading-none">
                  {stats?.average}
                </span>
                <div className="pb-1">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-5 h-5 ${s <= Math.round(stats?.average || 0) ? "fill-rose-gold text-rose-gold" : "fill-plum/20 text-plum/20"}`} />
                    ))}
                  </div>
                  <p className="text-sm text-plum/50 font-medium">
                    Based on {stats?.total} reviews
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {stats?.distribution.map((dist) => (
                  <div key={dist.stars} className="flex items-center gap-4 text-sm text-plum/60">
                    <div className="w-12 flex items-center gap-1 font-medium">
                      {dist.stars} <Star className="w-3 h-3 fill-plum/30 text-plum/30" />
                    </div>
                    <div className="flex-1 h-2 bg-plum/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-gold rounded-full"
                        style={{ width: `${stats.total > 0 ? (dist.count / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="w-8 text-right font-medium">{dist.count}</div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-plum/10">
                <h3 className="font-semibold text-plum mb-4">Review Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {["all", "with media", "verified only"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        filter === f 
                          ? "bg-plum text-white" 
                          : "bg-white border border-plum/10 text-plum/50 hover:border-plum/30"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Review List */}
          <div className="space-y-8">
            {filteredReviews.map((review, idx) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-plum/5 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:shadow-plum/5 transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-plum text-lg">{review.author}</h4>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-plum/40 font-medium">{review.date}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-4 h-4 ${s <= review.rating ? "fill-rose-gold text-rose-gold" : "fill-plum/10 text-plum/10"}`} 
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="font-semibold text-plum mb-2">{review.title}</h5>
                    <p className="text-plum/70 text-sm leading-relaxed mb-6">
                      "{review.content}"
                    </p>

                    <button className="flex items-center gap-2 text-xs font-semibold text-plum/40 hover:text-rose-gold transition-colors">
                      <ThumbsUp className="w-4 h-4" /> Helpful ({review.likes})
                    </button>
                  </div>

                  {/* Review Media */}
                  {review.media && review.media.length > 0 && (
                    <div className="flex sm:flex-col gap-3">
                      {review.media.map((m: any, i: number) => (
                        <div key={i} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-ivory flex-shrink-0 cursor-pointer group">
                          {m.type === "video" ? (
                            <div onClick={() => setActiveVideo(m.url)} className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                              <PlayCircle className="w-8 h-8 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                          ) : null}
                          <Image 
                            src={m.type === "video" ? m.thumb : m.url} 
                            alt="Customer review media" 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 96px, 128px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            
            {filteredReviews.length === 0 && (
              <div className="text-center text-sm text-plum/50 py-10">
                No reviews match your filter.
              </div>
            )}
            
            {filteredReviews.length > 0 && (
              <div className="text-center pt-8">
                <button className="px-8 py-3 bg-white border border-plum/20 text-plum text-sm font-bold uppercase tracking-wider rounded-full hover:bg-plum hover:text-white transition-all">
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <ReactPlayer
              url={activeVideo.startsWith("http") ? activeVideo : `https://Solanki-Vastra-backend.onrender.com${activeVideo}`}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
            />
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

