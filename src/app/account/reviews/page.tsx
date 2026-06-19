"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { productApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import { Star, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MyReviewsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    productApi.getMyReviews()
      .then((data) => {
        if (data.status) setReviews(data.reviews || []);
      })
      .catch((err) => console.error("Error fetching reviews:", err))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    router.push("/account/");
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
        <div className="container-premium max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <AccountSidebar />
            
            <div className="flex-1 min-w-0 space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-plum">My Reviews</h1>
                <p className="text-plum/50 mt-1">Products you have rated and reviewed</p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-plum/5 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-16 card-glass">
                  <MessageSquare className="w-16 h-16 text-plum/10 mx-auto mb-4" />
                  <h2 className="font-display text-xl text-plum mb-2">No reviews yet</h2>
                  <p className="text-plum/50 text-sm">You haven't left any reviews on your purchased products.</p>
                  <button onClick={() => router.push("/account/orders/")} className="mt-4 px-6 py-2 bg-plum text-white rounded-xl text-sm hover:bg-plum/90 transition-colors">
                    Review a past order
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const m = Array.isArray(review.product?.media) ? review.product?.media[0] : null;
                    const url = (typeof m === 'string' ? m : m?.url) || "/placeholder-image.jpg";
                    const imgSrc = url === "" ? "/placeholder-image.jpg" : url;
                    
                    return (
                      <div key={review.id} className="card-glass p-5 flex flex-col sm:flex-row gap-5">
                        <div className="w-20 h-24 sm:w-24 sm:h-32 shrink-0 bg-plum/5 rounded-xl overflow-hidden relative cursor-pointer" onClick={() => router.push(`/sarees/${review.product?.id}`)}>
                          <Image src={imgSrc} alt={review.product?.name || "Product"} fill className="object-cover" />
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-plum cursor-pointer hover:underline" onClick={() => router.push(`/sarees/${review.product?.id}`)}>
                                {review.product?.name}
                              </h3>
                              <p className="text-xs text-plum/40 mt-0.5">
                                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${review.status === "APPROVED" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                              {review.status}
                            </span>
                          </div>

                          <div className="flex gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-plum/10 fill-plum/10"}`}
                              />
                            ))}
                          </div>

                          {review.title && <h4 className="font-semibold text-sm text-plum mb-1">{review.title}</h4>}
                          {review.comment && <p className="text-sm text-plum/70 line-clamp-2">{review.comment}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
