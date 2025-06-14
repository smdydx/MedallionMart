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

  const getCategoryColor = (categoryColor: string) => {
    switch (categoryColor) {
      case 'red': return '#F56565';
      case 'blue': return '#4299E1';
      case 'green': return '#48BB78';
      case 'yellow': return '#ECC94B';
      case 'purple': return '#805AD5';
      case 'pink': return '#ED64A6';
      default: return '#6B46C1';
    }
  };

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories?.map((category: any, index: number) => {
              const getIcon = (categoryName: string) => {
                switch(categoryName.toLowerCase()) {
                  case 'electronics': return '📱';
                  case 'fashion': return '👕';
                  case 'home': return '🏠';
                  case 'sports': return '⚽';
                  case 'books': return '📚';
                  case 'grocery': return '🍎';
                  default: return '🛍️';
                }
              };

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/products?categoryId=${category.id}`}>
                    <div className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2">
                      <div 
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-lg"
                        style={{ backgroundColor: getCategoryColor(category.color) }}
                      >
                        {getIcon(category.name)}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
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