import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { cartCount, wishlistCount, isMobileMenuOpen, setMobileMenuOpen } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Categories" },
    { href: "/products?flashDeal=true", label: "Deals" },
    { href: "/orders", label: "Track Order" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <motion.div 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Medallion Mart
              </motion.div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className={`text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium cursor-pointer whitespace-nowrap ${
                    location === item.href ? "text-orange-500" : ""
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md xl:max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 p-1 h-auto"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Mobile Search Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden p-2 text-gray-600 hover:text-orange-500"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link href="/products">
              <motion.div
                className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                {wishlistCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={wishlistCount}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <motion.div
                className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartCount}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* Profile */}
            <motion.div
              className="relative hidden sm:block"
              whileHover={{ scale: 1.05 }}
            >
              <Button variant="ghost" className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-500">
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
                <span className="hidden lg:block font-medium">John</span>
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2 text-gray-600">
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="text-lg font-semibold">Menu</span>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="relative w-full mt-4 mb-6">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-4 pr-12 py-3"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <span
                          className="block text-gray-700 font-medium py-3 px-2 text-lg hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all cursor-pointer"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Profile Section */}
                  <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center space-x-3 p-2">
                      <User className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">John</p>
                        <p className="text-sm text-gray-500">john@example.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}