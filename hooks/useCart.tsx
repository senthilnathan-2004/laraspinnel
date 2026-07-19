"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  /** Optional customer-written customization note (e.g. "Add name 'Priya', pink ribbon"). */
  customText?: string;
}

// Same product with a different customization note is treated as a distinct cart line.
const lineKey = (productId: string, customText?: string) => `${productId}::${(customText || "").trim()}`;

interface CartContextType {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, customText?: string) => void;
  updateQuantity: (productId: string, quantity: number, customText?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lp_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart from localStorage", err);
      }
    }
    setIsHydrated(true);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("lp_cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prev) => {
      const key = lineKey(item.productId, item.customText);
      const existing = prev.find((i) => lineKey(i.productId, i.customText) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i.productId, i.customText) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeItem = (productId: string, customText?: string) => {
    const key = lineKey(productId, customText);
    setCart((prev) => prev.filter((i) => lineKey(i.productId, i.customText) !== key));
  };

  const updateQuantity = (productId: string, quantity: number, customText?: string) => {
    if (quantity <= 0) {
      removeItem(productId, customText);
      return;
    }
    const key = lineKey(productId, customText);
    setCart((prev) =>
      prev.map((i) => (lineKey(i.productId, i.customText) === key ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
