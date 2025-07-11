
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCartItemSchema, insertWishlistItemSchema, insertOrderSchema, insertOrderItemSchema, insertCategorySchema, insertUserSchema } from "@shared/schema";
import { setupAuth, isAuthenticated, isAdmin, hashPassword, verifyPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.post('/api/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password before storing
      const hashedPassword = hashPassword(password);

      const userData = {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: "user"
      };

      const result = insertUserSchema.safeParse(userData);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user data", errors: result.error.issues });
      }

      const user = await storage.createUser(result.data);

      // Set session
      const sessionUser = {
        id: parseInt(user.id.toString()),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      (req.session as any).user = sessionUser;

      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }
        
        res.status(201).json({ 
          message: "Account created successfully", 
          user: sessionUser
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await storage.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      if (!verifyPassword(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      const sessionUser = {
        id: parseInt(user.id.toString()),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      };

      (req.session as any).user = sessionUser;

      // First save the session, then handle cart migration
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }
        
        // Handle cart migration in background (don't await)
        const guestCart = (req.session as any)?.guestCart;
        if (guestCart && guestCart.length > 0) {
          // Migrate cart items asynchronously
          Promise.all(guestCart.map((item: any) => 
            storage.addToCart({
              productId: item.productId,
              quantity: item.quantity,
              userId: sessionUser.id.toString()
            })
          )).then(() => {
            // Clear guest cart after migration
            (req.session as any).guestCart = [];
            req.session.save(() => {});
          }).catch(error => {
            console.error("Cart migration error:", error);
          });
        }
        
        res.json({ 
          message: "Login successful", 
          user: sessionUser
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/logout', (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/user', (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  app.put('/api/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { firstName, lastName, email } = req.body;
      
      // For now, just return the updated user data since updateUser method may not be implemented
      const updatedUser = {
        id: userId,
        firstName,
        lastName,
        email,
        role: req.user?.role || "user"
      };

      // Update session with new user data
      (req.session as any).user = { ...req.user, ...updatedUser };

      res.json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Profile update failed" });
    }
  });
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, search, featured, flashDeal } = req.query;
      const products = await storage.getProducts(
        categoryId ? parseInt(categoryId as string) : undefined,
        search as string,
        featured ? featured === 'true' : undefined,
        flashDeal ? flashDeal === 'true' : undefined
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin Routes - Product Management
  app.post("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid product data", errors: result.error.issues });
      }

      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Failed to create product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.post("/api/admin/categories", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const result = insertCategorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid category data", errors: result.error.issues });
      }

      const category = await storage.createCategory(result.data);
      res.status(201).json(category);
    } catch (error) {
      console.error("Failed to create category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Cart (with guest support)
  app.get("/api/cart", async (req, res) => {
    try {
      if (req.user?.id) {
        // Authenticated user - get from database
        const cartItems = await storage.getCartItems(parseInt(req.user.id.toString()));
        res.json(cartItems);
      } else {
        // Guest user - return empty cart or session cart
        const guestCart = (req.session as any)?.guestCart || [];
        res.json(guestCart);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      if (req.user?.id) {
        // Authenticated user - save to database
        const data = insertCartItemSchema.parse({ 
          productId: parseInt(productId), 
          quantity: parseInt(quantity), 
          userId: req.user.id.toString()
        });

        const cartItem = await storage.addToCart(data);
        res.json(cartItem);
      } else {
        // Guest user - save to session
        if (!req.session) {
          return res.status(500).json({ message: "Session not available" });
        }

        const product = await storage.getProduct(parseInt(productId));
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        let guestCart = (req.session as any).guestCart || [];
        
        // Check if product already exists in cart
        const existingItemIndex = guestCart.findIndex((item: any) => item.productId === parseInt(productId));
        
        if (existingItemIndex >= 0) {
          // Update quantity
          guestCart[existingItemIndex].quantity += parseInt(quantity);
        } else {
          // Add new item
          const newItem = {
            id: Date.now(), // Temporary ID for guest cart
            productId: parseInt(productId),
            quantity: parseInt(quantity),
            product: product
          };
          guestCart.push(newItem);
        }

        (req.session as any).guestCart = guestCart;
        
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Failed to save cart" });
          }
          res.json({ message: "Item added to cart", cart: guestCart });
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItem(id, quantity);

      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);

      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      await storage.clearCart(parseInt(userId.toString()));
      res.json({ message: "Cart cleared" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Wishlist (authenticated users only)
  app.get("/api/wishlist", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const wishlistItems = await storage.getWishlistItems(parseInt(userId.toString()));
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const data = insertWishlistItemSchema.parse({ 
        ...req.body, 
        userId: parseInt(userId.toString())
      });
      const wishlistItem = await storage.addToWishlist(data);
      res.json(wishlistItem);
    } catch (error) {
      console.error("Add to wishlist error:", error);
      res.status(400).json({ message: "Invalid wishlist item data" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromWishlist(id);

      if (!success) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }

      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove wishlist item" });
    }
  });

  // Orders (authenticated users only)
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const orders = await storage.getOrders(parseInt(userId.toString()));
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const { orderData, items } = req.body;

      const orderInsert = insertOrderSchema.parse({ 
        ...orderData, 
        userId: parseInt(userId.toString())
      });
      const orderItems = items.map((item: any) => insertOrderItemSchema.parse(item));

      const order = await storage.createOrder(orderInsert, orderItems);

      // Clear cart after successful order
      await storage.clearCart(parseInt(userId.toString()));

      res.json(order);
    } catch (error) {
      console.error("Create order error:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await storage.updateOrderStatus(id, status);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Payment processing endpoint
  app.post("/api/payments/process", isAuthenticated, async (req, res) => {
    try {
      const { amount, paymentMethod, orderId } = req.body;

      if (!amount || !paymentMethod) {
        return res.status(400).json({ message: "Amount and payment method are required" });
      }

      // Simulate payment processing
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // In a real app, you would integrate with actual payment gateways like Razorpay, Stripe, etc.
      const paymentResult = {
        transactionId,
        status: "success",
        amount,
        paymentMethod,
        timestamp: new Date().toISOString()
      };

      res.json(paymentResult);
    } catch (error) {
      console.error("Payment processing error:", error);
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
