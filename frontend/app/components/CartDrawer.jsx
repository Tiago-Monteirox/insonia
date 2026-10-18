"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { products } from "../lib/store";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem, addItem } = useCart();
  const freeShippingTarget = 700;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingTarget) * 100);
  const amountToFreeShipping = Math.max(0, freeShippingTarget - subtotal);
  const recommendedProduct = products.find(
    (product) => !items.some((item) => item.id === product.id || item.id.startsWith(`${product.id}-`))
  );

  function handleRecommendationAdd() {
    if (!recommendedProduct) {
      return;
    }

    const firstSize = recommendedProduct.sizes?.[0] || "Unico";

    addItem({
      ...recommendedProduct,
      id: `${recommendedProduct.id}-${firstSize}`,
      variantLabel: `Tamanho ${firstSize}`
    });
  }

  return (
    <div className={`cart-drawer-shell${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
      <button className="cart-drawer-backdrop" type="button" onClick={closeCart} aria-label="Fechar carrinho"></button>

      <aside className="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
        <div className="cart-drawer-header">
          <div>
            <span>Carrinho</span>
            <h2 id="cart-drawer-title">Sua seleção</h2>
          </div>

          <button className="cart-close-button" type="button" onClick={closeCart} aria-label="Fechar carrinho">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <strong>Seu carrinho está vazio.</strong>
            <span>Adicione uma peça do drop para continuar a compra.</span>
          </div>
        ) : (
          <div className="cart-items">
            <div className="cart-progress" aria-label="Meta de frete grátis">
              <div>
                <span>{amountToFreeShipping > 0 ? "Frete cortesia" : "Frete cortesia liberado"}</span>
                <strong>
                  {amountToFreeShipping > 0
                    ? `Faltam ${moneyFormatter.format(amountToFreeShipping)}`
                    : "Você desbloqueou a vantagem"}
                </strong>
              </div>
              <span className="cart-progress-track">
                <span style={{ width: `${freeShippingProgress}%` }}></span>
              </span>
            </div>

            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item-thumb" aria-hidden="true">
                  {item.image ? <img src={item.image} alt="" /> : getInitials(item.name)}
                </div>
                <div className="cart-item-body">
                  <div className="cart-item-heading">
                    <h3>{item.name}</h3>
                    <strong>{moneyFormatter.format(item.price * item.quantity)}</strong>
                  </div>
                  <p>{item.variantLabel ? `${item.variantLabel} · ` : ""}{moneyFormatter.format(item.price)} cada</p>
                  <div className="cart-item-actions">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Diminuir quantidade de ${item.name}`}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Aumentar quantidade de ${item.name}`}>+</button>
                    <button className="cart-remove" type="button" onClick={() => removeItem(item.id)}>Remover</button>
                  </div>
                </div>
              </article>
            ))}

            {recommendedProduct ? (
              <div className="cart-recommendation">
                <div className="cart-recommendation-media" aria-hidden="true">
                  {recommendedProduct.image ? <img src={recommendedProduct.image} alt="" /> : getInitials(recommendedProduct.name)}
                </div>
                <div>
                  <span>Combine com</span>
                  <strong>{recommendedProduct.name}</strong>
                  <p>{recommendedProduct.priceLabel}</p>
                </div>
                <button type="button" onClick={handleRecommendationAdd}>Adicionar</button>
              </div>
            ) : null}
          </div>
        )}

        <div className="cart-drawer-footer">
          <div className="cart-subtotal">
            <span>Subtotal</span>
            <strong>{moneyFormatter.format(subtotal)}</strong>
          </div>

          <Link className={`button button-primary cart-checkout${items.length === 0 ? " is-disabled" : ""}`} href="/checkout" aria-disabled={items.length === 0} onClick={closeCart}>
            Finalizar compra
          </Link>
          <button className="cart-continue" type="button" onClick={closeCart}>Continuar comprando</button>
        </div>
      </aside>
    </div>
  );
}
