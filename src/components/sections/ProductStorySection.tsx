"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSettings } from "@/lib/contexts/settings-context";

const defaultStories = [
  {
    title: "Crafted in Banaras",
    description: "Every thread tells a story of the ancient city. Woven with devotion in the heart of Varanasi, this masterpiece carries the spiritual and cultural essence of centuries-old traditions.",
    image: "https://images.unsplash.com/photo-1596401057658-3e53288f01b0?q=80&w=1000&auto=format&fit=crop",
    align: "left"
  },
  {
    title: "Handwoven Heritage",
    description: "It takes weeks of meticulous labor on the handloom to create the intricate motifs you see. Our master weavers use techniques passed down through generations.",
    image: "https://images.unsplash.com/photo-1605051410714-3676778f69ea?q=80&w=1000&auto=format&fit=crop",
    align: "right"
  },
  {
    title: "Fabric Story",
    description: "Made from the finest pure silk and authentic zari. The luxurious drape and subtle sheen are testaments to the uncompromising quality of raw materials used.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop",
    align: "left"
  },
  {
    title: "Artisan Story",
    description: "By choosing this piece, you are supporting the livelihood of traditional artisans and keeping the sacred art of Banarasi weaving alive for future generations.",
    image: "https://images.unsplash.com/photo-1592643534571-002f2320b72a?q=80&w=1000&auto=format&fit=crop",
    align: "right"
  }
];

export default function ProductStorySection() {
  const { settings } = useSettings();
  let stories = defaultStories;

  if (settings?.story_data) {
    try {
      const parsed = JSON.parse(settings.story_data);
      if (Array.isArray(parsed) && parsed.length === 4) {
        stories = parsed;
      }
    } catch (e) {}
  }

  return (
    <section className="py-24 bg-ivory relative overflow-hidden border-t border-plum/5">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-rose-gold blur-3xl" />
        <div className="absolute bottom-40 -left-40 w-96 h-96 rounded-full bg-plum blur-3xl" />
      </div>

      <div className="container-premium relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-plum mb-6">
            The Story Behind The Silk
          </h2>
          <p className="text-plum/60 font-medium">
            Discover the heritage, artistry, and devotion woven into every single thread.
          </p>
        </motion.div>

        <div className="space-y-24 sm:space-y-32">
          {stories.map((story, idx) => (
            <div 
              key={story.title}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                story.align === "right" ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <motion.div 
                initial={{ opacity: 0, x: story.align === "left" ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full lg:w-1/2"
              >
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full max-w-md mx-auto">
                  {/* Decorative Frame */}
                  <div className={`absolute inset-0 border border-rose-gold/30 rounded-2xl ${
                    story.align === "left" ? "-translate-x-4 translate-y-4" : "translate-x-4 translate-y-4"
                  }`} />
                  <div className="absolute inset-0 rounded-2xl overflow-hidden bg-plum/5">
                    <Image 
                      src={story.image.startsWith("http") ? story.image : `https://Solanki-Vastra-backend.onrender.com${story.image}`}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 text-center lg:text-left max-w-lg mx-auto lg:mx-0"
              >
                <span className="text-xs font-bold tracking-[0.2em] text-rose-gold uppercase mb-4 block">
                  Chapter 0{idx + 1}
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-plum mb-6">
                  {story.title}
                </h3>
                <p className="text-plum/70 leading-relaxed text-lg">
                  {story.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

