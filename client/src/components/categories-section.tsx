import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Smartphone, Shirt, Home, Dumbbell, Book, Apple } from "lucide-react";

const iconMap = {
  "fas fa-mobile-alt": Smartphone,
  "fas fa-tshirt": Shirt,
  "fas fa-home": Home,
  "fas fa-dumbbell": Dumbbell,
  "fas fa-book": Book,
  "fas fa-apple-alt": Apple,
};

const colorMap = {
  red: "from-red-50 to-red-100 text-red-600",
  blue: "from-blue-50 to-blue-100 text-blue-600",
  green: "from-green-50 to-green-100 text-green-600",
  yellow: "from-yellow-50 to-yellow-100 text-yellow-600",
  purple: "from-purple-50 to-purple-100 text-purple-600",
  pink: "from-pink-50 to-pink-100 text-pink-600",
};

export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Discover amazing deals across all categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse p-6 rounded-2xl h-32"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-xl text-gray-600">Discover amazing deals across all categories</p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories?.map((category, index) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || Smartphone;
            const colorClass = colorMap[category.color as keyof typeof colorMap] || colorMap.red;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/products?categoryId=${category.id}`}>
                  <div className={`bg-gradient-to-br ${colorClass} p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-lg`}>
                    <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">50k+ items</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
