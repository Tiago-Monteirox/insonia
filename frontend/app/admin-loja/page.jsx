import Link from "next/link";
import { adminSales, products, salesTimeline, topProducts } from "../lib/store";

export const metadata = {
  title: "INSÔNIA | Administração"
};

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function formatMoney(value) {
  return moneyFormatter.format(value);
}

const backendModules = [
  {
    title: "Catálogo",
    status: "Backend pronto",
    tone: "ready",
    endpoint: "/api/produtos/",
    href: "/admin-loja/produtos",
    summary: "Produtos, imagens, preço de venda, preço promocional, custo, estoque, categoria, marca e descrição.",
    items: ["Produtos", "Imagens", "Preço", "Estoque", "Categorias", "Marcas"]
  },
  {
    title: "Vendas",
    status: "Backend pronto",
    tone: "ready",
    endpoint: "/api/vendas/",
    href: "/admin-loja/pedidos",
    summary: "Vendas com usuário, data, itens, valor total e lucro total calculado automaticamente.",
    items: ["Lista de vendas", "Itens", "Total", "Lucro", "Usuário", "Data"]
  },
  {
    title: "Estoque",
    status: "Backend pronto",
    tone: "ready",
    endpoint: "Produto.quantidade",
    href: "/admin-loja/produtos",
    summary: "Controle por quantidade no produto, validação antes da venda e baixa automática quando o item é vendido.",
    items: ["Saldo", "Baixa automática", "Validação", "Reposição manual"]
  },
  {
    title: "Financeiro",
    status: "Backend pronto",
    tone: "ready",
    endpoint: "/admin/pdv/venda/estatisticas/",
    href: "/admin-loja/pedidos",
    summary: "Cálculo de faturamento e lucro geral ou por período, usando as vendas registradas no PDV.",
    items: ["Faturamento", "Lucro", "Período", "Margem"]
  },
  {
    title: "Variações",
    status: "Backend pronto",
    tone: "ready",
    endpoint: "/api/variacao/",
    href: "/admin-loja/produtos",
    summary: "Estrutura para montar atributos como tamanho, cor e outros valores ligados aos produtos.",
    items: ["Nome", "Valor", "Produto", "Grade"]
  },
  {
    title: "Clientes",
    status: "Demonstrativo",
    tone: "demo",
    endpoint: "Sem modelo próprio",
    href: "/admin-loja/clientes",
    summary: "A tela existe no frontend, mas o backend ainda usa apenas o usuário padrão do Django nas vendas.",
    items: ["Perfil", "Contato", "Endereço", "Histórico"]
  }
];

const integrationSteps = [
  {
    title: "1. Conectar leituras reais",
    description: "Substituir os dados do store.js por chamadas de produtos, categorias, marcas, vendas e itens de venda."
  },
  {
    title: "2. Salvar catálogo no backend",
    description: "Enviar edição de preço, estoque, categoria, marca e imagem para os endpoints já existentes."
  },
  {
    title: "3. Separar pedidos de PDV",
    description: "Hoje o backend tem venda, mas ainda não tem status de pedido, pagamento, envio e entrega."
  },
  {
    title: "4. Criar módulos futuros",
    description: "Cliente, endereço, rastreio, cupons, frete e produto inativo precisam de campos próprios depois."
  }
];

const adminShortcuts = [
  { label: "Produtos", detail: "Preço, imagem e estoque", href: "/admin-loja/produtos" },
  { label: "Pedidos", detail: "Vendas e separação", href: "/admin-loja/pedidos" },
  { label: "Categorias", detail: "Menu e vitrines", href: "/admin-loja/categorias" },
  { label: "Clientes", detail: "Base demonstrativa", href: "/admin-loja/clientes" }
];

