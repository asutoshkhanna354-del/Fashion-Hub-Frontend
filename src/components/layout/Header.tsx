"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navLinks } from "@/data";
import { productApi } from "@/lib/api";
import { useCart } from "@/lib/contexts/cart-context";
import { useWishlist } from "@/lib/contexts/wishlist-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { useSettings } from "@/lib/contexts/settings-context";
import CartDrawer from "../ui/CartDrawer";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { settings } = useSettings();

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        productApi.list({ search: searchQuery, limit: "5" })
          .then(data => setSearchResults(data.products || []))
          .catch(() => {})
          .finally(() => setIsSearching(false));
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/sarees/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-glass-lg"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        {/* Main Header */}
        <div className="container-premium">
          <div className="flex items-center justify-between py-4 lg:py-5">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-plum hover:text-rose-gold transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mr-auto lg:mx-auto group">
              {settings?.store_logo_url ? (
                <div className="relative w-11 h-11 transition-transform duration-500 group-hover:rotate-12">
                  <img 
                    src={settings.store_logo_url.startsWith("http") ? settings.store_logo_url : `https://Solanki-Vastra-backend.onrender.com${settings.store_logo_url}`} 
                    alt={"Solanki Vastra"} 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ) : (
                <div className="relative">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    className="transition-transform duration-500 group-hover:rotate-12"
                  >
                    <circle cx="22" cy="22" r="20" stroke="#C58F7A" strokeWidth="1.5" fill="none" />
                    <path
                      d="M22 8c-2 4-6 8-6 14s4 10 6 14c2-4 6-8 6-14s-4-10-6-14z"
                      fill="#C58F7A"
                      opacity="0.15"
                      stroke="#C58F7A"
                      strokeWidth="1"
                    />
                    <path
                      d="M10 22c4-2 8-6 14-6s10 4 14 6c-4 2-8 6-14 6s-10-4-14-6z"
                      fill="#B89CCF"
                      opacity="0.15"
                      stroke="#B89CCF"
                      strokeWidth="1"
                    />
                    <circle cx="22" cy="22" r="3" fill="#C58F7A" />
                  </svg>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-display text-xl sm:text-2xl font-bold text-plum tracking-wide leading-none transition-colors group-hover:text-rose-gold">
                  {"SOLANKI"}
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.3em] text-rose-gold font-bold uppercase -mt-1">
                  {"VASTRA"}
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sarees, collections..."
                  className="w-full py-2.5 pl-4 pr-12 bg-ivory/80 border border-rose-gold/15 rounded-full text-sm text-plum placeholder:text-plum/40 focus:outline-none focus:border-rose-gold/40 focus:bg-white transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-rose-gold/10 rounded-full hover:bg-rose-gold hover:text-white text-plum/60 transition-all duration-300"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                {searchQuery.trim().length > 1 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-glass-lg border border-plum/5 overflow-hidden z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-xs text-plum/40">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-2">
                        {searchResults.map(p => (
                          <Link key={p.id} href={`/sarees/${p.slug || p.id}`} onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-plum/5 transition-colors">
                            <div className="w-10 h-10 rounded overflow-hidden bg-ivory">
                              {p.media?.[0] && <img src={p.media[0].url} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-sm font-medium text-plum truncate">{p.name}</p>
                              <p className="text-xs text-plum/50">₹{p.price}</p>
                            </div>
                          </Link>
                        ))}
                        <button type="submit" onClick={() => { setIsSearchOpen(false); }} className="block w-full text-center px-4 py-3 text-xs font-semibold text-rose-gold border-t border-plum/5 hover:bg-rose-gold/5 transition-colors">
                          View all results
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-plum/40">No results found</div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-plum hover:text-rose-gold transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist/"
                className="relative p-2 text-plum hover:text-rose-gold transition-colors group"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
                <span className="hidden sm:block text-[10px] text-plum/60 mt-0.5 text-center">
                  Wishlist
                </span>
              </Link>

              {/* Account */}
              <Link
                href="/account/"
                className="relative p-2 text-plum hover:text-rose-gold transition-colors group hidden sm:block"
                aria-label="Account"
              >
                {isLoggedIn ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-gold to-lavender flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">{user?.firstName?.[0]}</span>
                  </div>
                ) : (
                  <User className="w-5 h-5 transition-transform group-hover:scale-110" />
                )}
                <span className="hidden sm:block text-[10px] text-plum/60 mt-0.5 text-center">
                  {isLoggedIn ? "Profile" : "Account"}
                </span>
              </Link>

              {/* Cart */}
              <button
                onClick={(e) => { e.preventDefault(); setIsCartOpen(true); }}
                className="relative p-2 text-plum hover:text-rose-gold transition-colors group"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-plum text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:block text-[10px] text-plum/60 mt-0.5 text-center">
                  Cart
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block border-t border-rose-gold/10">
            <ul className="flex items-center justify-center gap-1">
              {navLinks.map((link) => (
                <li key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-plum/70 hover:text-plum transition-colors relative"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-rose-gold transition-all duration-300 group-hover:w-full rounded-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-0 left-0 right-0 z-[60] glass p-4 shadow-glass-lg lg:hidden"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sarees..."
                  className="w-full py-3 pl-4 pr-12 bg-ivory border border-rose-gold/15 rounded-full text-sm text-plum placeholder:text-plum/40 focus:outline-none focus:border-rose-gold/40"
                  autoFocus
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 bg-rose-gold rounded-full text-white">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-plum"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-[55] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-[56] shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    {settings?.store_logo_url ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-rose-gold/20">
                         <img 
                           src={settings.store_logo_url.startsWith("http") ? settings.store_logo_url : `https://Solanki-Vastra-backend.onrender.com${settings.store_logo_url}`} 
                           alt={"Solanki Vastra"} 
                           className="w-full h-full object-contain" 
                         />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-rose-gold/10 rounded-full flex items-center justify-center">
                        <span className="font-display text-sm font-bold text-rose-gold">
                          {"S"}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-display text-lg font-bold text-plum leading-none">
                        {"SOLANKI"}
                      </span>
                      <span className="text-[8px] tracking-[0.2em] text-rose-gold font-bold uppercase mt-0.5">
                        {"VASTRA"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-plum hover:text-rose-gold transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav>
                  <ul className="space-y-1">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-3 text-plum/80 hover:text-plum hover:bg-ivory rounded-lg transition-all text-sm font-medium"
                        >
                          {link.name}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 pt-8 border-t border-rose-gold/10 space-y-3">
                  <Link
                    href="/account/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-plum/70 hover:text-plum hover:bg-ivory rounded-lg transition-all text-sm"
                  >
                    <User className="w-4 h-4" />
                    My Account
                  </Link>
                  <Link
                    href="/wishlist/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-plum/70 hover:text-plum hover:bg-ivory rounded-lg transition-all text-sm"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </Link>
                  <Link
                    href="/account/orders/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-plum/70 hover:text-plum hover:bg-ivory rounded-lg transition-all text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    My Orders
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

