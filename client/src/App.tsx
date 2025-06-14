import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Orders from "@/pages/orders";
import AdminDashboard from "@/pages/admin";
import Landing from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile";

import Header from "@/components/header";
import FloatingCart from "@/components/floating-cart";

function DataProvider({ children }: { children: React.ReactNode }) {
  const { setCartItems, setWishlistItems } = useStore();

  // Load cart data
  const { data: cartItems } = useQuery({
    queryKey: ['/api/cart'],
    refetchInterval: false,
  });

  // Load wishlist data
  const { data: wishlistItems } = useQuery({
    queryKey: ['/api/wishlist'],
    refetchInterval: false,
  });

  useEffect(() => {
    if (cartItems) {
      setCartItems(cartItems);
    }
  }, [cartItems, setCartItems]);

  useEffect(() => {
    if (wishlistItems) {
      setWishlistItems(wishlistItems);
    }
  }, [wishlistItems, setWishlistItems]);

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={Landing} />
        <Route component={() => <Landing />} />
      </Switch>
    );
  }

  return <AuthenticatedApp />;
}

function AuthenticatedApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" component={Orders} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <FloatingCart />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <Toaster />
          <Router />
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
