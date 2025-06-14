import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden -mt-16 pt-16 md:-mt-20 md:pt-20">
      {/* Video Background */}
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="/src/assets/mall.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Enhanced Background pattern with dynamic geometric shapes */}
      <div className="absolute inset-0 opacity-20">
        {/* Floating circles with different animations */}
        <motion.div 
          className="absolute top-10 left-5 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-sm"
          animate={{ 
            y: [-20, 30, -20], 
            x: [-10, 10, -10],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-32 right-10 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg rotate-45 blur-sm"
          animate={{ 
            y: [-15, 25, -15], 
            rotate: [45, 225, 405],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 left-1/4 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full blur-sm"
          animate={{ 
            scale: [1, 1.5, 1], 
            opacity: [0.5, 1, 0.5],
            y: [-10, 20, -10]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-14 h-14 lg:w-28 lg:h-28 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-sm"
          animate={{ 
            x: [-20, 20, -20], 
            y: [-15, 15, -15],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-5 w-18 h-18 lg:w-36 lg:h-36 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-lg rotate-12 blur-sm"
          animate={{ 
            rotate: [12, 192, 372], 
            scale: [1, 0.7, 1],
            y: [-25, 15, -25]
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Additional smaller floating elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-4 h-4 lg:w-8 lg:h-8 bg-white rounded-full blur-sm opacity-60`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
          <motion.div 
            className="text-center lg:text-left order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-tight">
              Shop <span className="text-yellow-300 animate-pulse">Everything</span><br/>
              Get <span className="text-green-300 animate-bounce">Delivered Fast</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 lg:mb-8 text-gray-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
              From groceries to gadgets, fashion to food - discover millions of products with lightning-fast delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start mb-8 lg:mb-12">
              <Link href="/products">
                <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <ShoppingBag className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                  Start Shopping
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="w-full sm:w-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 hover:bg-opacity-30">
                  <Truck className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                  Track Order
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 lg:gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-xl lg:text-3xl font-bold text-yellow-300 animate-pulse">1M+</div>
                <div className="text-xs lg:text-sm text-gray-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-3xl font-bold text-green-300 animate-pulse">10min</div>
                <div className="text-xs lg:text-sm text-gray-200">Avg Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-xl lg:text-3xl font-bold text-blue-300 animate-pulse">500K+</div>
                <div className="text-xs lg:text-sm text-gray-200">Happy Users</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative order-1 lg:order-2 mb-8 lg:mb-0"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern e-commerce shopping experience" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover transform hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
