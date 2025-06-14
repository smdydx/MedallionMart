import { MessageCircle, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function FloatingCart() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-40">
      {/* Chat Support */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300"
          onClick={() => {
            // Chat functionality can be implemented here
            console.log("Chat support clicked");
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
      
      {/* Scroll to Top */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Button
          className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
