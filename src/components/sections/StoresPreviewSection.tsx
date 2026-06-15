"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import { useSettings } from "@/lib/contexts/settings-context";

export default function StoresPreviewSection() {
  const { settings } = useSettings();
  
  let stores: any[] = [];
  if (settings?.stores_data) {
    try {
      stores = JSON.parse(settings.stores_data).slice(0, 3); // Preview max 3
    } catch (e) {}
  }

  if (stores.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-ivory" aria-label="Our Boutiques">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-plum mb-2">
              Our Boutiques
            </h2>
            <div className="section-divider justify-start">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-rose-gold">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.5"/>
              </svg>
            </div>
            <p className="text-plum/50 text-sm sm:text-base mt-2">
              Experience the luxury of Solanki Vastra in person.
            </p>
          </div>

          <motion.a
            whileHover={{ x: 4 }}
            href="/stores"
            className="group inline-flex items-center gap-2 px-6 py-2.5 border-2 border-plum text-plum rounded-full text-sm font-medium uppercase tracking-wider hover:bg-plum hover:text-white transition-all duration-300"
          >
            All Locations
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, i) => (
            <motion.a
              key={store.id}
              href={`/stores`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-plum/5"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-plum/5">
                {store.media && store.media.length > 0 ? (
                  <Image 
                    src={typeof store.media[0] === 'string' ? store.media[0] : store.media[0].url} 
                    alt={store.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-plum/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-plum mb-2 group-hover:text-rose-gold transition-colors">{store.name}</h3>
                <p className="text-sm text-plum/60 line-clamp-2">{store.address}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-gold">
                  <MapPin className="w-3.5 h-3.5" /> View Store
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

