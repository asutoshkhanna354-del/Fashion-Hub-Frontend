"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSettings } from "@/lib/contexts/settings-context";

export default function StoresPage() {
  const { settings, loading } = useSettings();
  
  let stores: any[] = [];
  if (settings?.stores_data) {
    try {
      stores = JSON.parse(settings.stores_data);
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) return <div className="min-h-screen bg-ivory pt-32 pb-24" />;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-ivory pt-32 pb-24">
        <div className="container-premium max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-plum mb-6"
            >
              Our Boutiques
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-plum/60 text-lg"
            >
              Experience the luxury of Solanki Vastra Bhandar in person. Visit our exclusive boutiques for personalized styling and bespoke collections.
            </motion.p>
          </div>

          {/* Stores List */}
          {stores.length > 0 ? (
            <div className="space-y-24">
              {stores.map((store, index) => (
                <motion.div 
                  key={store.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col lg:flex-row gap-12 lg:gap-20 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Store Visuals */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    {store.media && store.media.length > 0 && (
                      <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl shadow-plum/5">
                        <Image 
                          src={typeof store.media[0] === 'string' ? store.media[0] : store.media[0].url} 
                          alt={store.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    )}
                    {store.mapSrc && (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-plum/5">
                        <iframe 
                          src={store.mapSrc} 
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }} 
                          allowFullScreen 
                          loading="lazy" 
                          referrerPolicy="no-referrer-when-downgrade"
                          title={`${store.name} Map`}
                        />
                      </div>
                    )}
                  </div>

                  {/* Store Details */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <span className="text-xs font-bold tracking-[0.2em] text-rose-gold uppercase mb-4 block">
                      {settings?.store_name || "Solanki Vastra Bhandar"}
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-plum mb-8">
                      {store.name}
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-plum/5 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-rose-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-plum mb-1">Address</h3>
                          <p className="text-plum/60 leading-relaxed max-w-xs">{store.address}</p>
                          <a 
                            href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-semibold text-rose-gold mt-2 hover:text-plum transition-colors"
                          >
                            <Navigation className="w-3 h-3" /> Get Directions
                          </a>
                        </div>
                      </div>

                      {store.hours && (
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-plum/5 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-rose-gold" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-plum mb-1">Opening Hours</h3>
                            <p className="text-plum/60">{store.hours}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-plum/5 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-rose-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-plum mb-1">Contact</h3>
                          {store.phone && <a href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`} className="block text-plum/60 hover:text-rose-gold transition-colors">{store.phone}</a>}
                          {store.email && <a href={`mailto:${store.email}`} className="block text-plum/60 hover:text-rose-gold transition-colors">{store.email}</a>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-plum/10 space-y-4">
                      {store.instagramLink && (
                        <a href={store.instagramLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-plum hover:text-rose-gold transition-colors block">
                          → View on Instagram
                        </a>
                      )}
                      {store.youtubeLink && (
                        <a href={store.youtubeLink} target="_blank" rel="noreferrer" className="text-sm font-semibold text-plum hover:text-rose-gold transition-colors block">
                          → View Video Tour
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-plum/50">
              Stores are currently being updated. Check back soon.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

