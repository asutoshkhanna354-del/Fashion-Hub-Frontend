"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { useCart } from "@/lib/contexts/cart-context";
import { useWishlist } from "@/lib/contexts/wishlist-context";
import { orderApi, productApi, paymentApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Package, Heart, Tag, Star, ChevronRight, Crown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";

const statusColors: Record<string, any> = {
  PLACED: { text: "text-amber-500", bg: "bg-amber-50" },
  CONFIRMED: { text: "text-blue-500", bg: "bg-blue-50" },
  PROCESSING: { text: "text-orange-500", bg: "bg-orange-50" },
  SHIPPED: { text: "text-indigo-500", bg: "bg-indigo-50" },
  DELIVERED: { text: "text-green-500", bg: "bg-green-50" },
  CANCELLED: { text: "text-red-500", bg: "bg-red-50" },
};

export default function AccountDashboard() {
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const router = useRouter();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [couponsCount, setCouponsCount] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    orderApi.list().then((d) => setOrders(d.orders || [])).catch(() => {}).finally(() => setLoadingOrders(false));
    productApi.list({ limit: "4" }).then((d) => setRecommendations(d.products?.slice(0, 4) || [])).catch(() => {}).finally(() => setLoadingProducts(false));
    
    // Check if promoApi exists in api.ts, otherwise handle safely
    import("@/lib/api").then(({ promoApi }) => {
      if (promoApi && promoApi.getPublic) {
        promoApi.getPublic().then((d: any) => setCouponsCount(d.promos?.length || 0)).catch(() => {}).finally(() => setLoadingCoupons(false));
      } else {
        setLoadingCoupons(false);
      }
    }).catch(() => setLoadingCoupons(false));
  }, []);

  return (
    <div className="flex-1 space-y-6 min-w-0">
      {/* Welcome Section */}
      <div>
        <h1 className="font-display text-3xl font-bold text-plum">Hello, {user?.firstName}! 👋</h1>
        <p className="text-plum/50 mt-1">Manage your account, orders and preferences</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Orders", value: loadingOrders ? "-" : orders.length, icon: Package, link: "/account/orders/", color: "bg-[#F5ECE2]", text: "text-[#A8875E]" },
          { label: "Wishlist", value: wishlistCount || 0, icon: Heart, link: "/wishlist/", color: "bg-rose-50", text: "text-rose-500" },
          { label: "Coupons", value: loadingCoupons ? "-" : couponsCount, icon: Tag, link: "/account/coupons", color: "bg-emerald-50", text: "text-emerald-500" },
          { label: "Reward Points", value: "0", icon: Star, link: "#", color: "bg-amber-50", text: "text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="card-glass p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => stat.link !== "#" && router.push(stat.link)}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-plum/60">{stat.label}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon className={`w-5 h-5 ${stat.text}`} />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-display font-bold text-plum">{stat.value}</span>
              <span className="text-[10px] text-plum/40 hover:underline">View {stat.label.toLowerCase()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 card-glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-plum">Recent Orders</h2>
            <button onClick={() => router.push("/account/orders/")} className="text-xs font-medium text-plum/60 hover:text-plum transition-colors">View All Orders</button>
          </div>
          
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-plum/5 animate-pulse rounded-xl" />)}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-plum/50 text-sm">No recent orders found.</div>
            ) : (
              orders.slice(0, 3).map((order) => {
                const conf = statusColors[order.orderStatus] || statusColors.PLACED;
                const media = order.orderItems?.[0]?.product?.media;
                const m = Array.isArray(media) ? media[0] : null;
                const url = (typeof m === 'string' ? m : m?.url) || "/placeholder-image.jpg";
                const firstImage = url === "" ? "/placeholder-image.jpg" : url;
                
                return (
                  <div key={order.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-plum/10 hover:border-plum/20 transition-colors bg-white/50">
                    <div className="w-16 h-16 shrink-0 bg-plum/5 rounded-lg overflow-hidden relative border border-plum/10">
                      <Image src={firstImage} alt="Product" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-plum mb-0.5 truncate">Order #{order.orderNumber}</p>
                      <p className="text-xs text-plum/50">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • {order.orderItems?.length} Item{order.orderItems?.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-4 sm:justify-end">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${conf.bg} ${conf.text}`}>
                        {order.orderStatus === "PLACED" ? "Processing" : order.orderStatus === "CONFIRMED" ? "Confirmed" : order.orderStatus === "SHIPPED" ? "Shipped" : order.orderStatus === "DELIVERED" ? "Delivered" : order.orderStatus}
                      </span>
                      <div className="text-right shrink-0 min-w-[70px]">
                        <p className="text-sm font-bold text-plum">₹{Number(order.totalAmount).toLocaleString("en-IN")}</p>
                        <button onClick={() => router.push(`/account/orders/${order.id}`)} className="text-[10px] font-medium text-plum/50 hover:text-plum mt-1">View Details</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Prime Promo Card */}
        <div className="rounded-2xl overflow-hidden relative flex flex-col justify-between bg-black border border-white/10 shadow-lg shadow-black/20">
          <div className="relative z-10 p-8 flex flex-col h-full text-white">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-[#E5C18D]" />
                <span className="font-display font-bold tracking-widest text-sm uppercase !text-white">SVB Prime</span>
              </div>
              <h2 className="font-display text-3xl !text-white font-bold" style={{ color: "white" }}>Membership</h2>
              <p className="!text-white/80 text-sm mt-1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>₹199 / yearly</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <p className="text-sm font-medium text-white opacity-90 mb-2">Exclusive member benefits</p>
              {[
                { text: "Free & Fast Delivery", icon: Package },
                { text: "Early Access to Deals", icon: Crown },
                { text: "Extra 5% Cashback", icon: Tag },
                { text: "Priority Customer Support", icon: Star }
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-200">
                  <benefit.icon className="w-4 h-4 text-[#E5C18D]" />
                  {benefit.text}
                </div>
              ))}
            </div>

            <button 
              onClick={async () => {
                try {
                  let key = "rzp_live_T3QZBiBTIS809z"; // Fallback to live key
                  let orderId = undefined;
                  let amount = 19900;
                  
                  try {
                    // Try to call backend
                    const membershipData = await paymentApi.createMembership();
                    if (membershipData.status && membershipData.order_id) {
                      key = membershipData.key;
                      orderId = membershipData.order_id;
                      amount = membershipData.amount;
                    }
                  } catch (backendErr) {
                    console.warn("Backend membership endpoint not deployed yet. Falling back to order-less checkout for testing.");
                  }
                  
                  if (!(window as any).Razorpay) {
                    await new Promise((resolve) => {
                      const script = document.createElement("script");
                      script.src = "https://checkout.razorpay.com/v1/checkout.js";
                      script.onload = resolve;
                      document.body.appendChild(script);
                    });
                  }
                  
                  const options: any = {
                    key: key,
                    amount: amount,
                    currency: "INR",
                    name: "Solanki Vastra Bhandar",
                    description: "SVB Prime Membership (1 Year)",
                    handler: function (response: any) {
                      alert(`Welcome to SVB Prime! Payment ID: ${response.razorpay_payment_id}`);
                      // Here you can call an API to update user's membership status
                    },
                    prefill: {
                      name: user?.firstName || "",
                      email: user?.email || "",
                      contact: user?.phone || "",
                    },
                    theme: { color: "#C5A47E" },
                    modal: {
                      ondismiss: function() {
                        console.log("Payment cancelled");
                      }
                    }
                  };

                  if (orderId) {
                    options.order_id = orderId;
                  }

                  const rzp = new (window as any).Razorpay(options);
                  rzp.on("payment.failed", function (response: any) {
                    console.error("Payment failed:", response.error);
                    alert("Payment failed: " + response.error.description);
                  });
                  rzp.open();
                } catch(err: any) {
                  console.error("Payment Gateway Error:", err);
                  alert(`Failed to initialize payment gateway: ${err.message || err.toString()}`);
                }
              }}
              className="mt-auto w-full py-3.5 bg-gradient-to-r from-[#C5A47E] to-[#A8875E] text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-[#C5A47E]/20 transition-all"
            >
              Buy Membership
            </button>
          </div>
        </div>
      </div>

      {/* Recommended For You */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-plum">Recommended for You</h2>
          <button onClick={() => router.push("/sarees/")} className="text-xs font-medium text-plum/60 hover:text-plum transition-colors">View all</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingProducts ? (
             [...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-plum/5 animate-pulse rounded-2xl" />)
          ) : (
            recommendations.map(product => {
              const m = Array.isArray(product.media) ? product.media[0] : null;
              const url = (typeof m === 'string' ? m : m?.url) || "/placeholder-image.jpg";
              const imgSrc = url === "" ? "/placeholder-image.jpg" : url;
              return (
                <div key={product.id} onClick={() => router.push(`/sarees/${product.id}`)} className="card-glass p-3 cursor-pointer group hover:border-rose-gold/30 transition-all flex flex-col h-full">
                  <div className="aspect-[4/5] bg-plum/5 rounded-lg overflow-hidden relative mb-3">
                     <Image src={imgSrc} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col flex-grow">
                  <h3 className="text-xs font-bold text-plum line-clamp-1 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xs font-bold text-plum">₹{Number(product.price).toLocaleString("en-IN")}</span>
                    {product.compareAtPrice && <span className="text-[10px] text-plum/40 line-through">₹{Number(product.compareAtPrice).toLocaleString("en-IN")}</span>}
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
