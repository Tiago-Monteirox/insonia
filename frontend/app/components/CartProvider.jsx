"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "./ToastProvider";

const CartContext = createContext(null);
const cartKey = "insoniaCart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(cartKey)) || []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return {
      items,
      isOpen,
      count,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (product) => {
        const { quantityToAdd = 1, ...cartProduct } = product;
        const amountToAdd = Math.max(1, Number(quantityToAdd) || 1);

        setItems((currentItems) => {
          const existingItem = currentItems.find((item) => item.id === cartProduct.id);

          if (existingItem) {
            return currentItems.map((item) =>
              item.id === cartProduct.id ? { ...item, quantity: item.quantity + amountToAdd } : item
            );
          }

          return [...currentItems, { ...cartProduct, quantity: amountToAdd }];
        });
        notify(
          amountToAdd > 1
            ? `${amountToAdd} unidades de ${cartProduct.name} adicionadas ao carrinho.`
            : `${cartProduct.name} adicionado ao carrinho.`,
          "success"
        );
        setIsOpen(true);
      },
      clearCart: () => {
        setItems([]);
        setIsOpen(false);
      },
      updateQuantity: (id, amount) => {
        const currentItem = items.find((item) => item.id === id);

        setItems((currentItems) =>
          currentItems
            .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
            .filter((item) => item.quantity > 0)
        );

        if (currentItem && currentItem.quantity + amount <= 0) {
          notify(`${currentItem.name} removido do carrinho.`, "info");
        }
      },
      removeItem: (id) => {
        const currentItem = items.find((item) => item.id === id);

        setItems((currentItems) => currentItems.filter((item) => item.id !== id));

        if (currentItem) {
          notify(`${currentItem.name} removido do carrinho.`, "info");
        }
      }
    };
  }, [items, isOpen, notify]);

  useEffect(() => {
    document.body.classList.toggle("cart-is-open", isOpen);

    return () => document.body.classList.remove("cart-is-open");
  }, [isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);

  if (!cart) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return cart;
}
