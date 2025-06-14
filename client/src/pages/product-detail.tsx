import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, Star, ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isInWishlist, wishlistItems } = useStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

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
    onError: (error) => {
      console.error('Add to cart error:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="bg-gray-200 animate-pulse rounded-2xl h-96"></div>
              <div className="flex space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-20 w-20"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-200 animate-pulse h-8 rounded w-3/4"></div>
              <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
              <div className="bg-gray-200 animate-pulse h-4 rounded w-1/2"></div>
              <div className="bg-gray-200 animate-pulse h-12 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const wishlistItem = wishlistItems.find(item => item.productId === product.id);

  const handleAddToCart = async () => {
    await addToCartMutation.mutateAsync({
      productId: product.id,
      quantity,
    });
  };

  const handleBuyNow = async () => {
    await addToCartMutation.mutateAsync({
      productId: product.id,
      quantity,
    });
    setLocation('/cart');
  };

  const handleWishlistToggle = async () => {
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
          className={`h-5 w-5 ${
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

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center space-x-2 text-sm text-gray-600 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/">
            <span className="hover:text-orange-500 cursor-pointer">Home</span>
          </Link>
          <span>/</span>
          <Link href="/products">
            <span className="hover:text-orange-500 cursor-pointer">Products</span>
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </motion.nav>

        {/* Back Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1">
                  {product.discountPercentage}% OFF
                </Badge>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
              </div>
              <span className="text-gray-600">({product.reviewCount || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString()}</span>
              {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
                <span className="text-2xl text-gray-500 line-through">₹{parseFloat(product.originalPrice).toLocaleString()}</span>
              )}
            </div>

            {/* Delivery Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <Truck className="h-5 w-5" />
                <span className="font-semibold">{product.deliveryTime}</span>
              </div>
              <p className="text-green-600 text-sm mt-1">Free delivery on orders above ₹499</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg font-semibold"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="p-3"
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? "text-red-500 fill-current" : ""}`} />
                </Button>
              </div>
              
              <Button
                onClick={handleBuyNow}
                disabled={addToCartMutation.isPending}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 text-lg font-semibold"
              >
                Buy Now
              </Button>
            </div>

            {/* Product Features */}
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Product Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <RotateCcw className="h-5 w-5 text-green-500" />
                  <span>Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Truck className="h-5 w-5 text-orange-500" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
