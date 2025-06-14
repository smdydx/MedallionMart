
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, Truck, Shield, Star, Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = document.getElementById('hero-video') as HTMLVideoElement;
    if (video) {
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          id="hero-video"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={() => setIsVideoLoaded(true)}
        >
          <source src="/src/assets/mall.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 video-overlay"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10">
        <motion.div
          className="absolute top-20 left-10 text-white/20"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <ShoppingBag size={60} />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-white/20"
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <Truck size={50} />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-white/20"
          animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        >
          <Shield size={40} />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Medallion
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Mart
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Your premium shopping destination with exclusive deals, 
              lightning-fast delivery, and unmatched quality
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Search for products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-6 px-6 pr-16 text-lg rounded-full border-0 bg-white/95 backdrop-blur-sm shadow-2xl focus:ring-4 focus:ring-white/30 transition-all duration-300 group-hover:bg-white"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <Link href="/products">
              <Button
                size="lg"
                className="px-8 py-4 text-lg rounded-full bg-white text-indigo-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl font-semibold"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Button>
            </Link>
            
            <Link href="/products?flashDeal=true">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg rounded-full border-2 border-white text-white hover:bg-white hover:text-indigo-600 hover:scale-105 transition-all duration-300 shadow-xl font-semibold"
              >
                ⚡ Flash Deals
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 text-white/80 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Free Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current text-yellow-400" />
              <span className="text-sm font-medium">4.8+ Rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          onClick={scrollToProducts}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/60 hover:text-white transition-colors"
          >
            <ChevronDown className="h-8 w-8" />
          </motion.div>
        </motion.div>
      </div>

      {/* Performance Metrics Overlay */}
      <motion.div
        className="absolute bottom-20 right-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white hidden lg:block"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2.2 }}
      >
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold">10K+</div>
          <div className="text-sm opacity-80">Happy Customers</div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white hidden lg:block"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 2.4 }}
      >
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold">5K+</div>
          <div className="text-sm opacity-80">Products</div>
        </div>
      </motion.div>
    </div>
  );
}
