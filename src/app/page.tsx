import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import PromoBannersSection from "@/components/sections/PromoBannersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TrustBar from "@/components/sections/TrustBar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <HeroSection />
      <CollectionsSection />
      <BestSellersSection />
      <PromoBannersSection />
      <WhyChooseUsSection />
      <TrustBar />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
