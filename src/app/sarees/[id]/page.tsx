"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingBag, Star, Truck, RotateCcw, ShieldCheck, ChevronLeft, Minus, Plus } from "lucide-react";
import { productApi } from "@/lib/api";
import { useCart } from "@/lib/contexts/cart-context";
import { useWishlist } from "@/lib/contexts/wishlist-context";
import { useAuth } from "@/lib/contexts/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ReviewsSection from "@/components/sections/ReviewsSection";
import UpsellsSection from "@/components/sections/UpsellsSection";
import Script from "next/script";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      productApi.get(id as string)
        .then((data) => {
          setProduct(data.product);
          // Fetch similar products for Upsells
          productApi.list({ sectionId: data.product.sectionId, limit: "4" })
            .then(sim => setSimilarProducts(sim.products.filter((p: any) => p.id !== data.product.id)))
            .catch(() => {});
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id]);

  const initRazorpayWidget = async () => {
    if (typeof window !== "undefined" && (window as any).RazorpayAffordabilitySuite && product?.price) {
      try {
        // Find existing widget to prevent duplicates
        const widgetContainer = document.getElementById("razorpay-affordability-widget");
        if (widgetContainer && widgetContainer.innerHTML !== "") return;
        
        let key = process.env.NEXT_PUBLIC_RZP_KEY || "";
        
        if (!key) {
          try {
            const res = await fetch(`${API_URL}/api/settings/public`);
            const data = await res.json();
            if (data.status && data.settings?.razorpay_key) {
              key = data.settings.razorpay_key;
            }
          } catch (e) {
            console.error("Failed to fetch Razorpay key from settings", e);
          }
        }
        
        if (!key) {
           console.error("Razorpay API key is missing. Widget cannot be loaded.");
           return;
        }
        
        const widgetConfig = {
          "key": key, 
          "amount": Math.round(Number(product.price) * 100),
        };
        const rzpAffordabilitySuite = new (window as any).RazorpayAffordabilitySuite(widgetConfig);
        rzpAffordabilitySuite.render();
      } catch (err) {
        console.error("Razorpay widget init error", err);
      }
    }
  };

  useEffect(() => {
    if (product) {
      initRazorpayWidget();
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) { router.push("/account/"); return; }
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
    } catch {}
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) { router.push("/account/"); return; }
    try {
      await addToCart(product.id, quantity);
      router.push("/cart/");
    } catch {}
  };

  const handleWishlist = () => {
    if (!isLoggedIn) { router.push("/account/"); return; }
    toggleWishlist(product.id);
  };

  const getImageUrl = (media: any[]) => {
    if (!media || media.length === 0) return "/images/products/product-1.png";
    const img = media[selectedImage] || media[0];
    if (typeof img === "string") return img.startsWith("http") ? img : `${API_URL}${img}`;
    return img.url?.startsWith("http") ? img.url : `${API_URL}${img.url}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-ivory pt-28 pb-20">
          <div className="container-premium">
            <div className="animate-pulse grid lg:grid-cols-2 gap-10">
              <div className="aspect-[3/4] bg-plum/5 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-8 bg-plum/5 rounded w-3/4" />
                <div className="h-4 bg-plum/5 rounded w-1/2" />
                <div className="h-10 bg-plum/5 rounded w-1/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-ivory pt-28 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl text-plum mb-2">Product Not Found</h1>
            <button onClick={() => router.push("/sarees/")} className="text-rose-gold hover:underline text-sm">Browse Sarees</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const features = product.features ? product.features.split(",").map((f: string) => f.trim()) : [];
  const media = Array.isArray(product.media) ? product.media : [];

  return (
    <>
      <Script src="https://cdn.razorpay.com/widgets/affordability/affordability.js" onReady={() => { initRazorpayWidget(); }} />
      <Header />
      <main className="min-h-screen bg-ivory pt-28 pb-20">
        <div className="container-premium">
          {/* Breadcrumb */}
          <button onClick={() => router.back()} className="flex items-center gap-1 text-plum/50 hover:text-plum text-sm mb-6">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white mb-3">
                <Image
                  src={getImageUrl(media)}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-gold text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    {product.discountPercent}% OFF
                  </span>
                )}
                <button onClick={handleWishlist} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                  <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? "fill-rose-gold text-rose-gold" : "text-plum/50"}`} />
                </button>
                {showVideo && product.videoUrl && (
                  <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
                    <ReactPlayer
                      url={product.videoUrl}
                      width="100%"
                      height="100%"
                      playing={showVideo}
                      controls={true}
                    />
                    <button onClick={() => setShowVideo(false)} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                      <ChevronLeft className="w-5 h-5 text-black" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.videoUrl && (
                  <button onClick={() => setShowVideo(true)} className={`relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all bg-black/5 flex items-center justify-center ${showVideo ? "border-rose-gold" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <svg className="w-6 h-6 text-black/50" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                )}
                {media.map((m: any, i: number) => (
                  <button key={i} onClick={() => { setSelectedImage(i); setShowVideo(false); }} className={`relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${!showVideo && i === selectedImage ? "border-rose-gold" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <Image src={typeof m === "string" ? m : (m.url?.startsWith("http") ? m.url : `${API_URL}${m.url}`)} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              {product.section && (
                <span className="text-xs font-semibold text-rose-gold uppercase tracking-wider">{product.section.name}</span>
              )}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-plum leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(product.rating)) ? "text-amber-400 fill-amber-400" : "text-plum/15"}`} />
                  ))}
                </div>
                <span className="text-sm text-plum/50">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-plum">₹{Number(product.price).toLocaleString("en-IN")}</span>
                {Number(product.originalPrice) > Number(product.price) && (
                  <span className="text-lg text-plum/30 line-through">₹{Number(product.originalPrice).toLocaleString("en-IN")}</span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{product.discountPercent}% off</span>
                )}
              </div>
              
              {/* Razorpay Affordability Widget Container */}
              <div id="razorpay-affordability-widget" className="my-2 min-h-[40px]"></div>

              {/* Fabric */}
              {product.fabric && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-plum/50">Fabric:</span>
                  <span className="text-sm font-semibold text-plum bg-ivory px-3 py-1 rounded-full">{product.fabric}</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-sm font-semibold text-plum mb-2">Description</h3>
                  <p className="text-sm text-plum/60 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Features */}
              {features.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-plum mb-2">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f: string, i: number) => (
                      <span key={i} className="text-xs bg-ivory border border-plum/10 text-plum/60 px-3 py-1.5 rounded-full">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-plum/50">Quantity:</span>
                <div className="flex items-center gap-1 bg-ivory rounded-xl border border-plum/10">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-plum/5 rounded-l-xl"><Minus className="w-4 h-4 text-plum/50" /></button>
                  <span className="w-10 text-center text-sm font-semibold text-plum">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-plum/5 rounded-r-xl"><Plus className="w-4 h-4 text-plum/50" /></button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 py-3.5 bg-plum text-white rounded-xl font-medium text-sm hover:bg-plum/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> {addingToCart ? <span className="loading-dots">Adding</span> : "Add to Cart"}
                </button>
                <button onClick={handleBuyNow} className="flex-1 py-3.5 bg-gradient-to-r from-rose-gold to-rose-gold/80 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Buy Now
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-plum/5">
                {[
                  { icon: Truck, label: "Free Shipping" },
                  { icon: RotateCcw, label: "Easy Returns" },
                  { icon: ShieldCheck, label: "Authentic" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="w-5 h-5 mx-auto text-rose-gold/60 mb-1" />
                    <span className="text-[10px] text-plum/40">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <ReviewsSection productId={product.id} />
      {similarProducts.length > 0 && (
        <UpsellsSection title="You May Also Like" subtitle="Handpicked recommendations based on your selection" products={similarProducts} />
      )}

      <Footer />
    </>
  );
}
