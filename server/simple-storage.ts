import { User, Category, Product, CartItem, WishlistItem, Order, OrderItem, InsertUser, InsertCategory, InsertProduct, InsertCartItem, InsertWishlistItem, InsertOrder, InsertOrderItem } from "@shared/schema";

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

export class SimpleStorage implements IStorage {
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
    // Create admin user
    const adminUser: User = {
      id: "1",
      email: "admin@medallionmart.com",
      firstName: "Admin",
      lastName: "User",
      profileImageUrl: null,
      password: "admin123",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(1, adminUser);

    // Create categories
    const categories = [
      { name: "Electronics", description: "Latest gadgets and devices", icon: "Smartphone", color: "#3B82F6" },
      { name: "Fashion", description: "Trendy clothing and accessories", icon: "Shirt", color: "#EF4444" },
      { name: "Home & Garden", description: "Everything for your home", icon: "Home", color: "#10B981" },
      { name: "Sports & Fitness", description: "Gear for active lifestyle", icon: "Dumbbell", color: "#F59E0B" },
    ];

    categories.forEach(cat => {
      const category: Category = { 
        ...cat, 
        id: this.currentCategoryId++,
        description: cat.description || null
      };
      this.categories.set(category.id, category);
    });

    // Create products
    const products = [
      {
        name: "Wireless Headphones",
        description: "High-quality noise-canceling wireless headphones with 30-hour battery life",
        price: "149.99",
        originalPrice: "199.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        categoryId: 1,
        featured: true,
        flashDeal: true,
        discountPercentage: 25,
        inStock: true,
        tags: ["wireless", "headphones", "audio"],
        rating: "4.5",
        reviewCount: 1250,
        deliveryTime: "Same Day"
      },
      {
        name: "Smart Watch",
        description: "Fitness tracking smartwatch with heart rate monitor and GPS",
        price: "299.99",
        originalPrice: "399.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        categoryId: 1,
        featured: true,
        flashDeal: false,
        discountPercentage: 25,
        inStock: true,
        tags: ["smartwatch", "fitness", "wearable"],
        rating: "4.3",
        reviewCount: 867,
        deliveryTime: "Express"
      }
    ];

    products.forEach(prod => {
      const product: Product = { 
        ...prod, 
        id: this.currentProductId++,
        images: null,
        originalPrice: prod.originalPrice || null,
        rating: prod.rating || null,
        reviewCount: prod.reviewCount || null,
        deliveryTime: prod.deliveryTime || null
      };
      this.products.set(product.id, product);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      ...insertUser, 
      id: this.currentUserId++.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(parseInt(user.id), user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = { 
      ...insertCategory, 
      id: this.currentCategoryId++,
      description: insertCategory.description || null
    };
    this.categories.set(category.id, category);
    return category;
  }

  async getProducts(categoryId?: number, search?: string, featured?: boolean, flashDeal?: boolean): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }
    
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
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
      images: insertProduct.images || null,
      originalPrice: insertProduct.originalPrice || null,
      rating: insertProduct.rating || null,
      reviewCount: insertProduct.reviewCount || null,
      deliveryTime: insertProduct.deliveryTime || null
    };
    this.products.set(product.id, product);
    return product;
  }

  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = Array.from(this.cartItems.values())
      .filter(item => parseInt(item.userId) === userId);
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      return { ...item, product: product! };
    }).filter(item => item.product);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const item: CartItem = { 
      ...insertItem, 
      id: this.currentCartItemId++,
      quantity: insertItem.quantity || 1
    };
    this.cartItems.set(item.id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
    }
    return item;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    let removed = false;
    for (const [id, item] of this.cartItems.entries()) {
      if (parseInt(item.userId) === userId) {
        this.cartItems.delete(id);
        removed = true;
      }
    }
    return removed;
  }

  async getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]> {
    const items = Array.from(this.wishlistItems.values())
      .filter(item => parseInt(item.userId) === userId);
    
    return items.map(item => {
      const product = this.products.get(item.productId);
      return { ...item, product: product! };
    }).filter(item => item.product);
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const item: WishlistItem = { 
      ...insertItem, 
      id: this.currentWishlistItemId++
    };
    this.wishlistItems.set(item.id, item);
    return item;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    return this.wishlistItems.delete(id);
  }

  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => parseInt(order.userId) === userId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const order: Order = { 
      ...insertOrder, 
      id: this.currentOrderId++,
      createdAt: new Date(),
      status: insertOrder.status || "pending",
      estimatedDelivery: insertOrder.estimatedDelivery || null
    };
    this.orders.set(order.id, order);

    // Create order items
    items.forEach(insertItem => {
      const orderItem: OrderItem = { 
        ...insertItem, 
        id: this.currentOrderItemId++, 
        orderId: order.id 
      };
      this.orderItems.set(orderItem.id, orderItem);
    });

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      this.orders.set(id, order);
    }
    return order;
  }
}

export const storage = new SimpleStorage();