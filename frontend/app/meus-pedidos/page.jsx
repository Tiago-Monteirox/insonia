import Link from "next/link";
import { orders } from "../lib/store";

export const metadata = {
  title: "INSÔNIA | Meus pedidos"
};

export default function OrdersPage() {
  return (
    <div className="orders-page">
      <section className="account-hero shell">
        <p className="eyebrow">Área do cliente</p>
        <div className="account-hero-grid">
          <div>
            <h1 className="account-title">Meus pedidos</h1>
            <p className="account-description">
              Acompanhe suas compras, veja o andamento do pagamento, envio e entrega em tempo real.
            </p>
          </div>
          <div className="account-status">
            <span>Resumo</span>
            <strong>3 pedidos acompanhados</strong>
            <p>Última atualização: hoje, 18h40.</p>
          </div>
        </div>
      </section>

      <section className="orders-dashboard shell" aria-label="Lista de pedidos">
        {orders.map((order) => (
          <article className="tracking-card" key={order.id}>
            <div className="tracking-header">
              <div>
                <span>Pedido #{order.id}</span>
                <h2>{order.title}</h2>
                <p>{order.items}</p>
              </div>
              <div className="tracking-summary">
                <strong>{order.total}</strong>
                <span className={`status-pill ${order.statusClass}`}>{order.status}</span>
                <Link href={`/meus-pedidos/${order.id}`} className="tracking-link">Detalhes</Link>
              </div>
            </div>

            <div className="tracking-steps" aria-label={`Status do pedido #${order.id}`}>
              {order.steps.map(([label, detail, state]) => (
                <div className={`tracking-step${state ? ` is-${state}` : ""}`} key={`${order.id}-${label}`}>
                  <span></span>
                  <strong>{label}</strong>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
