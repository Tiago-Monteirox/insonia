"use client";

import Link from "next/link";
import { ProductGrid } from "./ProductGrid";
import { useWishlist } from "./WishlistProvider";
import { products } from "../lib/store";

export function FavoritesClient() {
  const { ids, clearWishlist } = useWishlist();
  const favoriteProducts = products.filter((product) => ids.includes(product.id));

  return (
    <div className="favorites-page">
      <section className="account-hero shell">
        <p className="eyebrow">Área do cliente</p>
        <div className="account-hero-grid">
          <div>
            <h1 className="account-title">Favoritos</h1>
            <p className="account-description">Salve peças do drop para comparar, montar looks e voltar depois sem perder o produto.</p>
          </div>
          <div className="account-status">
            <span>Lista salva</span>
            <strong>{favoriteProducts.length} produto(s)</strong>
            <p>Os favoritos ficam guardados neste navegador até você limpar a lista.</p>
          </div>
        </div>
      </section>

      <section className="favorites-content shell" aria-label="Produtos favoritos">
        {favoriteProducts.length > 0 ? (
          <>
            <div className="collection-toolbar favorites-toolbar">
              <span>Produtos salvos</span>
              <button className="filter-clear" type="button" onClick={clearWishlist}>Limpar favoritos</button>
            </div>
            <ProductGrid products={favoriteProducts} />
          </>
        ) : (
          <div className="favorite-empty">
            <span>Wishlist</span>
            <h2>Nenhuma peça salva ainda</h2>
            <p>Use o coração nos produtos para criar sua seleção antes de fechar o carrinho.</p>
            <div className="favorite-empty-actions">
              <Link className="button button-primary" href="/novidades">Ver novidades</Link>
              <Link className="button" href="/roupas">Ver roupas</Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
