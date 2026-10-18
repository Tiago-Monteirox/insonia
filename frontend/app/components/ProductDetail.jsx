"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { FavoriteButton } from "./FavoriteButton";
import { ProductGrid } from "./ProductGrid";

export function ProductDetail({ product, relatedProducts = [] }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const lowStock = product.stock <= 8;
  const stockMessage = lowStock ? "Poucas unidades" : "Pronta entrega";

  function updateQuantity(amount) {
    setQuantity((currentQuantity) => {
      const nextQuantity = currentQuantity + amount;
      return Math.min(product.stock, Math.max(1, nextQuantity));
    });
  }

  function handleAddToCart() {
    addItem({
      ...product,
      id: `${product.id}-${selectedSize}`,
      variantLabel: `Tamanho ${selectedSize}`,
      quantityToAdd: quantity
    });
  }

  return (
    <div className="product-detail-page">
      <section className="product-detail shell">
        <div className="product-gallery" aria-label={`Galeria de ${product.name}`}>
          <div className="product-hero-frame">
            <span className="product-badge">{product.badge}</span>
            <FavoriteButton product={product} className="product-detail-favorite" />
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <span className="product-large-art" aria-hidden="true"></span>
            )}
          </div>
          <div className="product-thumbs" aria-hidden="true">
            <span>{product.image ? <img src={product.image} alt="" /> : null}</span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="product-buybox">
          <Link className="product-back-link" href={`/${product.categorySlug}`}>
            {product.category}
          </Link>

          <p className="eyebrow">INSÔNIA Drop 01</p>
          <h1>{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="product-price-row">
            <strong>{product.priceLabel}</strong>
            <span>{stockMessage} · {product.stock} em estoque</span>
          </div>

          <div className="product-meta-grid">
            <div>
              <span>Cor</span>
              <strong>{product.color}</strong>
            </div>
            <div>
              <span>Modelagem</span>
              <strong>{product.fit}</strong>
            </div>
          </div>

          <div className="size-picker" aria-label="Selecionar tamanho">
            <div className="picker-heading">
              <span>Tamanho</span>
              <strong>{selectedSize}</strong>
            </div>
            <div className="size-options">
              {product.sizes.map((size) => (
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
          </div>

          <div className="product-choice-panel" aria-label="Resumo da escolha">
            <div>
              <span>Você escolheu</span>
              <strong>{product.name} · {selectedSize}</strong>
              <p>{product.fit} em {product.color.toLowerCase()}</p>
            </div>

            <div className="quantity-control" aria-label="Selecionar quantidade">
              <button type="button" onClick={() => updateQuantity(-1)} disabled={quantity === 1}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => updateQuantity(1)} disabled={quantity === product.stock}>+</button>
            </div>
          </div>

          <div className="product-actions-row">
            <button className="button button-primary product-buy-button" type="button" onClick={handleAddToCart}>
              Adicionar ao carrinho
            </button>
            <FavoriteButton product={product} className="product-buy-favorite" />
          </div>

          <div className="product-detail-list">
            {product.details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </div>

          <div className="product-confidence-grid" aria-label="Informações rápidas de compra">
            <div>
              <strong>Envio claro</strong>
              <span>Frete calculado no checkout</span>
            </div>
            <div>
              <strong>Troca fácil</strong>
              <span>Acompanhamento em pedidos</span>
            </div>
            <div>
              <strong>Compra guiada</strong>
              <span>Carrinho lateral e checkout simples</span>
            </div>
          </div>
        </div>
      </section>

      <section className="product-extra shell" aria-label="Informações do produto">
        <article className="product-how-to-buy">
          <span>Como comprar</span>
          <h2>Escolha, adicione e finalize.</h2>
          <div className="buy-steps">
            <div>
              <strong>01</strong>
              <p>Escolha tamanho e quantidade.</p>
            </div>
            <div>
              <strong>02</strong>
              <p>Adicione ao carrinho lateral.</p>
            </div>
            <div>
              <strong>03</strong>
              <p>Finalize no checkout demonstrativo.</p>
            </div>
          </div>
        </article>

        <article>
          <span>Guia de medidas</span>
          <h2>Escolha sem adivinhar</h2>
          <div className="size-guide">
            <div>
              <strong>Roupas</strong>
              <p>P veste 36/38 · M veste 40 · G veste 42 · GG veste 44/46</p>
            </div>
            <div>
              <strong>Calçados</strong>
              <p>Forma regular. Se estiver entre dois números, escolha o maior.</p>
            </div>
          </div>
        </article>

        <article>
          <span>Compra segura</span>
          <h2>Troca fácil</h2>
          <p>Você pode solicitar troca por tamanho ou defeito de fabricação pela área de pedidos.</p>
        </article>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="section shell related-products" aria-label="Produtos relacionados">
          <div className="section-heading">
            <h2>Combine com</h2>
            <span className="rule"></span>
            <Link href={`/${product.categorySlug}`}>Ver categoria</Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      ) : null}
    </div>
  );
}
