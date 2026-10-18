"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function OrderSuccessClient() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      setOrder(JSON.parse(sessionStorage.getItem("insoniaLastOrder")));
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <section className="order-success shell">
      <div className="success-card">
        <p className="eyebrow">Pedido confirmado</p>
        <h1>{order?.id || "IN-DEMO"}</h1>
        <p>
          Recebemos sua compra. Você pode acompanhar as próximas etapas pela área de pedidos.
        </p>

        <div className="success-steps" aria-label="Acompanhamento inicial do pedido">
          <span className="is-complete">Confirmado</span>
          <span>Pagamento aceito</span>
          <span>Enviado</span>
          <span>Entregue</span>
        </div>

        {order ? (
          <div className="success-total">
            <span>Total</span>
            <strong>{moneyFormatter.format(order.total)}</strong>
          </div>
        ) : null}

        <div className="success-actions">
          <Link className="button button-primary" href="/meus-pedidos">Ver meus pedidos</Link>
          <Link className="button" href="/">Voltar para loja</Link>
        </div>
      </div>
    </section>
  );
}
