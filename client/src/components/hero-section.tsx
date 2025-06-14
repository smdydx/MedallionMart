import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative text-white overflow-hidden">
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
      
      {/* Background pattern with modern geometric shapes */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24 bg-white rounded-lg rotate-45"
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-16 h-16 bg-white rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Shop <span className="text-yellow-300">Everything</span><br/>
              Get <span className="text-green-300">Delivered Fast</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
              From groceries to gadgets, fashion to food - discover millions of products with lightning-fast delivery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="outline" className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-opacity-30">
                  <Truck className="mr-2 h-5 w-5" />
                  Track Order
                </Button>
              </Link>
            </div>
            
            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">1M+</div>
                <div className="text-sm text-gray-200">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">10min</div>
                <div className="text-sm text-gray-200">Avg Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-300">500K+</div>
                <div className="text-sm text-gray-200">Happy Users</div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Modern e-commerce shopping experience" 
              className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
