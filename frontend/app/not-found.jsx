import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page shell">
      <p className="eyebrow">404</p>
      <h1>Essa rota saiu da sessão</h1>
      <p>A página não foi encontrada, mas o drop continua aberto para navegação.</p>
      <div className="not-found-actions">
        <Link className="button button-primary" href="/novidades">Ver novidades</Link>
        <Link className="button" href="/">Voltar para início</Link>
      </div>
    </section>
  );
}
