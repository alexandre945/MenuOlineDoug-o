"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartAdditional = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  additionals: CartAdditional[];
  note?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "dougao_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✅ Carregar do sessionStorage (1 aba = 1 carrinho)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      sessionStorage.removeItem(CART_KEY);
      setItems([]);
    }
  }, []);

  // ✅ Salvar no sessionStorage
  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
    sessionStorage.removeItem(CART_KEY);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de CartProvider");
  }
  return ctx;
}
