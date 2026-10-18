import Link from "next/link";
import { ProductGrid } from "./components/ProductGrid";
import { featuredProducts } from "./lib/store";

const collectionTiles = [
  {
    title: "Roupas",
    href: "/roupas",
    kicker: "Silhueta slim",
    description: "Jaquetas, camisetas e cargos em tons fechados."
  },
  {
    title: "Calçados",
    href: "/calcados",
    kicker: "Base de skate",
    description: "Tênis baixos e médios para rotina urbana."
  },
  {
    title: "Acessórios",
    href: "/acessorios",
    kicker: "Detalhes úteis",
    description: "Bolsas e bonés para completar o look."
  }
];

const lookbookItems = [
  ["01", "Noite urbana", "Jaqueta Line + Calça Slim Cargo + Tênis Asfalto Low"],
  ["02", "Sessão tardia", "Camiseta Eye + Shoulder Bag Noite + Boné Panel Eye"],
  ["03", "Drop completo", "Overshirt Grafite com peças tonais e acessórios discretos"]
];

const shoppingRoutes = [
  {
    title: "Look completo",
    href: "/novidades",
    kicker: "Drop novo",
    description: "Peças que já combinam entre si para sair com o visual fechado.",
    accent: "01"
  },
  {
    title: "Base de skate",
    href: "/calcados",
    kicker: "Calçados",
    description: "Tênis de sola reta e presença urbana para usar todo dia.",
    accent: "02"
  },
  {
    title: "Primeira peça",
    href: "/roupas",
    kicker: "Roupas",
    description: "Camisetas, jaquetas e cargos para entrar na estética INSÔNIA.",
    accent: "03"
  },
  {
    title: "Preço de saída",
    href: "/outlet",
    kicker: "Outlet",
    description: "Últimas peças com cara premium e compra mais direta.",
    accent: "04"
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero home-hero" id="novidades">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Drop 01 · skatewear noturno</p>
            <h1 className="hero-title">
              <span>Roupa de rua</span>
              <span>para noites longas</span>
            </h1>
            <p className="hero-subtitle">Jaquetas, cargos, camisetas e acessórios em uma vitrine escura, slim e urbana.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/novidades">Ver coleção</Link>
              <Link className="button" href="/roupas">Montar look</Link>
            </div>
          </div>

          <div className="hero-commerce-strip" aria-label="Resumo da coleção">
            <span>Drop 01</span>
            <strong>8 peças essenciais</strong>
            <span>Preto · grafite · vinho</span>
          </div>
        </div>
      </section>

      <section className="home-categories shell" aria-label="Categorias principais">
        {collectionTiles.map((tile) => (
          <Link className="collection-tile" href={tile.href} key={tile.title}>
            <span>{tile.kicker}</span>
            <strong>{tile.title}</strong>
            <p>{tile.description}</p>
          </Link>
        ))}
      </section>

      <section className="shopping-routes shell" aria-label="Caminhos de compra">
        <div className="section-heading">
          <h2>Escolha sua rota</h2>
          <span className="rule"></span>
          <Link href="/novidades">Começar pelo drop</Link>
        </div>
        <div className="route-grid">
          {shoppingRoutes.map((route) => (
            <Link className="route-card" href={route.href} key={route.title}>
              <span>{route.kicker}</span>
              <strong>{route.title}</strong>
              <p>{route.description}</p>
              <em>{route.accent}</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell" id="skatewear">
        <div className="section-heading">
          <h2>Drop em destaque</h2>
          <span className="rule"></span>
          <Link href="/novidades">Ver todos</Link>
        </div>

        <ProductGrid products={featuredProducts} />

        <div className="benefits" aria-label="Benefícios da loja">
          <div className="benefit">
            <strong>Frete para todo o Brasil</strong>
            <span>Envio calculado no fechamento do pedido.</span>
          </div>
          <div className="benefit">
            <strong>Até 6x sem juros</strong>
            <span>Compra demonstrativa com fluxo seguro.</span>
          </div>
          <div className="benefit">
            <strong>Compra segura</strong>
            <span>Experiência preparada para e-commerce premium.</span>
          </div>
          <div className="benefit">
            <strong>Troca fácil</strong>
            <span>Política clara para lojas futuras.</span>
          </div>
        </div>
      </section>

      <section className="lookbook-section shell" aria-label="Lookbook INSÔNIA">
        <div className="lookbook-lead">
          <p className="eyebrow">Lookbook</p>
          <h2>Peças combinadas para vender o visual completo.</h2>
          <p>Uma home com mais contexto ajuda o cliente a entender como usar cada produto e aumenta o valor percebido do carrinho.</p>
          <Link className="button" href="/novidades">Explorar drop</Link>
        </div>

        <div className="lookbook-list">
          {lookbookItems.map(([number, title, description]) => (
            <article className="lookbook-item" key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="drop-banner shell" id="colecao">
        <div className="banner-inner">
          <h2>Noites longas, mesma visão.</h2>
          <p>Uma vitrine demonstrativa com identidade forte para apresentar lojas urbanas de forma moderna.</p>
        </div>
      </section>
    </>
  );
}
