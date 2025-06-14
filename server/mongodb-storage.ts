import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { 
  users, categories, products, cartItems, wishlistItems, orders, orderItems,
  type User, type InsertUser, type Category, type InsertCategory, 
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { IStorage } from "./storage";

export class MongoStorage implements IStorage {
  private client: MongoClient;
  private db!: Db;
  private isConnected: boolean = false;

  constructor(connectionString: string) {
    this.client = new MongoClient(connectionString);
  }

  async connect() {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.db = this.client.db('medallion_mart');
        this.isConnected = true;
        console.log('MongoDB connected successfully');
        await this.seedData();
      } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
      }
    }
  }

  private async seedData() {
    // Check if data already exists
    const categoriesCount = await this.db.collection('categories').countDocuments();
    if (categoriesCount > 0) return;

    // Seed categories
    const categoriesData = [
      { name: "Electronics", icon: "fas fa-mobile-alt", color: "red", description: "Latest gadgets and electronics" },
      { name: "Fashion", icon: "fas fa-tshirt", color: "blue", description: "Trendy fashion and apparel" },
      { name: "Home", icon: "fas fa-home", color: "green", description: "Home and living essentials" },
      { name: "Sports", icon: "fas fa-dumbbell", color: "yellow", description: "Sports and fitness equipment" },
      { name: "Books", icon: "fas fa-book", color: "purple", description: "Books and educational materials" },
      { name: "Grocery", icon: "fas fa-apple-alt", color: "pink", description: "Fresh groceries and food items" },
    ];

    const insertedCategories = await this.db.collection('categories').insertMany(categoriesData);
    const categoryIds = Object.values(insertedCategories.insertedIds);

    // Seed products
    const productsData = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: "2999",
        originalPrice: "7499",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "4.5",
        reviewCount: 2845,
        featured: true,
        flashDeal: true,
        discountPercentage: 60,
        tags: ["wireless", "premium", "noise-cancellation"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracker with health monitoring and smart features.",
        price: "8999",
        originalPrice: "16499",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "4.2",
        reviewCount: 1234,
        featured: true,
        flashDeal: true,
        discountPercentage: 45,
        tags: ["fitness", "smart", "health"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "MacBook Pro 16\"",
        description: "M2 Chip, 16GB RAM, 512GB SSD - Professional laptop for creators and developers.",
        price: "245999",
        originalPrice: "245999",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "5.0",
        reviewCount: 1245,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["laptop", "apple", "professional"],
        deliveryTime: "Free Shipping",
        inStock: true
      },
      {
        name: "Classic White Sneakers",
        description: "Premium leather sneakers for casual wear. Available in all sizes.",
        price: "4999",
        originalPrice: "4999",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[1],
        rating: "4.1",
        reviewCount: 892,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["sneakers", "leather", "casual"],
        deliveryTime: "Express Delivery",
        inStock: true
      },
      {
        name: "Canon DSLR Camera",
        description: "24MP professional camera with 4K video recording and advanced features.",
        price: "65999",
        originalPrice: "65999",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "4.7",
        reviewCount: 456,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["camera", "professional", "4k"],
        deliveryTime: "Free Shipping",
        inStock: true
      },
      {
        name: "Premium Coffee Beans",
        description: "Arabica coffee beans, single origin, 1kg pack for perfect home brewing.",
        price: "1299",
        originalPrice: "1299",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[5],
        rating: "5.0",
        reviewCount: 2134,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["coffee", "organic", "arabica"],
        deliveryTime: "Same Day",
        inStock: true
      },
      {
        name: "Pro Camera Lens 50mm",
        description: "Professional 50mm lens for portrait and professional photography.",
        price: "15999",
        originalPrice: "52999",
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "5.0",
        reviewCount: 892,
        featured: false,
        flashDeal: true,
        discountPercentage: 70,
        tags: ["lens", "professional", "portrait"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "RGB Gaming Keyboard",
        description: "Mechanical gaming keyboard with RGB backlighting and premium switches.",
        price: "4499",
        originalPrice: "9999",
        image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "4.3",
        reviewCount: 3567,
        featured: false,
        flashDeal: true,
        discountPercentage: 55,
        tags: ["gaming", "rgb", "mechanical"],
        deliveryTime: "Express",
        inStock: true
      }
    ];

    await this.db.collection('products').insertMany(productsData);

    // Create a demo user
    const demoUser = {
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

    await this.db.collection('users').insertOne(demoUser);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const user = await this.db.collection('users').findOne({ _id: new ObjectId(id.toString()) });
      return user ? { ...user, id: parseInt(user._id.toString().slice(-8), 16) } as any : undefined;
    } catch {
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await this.db.collection('users').findOne({ email });
    return user ? { ...user, id: parseInt(user._id.toString().slice(-8), 16) } as any : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.collection('users').insertOne(insertUser);
    return { ...insertUser, id: parseInt(result.insertedId.toString().slice(-8), 16) } as any;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const categories = await this.db.collection('categories').find({}).toArray();
    return categories.map(cat => ({ ...cat, id: parseInt(cat._id.toString().slice(-8), 16) })) as any;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await this.db.collection('categories').insertOne(insertCategory);
    return { ...insertCategory, id: parseInt(result.insertedId.toString().slice(-8), 16) } as any;
  }

  // Product methods
  async getProducts(categoryId?: number, search?: string, featured?: boolean, flashDeal?: boolean): Promise<Product[]> {
    const filter: any = {};

    if (categoryId) {
      filter.categoryId = new ObjectId(categoryId.toString());
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (flashDeal !== undefined) {
      filter.flashDeal = flashDeal;
    }

    const products = await this.db.collection('products').find(filter).toArray();
    return products.map(product => ({ ...product, id: product._id.toString() })) as any;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const product = await this.db.collection('products').findOne({ _id: new ObjectId(id.toString()) });
    return product ? { ...product, id: product._id.toString() } as any : undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await this.db.collection('products').insertOne({
      ...insertProduct,
      rating: insertProduct.rating || "0",
      reviewCount: insertProduct.reviewCount || 0,
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured || false,
      flashDeal: insertProduct.flashDeal || false,
      discountPercentage: insertProduct.discountPercentage || 0,
      deliveryTime: insertProduct.deliveryTime || "Standard"
    });
    return { ...insertProduct, id: result.insertedId.toString() } as any;
  }

  // Cart methods
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const cartItems = await this.db.collection('cart_items').find({ userId }).toArray();
    const result = [];
    
    for (const item of cartItems) {
      const product = await this.getProduct(item.productId);
      if (product) {
        result.push({ ...item, id: item._id.toString(), product });
      }
    }
    
    return result as any;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = await this.db.collection('cart_items').findOne({
      userId: insertItem.userId,
      productId: insertItem.productId
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = (existingItem.quantity || 1) + (insertItem.quantity || 1);
      await this.db.collection('cart_items').updateOne(
        { _id: existingItem._id },
        { $set: { quantity: newQuantity } }
      );
      return { ...existingItem, quantity: newQuantity, id: existingItem._id.toString() } as any;
    }

    const result = await this.db.collection('cart_items').insertOne(insertItem);
    return { ...insertItem, id: result.insertedId.toString() } as any;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const result = await this.db.collection('cart_items').findOneAndUpdate(
      { _id: new ObjectId(id.toString()) },
      { $set: { quantity } },
      { returnDocument: 'after' }
    );
    return result ? { ...result, id: result._id.toString() } as any : undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await this.db.collection('cart_items').deleteOne({ _id: new ObjectId(id.toString()) });
    return result.deletedCount > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await this.db.collection('cart_items').deleteMany({ userId });
    return result.deletedCount > 0;
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]> {
    const wishlistItems = await this.db.collection('wishlist_items').find({ userId }).toArray();
    const result = [];
    
    for (const item of wishlistItems) {
      const product = await this.getProduct(item.productId);
      if (product) {
        result.push({ ...item, id: item._id.toString(), product });
      }
    }
    
    return result as any;
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists
    const existingItem = await this.db.collection('wishlist_items').findOne({
      userId: insertItem.userId,
      productId: insertItem.productId
    });

    if (existingItem) {
      return { ...existingItem, id: existingItem._id.toString() } as any;
    }

    const result = await this.db.collection('wishlist_items').insertOne(insertItem);
    return { ...insertItem, id: result.insertedId.toString() } as any;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    const result = await this.db.collection('wishlist_items').deleteOne({ _id: new ObjectId(id.toString()) });
    return result.deletedCount > 0;
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    const orders = await this.db.collection('orders').find({ userId }).toArray();
    return orders.map(order => ({ ...order, id: order._id.toString() })) as any;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const order = await this.db.collection('orders').findOne({ _id: new ObjectId(id.toString()) });
    return order ? { ...order, id: order._id.toString() } as any : undefined;
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderData = {
      ...insertOrder,
      createdAt: new Date(),
      status: insertOrder.status || "confirmed"
    };

    const orderResult = await this.db.collection('orders').insertOne(orderData);
    const orderId = orderResult.insertedId;

    // Add order items
    const orderItems = items.map(item => ({ ...item, orderId: orderId.toString() }));
    await this.db.collection('order_items').insertMany(orderItems);

    return { ...orderData, id: orderId.toString() } as any;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await this.db.collection('orders').findOneAndUpdate(
      { _id: new ObjectId(id.toString()) },
      { $set: { status } },
      { returnDocument: 'after' }
    );
    return result ? { ...result, id: result._id.toString() } as any : undefined;
  }
}