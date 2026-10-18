"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { ThemeToggle } from "./ThemeToggle";
import { useWishlist } from "./WishlistProvider";
import { products } from "../lib/store";

const navItems = [
  ["Novidades", "/novidades"],
  ["Calçados", "/calcados"],
  ["Roupas", "/roupas"],
  ["Acessórios", "/acessorios"],
  ["Outlet", "/outlet"]
];

const mobileQuickLinks = [
  ["Favoritos", "/favoritos"],
  ["Minha conta", "/minha-conta"],
  ["Meus pedidos", "/meus-pedidos"],
  ["Área do dono", "/admin-loja"]
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, openCart, addItem } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountActive = pathname === "/minha-conta" || pathname === "/cadastro" || pathname.startsWith("/meus-pedidos");
  const favoritesActive = pathname === "/favoritos";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileMenuOpen);

    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileMenuOpen]);

  const searchResults = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return [];
    }

    return products
      .filter((product) =>
        [product.name, product.category, product.description, product.color, product.fit]
          .join(" ")
          .toLowerCase()
          .includes(normalizedTerm)
      )
      .slice(0, 4);
  }, [searchTerm]);

  const suggestedProducts = useMemo(() => products.filter((product) => product.featured).slice(0, 3), []);
  const showSearchPanel = searchFocused;

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (searchResults[0]) {
      router.push(`/produto/${searchResults[0].slug}`);
      setSearchTerm("");
      setSearchFocused(false);
    }
  }

  function handleSearchQuickAdd(product) {
    const firstSize = product.sizes?.[0] || "Unico";

    addItem({
      ...product,
      id: `${product.id}-${firstSize}`,
      variantLabel: `Tamanho ${firstSize}`
    });
    setSearchTerm("");
    setSearchFocused(false);
  }

  return (
    <header className="site-header">
      <div className="shell header-top">
        <span>Drop 01 disponível</span>
        <div className="header-top-links">
          <span>Skatewear premium para noites longas</span>
          <Link href="/admin-loja">Área do dono</Link>
        </div>
      </div>

      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="INSÔNIA">
          <img src="/images/brand/insonia-logo.png" alt="INSÔNIA" />
        </Link>

        <nav className="nav" aria-label="Navegação principal">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "is-active" : undefined}>
              {label}
            </Link>
          ))}
        </nav>

        <form className="header-search" role="search" onSubmit={handleSearchSubmit}>
          <label htmlFor="store-search">Buscar produto</label>
          <div className="header-search-field">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8"></circle>
              <path d="m16.2 16.2 4 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
            </svg>
            <input
              id="store-search"
              type="search"
              value={searchTerm}
              placeholder="Buscar"
              autoComplete="off"
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => window.setTimeout(() => setSearchFocused(false), 140)}
            />
            {searchTerm ? (
              <button className="search-clear" type="button" aria-label="Limpar busca" onClick={() => setSearchTerm("")}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
                </svg>
              </button>
            ) : null}
          </div>

          {showSearchPanel ? (
            <div className="header-search-results">
              {searchTerm.trim() ? (
                <>
                  <div className="search-panel-heading">
                    <span>Resultado</span>
                    <strong>{searchResults.length} item(ns)</strong>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="search-result-list">
                      {searchResults.map((product) => (
                        <article className="search-result-item" key={product.id}>
                          <Link className="search-result-link" href={`/produto/${product.slug}`} onClick={() => setSearchTerm("")}>
                            <span className="search-thumb" aria-hidden="true">
                              {product.image ? <img src={product.image} alt="" /> : product.name.slice(0, 2)}
                            </span>
                            <span className="search-result-copy">
                              <em>{product.category}</em>
                              <strong>{product.name}</strong>
                              <small>{product.priceLabel}</small>
                            </span>
                          </Link>
                          <button type="button" onClick={() => handleSearchQuickAdd(product)}>Comprar</button>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="search-empty">
                      <strong>Nenhum produto encontrado.</strong>
                      <p>Tente buscar por categoria, tamanho, cor ou nome da peça.</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="search-panel-heading">
                    <span>Busca rápida</span>
                    <strong>Mais vistos</strong>
                  </div>
                  <div className="search-suggestions">
                    {suggestedProducts.map((product) => (
                      <Link key={product.id} href={`/produto/${product.slug}`} onClick={() => setSearchTerm("")}>
                        {product.name}
                      </Link>
                    ))}
                  </div>
                  <div className="search-category-row">
                    {navItems.slice(0, 4).map(([label, href]) => (
                      <Link key={href} href={href} onClick={() => setSearchTerm("")}>{label}</Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : null}
        </form>

        <div className="header-actions">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Abrir menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
            </svg>
          </button>
          <ThemeToggle />
          <Link className={`icon-button header-icon-link${favoritesActive ? " is-active" : ""}`} href="/favoritos" aria-label="Favoritos">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20.2S4.6 15.8 3.3 10.4C2.5 7.2 4.3 4.8 7.1 4.4c1.7-.2 3.3.6 4.1 2 1-1.5 2.5-2.2 4.3-2 2.8.4 4.5 2.8 3.8 6-1.3 5.4-8.3 9.8-8.3 9.8Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7"></path>
            </svg>
            <strong className="cart-count" hidden={wishlistCount === 0}>{wishlistCount}</strong>
          </Link>
          <Link className={`icon-button header-icon-link account-link${accountActive ? " is-active" : ""}`} href="/minha-conta" aria-label="Minha conta">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.7"></circle>
              <path d="M4.8 20a7.4 7.4 0 0 1 14.4 0" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7"></path>
            </svg>
          </Link>
          <button className="cart-link" type="button" onClick={openCart} aria-controls="cart-drawer" aria-expanded={count > 0}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 8h12l-1.2 8.3a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 4H3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7"></path>
              <circle cx="9" cy="21" r="1" fill="currentColor"></circle>
              <circle cx="17" cy="21" r="1" fill="currentColor"></circle>
            </svg>
            <span>Carrinho</span>
            <strong className="cart-count" hidden={count === 0}>{count}</strong>
          </button>
        </div>
      </div>

      <div className={`mobile-menu-shell${mobileMenuOpen ? " is-open" : ""}`} id="mobile-menu" aria-hidden={!mobileMenuOpen}>
        <button className="mobile-menu-backdrop" type="button" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)}></button>
        <aside className="mobile-menu-panel" aria-label="Menu mobile">
          <div className="mobile-menu-head">
            <div>
              <span>INSÔNIA</span>
              <strong>Menu</strong>
            </div>
            <button className="cart-close-button" type="button" aria-label="Fechar menu" onClick={() => setMobileMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
              </svg>
            </button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Categorias">
            <span>Categorias</span>
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className={pathname === href ? "is-active" : undefined}>
                {label}
              </Link>
            ))}
          </nav>

          <nav className="mobile-menu-links" aria-label="Acesso rápido">
            <span>Acesso rápido</span>
            {mobileQuickLinks.map(([label, href]) => (
              <Link key={href} href={href} className={pathname === href ? "is-active" : undefined}>
                {label}
              </Link>
            ))}
          </nav>

          <button
            className="button button-primary mobile-cart-button"
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openCart();
            }}
          >
            Abrir carrinho {count > 0 ? `(${count})` : ""}
          </button>
        </aside>
      </div>
    </header>
  );
}
