import { 
  users, categories, products, cartItems, wishlistItems, orders, orderItems,
  type User, type UpsertUser, type Category, type InsertCategory, 
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Order, type InsertOrder,
  type OrderItem, type InsertOrderItem
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  // Product methods
  async getProducts(categoryId?: number, search?: string, featured?: boolean, flashDeal?: boolean): Promise<Product[]> {
    let query = db.select().from(products);
    
    // Apply filters (we'll implement these later)
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  // Cart methods
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const items = await db
      .select({
        id: cartItems.id,
        userId: cartItems.userId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        product: products
      })
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));
    
    return items.filter(item => item.product) as (CartItem & { product: Product })[];
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const [item] = await db
      .insert(cartItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.rowCount > 0;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return result.rowCount > 0;
  }

  // Wishlist methods
  async getWishlistItems(userId: string): Promise<(WishlistItem & { product: Product })[]> {
    const items = await db
      .select({
        id: wishlistItems.id,
        userId: wishlistItems.userId,
        productId: wishlistItems.productId,
        product: products
      })
      .from(wishlistItems)
      .leftJoin(products, eq(wishlistItems.productId, products.id))
      .where(eq(wishlistItems.userId, userId));
    
    return items.filter(item => item.product) as (WishlistItem & { product: Product })[];
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const [item] = await db
      .insert(wishlistItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    const result = await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
    return result.rowCount > 0;
  }

  // Order methods
  async getOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();

    // Add order items
    if (items.length > 0) {
      await db.insert(orderItems).values(
        items.map(item => ({ ...item, orderId: order.id }))
      );
    }

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }
}