"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "framer-motion";
import type { Product } from "@/data";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: any; // Allow both frontend Product and backend Product types
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const saveAmount = (product.originalPrice || 0) - (product.price || 0);
  
  const linkRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(linkRef, { amount: 0.2 });

  let imageUrl = "/placeholder.png";
  if (product.image) {
    imageUrl = product.image;
  } else if (product.media && product.media.length > 0) {
    // If first media is an image, use it as fallback/poster
    const firstMedia = product.media[0];
    imageUrl = typeof firstMedia === "string" ? firstMedia : firstMedia.url;
  }
  
  if (!imageUrl) {
    imageUrl = "/placeholder.png";
  }

  // Find if there's a video URL
  let videoUrl = product.videoUrl;
  if (!videoUrl && product.media && Array.isArray(product.media)) {
    const videoMedia = product.media.find((m: any) => m.type === "video");
    if (videoMedia) {
      videoUrl = typeof videoMedia === "string" ? videoMedia : videoMedia.url;
    }
  }

  const isYouTube = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };
  const ytId = isYouTube ? getYouTubeId(videoUrl) : null;

  useEffect(() => {
    if (videoRef.current && !isYouTube) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, isYouTube]);

  return (
    <div
      className="group flex flex-col relative w-full bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image / Video Container */}
      <Link ref={linkRef} href={`/sarees/${product.slug || product.id}`} className="relative aspect-[3/4] overflow-hidden bg-[#f9f9f9] rounded-2xl">
        {videoUrl ? (
          isYouTube && ytId ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-black flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&modestbranding=1&rel=0`}
                className="w-[300%] h-[150%] md:w-[200%] md:h-[120%] max-w-none transition-transform duration-700 group-hover:scale-105 opacity-90"
                allow="autoplay; encrypted-media"
                style={{ border: 'none' }}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              muted
              loop
              playsInline
              poster={imageUrl !== "/placeholder.png" ? imageUrl : undefined}
            />
          )
        ) : (
          <Image
            src={imageUrl}
            alt={product.name || "Product"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Sale Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#E12C2C] text-white text-[10px] md:text-xs font-semibold px-2 py-1 uppercase tracking-wider">
            Sale
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="pt-4 flex flex-col items-center text-center">
        {/* Name */}
        <Link href={`/sarees/${product.slug || product.id}`}>
          <h3 className="font-display text-[11px] md:text-sm font-medium text-black uppercase tracking-widest leading-snug mb-2 line-clamp-2 hover:text-black/70 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex flex-col items-center mt-auto">
          <div className="flex items-center gap-2 mb-1">
            {product.originalPrice > product.price && (
              <span className="text-[11px] md:text-sm text-black/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-[11px] md:text-sm font-medium text-[#E12C2C]">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Save Amount */}
          {saveAmount > 0 && (
            <span className="text-[10px] md:text-xs text-black/40 tracking-wider">
              Save {formatPrice(saveAmount)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
