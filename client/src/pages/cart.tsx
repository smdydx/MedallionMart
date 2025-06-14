import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

export default function Cart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['/api/cart'],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiRequest('PUT', `/api/cart/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/cart/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', '/api/cart'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
  });

  const moveToWishlistMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest('POST', '/api/wishlist', { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: "Moved to wishlist",
        description: "Item has been moved to your wishlist.",
      });
    },
  });

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity });
  };

  const handleRemoveItem = (id: number) => {
    removeItemMutation.mutate(id);
  };

  const handleMoveToWishlist = async (item: any) => {
    await moveToWishlistMutation.mutateAsync(item.productId);
    await removeItemMutation.mutateAsync(item.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gray-200 animate-pulse rounded-lg h-20 w-20"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 animate-pulse h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
              <div className="space-y-4">
                <div className="bg-gray-200 animate-pulse h-6 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                <div className="bg-gray-200 animate-pulse h-10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-xl text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/products">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum: number, item: any) => 
    sum + (parseFloat(item.product.price) * item.quantity), 0
  );
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                  <Button
                    variant="ghost"
                    onClick={() => clearCartMutation.mutate()}
                    disabled={clearCartMutation.isPending}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="divide-y">
                <AnimatePresence>
                  {cartItems.map((item: any) => (
                    <motion.div
                      key={item.id}
                      className="p-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center space-x-4">
                        <Link href={`/products/${item.product.id}`}>
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                          />
                        </Link>

                        <div className="flex-1">
                          <Link href={`/products/${item.product.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-orange-500 cursor-pointer mb-1">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm mb-2">
                            {item.product.description?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{parseFloat(item.product.price).toLocaleString()}
                            </span>
                            {item.product.originalPrice && parseFloat(item.product.originalPrice) > parseFloat(item.product.price) && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{parseFloat(item.product.originalPrice).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              className="p-1 h-8 w-8"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={updateQuantityMutation.isPending}
                              className="p-1 h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Item Actions */}
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveToWishlist(item)}
                              disabled={moveToWishlistMutation.isPending}
                              className="text-gray-600 hover:text-red-500 p-1"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removeItemMutation.isPending}
                              className="text-gray-600 hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <Badge className="bg-green-100 text-green-800">FREE</Badge>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-gray-600 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    Add ₹{(499 - subtotal).toLocaleString()} more for free delivery!
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 text-center space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span>🔒</span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>🚚</span>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>↩️</span>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
