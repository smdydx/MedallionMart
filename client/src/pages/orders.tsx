import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/footer";

const statusConfig = {
  confirmed: {
    label: "Order Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Your order has been confirmed"
  },
  preparing: {
    label: "Being Prepared",
    color: "bg-yellow-100 text-yellow-800",
    icon: Package,
    description: "Items being packed for delivery"
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-800",
    icon: Truck,
    description: "On the way to your location"
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Order has been delivered"
  }
};

function OrderTrackingModal({ order }: { order: any }) {
  const trackingSteps = [
    {
      status: "confirmed",
      time: "12:45 PM",
      completed: true
    },
    {
      status: "preparing",
      time: "12:47 PM",
      completed: order.status !== "confirmed"
    },
    {
      status: "out_for_delivery",
      time: order.status === "out_for_delivery" || order.status === "delivered" ? "12:52 PM" : "",
      completed: order.status === "out_for_delivery" || order.status === "delivered"
    },
    {
      status: "delivered",
      time: order.status === "delivered" ? "1:05 PM" : "",
      completed: order.status === "delivered"
    }
  ];

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Track Order #{order.id}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6">
        {/* Delivery Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-700 mb-2">
            <Truck className="h-5 w-5" />
            <span className="font-semibold">Estimated Delivery</span>
          </div>
          <p className="text-green-600">{order.estimatedDelivery || "10-15 minutes"}</p>
        </div>

        {/* Tracking Steps */}
        <div className="space-y-4">
          {trackingSteps.map((step, index) => {
            const config = statusConfig[step.status as keyof typeof statusConfig];
            const IconComponent = config.icon;
            
            return (
              <motion.div
                key={step.status}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed ? config.color : 'bg-gray-100 text-gray-400'
                } ${step.status === order.status ? 'animate-pulse' : ''}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                    {config.label}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {step.time && `${step.time} - `}{config.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Delivery Address */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 text-gray-700 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="font-semibold">Delivery Address</span>
          </div>
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
        </div>
      </div>
    </DialogContent>
  );
}

export default function Orders() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['/api/orders'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-200 animate-pulse h-6 rounded w-32"></div>
                  <div className="bg-gray-200 animate-pulse h-6 rounded w-24"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-200 animate-pulse h-4 rounded"></div>
                  <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-8xl mb-6">📦</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No orders yet</h1>
            <p className="text-xl text-gray-600 mb-8">You haven't placed any orders yet. Start shopping!</p>
            <Button
              onClick={() => window.location.href = '/products'}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
            >
              Start Shopping
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">{orders.length} order{orders.length > 1 ? 's' : ''} found</p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order: any, index: number) => {
              const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.confirmed;
              const IconComponent = config.icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${config.color}`}>
                            <IconComponent className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={config.color}>{config.label}</Badge>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            ₹{parseFloat(order.totalAmount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Estimated delivery: {order.estimatedDelivery || "10-15 minutes"}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-2">{order.deliveryAddress}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                Track Order
                              </Button>
                            </DialogTrigger>
                            <OrderTrackingModal order={order} />
                          </Dialog>

                          {order.status === "delivered" && (
                            <Button variant="outline" className="w-full">
                              Rate & Review
                            </Button>
                          )}

                          <Button variant="ghost" className="w-full text-orange-600 hover:text-orange-700">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar for Active Orders */}
                      {order.status !== "delivered" && (
                        <div className="mt-6">
                          <Separator className="mb-4" />
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Order Confirmed</span>
                            <span>Being Prepared</span>
                            <span>Out for Delivery</span>
                            <span>Delivered</span>
                          </div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: 
                                  order.status === "confirmed" ? "25%" :
                                  order.status === "preparing" ? "50%" :
                                  order.status === "out_for_delivery" ? "75%" :
                                  "100%"
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
