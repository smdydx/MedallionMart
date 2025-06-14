import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import FlashDealsSection from "@/components/flash-deals-section";
import FeaturedProductsSection from "@/components/featured-products-section";
import DeliveryPromiseSection from "@/components/delivery-promise-section";
import TestimonialsSection from "@/components/testimonials-section";
import Footer from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingBag, Heart, Package } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Personalized Welcome Section */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mb-6">
              Ready to discover amazing products today?
            </p>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Link href="/products">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <ShoppingBag className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Browse Products</h3>
                    <p className="text-sm text-gray-600">Explore our collection</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/orders">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Track Orders</h3>
                    <p className="text-sm text-gray-600">Check your deliveries</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/profile">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Wishlist</h3>
                    <p className="text-sm text-gray-600">View saved items</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <FlashDealsSection />
      <DeliveryPromiseSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}