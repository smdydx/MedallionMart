import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CreditCard, MapPin, Truck, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { apiRequest } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "John Doe",
    phone: "+91 9876543210",
    address: "123 Demo Street",
    city: "Mumbai",
    pincode: "400001",
    landmark: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['/api/cart'],
  });

  const placeOrderMutation = useMutation({
    mutationFn: (orderData: any) => apiRequest('POST', '/api/orders', orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed and will be delivered soon.",
      });
      setLocation(`/orders`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="bg-gray-200 animate-pulse h-6 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No items to checkout</h1>
            <p className="text-xl text-gray-600 mb-8">Add items to your cart first.</p>
            <Button onClick={() => setLocation('/products')} className="bg-orange-500 hover:bg-orange-600">
              Continue Shopping
            </Button>
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

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);

    const orderItems = cartItems.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const orderData = {
      orderData: {
        status: "confirmed",
        totalAmount: total.toString(),
        deliveryAddress: `${deliveryAddress.fullName}, ${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.pincode}`,
        estimatedDelivery: "10-15 minutes",
      },
      items: orderItems,
    };

    try {
      await placeOrderMutation.mutateAsync(orderData);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }));
  };

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
          <Button
            variant="ghost"
            onClick={() => setLocation('/cart')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={deliveryAddress.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={deliveryAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={deliveryAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your address"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={deliveryAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={deliveryAddress.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Pincode"
                      />
                    </div>
                    <div>
                      <Label htmlFor="landmark">Landmark (Optional)</Label>
                      <Input
                        id="landmark"
                        value={deliveryAddress.landmark}
                        onChange={(e) => handleInputChange('landmark', e.target.value)}
                        placeholder="Landmark"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Delivery Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value="express" className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <RadioGroupItem value="express" id="express" />
                      <div className="flex-1">
                        <Label htmlFor="express" className="font-semibold text-orange-700">
                          Express Delivery (10-15 minutes)
                        </Label>
                        <p className="text-sm text-orange-600">Get your order delivered in just 10-15 minutes</p>
                      </div>
                      <span className="font-semibold text-orange-700">FREE</span>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <Label htmlFor="cod" className="font-semibold">Cash on Delivery</Label>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                      <span className="text-green-600 font-semibold">Recommended</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <div className="flex-1">
                        <Label htmlFor="card" className="font-semibold">Credit/Debit Card</Label>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                      <RadioGroupItem value="upi" id="upi" disabled />
                      <div className="flex-1">
                        <Label htmlFor="upi" className="font-semibold">UPI Payment</Label>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-sm">
                        ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || placeOrderMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                >
                  <Check className="mr-2 h-5 w-5" />
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>

                {/* Security Badge */}
                <div className="text-center pt-4 border-t">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>🔒</span>
                    <span>Your order is secured with SSL encryption</span>
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
