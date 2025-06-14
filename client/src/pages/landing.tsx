import { motion } from "framer-motion";
import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import FlashDealsSection from "@/components/flash-deals-section";
import TestimonialsSection from "@/components/testimonials-section";
import DeliveryPromiseSection from "@/components/delivery-promise-section";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeroSection />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="space-y-0"
      >
        <CategoriesSection />
        <FeaturedProductsSection />
        <FlashDealsSection />
        <DeliveryPromiseSection />
        <TestimonialsSection />
      </motion.div>
      <Footer />
    </div>
  );
}