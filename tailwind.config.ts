import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF7F2",
        pearl: "#FFFFFF",
        "rose-gold": "#C5A47E",
        "rose-gold-light": "#D4B896",
        "rose-gold-dark": "#A8875E",
        lavender: "#C5A47E",
        "lavender-light": "#D4B896",
        plum: "#111111",
        "plum-light": "#2A2A2A",
        sage: "#8AA391",
        "sage-light": "#A8BFB0",
        "sage-dark": "#6E8A77",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        shimmer: "shimmer 2s infinite linear",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 50%, #FAF7F2 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.06)",
        "glass-lg": "0 12px 48px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.1)",
        premium: "0 4px 24px rgba(197, 143, 122, 0.15)",
        "premium-lg": "0 8px 40px rgba(197, 143, 122, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