export default function StoreAdminPage() {
  const revenue = adminSales.reduce((total, sale) => total + sale.total, 0);
  const profit = adminSales.reduce((total, sale) => total + sale.profit, 0);
  const averageTicket = revenue / adminSales.length;
  const pendingSales = adminSales.filter((sale) => sale.status !== "Entregue").length;
  const lowStockProducts = products.filter((product) => product.stock <= 9);
  const maxTimelineValue = Math.max(...salesTimeline.map((item) => item.value));

  const metrics = [
    { label: "Faturamento", value: formatMoney(revenue), detail: "Pronto para puxar de vendas" },
    { label: "Lucro estimado", value: formatMoney(profit), detail: `${Math.round((profit / revenue) * 100)}% de margem` },
    { label: "Pedidos", value: String(adminSales.length), detail: `${pendingSales} precisam de ação` },
    { label: "Estoque baixo", value: String(lowStockProducts.length), detail: "Baseado em quantidade" }
  ];

  return (
    <div className="owner-page">
      <section className="owner-hero shell">
        <div>
          <p className="eyebrow">Administração</p>
          <h1>Painel do dono</h1>
          <p>Central para controlar catálogo, vendas, estoque e financeiro com base nas funções que o backend já oferece.</p>
        </div>
        <div className="owner-actions">
          <Link className="button" href="/">Ver loja</Link>
          <Link className="button" href="/admin-loja/pedidos">Gerenciar pedidos</Link>
          <Link className="button" href="/admin-loja/categorias">Gerenciar categorias</Link>
          <Link className="button button-primary" href="/admin-loja/produtos">Gerenciar produtos</Link>
        </div>
      </section>

      <section className="owner-command-center shell" aria-label="Atalhos do painel">
        {adminShortcuts.map((shortcut) => (
          <Link className="owner-shortcut" href={shortcut.href} key={shortcut.label}>
            <span>{shortcut.label}</span>
            <strong>{shortcut.detail}</strong>
          </Link>
        ))}
      </section>

      <section className="owner-dashboard shell" aria-label="Resumo da loja">
        <div className="owner-metrics">
          {metrics.map((metric) => (
            <article className="owner-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>

        <div className="owner-grid">
          <article className="owner-panel sales-panel">
            <div className="owner-panel-heading">
              <div>
                <span>Vendas</span>
                <h2>Últimos 7 dias</h2>
              </div>
              <strong>{formatMoney(salesTimeline.reduce((total, item) => total + item.value, 0))}</strong>
            </div>
            <div className="sales-chart" aria-label="Vendas por dia">
              {salesTimeline.map((item) => (
                <div className="sales-bar" key={item.label}>
                  <span style={{ height: `${Math.max(18, (item.value / maxTimelineValue) * 100)}%` }}></span>
                  <strong>{item.label}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="owner-panel">
            <div className="owner-panel-heading">
              <div>
                <span>Produtos</span>
                <h2>Mais fortes</h2>
              </div>
            </div>
            <div className="top-products">
              {topProducts.map((product, index) => (
                <div className="top-product" key={product.name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.sold} unidades vendidas</p>
                  </div>
                  <em>{formatMoney(product.revenue)}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="owner-panel stock-panel">
            <div className="owner-panel-heading">
              <div>
                <span>Estoque</span>
                <h2>Atenção rápida</h2>
              </div>
              <Link className="owner-panel-link" href="/admin-loja/produtos">{lowStockProducts.length} itens</Link>
            </div>
            <div className="stock-list">
              {lowStockProducts.map((product) => (
                <div className="stock-item" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.category}</p>
                  </div>
                  <span>{product.stock} un.</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="owner-backend-map shell" aria-label="Funcionalidades do backend">
        <div className="owner-section-heading">
          <div>
            <span>Backend mapeado</span>
            <h2>O que entra no painel</h2>
          </div>
          <p>Base verificada no Django, DRF e GraphQL. Clientes e status logístico ainda ficam como etapa futura.</p>
        </div>

        <div className="backend-module-grid">
          {backendModules.map((module) => (
            <article className={`backend-module-card is-${module.tone}`} key={module.title}>
              <div className="backend-module-head">
                <div>
                  <span>{module.endpoint}</span>
                  <h3>{module.title}</h3>
                </div>
                <strong>{module.status}</strong>
              </div>
              <p>{module.summary}</p>
              <div className="backend-tags" aria-label={`Recursos de ${module.title}`}>
                {module.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <Link className="owner-panel-link" href={module.href}>Abrir módulo</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="owner-integration shell" aria-label="Plano de integração">
        <div className="owner-section-heading">
          <div>
            <span>Próxima etapa</span>
            <h2>Fila de integração</h2>
          </div>
          <p>Ordem segura para conectar o painel ao backend sem mexer nas regras que já funcionam.</p>
        </div>

        <div className="integration-track">
          {integrationSteps.map((step) => (
            <article className="integration-step" key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="owner-sales shell" aria-label="Lista de vendas">
        <div className="owner-section-heading">
          <div>
            <span>Gestão de pedidos</span>
            <h2>Lista de vendas</h2>
          </div>
          <p>Visual demonstrativo alinhado ao modelo Venda. Status de envio e pagamento ainda não existem no backend.</p>
          <Link className="owner-panel-link" href="/admin-loja/pedidos">Abrir gestão</Link>
        </div>

        <div className="sales-table">
          <div className="sales-table-head">
            <span>Pedido</span>
            <span>Cliente</span>
            <span>Itens</span>
            <span>Status</span>
            <span>Total</span>
          </div>

          {adminSales.map((sale) => (
            <article className="sales-row" key={sale.id}>
              <div>
                <strong>{sale.id}</strong>
                <p>{sale.date} · {sale.channel}</p>
              </div>
              <div>
                <strong>{sale.customer}</strong>
                <p>{sale.payment}</p>
              </div>
              <div>
                <strong>{sale.items}</strong>
                <p>{sale.fulfillment}</p>
              </div>
              <div>
                <span className={`status-pill ${sale.statusClass}`}>{sale.status}</span>
              </div>
              <div className="sales-total">
                <strong>{formatMoney(sale.total)}</strong>
                <p>{formatMoney(sale.profit)} lucro</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
