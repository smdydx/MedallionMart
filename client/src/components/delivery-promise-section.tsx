import { motion } from "framer-motion";
import { Rocket, MapPin, Shield } from "lucide-react";

export default function DeliveryPromiseSection() {
  const features = [
    {
      icon: Rocket,
      title: "10-Minute Delivery",
      description: "Ultra-fast delivery for everyday essentials within 10 minutes of ordering",
      color: "bg-green-500",
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "Track your order in real-time from our warehouse to your doorstep",
      color: "bg-blue-500",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Contactless delivery with temperature-controlled storage for freshness",
      color: "bg-purple-500",
    },
  ];

  const trackingSteps = [
    {
      icon: "✓",
      title: "Order Confirmed",
      time: "12:45 PM",
      description: "Your order has been confirmed",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: "📦",
      title: "Being Prepared",
      time: "12:47 PM",
      description: "Items being packed for delivery",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: "🏍️",
      title: "Out for Delivery",
      time: "12:52 PM",
      description: "On the way to your location",
      color: "bg-orange-100 text-orange-600",
      isActive: true,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lightning Fast Delivery</h2>
          <p className="text-xl text-gray-600">From your cart to your door in minutes, not hours</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-20 h-20 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className="text-white h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Delivery Showcase */}
        <motion.div 
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Order Tracking Made Simple</h3>
              <div className="space-y-6">
                {trackingSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center ${step.isActive ? 'animate-pulse' : ''}`}>
                      <span className="text-lg">{step.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-gray-600 text-sm">{step.time} - {step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500" 
                alt="Professional delivery service with tracking interface" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
