
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-blue-900/70"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements - Hidden on mobile for better performance */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-20 left-10 w-16 h-16 lg:w-20 lg:h-20 bg-orange-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 lg:w-16 lg:h-16 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 left-20 w-18 h-18 lg:w-24 lg:h-24 bg-purple-500/20 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-10 w-10 h-10 lg:w-12 lg:h-12 bg-green-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span className="block">Your One-Stop</span>
            <span className="bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
              Shopping Destination
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-200 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Everything you need, delivered faster than ever. Experience the future of shopping with 
            <span className="text-orange-400 font-semibold"> premium quality</span> and 
            <span className="text-blue-400 font-semibold"> lightning-fast delivery</span>.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 border border-white/20">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-white font-medium text-sm sm:text-base">Lightning Fast</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 border border-white/20">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-white font-medium text-sm sm:text-base">Secure Shopping</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 border border-white/20">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              <span className="text-white font-medium text-sm sm:text-base">Free Delivery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300"
            >
              Explore Categories
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">10M+</div>
              <div className="text-slate-300 text-sm sm:text-base">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-slate-300 text-sm sm:text-base">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-300 text-sm sm:text-base">Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
