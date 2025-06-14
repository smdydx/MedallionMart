import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  };
}

interface StoreState {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  setCartItems: (items: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  setWishlistItems: (items: WishlistItem[]) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (productId: number) => boolean;

  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cartItems: [],
      cartCount: 0,
      setCartItems: (items) => set({ 
        cartItems: items, 
        cartCount: items.reduce((sum, item) => sum + (item.quantity || 1), 0) 
      }),
      addToCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(ci => ci.productId === item.productId);
        
        let newItems;
        if (existingItem) {
          newItems = cartItems.map(ci => 
            ci.productId === item.productId 
              ? { ...ci, quantity: (ci.quantity || 1) + (item.quantity || 1) }
              : ci
          );
        } else {
          newItems = [...cartItems, item];
        }
        
        set({ 
          cartItems: newItems,
          cartCount: newItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
        });
      },
      removeFromCart: (id) => {
        const { cartItems } = get();
        const newItems = cartItems.filter(item => item.id !== id);
        set({ 
          cartItems: newItems,
          cartCount: newItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
        });
      },
      updateCartQuantity: (id, quantity) => {
        const { cartItems } = get();
        const newItems = cartItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        set({ 
          cartItems: newItems,
          cartCount: newItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
        });
      },
      clearCart: () => set({ cartItems: [], cartCount: 0 }),

      // Wishlist
      wishlistItems: [],
      wishlistCount: 0,
      setWishlistItems: (items) => set({ 
        wishlistItems: items, 
        wishlistCount: items.length 
      }),
      addToWishlist: (item) => {
        const { wishlistItems } = get();
        const newItems = [...wishlistItems, item];
        set({ 
          wishlistItems: newItems,
          wishlistCount: newItems.length
        });
      },
      removeFromWishlist: (id) => {
        const { wishlistItems } = get();
        const newItems = wishlistItems.filter(item => item.id !== id);
        set({ 
          wishlistItems: newItems,
          wishlistCount: newItems.length
        });
      },
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some(item => item.productId === productId);
      },

      // UI State
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
    }),
    {
      name: 'medallion-mart-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
      }),
    }
  )
);
