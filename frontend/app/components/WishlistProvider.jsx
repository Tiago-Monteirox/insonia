"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useToast } from "./ToastProvider";

const WishlistContext = createContext(null);
const wishlistStorageKey = "insoniaWishlist";

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    try {
      const storedIds = JSON.parse(localStorage.getItem(wishlistStorageKey)) || [];
      setIds(Array.isArray(storedIds) ? storedIds : []);
    } catch {
      setIds([]);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    localStorage.setItem(wishlistStorageKey, JSON.stringify(ids));
  }, [ids, isReady]);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      isFavorite: (productId) => ids.includes(productId),
      toggleFavorite: (product) => {
        setIds((currentIds) => {
          if (currentIds.includes(product.id)) {
            notify(`${product.name} removido dos favoritos.`, "info");
            return currentIds.filter((id) => id !== product.id);
          }

          notify(`${product.name} salvo nos favoritos.`, "success");
          return [...currentIds, product.id];
        });
      },
      clearWishlist: () => {
        setIds([]);
        notify("Lista de favoritos limpa.", "info");
      }
    }),
    [ids, notify]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const wishlist = useContext(WishlistContext);

  if (!wishlist) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return wishlist;
}
