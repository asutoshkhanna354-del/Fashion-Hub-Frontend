"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import { useSettings } from "@/lib/contexts/settings-context";

export default function PromoBannersSection() {
  const { settings, loading } = useSettings();

  const defaultBanners = [
    {
      id: "1",
      title: "Summer Breeze",
      subtitle: "New Collection",
      description: "Light, Colorful, Beautiful. Perfect for the season ahead.",
      cta: "Explore Collection",
      link: "/collections/summer",
      image: "/images/banners/summer.png",
      bgColor: "from-sage/15 via-sage-light/10 to-ivory",
      textColor: "text-plum",
      position: "left",
    },
    {
      id: "2",
      title: "Celebrate in Style & Color",
      subtitle: "Festive Special",
      description: "Up to 30% Off. Limited time festive collection offer.",
      cta: "Shop Festive",
      link: "/collections/festive",
      image: "/images/banners/summer.png",
      bgColor: "from-plum via-plum-light to-plum",
      textColor: "text-white",
      position: "right",
    },
    {
      id: "3",
      title: "Wedding Season",
      subtitle: "Special Occasion",
      description: "Exquisite bridal & trousseau collection",
      cta: "Shop Now",
      link: "/collections/wedding",
      image: "",
      bgColor: "from-rose-gold/10 via-lavender/10 to-rose-gold/5",
      textColor: "text-plum",
      position: "left",
    },
    {
      id: "4",
      title: "Designer Picks",
      subtitle: "Curated For You",
      description: "Handpicked designer sarees for every taste",
      cta: "Explore",
      link: "/collections/designer",
      image: "",
      bgColor: "from-lavender/10 via-plum/5 to-lavender/10",
      textColor: "text-plum",
      position: "right",
    }
  ];

  let banners = defaultBanners;
  if (settings?.promo_banners) {
    try {
      const parsed = JSON.parse(settings.promo_banners);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const padded = [...parsed];
        while (padded.length < 4) {
          padded.push(defaultBanners[padded.length]);
        }
        banners = padded;
      }
    } catch (e) {}
  }

  // Loading skeleton
  if (loading && !settings?.promo_banners) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-ivory">
        <div className="container-premium space-y-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="min-h-[320px] bg-black/5 rounded-2xl"></div>
            <div className="min-h-[320px] bg-black/5 rounded-2xl"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <div className="min-h-[200px] bg-black/5 rounded-2xl"></div>
            <div className="min-h-[200px] bg-black/5 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  const mainBanners = banners.slice(0, 2);
  const secondaryBanners = banners.slice(2, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-ivory" aria-label="Promotional Banners">
      <div className="container-premium">
        
        {/* Main Banners Row */}
        {mainBanners.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {mainBanners.map((banner, index) => {
              const isLeft = banner.position === "left";
              return (
                <motion.div
                  key={banner.id || index}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                  className={`group relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[380px] bg-gradient-to-br ${banner.bgColor}`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    {banner.image && (
                      <Image
                        src={banner.image.startsWith("http") ? banner.image : `https://Solanki-Vastra-backend.onrender.com${banner.image}`}
                        alt={banner.title}
                        fill
                        className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-${isLeft ? 'r' : 'l'} from-${banner.textColor === 'text-white' ? 'plum' : 'white'}/80 via-${banner.textColor === 'text-white' ? 'plum' : 'white'}/60 to-transparent`} />
                  </div>

                  {/* Content */}
                  <div className={`relative h-full flex items-center p-8 sm:p-10 lg:p-12 ${isLeft ? 'justify-start' : 'justify-end text-right'}`}>
                    <div className="max-w-sm">
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className={`inline-block ${banner.textColor === 'text-white' ? 'text-rose-gold-light' : 'text-sage-dark'} text-xs font-bold uppercase tracking-[0.2em] mb-3`}
                      >
                        {banner.subtitle}
                      </motion.span>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold ${banner.textColor} mb-3 leading-tight`}
                      >
                        {banner.title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className={`${banner.textColor === 'text-white' ? 'text-white/80' : 'text-plum/60'} text-sm sm:text-base mb-6`}
                      >
                        {banner.description}
                      </motion.p>
                      <motion.a
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ x: isLeft ? 4 : -4 }}
                        href={banner.link || "#"}
                        className={`group/btn inline-flex items-center gap-2 ${banner.textColor === 'text-white' ? 'bg-rose-gold hover:bg-rose-gold-dark text-white' : 'bg-sage hover:bg-sage-dark text-white'} px-6 py-3 rounded-sm text-sm font-medium uppercase tracking-wider transition-all duration-300`}
                      >
                        {!isLeft && <ArrowRight className="w-4 h-4 rotate-180 transition-transform group-hover/btn:-translate-x-1" />}
                        {banner.cta}
                        {isLeft && <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Secondary Banners Row */}
        {secondaryBanners.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
            {secondaryBanners.map((banner, index) => {
              const isRight = index % 2 !== 0; // Alternating
              return (
                <motion.div
                  key={banner.id || index + 2}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className={`group relative rounded-2xl overflow-hidden min-h-[200px] bg-gradient-to-r ${banner.bgColor} border border-plum/5`}
                >
                  {banner.image && (
                    <Image src={banner.image.startsWith("http") ? banner.image : `https://Solanki-Vastra-backend.onrender.com${banner.image}`} alt={banner.title} fill className="object-cover opacity-20 mix-blend-multiply" />
                  )}
                  <div className={`absolute inset-0 bg-[radial-gradient(circle_at_${isRight ? '20%_80%' : '80%_20%'},rgba(197,143,122,0.1),transparent)]`} />
                  
                  <div className={`relative h-full flex items-center p-8 ${isRight ? 'justify-end text-right' : ''}`}>
                    <div>
                      <span className="text-rose-gold text-xs font-bold uppercase tracking-[0.2em]">
                        {banner.subtitle}
                      </span>
                      <h4 className={`font-display text-2xl sm:text-3xl font-bold ${banner.textColor || 'text-plum'} mt-2 mb-2`}>
                        {banner.title}
                      </h4>
                      <p className={`${banner.textColor === 'text-white' ? 'text-white/70' : 'text-plum/50'} text-sm mb-4`}>
                        {banner.description}
                      </p>
                      <a
                        href={banner.link || "#"}
                        className={`inline-flex items-center gap-1.5 text-sm font-semibold ${banner.textColor === 'text-white' ? 'text-rose-gold-light hover:text-white' : 'text-rose-gold hover:text-rose-gold-dark'} transition-colors group/link`}
                      >
                        {banner.cta}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

