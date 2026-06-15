import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import CollectionsSection from "@/components/sections/CollectionsSection";
import OccasionsSection from "@/components/sections/OccasionsSection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import HomeCollectionsPreview from "@/components/sections/HomeCollectionsPreview";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import PromoBannersSection from "@/components/sections/PromoBannersSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import TrustBar from "@/components/sections/TrustBar";
import ProductStorySection from "@/components/sections/ProductStorySection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import StoresPreviewSection from "@/components/sections/StoresPreviewSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <HeroSection />
      <CollectionsSection />
      <OccasionsSection />
      <BestSellersSection />
      <HomeCollectionsPreview />
      <PromoBannersSection />
      <WhyChooseUsSection />
      <TrustBar />
      <StoresPreviewSection />
      <ProductStorySection />
      <ReviewsSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
