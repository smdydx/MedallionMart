import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, Clock } from "lucide-react";
import ProductCard from "@/components/product-card";

export default function FlashDealsSection() {
  const { data: flashDeals, isLoading } = useQuery({
    queryKey: ['/api/products', { flashDeal: 'true' }],
    queryFn: () => fetch('/api/products?flashDeal=true').then(res => res.json()),
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Flash Deals</h2>
              <p className="text-gray-600">Limited time offers - grab them fast!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-200 animate-pulse h-48"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                  <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 animate-pulse h-8 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <Zap className="text-yellow-500 mr-2 h-8 w-8" />
              Flash Deals
            </h2>
            <p className="text-gray-600">Limited time offers - grab them fast!</p>
          </motion.div>
          <div className="flex items-center space-x-4">
            {/* Countdown Timer */}
            <motion.div 
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="text-sm flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Ends in: 2:45:30
              </span>
            </motion.div>
            <Link href="/products?flashDeal=true">
              <button className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                View All
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashDeals?.slice(0, 4).map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} showDiscount />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
