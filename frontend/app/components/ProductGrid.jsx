"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { FavoriteButton } from "./FavoriteButton";

export function ProductGrid({ products }) {
  const { addItem } = useCart();
  const [quickProduct, setQuickProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    document.body.classList.toggle("quick-add-open", Boolean(quickProduct));

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setQuickProduct(null);
      }
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("quick-add-open");
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [quickProduct]);

  function openQuickAdd(product) {
    setQuickProduct(product);
    setSelectedSize(product.sizes?.[0] || "Unico");
  }

  function handleQuickAdd() {
    if (!quickProduct) {
      return;
    }

    addItem({
      ...quickProduct,
      id: `${quickProduct.id}-${selectedSize}`,
      variantLabel: `Tamanho ${selectedSize}`
    });
    setQuickProduct(null);
  }

  return (
    <>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-media-wrap">
              <Link className="product-card-link" href={`/produto/${product.slug}`} aria-label={`Ver detalhes de ${product.name}`}>
                <div className="product-media">
                  <span className="product-badge">{product.badge}</span>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span className="fallback-art" aria-hidden="true"></span>
                  )}
                </div>
              </Link>
              <FavoriteButton product={product} className="product-favorite-button" />
            </div>
            <div className="product-info">
              <Link href={`/produto/${product.slug}`}>
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.priceLabel}</p>
                <div className="product-card-meta">
                  <small>{product.fit}</small>
                  <small>{product.stock} un.</small>
                </div>
              </Link>
              <button
                className="add-button"
                type="button"
                aria-label={`Compra rápida de ${product.name}`}
                onClick={() => openQuickAdd(product)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 8h12l-1.2 8.3a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 4H3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7"></path>
                  <path d="M12 10v5M9.5 12.5h5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7"></path>
                </svg>
                <span>Adicionar</span>
              </button>
            </div>
          </article>
        ))}
      </div>


      {quickProduct ? (
        <div className="quick-add-shell" role="dialog" aria-modal="true" aria-label={`Compra rápida de ${quickProduct.name}`}>
          <button className="quick-add-backdrop" type="button" aria-label="Fechar compra rápida" onClick={() => setQuickProduct(null)}></button>
          <section className="quick-add-panel">
            <button className="cart-close-button quick-add-close" type="button" aria-label="Fechar compra rápida" onClick={() => setQuickProduct(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
              </svg>
            </button>

            <div className="quick-add-media">
              {quickProduct.image ? <img src={quickProduct.image} alt={quickProduct.name} /> : <span className="fallback-art" aria-hidden="true"></span>}
            </div>

            <div className="quick-add-content">
              <span>{quickProduct.category}</span>
              <h2>{quickProduct.name}</h2>
              <p>{quickProduct.description}</p>

              <div className="quick-add-price">
                <strong>{quickProduct.priceLabel}</strong>
                <em>{quickProduct.stock} em estoque</em>
              </div>

              <div className="quick-size-picker" aria-label="Escolher tamanho">
                {(quickProduct.sizes || ["Unico"]).map((size) => (
                  <button
                    className={selectedSize === size ? "is-selected" : undefined}
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="quick-add-actions">
                <button className="button button-primary" type="button" onClick={handleQuickAdd}>Adicionar ao carrinho</button>
                <Link className="button" href={`/produto/${quickProduct.slug}`} onClick={() => setQuickProduct(null)}>Ver detalhes</Link>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
