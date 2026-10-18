"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const customerRecords = [
  {
    id: "marina-costa",
    name: "Marina Costa",
    email: "marina.costa@email.com",
    phone: "(11) 98422-1048",
    city: "São Paulo, SP",
    segment: "Recorrente",
    status: "Ativa",
    totalSpent: 1089.5,
    orders: 3,
    lastOrder: "Hoje, 19:12",
    favorite: "Calçados e acessórios",
    notes: "Compra por Pix e costuma buscar peças do drop novo.",
    history: [
      ["IN-1052", "Tênis Asfalto Low, Boné Panel Eye", "Pago", "R$ 519,80"],
      ["IN-1032", "Overshirt Grafite, Camiseta Eye", "Entregue", "R$ 469,80"]
    ]
  },
  {
    id: "rafael-nunes",
    name: "Rafael Nunes",
    email: "rafael.nunes@email.com",
    phone: "(21) 97340-5521",
    city: "Rio de Janeiro, RJ",
    segment: "VIP",
    status: "Em acompanhamento",
    totalSpent: 1589.3,
    orders: 4,
    lastOrder: "Hoje, 17:46",
    favorite: "Jaquetas e calças",
    notes: "Prefere entrega expressa e compra looks completos.",
    history: [
      ["IN-1051", "Jaqueta Line, Camiseta Eye, Calça Slim Cargo", "Enviado", "R$ 789,70"],
      ["IN-1048", "Drop noturno completo", "Enviado", "R$ 789,70"]
    ]
  },
  {
    id: "bianca-torres",
    name: "Bianca Torres",
    email: "bianca.torres@email.com",
    phone: "(31) 99612-3008",
    city: "Belo Horizonte, MG",
    segment: "Nova cliente",
    status: "Ativa",
    totalSpent: 319.9,
    orders: 1,
    lastOrder: "Hoje, 15:08",
    favorite: "Roupas",
    notes: "Primeira compra feita pelo site demonstrativo.",
    history: [
      ["IN-1050", "Overshirt Grafite", "Confirmado", "R$ 319,90"]
    ]
  },
  {
    id: "caio-martins",
    name: "Caio Martins",
    email: "caio.martins@email.com",
    phone: "(41) 98244-7780",
    city: "Curitiba, PR",
    segment: "Recorrente",
    status: "Ativa",
    totalSpent: 749.7,
    orders: 3,
    lastOrder: "Ontem, 22:11",
    favorite: "Camisetas e bonés",
    notes: "Boa oportunidade para campanha de outlet.",
    history: [
      ["IN-1049", "Camiseta Eye, Boné Panel Eye", "Entregue", "R$ 269,80"],
      ["IN-1024", "Camisetas da coleção", "Pagamento aceito", "R$ 299,80"]
    ]
  }
];

function formatMoney(value) {
  return moneyFormatter.format(value);
}

export function CustomerAdminClient() {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerRecords[0].id);
  const selectedCustomer = customerRecords.find((customer) => customer.id === selectedCustomerId) || customerRecords[0];

  const metrics = useMemo(() => {
    const revenue = customerRecords.reduce((total, customer) => total + customer.totalSpent, 0);
    const recurring = customerRecords.filter((customer) => customer.orders > 1).length;
    const average = revenue / customerRecords.length;

    return [
      { label: "Clientes", value: String(customerRecords.length), detail: "Base demonstrativa" },
      { label: "Recorrentes", value: String(recurring), detail: "Compraram mais de uma vez" },
      { label: "Receita", value: formatMoney(revenue), detail: "Histórico da carteira" },
      { label: "Ticket médio", value: formatMoney(average), detail: "Por cliente cadastrado" }
    ];
  }, []);

  return (
    <div className="owner-page customers-page">
      <section className="owner-hero shell">
        <div>
          <p className="eyebrow">Administração</p>
          <h1>Clientes</h1>
          <p>Visualize compradores, histórico de pedidos, valor acumulado e preferências para atendimento.</p>
        </div>
        <div className="owner-actions">
          <Link className="button" href="/admin-loja">Dashboard</Link>
          <Link className="button" href="/admin-loja/pedidos">Pedidos</Link>
          <Link className="button button-primary" href="/admin-loja/produtos">Produtos</Link>
        </div>
      </section>

      <section className="owner-dashboard shell" aria-label="Resumo de clientes">
        <div className="owner-metrics">
          {metrics.map((metric) => (
            <article className="owner-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="customers-admin shell" aria-label="Gestão de clientes">
        <div className="owner-section-heading">
          <div>
            <span>Carteira</span>
            <h2>Lista de clientes</h2>
          </div>
          <p>Dados fictícios para desenhar a experiência antes da integração real com o backend.</p>
        </div>

        <div className="customers-layout">
          <div className="customers-list">
            {customerRecords.map((customer) => (
              <button
                className={`customer-card${selectedCustomer.id === customer.id ? " is-selected" : ""}`}
                type="button"
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
              >
                <span>{customer.segment}</span>
                <strong>{customer.name}</strong>
                <p>{customer.email}</p>
                <div>
                  <em>{customer.orders} pedido(s)</em>
                  <b>{formatMoney(customer.totalSpent)}</b>
                </div>
              </button>
            ))}
          </div>

          <article className="customer-detail">
            <div className="customer-detail-head">
              <div>
                <span>{selectedCustomer.segment}</span>
                <h3>{selectedCustomer.name}</h3>
                <p>{selectedCustomer.email} · {selectedCustomer.phone}</p>
              </div>
              <span className="status-pill is-payment">{selectedCustomer.status}</span>
            </div>

            <div className="customer-summary">
              <div>
                <span>Total gasto</span>
                <strong>{formatMoney(selectedCustomer.totalSpent)}</strong>
              </div>
              <div>
                <span>Último pedido</span>
                <strong>{selectedCustomer.lastOrder}</strong>
              </div>
              <div>
                <span>Preferência</span>
                <strong>{selectedCustomer.favorite}</strong>
              </div>
            </div>

            <div className="customer-notes">
              <span>Observações</span>
              <p>{selectedCustomer.notes}</p>
              <p>{selectedCustomer.city}</p>
            </div>

            <div className="customer-history">
              <span>Histórico</span>
              {selectedCustomer.history.map(([id, items, status, total]) => (
                <div className="customer-history-row" key={id}>
                  <div>
                    <strong>{id}</strong>
                    <p>{items}</p>
                  </div>
                  <span>{status}</span>
                  <b>{total}</b>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
