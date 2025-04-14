
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId?: string;
  sellerName?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

export const useCart = () => useContext(CartContext);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  // Initialize cart from localStorage or empty array
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Calculate derived values
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        toast.success(`Added another ${item.name} to your cart`);
        return updatedCart;
      } else {
        // Add new item with quantity 1
        toast.success(`${item.name} added to your cart`);
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id: string | number) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === id);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} removed from your cart`);
      }
      return prevCart.filter(item => item.id !== id);
    });
  };

  // Update item quantity
  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
