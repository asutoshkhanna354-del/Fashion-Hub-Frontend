"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, StarHalf, Eye } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/data";
import { formatPrice, generateStars } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const stars = generateStars(product.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-glass overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlay on hover */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-plum/30 via-transparent to-transparent"
          />

          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-rose-gold text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              -{product.discount}%
            </div>
          )}

          {/* Product Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 mt-8 bg-plum text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
              {product.badge}
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
              isWishlisted
                ? "bg-rose-gold text-white"
                : "bg-white/90 text-plum/60 hover:text-rose-gold"
            }`}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </motion.button>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-3 left-3 right-3 flex items-center gap-2"
          >
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-plum py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-plum hover:text-white transition-all duration-300 shadow-lg">
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button
              className="w-10 h-10 flex items-center justify-center bg-white/95 backdrop-blur-sm text-plum rounded-lg hover:bg-plum hover:text-white transition-all duration-300 shadow-lg"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-[10px] text-rose-gold font-medium uppercase tracking-wider mb-1">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="font-display text-sm sm:text-base font-semibold text-plum leading-tight mb-2 line-clamp-2 group-hover:text-rose-gold transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5">
              {stars.map((type, i) => (
                <span key={i}>
                  {type === "full" && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  )}
                  {type === "half" && (
                    <StarHalf className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  )}
                  {type === "empty" && (
                    <Star className="w-3.5 h-3.5 text-gray-200" />
                  )}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-plum/40">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-plum">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-plum/35 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
