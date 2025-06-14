import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import FlashDealsSection from "@/components/flash-deals-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import DeliveryPromiseSection from "@/components/delivery-promise-section";
import TestimonialsSection from "@/components/testimonials-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <FlashDealsSection />
      <FeaturedProductsSection />
      <DeliveryPromiseSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
