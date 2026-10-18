"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useToast } from "./ToastProvider";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const deliveryOptions = [
  { id: "standard", title: "Entrega padrão", detail: "Receba em 5 a 8 dias úteis", price: 19.9 },
  { id: "express", title: "Entrega expressa", detail: "Receba em 2 a 3 dias úteis", price: 34.9 },
  { id: "pickup", title: "Retirada combinada", detail: "Sem frete, retirada com a loja", price: 0 }
];

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { notify } = useToast();
  const [orderCode, setOrderCode] = useState("IN-DEMO");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState("standard");
  const selectedDelivery = deliveryOptions.find((option) => option.id === selectedDeliveryId) || deliveryOptions[0];
  const shipping = items.length > 0 ? selectedDelivery.price : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    const suffix = String(Date.now()).slice(-5);
    setOrderCode(`IN-${suffix}`);
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    sessionStorage.setItem(
      "insoniaLastOrder",
      JSON.stringify({
        id: orderCode,
        items,
        subtotal,
        shipping,
        total,
        delivery: selectedDelivery.title,
        createdAt: new Date().toISOString()
      })
    );

    clearCart();
    notify("Pedido demonstrativo confirmado.", "success");
    router.push("/pedido-confirmado");
  }

  if (items.length === 0) {
    return (
      <section className="checkout-empty shell">
        <p className="eyebrow">Checkout</p>
        <h1>Seu carrinho está vazio</h1>
        <p>Adicione uma peça do drop para abrir o fechamento do pedido.</p>
        <Link className="button button-primary" href="/novidades">Ver coleção</Link>
      </section>
    );
  }

  return (
    <form className="checkout-page shell" onSubmit={handleSubmit}>
      <section className="checkout-main">
        <div className="checkout-heading">
          <p className="eyebrow">Checkout</p>
          <h1>Finalizar compra</h1>
          <p>Revise seus dados, escolha a entrega e confirme sua seleção INSÔNIA.</p>
        </div>

        <div className="checkout-steps" aria-label="Etapas do checkout">
          <span>Dados</span>
          <span>Entrega</span>
          <span>Pagamento</span>
          <span>Revisão</span>
        </div>

        <div className="checkout-panel">
          <div className="panel-heading">
            <span>Contato</span>
            <h2>Dados do cliente</h2>
          </div>
          <div className="customer-form">
            <label>
              Nome completo
              <input type="text" name="name" placeholder="Seu nome" autoComplete="name" required />
            </label>
            <label>
              E-mail
              <input type="email" name="email" placeholder="voce@email.com" autoComplete="email" required />
            </label>
            <label>
              Telefone
              <input type="tel" name="phone" placeholder="(00) 00000-0000" autoComplete="tel" required />
            </label>
            <label>
              CPF
              <input type="text" name="document" placeholder="000.000.000-00" inputMode="numeric" required />
            </label>
          </div>
        </div>

        <div className="checkout-panel">
          <div className="panel-heading">
            <span>Entrega</span>
            <h2>Endereço</h2>
          </div>
          <div className="customer-form">
            <label>
              CEP
              <input type="text" name="postalCode" placeholder="00000-000" inputMode="numeric" required />
            </label>
            <label>
              Cidade
              <input type="text" name="city" placeholder="Sua cidade" required />
            </label>
            <label>
              Endereço
              <input type="text" name="address" placeholder="Rua, avenida ou travessa" autoComplete="street-address" required />
            </label>
            <label>
              Número
              <input type="text" name="number" placeholder="000" required />
            </label>
          </div>
        </div>

        <div className="checkout-panel">
          <div className="panel-heading">
            <span>Entrega</span>
            <h2>Opção de entrega</h2>
          </div>
          <div className="delivery-options" aria-label="Opções de entrega">
            {deliveryOptions.map((option) => (
              <label className={selectedDeliveryId === option.id ? "is-selected" : ""} key={option.id}>
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={selectedDeliveryId === option.id}
                  onChange={() => setSelectedDeliveryId(option.id)}
                />
                <span>
                  <strong>{option.title}</strong>
                  <em>{option.detail}</em>
                </span>
                <b>{moneyFormatter.format(option.price)}</b>
              </label>
            ))}
          </div>
        </div>

        <div className="checkout-panel">
          <div className="panel-heading">
            <span>Pagamento</span>
            <h2>Forma de pagamento</h2>
          </div>
          <div className="payment-options">
            <label><input type="radio" name="payment" value="pix" defaultChecked /><span>Pix</span></label>
            <label><input type="radio" name="payment" value="card" /><span>Cartão de crédito</span></label>
            <label><input type="radio" name="payment" value="boleto" /><span>Boleto</span></label>
          </div>
        </div>
      </section>

      <aside className="checkout-summary" aria-label="Resumo do pedido">
        <div className="summary-card">
          <span>Pedido {orderCode}</span>
          <h2>Resumo</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div className="summary-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.variantLabel ? `${item.variantLabel} · ` : ""}Qtd. {item.quantity}</p>
                </div>
                <span>{moneyFormatter.format(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div><span>Subtotal</span><strong>{moneyFormatter.format(subtotal)}</strong></div>
            <div><span>Frete</span><strong>{moneyFormatter.format(shipping)}</strong></div>
            <div><span>Entrega</span><strong>{selectedDelivery.title}</strong></div>
            <div><span>Total</span><strong>{moneyFormatter.format(total)}</strong></div>
          </div>
          <button className="button button-primary checkout-submit" type="submit">Confirmar pedido</button>
          <p className="checkout-safe-note">Pedido protegido por revisão final antes da integração de pagamento.</p>
        </div>
      </aside>
    </form>
  );
}
