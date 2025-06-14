
import { motion } from "framer-motion";
import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import FlashDealsSection from "@/components/flash-deals-section";
import TestimonialsSection from "@/components/testimonials-section";
import DeliveryPromiseSection from "@/components/delivery-promise-section";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation Bar for Landing */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-orange-600">
                🏆 Medallion Mart
              </h1>
              <p className="ml-2 sm:ml-4 hidden lg:block text-sm text-gray-600">
                Premium Shopping Experience
              </p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
              <Link href="/auth">
                <Button variant="outline" size="sm" className="text-sm px-4 py-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-sm px-4 py-2">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-orange-600 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                <Link href="/auth">
                  <Button variant="outline" className="w-full justify-center mb-2">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="w-full justify-center bg-orange-600 hover:bg-orange-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-14 sm:pt-16">
        <div className="mt-4 sm:mt-6">
        <HeroSection />
      </div>
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
