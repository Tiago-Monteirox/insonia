"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "./ProductGrid";

const priceRanges = [
  { label: "Todos", value: "all" },
  { label: "Até R$ 200", value: "under-200" },
  { label: "R$ 200 a R$ 350", value: "200-350" },
  { label: "Acima de R$ 350", value: "over-350" }
];

function matchesPrice(product, priceRange) {
  if (priceRange === "under-200") {
    return product.price < 200;
  }

  if (priceRange === "200-350") {
    return product.price >= 200 && product.price <= 350;
  }

  if (priceRange === "over-350") {
    return product.price > 350;
  }

  return true;
}

export function ProductCollectionClient({ products, label }) {
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const sizes = useMemo(() => {
    const allSizes = products.flatMap((product) => product.sizes);
    return ["all", ...Array.from(new Set(allSizes))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return [...products]
      .filter((product) => selectedSize === "all" || product.sizes.includes(selectedSize))
      .filter((product) => matchesPrice(product, selectedPrice))
      .filter((product) => !inStockOnly || product.stock > 0)
      .sort((firstProduct, secondProduct) => {
        if (sortBy === "price-low") {
          return firstProduct.price - secondProduct.price;
        }

        if (sortBy === "price-high") {
          return secondProduct.price - firstProduct.price;
        }

        if (sortBy === "stock") {
          return secondProduct.stock - firstProduct.stock;
        }

        return 0;
      });
  }, [inStockOnly, products, selectedPrice, selectedSize, sortBy]);

  function clearFilters() {
    setSelectedSize("all");
    setSelectedPrice("all");
    setInStockOnly(false);
    setSortBy("featured");
  }

  return (
    <section className="collection-grid-section shell" aria-label={label}>
      <div className="collection-toolbar">
        <span>{label}</span>
        <span>{filteredProducts.length} produto(s)</span>
      </div>

      <div className="collection-controls" aria-label="Filtros de produtos">
        <label>
          Tamanho
          <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>
            {sizes.map((size) => (
              <option value={size} key={size}>
                {size === "all" ? "Todos" : size}
              </option>
            ))}
          </select>
        </label>

        <label>
          Preço
          <select value={selectedPrice} onChange={(event) => setSelectedPrice(event.target.value)}>
            {priceRanges.map((range) => (
              <option value={range.value} key={range.value}>{range.label}</option>
            ))}
          </select>
        </label>

        <label>
          Ordenar
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="featured">Destaques</option>
            <option value="price-low">Menor preço</option>
            <option value="price-high">Maior preço</option>
            <option value="stock">Mais estoque</option>
          </select>
        </label>

        <label className="filter-check">
          <input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
          Disponíveis
        </label>

        <button className="filter-clear" type="button" onClick={clearFilters}>Limpar</button>
      </div>

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="empty-results">
          <strong>Nenhum produto encontrado.</strong>
          <p>Limpe os filtros ou tente outra combinação de tamanho e preço.</p>
        </div>
      )}
    </section>
  );
}
