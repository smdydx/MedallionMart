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
      { name: "Beauty", icon: "fas fa-spa", color: "orange", description: "Beauty and personal care products" },
      { name: "Automotive", icon: "fas fa-car", color: "indigo", description: "Car accessories and automotive parts" },
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
      },
      {
        name: "Designer Handbag",
        description: "Luxury designer handbag made from premium leather with elegant design.",
        price: "12999",
        originalPrice: "19999",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[1],
        rating: "4.8",
        reviewCount: 567,
        featured: true,
        flashDeal: false,
        discountPercentage: 35,
        tags: ["handbag", "luxury", "leather"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable wireless speaker with 360-degree sound and waterproof design.",
        price: "3499",
        originalPrice: "5999",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "4.4",
        reviewCount: 1823,
        featured: false,
        flashDeal: true,
        discountPercentage: 42,
        tags: ["speaker", "bluetooth", "portable"],
        deliveryTime: "Same Day",
        inStock: true
      },
      {
        name: "Decorative Table Lamp",
        description: "Modern LED table lamp with adjustable brightness and USB charging port.",
        price: "2799",
        originalPrice: "2799",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[2],
        rating: "4.6",
        reviewCount: 445,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["lamp", "led", "modern"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "Yoga Mat Set",
        description: "Premium non-slip yoga mat with carrying strap and exercise guide.",
        price: "1899",
        originalPrice: "3499",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[3],
        rating: "4.7",
        reviewCount: 1234,
        featured: false,
        flashDeal: true,
        discountPercentage: 46,
        tags: ["yoga", "fitness", "exercise"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "Programming Books Bundle",
        description: "Complete set of 5 programming books covering JavaScript, Python, and React.",
        price: "2999",
        originalPrice: "5999",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[4],
        rating: "4.9",
        reviewCount: 789,
        featured: true,
        flashDeal: true,
        discountPercentage: 50,
        tags: ["books", "programming", "education"],
        deliveryTime: "Free Shipping",
        inStock: true
      },
      {
        name: "Organic Honey Pack",
        description: "Pure organic honey, 500g jar sourced directly from local beekeepers.",
        price: "899",
        originalPrice: "899",
        image: "https://images.unsplash.com/photo-1587049016823-c90bb65e9dd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1587049016823-c90bb65e9dd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[5],
        rating: "5.0",
        reviewCount: 456,
        featured: true,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["honey", "organic", "natural"],
        deliveryTime: "Same Day",
        inStock: true
      },
      {
        name: "Gaming Mouse",
        description: "High-precision gaming mouse with customizable RGB lighting and 7 buttons.",
        price: "2799",
        originalPrice: "4999",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[0],
        rating: "4.5",
        reviewCount: 2345,
        featured: false,
        flashDeal: true,
        discountPercentage: 44,
        tags: ["mouse", "gaming", "rgb"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "Cotton T-Shirt",
        description: "100% organic cotton t-shirt in various colors. Comfortable and breathable.",
        price: "999",
        originalPrice: "1999",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[1],
        rating: "4.2",
        reviewCount: 1567,
        featured: false,
        flashDeal: true,
        discountPercentage: 50,
        tags: ["tshirt", "cotton", "casual"],
        deliveryTime: "Express",
        inStock: true
      },
      {
        name: "Wall Clock",
        description: "Elegant wooden wall clock with silent movement. Perfect for home decoration.",
        price: "1599",
        originalPrice: "1599",
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[2],
        rating: "4.3",
        reviewCount: 234,
        featured: false,
        flashDeal: false,
        discountPercentage: 0,
        tags: ["clock", "wooden", "decoration"],
        deliveryTime: "Standard",
        inStock: true
      },
      {
        name: "Resistance Bands Set",
        description: "Professional resistance bands set with 5 different resistance levels and door anchor.",
        price: "1299",
        originalPrice: "2499",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        categoryId: categoryIds[3],
        rating: "4.6",
        reviewCount: 987,
        featured: true,
        flashDeal: true,
        discountPercentage: 48,
        tags: ["resistance", "bands", "fitness"],
        deliveryTime: "Express",
        inStock: true
      },
      {
            name: "Smart Watch",
            description: "Advanced smartwatch with health monitoring",
            price: "8999",
            originalPrice: "12999",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
            categoryId: categoryIds[0],
            featured: true,
            flashDeal: true,
            discountPercentage: 30,
            tags: ["smart", "health", "fitness"],
            deliveryTime: "Same Day",
            inStock: true,
            rating: "4.7",
            reviewCount: 256
          },
          {
            name: "Gaming Mouse",
            description: "High-precision gaming mouse with RGB lighting",
            price: "1999",
            originalPrice: "2999",
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
            categoryId: categoryIds[0],
            featured: false,
            flashDeal: true,
            discountPercentage: 33,
            tags: ["gaming", "rgb", "precision"],
            deliveryTime: "Express",
            inStock: true,
            rating: "4.4",
            reviewCount: 167
          },
          {
            name: "Cotton T-Shirt",
            description: "Premium cotton t-shirt for everyday wear",
            price: "799",
            originalPrice: "1299",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
            categoryId: categoryIds[1],
            featured: false,
            flashDeal: false,
            discountPercentage: 0,
            tags: ["cotton", "casual", "comfort"],
            deliveryTime: "Standard",
            inStock: true,
            rating: "4.3",
            reviewCount: 92
          },
          {
            name: "Running Shoes",
            description: "Lightweight running shoes for athletes",
            price: "3499",
            originalPrice: "4999",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
            categoryId: categoryIds[3],
            featured: true,
            flashDeal: false,
            discountPercentage: 30,
            tags: ["running", "sports", "lightweight"],
            deliveryTime: "Express",
            inStock: true,
            rating: "4.6",
            reviewCount: 203
          },
          {
            name: "Coffee Maker",
            description: "Automatic coffee maker with multiple brewing options",
            price: "5999",
            originalPrice: "8999",
            image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
            categoryId: categoryIds[2],
            featured: false,
            flashDeal: true,
            discountPercentage: 33,
            tags: ["coffee", "automatic", "kitchen"],
            deliveryTime: "Standard",
            inStock: true,
            rating: "4.5",
            reviewCount: 156
          },
          {
            name: "LED Desk Lamp",
            description: "Adjustable LED desk lamp with touch control",
            price: "1499",
            originalPrice: "2299",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
            categoryId: categoryIds[2],
            featured: false,
            flashDeal: false,
            discountPercentage: 0,
            tags: ["led", "adjustable", "office"],
            deliveryTime: "Express",
            inStock: true,
            rating: "4.2",
            reviewCount: 78
          }
    ];

    await this.db.collection('products').insertMany(productsData);

    // Create demo users
    const demoUsers = [
      {
        username: "demo",
        email: "demo@medallionmart.com",
        password: "demo123",
        firstName: "John",
        lastName: "Doe",
        phone: "+91 9876543210",
        address: "123 Demo Street",
        city: "Mumbai",
        pincode: "400001",
        role: "user"
      },
      {
        username: "admin",
        email: "admin@medallionmart.com",
        password: "admin123",
        firstName: "Admin",
        lastName: "User",
        phone: "+91 9876543211",
        address: "Admin Office",
        city: "Mumbai",
        pincode: "400001",
        role: "admin"
      }
    ];

    await this.db.collection('users').insertMany(demoUsers);
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
    return user ? { ...user, id: user._id.toString() } as any : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.collection('users').insertOne(insertUser);
    return { ...insertUser, id: result.insertedId.toString() } as any;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const categories = await this.db.collection('categories').find({}).toArray();
    return categories.map(cat => ({ ...cat, id: cat._id.toString() })) as any;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await this.db.collection('categories').insertOne(insertCategory);
    return { ...insertCategory, id: result.insertedId.toString() } as any;
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
      status: insertOrder.status || "confirmed",
      paymentMethod: insertOrder.paymentMethod || "cash",
      transactionId: insertOrder.transactionId || null,
      trackingId: `TRK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
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