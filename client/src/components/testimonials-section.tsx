import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Delhi",
      rating: 5,
      comment: "Amazing service! Got my groceries delivered in just 8 minutes. The quality is excellent and the prices are competitive.",
      initials: "PS",
      gradient: "from-purple-400 to-pink-400",
    },
    {
      name: "Rajesh Singh",
      location: "Mumbai",
      rating: 5,
      comment: "The electronics section has everything I need. Fast delivery, great packaging, and excellent customer support.",
      initials: "RS",
      gradient: "from-blue-400 to-indigo-400",
    },
    {
      name: "Anita Kumari",
      location: "Bangalore",
      rating: 5,
      comment: "Best shopping app ever! The live tracking feature is incredible. I can see exactly where my delivery partner is.",
      initials: "AK",
      gradient: "from-green-400 to-emerald-400",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Join millions of satisfied customers worldwide</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-4">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-600">{testimonial.rating}.0</span>
              </div>
              
              <p className="text-gray-700 mb-6 italic">
                "{testimonial.comment}"
              </p>
              
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center mr-4`}>
                  <span className="text-white font-bold">{testimonial.initials}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
