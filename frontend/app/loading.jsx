export default function Loading() {
  return (
    <section className="loading-page shell" aria-label="Carregando">
      <div className="loading-copy">
        <p className="eyebrow">INSÔNIA</p>
        <h1>Carregando drop</h1>
        <p>Preparando produtos, carrinho e vitrine.</p>
      </div>
      <div className="loading-grid" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  );
}
