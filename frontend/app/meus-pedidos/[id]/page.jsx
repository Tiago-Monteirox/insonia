import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, orders } from "../../lib/store";

export function generateStaticParams() {
  return orders.map((order) => ({ id: order.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    return {};
  }

  return {
    title: `INSÔNIA | Pedido ${order.id}`
  };
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="orders-page">
      <section className="account-hero shell">
        <p className="eyebrow">Acompanhamento</p>
        <div className="account-hero-grid">
          <div>
            <h1 className="account-title">Pedido {order.id}</h1>
            <p className="account-description">{order.items}</p>
          </div>
          <div className="account-status">
            <span>Status atual</span>
            <strong>{order.status}</strong>
            <p>Total do pedido: {order.total}</p>
            <Link className="account-status-link" href="/meus-pedidos">Voltar aos pedidos</Link>
          </div>
        </div>
      </section>

      <section className="order-detail shell">
        <article className="tracking-card">
          <div className="tracking-header">
            <div>
              <span>Pedido #{order.id}</span>
              <h2>{order.title}</h2>
              <p>Veja o andamento da compra, da confirmação até a entrega.</p>
            </div>
            <div className="tracking-summary">
              <strong>{order.total}</strong>
              <span className={`status-pill ${order.statusClass}`}>{order.status}</span>
            </div>
          </div>

          <div className="tracking-steps order-detail-steps" aria-label={`Status do pedido #${order.id}`}>
            {order.steps.map(([label, detail, state]) => (
              <div className={`tracking-step${state ? ` is-${state}` : ""}`} key={`${order.id}-${label}`}>
                <span></span>
                <strong>{label}</strong>
                <p>{detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
