import Link from "next/link";

const footerLinks = [
  {
    title: "Loja",
    links: [
      ["Novidades", "/novidades"],
      ["Calçados", "/calcados"],
      ["Roupas", "/roupas"],
      ["Acessórios", "/acessorios"],
      ["Outlet", "/outlet"]
    ]
  },
  {
    title: "Atendimento",
    links: [
      ["Minha conta", "/minha-conta"],
      ["Favoritos", "/favoritos"],
      ["Meus pedidos", "/meus-pedidos"],
      ["Trocas e devoluções", "/minha-conta"],
      ["Checkout", "/checkout"]
    ]
  },
  {
    title: "Admin",
    links: [
      ["Painel do dono", "/admin-loja"],
      ["Produtos", "/admin-loja/produtos"],
      ["Pedidos", "/admin-loja/pedidos"],
      ["Clientes", "/admin-loja/clientes"],
      ["Categorias", "/admin-loja/categorias"]
    ]
  }
];

export function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <img src="/images/brand/insonia-logo.png" alt="INSÔNIA" />
          <p>Skatewear escuro, visual editorial e experiência de compra pensada para marcas urbanas.</p>
          <span>INSÔNIA Dark Editorial</span>
        </div>

        {footerLinks.map((group) => (
          <nav className="footer-links" aria-label={group.title} key={group.title}>
            <strong>{group.title}</strong>
            {group.links.map(([label, href]) => (
              <Link href={href} key={`${group.title}-${label}`}>{label}</Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="shell footer-bottom">
        <span>Compra demonstrativa · Pix, cartão e boleto</span>
        <span>Entrega, troca e gestão em uma base flexível</span>
      </div>
    </footer>
  );
}
