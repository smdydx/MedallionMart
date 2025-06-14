import { motion } from "framer-motion";
import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import FlashDealsSection from "@/components/flash-deals-section";
import TestimonialsSection from "@/components/testimonials-section";
import DeliveryPromiseSection from "@/components/delivery-promise-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation Bar for Landing */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">
                🏆 Medallion Mart
              </h1>
              <p className="ml-4 hidden md:block text-gray-600">
                Premium Shopping Experience
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant="outline" className="flex items-center gap-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <FlashDealsSection />
        <DeliveryPromiseSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </div>
  );
}