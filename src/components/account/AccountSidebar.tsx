"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Star,
  Gift,
  RotateCcw,
  Bell,
  HelpCircle,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { useAuth } from "@/lib/contexts/auth-context";
import { useWishlist } from "@/lib/contexts/wishlist-context";

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const navItems = [
    { name: "Account Overview", href: "/account/", icon: Home },
    { name: "My Orders", href: "/account/orders/", icon: Package },
    { name: "My Wishlist", href: "/wishlist/", icon: Heart, badge: wishlistCount || 0 },
    { name: "My Addresses", href: "/account/profile/", icon: MapPin },
    { name: "My Reviews", href: "/account/reviews/", icon: Star },
    { name: "Coupons & Offers", href: "/account/coupons/", icon: Gift },
    { name: "Help & Support", href: "/contact/", icon: HelpCircle },
  ];

  return (
    <div className="w-full lg:w-72 shrink-0">
      {/* Profile Card */}
      <div className="card-glass p-6 mb-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#C5A47E] flex items-center justify-center text-white font-display text-2xl font-bold mb-4 shadow-lg shadow-rose-gold/20">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <h2 className="font-bold text-lg text-plum truncate w-full">{user?.firstName} {user?.lastName}</h2>
        <p className="text-xs text-plum/50 mb-4 truncate w-full">{user?.email}</p>
        <button 
          onClick={() => router.push("/account/profile/")}
          className="w-full py-2 flex items-center justify-center gap-2 border border-plum/10 rounded-xl text-sm font-medium hover:bg-plum/5 transition-colors"
        >
          <UserIcon className="w-4 h-4" /> View Profile
        </button>
      </div>

      {/* Navigation List */}
      <div className="card-glass overflow-hidden flex flex-col p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/account/" && pathname?.startsWith(item.href));
          return (
            <button
              key={item.name}
              onClick={() => { if (item.href !== "#") router.push(item.href); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-colors text-sm font-medium mb-1 ${
                isActive ? "bg-gradient-to-r from-[#FDFBF7] to-[#F5ECE2] text-[#A8875E]" : "text-plum/70 hover:bg-plum/5 hover:text-plum"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? "text-[#C5A47E]" : "text-plum/40"}`} />
                {item.name}
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-[#F5ECE2] text-[#A8875E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
        <hr className="border-plum/10 my-2" />
        <button
          onClick={() => { logout(); router.push("/account/"); }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}
