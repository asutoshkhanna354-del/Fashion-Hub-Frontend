"use client";
import { motion } from "framer-motion";
import { Heart, Star, Users, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <><Header /><main className="min-h-screen bg-ivory pt-28 pb-20"><div className="container-premium max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl sm:text-4xl font-bold text-plum">Our Story</motion.h1>
        <p className="text-plum/40 text-sm mt-2">The heart behind Solanki Vastra Bhandar</p>
      </div>
      <div className="card-glass p-8 sm:p-10 mb-8">
        <h2 className="font-display text-xl font-bold text-plum mb-4">About Solanki Vastra Bhandar</h2>
        <p className="text-plum/60 text-sm leading-relaxed mb-4">Solanki Vastra Bhandar is a premium online destination for exquisite Indian sarees. Born from a passion for preserving the timeless elegance of Indian textiles, we bring you handpicked collections that blend traditional craftsmanship with contemporary design.</p>
        <p className="text-plum/60 text-sm leading-relaxed mb-4">Every saree in our collection tells a story — of skilled weavers, rich cultural heritage, and the pursuit of perfection. From the luxurious silk of Kanchipuram to the delicate organza of Lucknow, we source the finest fabrics from across India.</p>
        <p className="text-plum/60 text-sm leading-relaxed">Our mission is simple: to make premium, authentic sarees accessible to every woman, delivered right to your doorstep with love and care.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Heart, label: "Handpicked", desc: "Every piece personally curated" },
          { icon: Star, label: "Premium Quality", desc: "Only the finest fabrics" },
          { icon: Users, label: "10K+ Customers", desc: "Trusted nationwide" },
          { icon: Sparkles, label: "Authentic", desc: "100% genuine products" },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="card-glass p-5 text-center">
            <Icon className="w-8 h-8 text-rose-gold mx-auto mb-2" />
            <h3 className="text-sm font-bold text-plum">{label}</h3>
            <p className="text-xs text-plum/40 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div></main><Footer /></>
  );
}

