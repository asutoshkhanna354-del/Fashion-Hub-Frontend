export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  badge?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export interface HeroSlide {
  id: string;
  subtitle: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  image: string;
  bgGradient: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  image: string;
  bgColor: string;
  textColor: string;
  position: "left" | "right";
}

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    subtitle: "Timeless Elegance, Crafted for You",
    title: "Discover Grace in Every",
    highlight: "Drape",
    description:
      "Premium sarees crafted with love, tradition & perfection. Explore our curated collection of handpicked designer pieces.",
    cta: "Shop Now",
    image: "/images/hero/hero-1.png",
    bgGradient: "from-[#FAF7F2] via-[#F5EFE6] to-[#FAF7F2]",
  },
  {
    id: "2",
    subtitle: "New Collection 2026",
    title: "Where Tradition Meets",
    highlight: "Modernity",
    description:
      "Unveiling our latest collection — a perfect blend of heritage artistry and contemporary design for the modern woman.",
    cta: "Explore Collection",
    image: "/images/hero/hero-2.png",
    bgGradient: "from-[#F8F0F5] via-[#FAF7F2] to-[#F5EFE6]",
  },
];

export const collections: Collection[] = [
  {
    id: "1",
    name: "Floral Prints",
    slug: "floral-prints",
    image: "/images/collections/floral.png",
    itemCount: 48,
  },
  {
    id: "2",
    name: "Silk Sarees",
    slug: "silk-sarees",
    image: "/images/collections/silk.png",
    itemCount: 36,
  },
  {
    id: "3",
    name: "Party Wear",
    slug: "party-wear",
    image: "/images/collections/party.png",
    itemCount: 52,
  },
  {
    id: "4",
    name: "Designer Collection",
    slug: "designer-collection",
    image: "/images/collections/designer.png",
    itemCount: 28,
  },
  {
    id: "5",
    name: "Cotton Comfort",
    slug: "cotton-comfort",
    image: "/images/collections/cotton.png",
    itemCount: 64,
  },
  {
    id: "6",
    name: "Organza",
    slug: "organza",
    image: "/images/collections/organza.png",
    itemCount: 32,
  },
  {
    id: "7",
    name: "Chiffon",
    slug: "chiffon",
    image: "/images/collections/chiffon.png",
    itemCount: 40,
  },
  {
    id: "8",
    name: "New Arrivals",
    slug: "new-arrivals",
    image: "/images/collections/new-arrivals.png",
    itemCount: 24,
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Designer Organza Floral Saree",
    slug: "designer-organza-floral-saree",
    price: 3399,
    originalPrice: 5299,
    discount: 36,
    rating: 4.5,
    reviewCount: 128,
    image: "/images/products/product-1.png",
    category: "Organza",
    isBestSeller: true,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Premium Soft Silk Saree",
    slug: "premium-soft-silk-saree",
    price: 3699,
    originalPrice: 5699,
    discount: 35,
    rating: 4.6,
    reviewCount: 96,
    image: "/images/products/product-2.png",
    category: "Silk",
    isBestSeller: true,
  },
  {
    id: "3",
    name: "Linen Digital Print Saree",
    slug: "linen-digital-print-saree",
    price: 2899,
    originalPrice: 4299,
    discount: 33,
    rating: 4.4,
    reviewCount: 87,
    image: "/images/products/product-3.png",
    category: "Cotton",
    isBestSeller: true,
  },
  {
    id: "4",
    name: "Banarasi Weaving Saree",
    slug: "banarasi-weaving-saree",
    price: 4699,
    originalPrice: 6999,
    discount: 33,
    rating: 4.8,
    reviewCount: 110,
    image: "/images/products/product-4.png",
    category: "Silk",
    isBestSeller: true,
    badge: "Premium",
  },
  {
    id: "5",
    name: "Chiffon Sequence Saree",
    slug: "chiffon-sequence-saree",
    price: 2599,
    originalPrice: 3999,
    discount: 35,
    rating: 4.3,
    reviewCount: 75,
    image: "/images/products/product-5.png",
    category: "Chiffon",
    isBestSeller: true,
  },
  {
    id: "6",
    name: "Royal Silk Bridal Saree",
    slug: "royal-silk-bridal-saree",
    price: 5999,
    originalPrice: 8999,
    discount: 33,
    rating: 4.9,
    reviewCount: 142,
    image: "/images/products/product-6.png",
    category: "Silk",
    isBestSeller: true,
    isNew: true,
    badge: "New",
  },
];

export const features: Feature[] = [
  {
    id: "1",
    icon: "ShieldCheck",
    title: "Authentic Products",
    description: "Each saree is carefully curated and authenticity verified",
  },
  {
    id: "2",
    icon: "Sparkles",
    title: "Premium Fabrics",
    description: "Only the finest quality fabrics from trusted weavers",
  },
  {
    id: "3",
    icon: "Truck",
    title: "Free Shipping",
    description: "Complimentary shipping on all prepaid orders above ₹1999",
  },
  {
    id: "4",
    icon: "RotateCcw",
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days of delivery",
  },
  {
    id: "5",
    icon: "Lock",
    title: "Secure Payments",
    description: "100% safe and encrypted payment processing",
  },
  {
    id: "6",
    icon: "Headphones",
    title: "Customer Support",
    description: "Dedicated support team available 7 days a week",
  },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "1",
    title: "Summer Breeze Collection",
    subtitle: "New Collection",
    description: "Light, Colorful, Beautiful. Perfect for the season.",
    cta: "Explore Collection",
    image: "/images/banners/summer.png",
    bgColor: "from-sage/10 to-sage-light/5",
    textColor: "text-plum",
    position: "left",
  },
  {
    id: "2",
    title: "Celebrate in Style & Color",
    subtitle: "Festive Special",
    description: "Up to 30% Off on festive collection. Limited time offer.",
    cta: "Shop Festive",
    image: "/images/banners/summer.png",
    bgColor: "from-plum to-plum-light",
    textColor: "text-white",
    position: "right",
  },
];

export const navLinks = [
  { name: "Home", href: "/" },
  { name: "Sarees", href: "/sarees/" },
  { name: "Collections", href: "/collections/" },
  { name: "New Arrivals", href: "/new-arrivals/" },
  { name: "Best Sellers", href: "/best-sellers/" },
  { name: "Occasions", href: "/occasions/" },
  { name: "About", href: "/about/" },
  { name: "Blog", href: "/blog/" },
  { name: "Contact", href: "/contact/" },
];

export const footerLinks = {
  shop: [
    { name: "All Sarees", href: "/sarees/" },
    { name: "Collections", href: "/collections/" },
    { name: "New Arrivals", href: "/new-arrivals/" },
    { name: "Best Sellers", href: "/best-sellers/" },
    { name: "Occasions", href: "/occasions/" },
  ],
  customer: [
    { name: "My Account", href: "/account/" },
    { name: "My Orders", href: "/account/orders/" },
    { name: "Wishlist", href: "/wishlist/" },
    { name: "Cart", href: "/cart/" },
  ],
  company: [
    { name: "About Us", href: "/about/" },
    { name: "Blog", href: "/blog/" },
    { name: "Contact", href: "/contact/" },
  ],
  help: [
    { name: "FAQ", href: "/faq/" },
    { name: "Shipping Policy", href: "/shipping-policy/" },
    { name: "Return Policy", href: "/return-policy/" },
    { name: "Privacy Policy", href: "/privacy-policy/" },
    { name: "Terms of Service", href: "/terms/" },
  ],
};
