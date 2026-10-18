"use client";

import { useWishlist } from "./WishlistProvider";

export function FavoriteButton({ product, className = "" }) {
  const { isFavorite, toggleFavorite } = useWishlist();
  const active = isFavorite(product.id);

  return (
    <button
      className={`favorite-button${active ? " is-active" : ""}${className ? ` ${className}` : ""}`}
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remover ${product.name} dos favoritos` : `Salvar ${product.name} nos favoritos`}
      onClick={() => toggleFavorite(product)}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.2S4.6 15.8 3.3 10.4C2.5 7.2 4.3 4.8 7.1 4.4c1.7-.2 3.3.6 4.1 2 1-1.5 2.5-2.2 4.3-2 2.8.4 4.5 2.8 3.8 6-1.3 5.4-8.3 9.8-8.3 9.8Z" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7"></path>
      </svg>
    </button>
  );
}
