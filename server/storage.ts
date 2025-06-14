import { 
  users, categories, products, cartItems, wishlistItems, orders, orderItems,
  type User, type UpsertUser, type Category, type InsertCategory, 
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";
import { MongoStorage } from "./mongodb-storage";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product methods
  getProducts(categoryId?: number, search?: string, featured?: boolean, flashDeal?: boolean): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart methods
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Wishlist methods
  getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<boolean>;

  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private wishlistItems: Map<number, WishlistItem> = new Map();
  private orders: Map<number, Order> = new Map();
  private orderItems: Map<number, OrderItem> = new Map();
  
  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentProductId = 1;
  private currentCartItemId = 1;
  private currentWishlistItemId = 1;
  private currentOrderId = 1;
  private currentOrderItemId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoriesData = [
      { name: "Electronics", icon: "fas fa-mobile-alt", color: "red", description: "Latest gadgets and electronics" },
      { name: "Fashion", icon: "fas fa-tshirt", color: "blue", description: "Trendy fashion and apparel" },
      { name: "Home", icon: "fas fa-home", color: "green", description: "Home and living essentials" },
      { name: "Sports", icon: "fas fa-dumbbell", color: "yellow", description: "Sports and fitness equipment" },
      { name: "Books", icon: "fas fa-book", color: "purple", description: "Books and educational materials" },
      { name: "Grocery", icon: "fas fa-apple-alt", color: "pink", description: "Fresh groceries and food items" },
    ];

    categoriesData.forEach(cat => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Seed products
    const productsData = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: "2999",
        originalPrice: "7499",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 1,
        rating: "4.5",
        reviewCount: 2845,
        featured: true,
        flashDeal: true,
        discountPercentage: 60,
        tags: ["wireless", "premium", "noise-cancellation"],
        deliveryTime: "Express"
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracker with health monitoring and smart features.",
        price: "8999",
        originalPrice: "16499",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 1,
        rating: "4.2",
        reviewCount: 1234,
        featured: true,
        flashDeal: true,
        discountPercentage: 45,
        tags: ["fitness", "smart", "health"],
        deliveryTime: "Express"
      },
      {
        name: "MacBook Pro 16\"",
        description: "M2 Chip, 16GB RAM, 512GB SSD - Professional laptop for creators and developers.",
        price: "245999",
        originalPrice: "245999",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 1,
        rating: "5.0",
        reviewCount: 1245,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["laptop", "apple", "professional"],
        deliveryTime: "Free Shipping"
      },
      {
        name: "Classic White Sneakers",
        description: "Premium leather sneakers for casual wear. Available in all sizes.",
        price: "4999",
        originalPrice: "4999",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 2,
        rating: "4.1",
        reviewCount: 892,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["sneakers", "leather", "casual"],
        deliveryTime: "Express Delivery"
      },
      {
        name: "Canon DSLR Camera",
        description: "24MP professional camera with 4K video recording and advanced features.",
        price: "65999",
        originalPrice: "65999",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 1,
        rating: "4.7",
        reviewCount: 456,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["camera", "professional", "4k"],
        deliveryTime: "Free Shipping"
      },
      {
        name: "Premium Coffee Beans",
        description: "Arabica coffee beans, single origin, 1kg pack for perfect home brewing.",
        price: "1299",
        originalPrice: "1299",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 6,
        rating: "5.0",
        reviewCount: 2134,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["coffee", "organic", "arabica"],
        deliveryTime: "Same Day"
      },
      {
        name: "Pro Camera Lens 50mm",
        description: "Professional 50mm lens for portrait and professional photography.",
        price: "15999",
        originalPrice: "52999",
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 1,
        rating: "5.0",
        reviewCount: 892,
        featured: false,
        flashDeal: true,
        discountPercentage: 70,
        tags: ["lens", "professional", "portrait"],
        deliveryTime: "Express"
      },
      {
        name: "RGB Gaming Keyboard",
        description: "Mechanical gaming keyboard with RGB backlighting and premium switches.",
        price: "4499",
        originalPrice: "9999",
        image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: 1,
        rating: "4.3",
        reviewCount: 3567,
        featured: false,
        flashDeal: true,
        discountPercentage: 55,
        tags: ["gaming", "rgb", "mechanical"],
        deliveryTime: "Express"
      }
    ];

    productsData.forEach(prod => {
      const product: Product = { 
        ...prod, 
        id: this.currentProductId++,
        inStock: true,
        images: prod.images || []
      };
      this.products.set(product.id, product);
    });

    // Create a demo user
    const demoUser: User = {
      id: this.currentUserId++,
      username: "demo",
      email: "demo@medallionmart.com",
      password: "demo123",
      firstName: "John",
      lastName: "Doe",
      phone: "+91 9876543210",
      address: "123 Demo Street",
      city: "Mumbai",
      pincode: "400001"
    };
    this.users.set(demoUser.id, demoUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.currentUserId++ };
    this.users.set(user.id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = { ...insertCategory, id: this.currentCategoryId++ };
    this.categories.set(category.id, category);
    return category;
  }

  // Product methods
  async getProducts(categoryId?: number, search?: string, featured?: boolean, flashDeal?: boolean): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    if (featured !== undefined) {
      products = products.filter(p => p.featured === featured);
    }

    if (flashDeal !== undefined) {
      products = products.filter(p => p.flashDeal === flashDeal);
    }

    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = { 
      ...insertProduct, 
      id: this.currentProductId++,
      rating: insertProduct.rating || "0",
      reviewCount: insertProduct.reviewCount || 0,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured || false,
      flashDeal: insertProduct.flashDeal || false,
      discountPercentage: insertProduct.discountPercentage || 0,
      deliveryTime: insertProduct.deliveryTime || "Standard"
    };
    this.products.set(product.id, product);
    return product;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return { ...item, product };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === insertItem.userId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity = (existingItem.quantity || 1) + (insertItem.quantity || 1);
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const item: CartItem = { ...insertItem, id: this.currentCartItemId++ };
    this.cartItems.set(item.id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const items = Array.from(this.cartItems.entries()).filter(([, item]) => item.userId === userId);
    items.forEach(([id]) => this.cartItems.delete(id));
    return true;
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]> {
    const items = Array.from(this.wishlistItems.values()).filter(item => item.userId === userId);
    return items.map(item => {
      const product = this.products.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return { ...item, product };
    });
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists
    const existingItem = Array.from(this.wishlistItems.values()).find(
      item => item.userId === insertItem.userId && item.productId === insertItem.productId
    );

    if (existingItem) {
      return existingItem;
    }

    const item: WishlistItem = { ...insertItem, id: this.currentWishlistItemId++ };
    this.wishlistItems.set(item.id, item);
    return item;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const order: Order = { 
      ...insertOrder, 
      id: this.currentOrderId++,
      createdAt: new Date()
    };
    this.orders.set(order.id, order);

    // Add order items
    items.forEach(insertItem => {
      const orderItem: OrderItem = { ...insertItem, id: this.currentOrderItemId++, orderId: order.id };
      this.orderItems.set(orderItem.id, orderItem);
    });

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    order.status = status;
    this.orders.set(id, order);
    return order;
  }
}

// Use memory storage for traditional authentication
const memStorage = new MemStorage();

export const storage = memStorage;
