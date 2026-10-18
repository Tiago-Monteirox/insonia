"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminSales } from "../lib/store";

const orderStorageKey = "insoniaAdminOrders";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const statusFlow = [
  { label: "Confirmado", fulfillment: "Pedido recebido", className: "is-pending" },
  { label: "Pagamento aceito", fulfillment: "Pagamento aprovado", className: "is-payment" },
  { label: "Em separação", fulfillment: "Separar e embalar", className: "is-pending" },
  { label: "Enviado", fulfillment: "Em transporte", className: "is-shipping" },
  { label: "Entregue", fulfillment: "Finalizado", className: "is-delivered" },
  { label: "Cancelado", fulfillment: "Pedido cancelado", className: "is-canceled" }
];

const statusFilters = [
  { label: "Todos", value: "todos" },
  { label: "Abertos", value: "abertos" },
  ...statusFlow.map((status) => ({ label: status.label, value: status.label }))
];

function normalizeOrderStatus(status) {
  if (status === "Pago") {
    return "Pagamento aceito";
  }

  return status;
}

function getStatusMeta(status) {
  return statusFlow.find((item) => item.label === status) || statusFlow[0];
}

function isOpenOrder(order) {
  return !["Entregue", "Cancelado"].includes(order.status);
}

function orderMatchesSearch(order, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    order.id,
    order.customer,
    order.items,
    order.status,
    order.channel,
    order.payment,
    order.fulfillment,
    order.trackingCode,
    order.note
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalizedQuery));
}

function buildOrders(savedOrders = []) {
  if (savedOrders.length > 0) {
    return savedOrders;
  }

  return adminSales.map((sale) => {
    const status = normalizeOrderStatus(sale.status);
    const statusMeta = getStatusMeta(status);

    return {
      ...sale,
      status,
      statusClass: statusMeta.className,
      fulfillment: statusMeta.fulfillment,
      trackingCode: status === "Enviado" || status === "Entregue" ? `BR${sale.id.replace(/\D/g, "")}SP` : "",
      note: ""
    };
  });
}

