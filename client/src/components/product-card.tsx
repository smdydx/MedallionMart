import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: any;
  showDiscount?: boolean;
}

export default function ProductCard({ product, showDiscount = false }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist, wishlistItems } = useStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const inWishlist = isInWishlist(product.id);
  const wishlistItem = wishlistItems.find(item => item.productId === product.id);

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) =>
      apiRequest('POST', '/api/cart', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (data: { productId: number }) =>
      apiRequest('POST', '/api/wishlist', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: "Added to wishlist!",
        description: `${product.name} has been added to your wishlist.`,
      });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/wishlist/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    },
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist && wishlistItem) {
      await removeFromWishlistMutation.mutateAsync(wishlistItem.id);
    } else {
      await addToWishlistMutation.mutateAsync({
        productId: product.id,
      });
    }
  };

  const renderStars = (rating: string | number) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.floor(numRating)
              ? "text-yellow-400 fill-current"
              : i <= numRating
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {showDiscount && product.discountPercentage > 0 && (
              <Badge className="bg-red-500 text-white px-2 py-1 text-xs font-bold">
                {product.discountPercentage}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-green-500 text-white px-2 py-1 text-xs font-bold">
                Best Seller
              </Badge>
            )}
            {product.flashDeal && (
              <Badge className="bg-orange-500 text-white px-2 py-1 text-xs font-bold">
                Flash Deal
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "text-red-500 fill-current" : "text-gray-600"}`} />
          </Button>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2 text-lg line-clamp-2">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount || 0})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <span className="text-lg text-gray-500 line-through">₹{parseFloat(product.originalPrice).toLocaleString()}</span>
              )}
            </div>
            <span className="text-green-600 text-sm font-semibold">{product.deliveryTime}</span>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            onClick={handleAddToCart}
            disabled={isLoading || addToCartMutation.isPending}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading || addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </Link>
    </motion.div>
  );
}
