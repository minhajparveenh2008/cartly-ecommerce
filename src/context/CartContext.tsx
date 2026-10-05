import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../services/api";

export interface CartItemType {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => { success: boolean; message?: string };
  decreaseQuantity: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  subtotal: number;
  total: number;
  totalItems: number;
  notification: string | null;
  dismissNotification: () => void;
}

const CART_STORAGE_KEY = "cartly_shopping_cart_v1";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const dismissNotification = () => setNotification(null);

  const addToCart = (
    product: Product,
    quantity = 1
  ): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      const msg = `${product.name} is currently out of stock.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    const existing = cartItems.find((item) => item.product._id === product._id);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + quantity;

    if (nextQty > product.stock) {
      const msg = `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} available in stock.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    setCartItems((prev) => {
      const exists = prev.find((i) => i.product._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, product, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });

    const msg = `Added ${quantity} × ${product.name} to cart.`;
    showToast(msg);
    return { success: true, message: msg };
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId)
    );
  };

  const increaseQuantity = (
    productId: string
  ): { success: boolean; message?: string } => {
    const target = cartItems.find((item) => item.product._id === productId);
    if (!target) return { success: false };

    if (target.quantity + 1 > target.product.stock) {
      const msg = `Maximum available stock (${target.product.stock}) reached.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    return { success: true };
  };

  const decreaseQuantity = (productId: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number
  ): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const target = cartItems.find((item) => item.product._id === productId);
    if (!target) return { success: false };

    if (quantity > target.product.stock) {
      const msg = `Only ${target.product.stock} available in stock.`;
      showToast(msg);
      return { success: false, message: msg };
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
    return { success: true };
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = Number(
    cartItems
      .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
      .toFixed(2)
  );

  const total = subtotal;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        subtotal,
        total,
        totalItems,
        notification,
        dismissNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