export function OrderAdminClient() {
  const [orders, setOrders] = useState(() => buildOrders());
  const [selectedOrderId, setSelectedOrderId] = useState(adminSales[0]?.id || "");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem(orderStorageKey)) || [];
      const nextOrders = buildOrders(savedOrders);
      setOrders(nextOrders);
      setSelectedOrderId(nextOrders[0]?.id || "");
    } catch {
      setOrders(buildOrders());
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "todos" ||
        (statusFilter === "abertos" && isOpenOrder(order)) ||
        order.status === statusFilter;

      return matchesStatus && orderMatchesSearch(order, query);
    });
  }, [orders, query, statusFilter]);

  useEffect(() => {
    if (filteredOrders.length === 0) {
      return;
    }

    const selectedStillVisible = filteredOrders.some((order) => order.id === selectedOrderId);

    if (!selectedStillVisible) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) || filteredOrders[0] || null;

  const metrics = useMemo(() => {
    const openOrders = filteredOrders.filter(isOpenOrder).length;
    const shippingOrders = filteredOrders.filter((order) => order.status === "Enviado").length;
    const attentionOrders = filteredOrders.filter((order) =>
      ["Confirmado", "Pagamento aceito", "Em separação"].includes(order.status)
    ).length;
    const revenue = filteredOrders
      .filter((order) => order.status !== "Cancelado")
      .reduce((total, order) => total + order.total, 0);

    return [
      { label: "Pedidos filtrados", value: filteredOrders.length },
      { label: "Abertos", value: openOrders },
      { label: "Em envio", value: shippingOrders },
      { label: "Ação hoje", value: attentionOrders },
      { label: "Receita válida", value: moneyFormatter.format(revenue) }
    ];
  }, [filteredOrders]);

  const statusSummary = useMemo(() => {
    return statusFlow.map((status) => {
      const statusOrders = orders.filter((order) => order.status === status.label);
      const total = statusOrders.reduce((sum, order) => sum + order.total, 0);

      return {
        ...status,
        count: statusOrders.length,
        total
      };
    });
  }, [orders]);

  function updateOrder(orderId, changes) {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, ...changes } : order))
    );
    setSavedAt("");
  }

  function updateStatus(orderId, status) {
    const statusMeta = getStatusMeta(status);

    updateOrder(orderId, {
      status,
      statusClass: statusMeta.className,
      fulfillment: statusMeta.fulfillment
    });
  }

  function handleSave() {
    localStorage.setItem(orderStorageKey, JSON.stringify(orders));
    setSavedAt("Pedidos salvos");
  }

  function clearFilters() {
    setQuery("");
    setStatusFilter("todos");
  }

  return (
    <div className="owner-page orders-admin-page">
      <section className="owner-hero shell">
        <div>
          <p className="eyebrow">Pedidos</p>
          <h1>Gestão de vendas</h1>
          <p>Atualize status, acompanhe separação e registre observações operacionais.</p>
        </div>
        <div className="owner-actions">
          <Link className="button" href="/admin-loja">Dashboard</Link>
          <button className="button button-primary" type="button" onClick={handleSave}>Salvar pedidos</button>
        </div>
      </section>

      <section className="catalog-dashboard shell" aria-label="Resumo de pedidos">
        <div className="owner-metrics">
          {metrics.map((metric) => (
            <article className="owner-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>Operação de vendas</p>
            </article>
          ))}
        </div>

        {savedAt ? <p className="catalog-save-note">{savedAt}</p> : null}
      </section>

      <section className="orders-control-panel shell" aria-label="Filtros e status dos pedidos">
        <div className="orders-toolbar">
          <label className="admin-field orders-search-field">
            Buscar venda
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pedido, cliente, item ou canal"
            />
          </label>

          <div className="orders-filter-group" role="group" aria-label="Filtrar por status">
            {statusFilters.map((filter) => (
              <button
                className={statusFilter === filter.value ? "is-active" : ""}
                type="button"
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="orders-status-grid" aria-label="Resumo por status">
          {statusSummary.map((status) => (
            <article className="orders-status-card" key={status.label}>
              <span className={`status-pill ${status.className}`}>{status.label}</span>
              <strong>{status.count}</strong>
              <p>{moneyFormatter.format(status.total)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="orders-admin shell" aria-label="Gerenciar pedidos">
        <div className="owner-section-heading">
          <div>
            <span>Fila operacional</span>
            <h2>Pedidos recentes</h2>
          </div>
          <p>{filteredOrders.length} venda(s) na visão atual.</p>
        </div>

        <div className="orders-admin-layout">
          <div className="orders-admin-list">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <button
                  className={`order-admin-card${order.id === selectedOrder?.id ? " is-selected" : ""}`}
                  type="button"
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <span>{order.id}</span>
                  <strong>{order.customer}</strong>
                  <p>{order.items}</p>
                  <div>
                    <em>{moneyFormatter.format(order.total)}</em>
                    <span className={`status-pill ${order.statusClass}`}>{order.status}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="orders-empty-state">
                <strong>Nenhuma venda encontrada</strong>
                <p>Ajuste a busca ou volte para todos os status.</p>
                <button className="button" type="button" onClick={clearFilters}>Limpar filtros</button>
              </div>
            )}
          </div>

          {selectedOrder ? (
            <article className="order-admin-detail">
              <div className="order-admin-detail-head">
                <div>
                  <span>Pedido {selectedOrder.id}</span>
                  <h3>{selectedOrder.customer}</h3>
                  <p>{selectedOrder.date} · {selectedOrder.channel} · {selectedOrder.payment}</p>
                </div>
                <span className={`status-pill ${selectedOrder.statusClass}`}>{selectedOrder.status}</span>
              </div>

              <div className="order-admin-summary">
                <div>
                  <span>Total</span>
                  <strong>{moneyFormatter.format(selectedOrder.total)}</strong>
                </div>
                <div>
                  <span>Lucro</span>
                  <strong>{moneyFormatter.format(selectedOrder.profit)}</strong>
                </div>
                <div>
                  <span>Separação</span>
                  <strong>{selectedOrder.fulfillment}</strong>
                </div>
              </div>

              <div className="order-status-editor">
                <span>Alterar status</span>
                <div className="status-options">
                  {statusFlow.map((status) => (
                    <button
                      className={selectedOrder.status === status.label ? "is-selected" : ""}
                      type="button"
                      key={status.label}
                      onClick={() => updateStatus(selectedOrder.id, status.label)}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="order-admin-fields">
                <label className="admin-field">
                  Código de rastreio
                  <input
                    value={selectedOrder.trackingCode}
                    onChange={(event) => updateOrder(selectedOrder.id, { trackingCode: event.target.value })}
                    placeholder="Ex: BR000000SP"
                  />
                </label>
                <label className="admin-field admin-field-wide">
                  Observação interna
                  <textarea
                    value={selectedOrder.note}
                    onChange={(event) => updateOrder(selectedOrder.id, { note: event.target.value })}
                    placeholder="Ex: cliente pediu envio após as 18h"
                  />
                </label>
              </div>

              <div className="order-items-box">
                <span>Itens do pedido</span>
                <p>{selectedOrder.items}</p>
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  );
}
