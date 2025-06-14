import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Truck, Shield, Star, Clock, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating shapes */}
        <div className="absolute -top-20 -left-20 w-40 h-40 lg:w-80 lg:h-80 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 -right-20 w-32 h-32 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 lg:w-48 lg:h-48 bg-gradient-to-br from-green-200 to-teal-200 rounded-full opacity-30 animate-ping"></div>
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <div className="w-2 h-2 lg:w-4 lg:h-4 bg-orange-300 rounded-full opacity-40"></div>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 min-h-screen flex items-center">
          <div className="text-center relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
              Welcome to <span className="text-orange-600 animate-pulse">Medallion Mart</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 lg:mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience premium shopping with lightning-fast delivery. From electronics to everyday essentials, 
              we bring the best products right to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center max-w-lg mx-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                onClick={() => window.location.href = '/auth'}
              >
                Get Started - Sign In
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-bold border-orange-600 text-orange-600 hover:bg-orange-50 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = '/auth'}
              >
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Medallion Mart?</h2>
            <p className="text-lg text-gray-600">Everything you need for a superior shopping experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast Delivery</h3>
                <p className="text-gray-600">Same-day delivery available. Express shipping in 1-2 days for most items.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                <p className="text-gray-600">Your data is protected with enterprise-level security and encrypted transactions.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Curated selection of high-quality products from trusted brands worldwide.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">99.8%</div>
              <div className="text-gray-600">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9★</div>
              <div className="text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover amazing products across all categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", icon: "📱", color: "bg-blue-100 text-blue-600" },
              { name: "Fashion", icon: "👕", color: "bg-pink-100 text-pink-600" },
              { name: "Home & Garden", icon: "🏠", color: "bg-green-100 text-green-600" },
              { name: "Sports", icon: "⚽", color: "bg-orange-100 text-orange-600" },
              { name: "Books", icon: "📚", color: "bg-purple-100 text-purple-600" },
              { name: "Beauty", icon: "💄", color: "bg-red-100 text-red-600" },
              { name: "Toys", icon: "🧸", color: "bg-yellow-100 text-yellow-600" },
              { name: "Groceries", icon: "🛒", color: "bg-indigo-100 text-indigo-600" }
            ].map((category, index) => (
              <Card key={index} className="text-center p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mx-auto mb-3 text-2xl`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of satisfied customers and experience the future of online shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Medallion Mart</h3>
              <p className="text-gray-400">
                Your premium destination for quality products and exceptional service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Electronics</a></li>
                <li><a href="#" className="hover:text-white">Fashion</a></li>
                <li><a href="#" className="hover:text-white">Home & Garden</a></li>
                <li><a href="#" className="hover:text-white">Sports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Medallion Mart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}