"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { promoApi } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountSidebar from "@/components/account/AccountSidebar";
import { Gift, Copy, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CouponsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    promoApi.getPublic()
      .then((data) => {
        if (data.status) setPromos(data.promos || []);
      })
      .catch((err) => console.error("Error fetching promos:", err))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    router.push("/account/");
    return null;
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FDFBF7] pt-28 pb-20">
        <div className="container-premium max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <AccountSidebar />
            
            <div className="flex-1 min-w-0 space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-plum">Coupons & Offers</h1>
                <p className="text-plum/50 mt-1">Exclusive discounts available for you</p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-plum/5 animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : promos.length === 0 ? (
                <div className="text-center py-16 card-glass">
                  <Gift className="w-16 h-16 text-plum/10 mx-auto mb-4" />
                  <h2 className="font-display text-xl text-plum mb-2">No active offers</h2>
                  <p className="text-plum/50 text-sm">Check back later for new coupons and discounts!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promos.map((promo) => {
                    const isCopied = copiedCode === promo.code;
                    return (
                      <div key={promo.id} className="card-glass p-6 relative overflow-hidden flex flex-col justify-between group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-gold/5 rounded-full -translate-y-16 translate-x-16" />
                        
                        <div className="relative z-10 flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 font-bold text-xs rounded-full mb-2 uppercase tracking-wider">
                              Save {promo.discountPercent}%
                            </span>
                            <h3 className="font-bold text-plum text-lg">{promo.code}</h3>
                          </div>
                          <button 
                            onClick={() => handleCopy(promo.code)}
                            className="p-2 rounded-xl bg-ivory border border-plum/10 hover:bg-plum/5 transition-colors"
                            title="Copy code"
                          >
                            {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-plum/40" />}
                          </button>
                        </div>

                        <div className="relative z-10 text-xs text-plum/60 space-y-1 mt-auto">
                          {promo.minOrder > 0 && <p>• Minimum order value: ₹{promo.minOrder}</p>}
                          {promo.expiresAt && <p>• Expires on: {new Date(promo.expiresAt).toLocaleDateString()}</p>}
                          {(!promo.minOrder && !promo.expiresAt) && <p>• No minimum order required</p>}
                        </div>

                        {/* Cutout circles for coupon design effect */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#FDFBF7] rounded-full -translate-y-1/2 border-r border-plum/5" />
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#FDFBF7] rounded-full -translate-y-1/2 border-l border-plum/5" />
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
