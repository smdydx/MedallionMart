
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSection />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="space-y-16 md:space-y-20 lg:space-y-24"
      >
        <div className="pt-16 md:pt-20">
          <CategoriesSection />
        </div>
        
        <div className="py-8">
          <FeaturedProductsSection />
        </div>
        
        <div className="py-8">
          <FlashDealsSection />
        </div>
        
        <div className="py-8">
          <DeliveryPromiseSection />
        </div>
        
        <div className="py-8">
          <TestimonialsSection />
        </div>
      </motion.div>
      
      <div className="mt-16 md:mt-20">
        <Footer />
      </div>
    </div>
  );
}
