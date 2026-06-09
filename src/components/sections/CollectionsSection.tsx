"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { collections } from "@/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CollectionsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-ivory" aria-label="Shop by Collection">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-plum mb-3">
            Shop By Collection
          </h2>
          <div className="section-divider">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-rose-gold"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
                opacity="0.5"
              />
            </svg>
          </div>
          <p className="text-plum/50 text-sm sm:text-base max-w-lg mx-auto mt-3">
            Explore our handpicked categories of premium sarees
          </p>
        </motion.div>

        {/* Collection Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6 lg:gap-8"
        >
          {collections.map((collection) => (
            <motion.a
              key={collection.id}
              variants={itemVariants}
              href={`/collections/${collection.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {/* Circular Image */}
              <div className="relative mb-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-rose-gold/15 group-hover:border-rose-gold/40 transition-all duration-500 shadow-sm group-hover:shadow-premium">
                  <div className="w-full h-full rounded-full overflow-hidden transform transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Hover ring */}
                <div className="absolute -inset-1 rounded-full border border-rose-gold/0 group-hover:border-rose-gold/20 transition-all duration-500 group-hover:scale-110" />
              </div>

              {/* Collection Name */}
              <h3 className="font-display text-xs sm:text-sm font-semibold text-plum group-hover:text-rose-gold transition-colors duration-300 leading-tight">
                {collection.name}
              </h3>
              <p className="text-[10px] sm:text-xs text-plum/40 mt-0.5">
                {collection.itemCount} items
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
