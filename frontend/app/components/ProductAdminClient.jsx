"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "../lib/store";

const moneyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const productStorageKey = "insoniaAdminProducts";
const categoryOptions = ["Roupas", "Calçados", "Acessórios", "Outlet"];

const emptyProductForm = {
  name: "",
  category: "Roupas",
  description: "",
  price: "",
  stock: "",
  sizesText: "",
  active: true,
  imagePreview: "",
  fileName: ""
};

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeProduct(product) {
  return {
    id: product.id,
    slug: product.slug || slugify(product.name),
    name: product.name,
    category: product.category,
    categorySlug: product.categorySlug || slugify(product.category),
    description: product.description || "",
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    sizesText: Array.isArray(product.sizes) ? product.sizes.join(", ") : product.sizesText || "",
    active: product.active ?? true,
    imagePreview: product.imagePreview || product.image || "",
    fileName: product.fileName || ""
  };
}

function buildProductRows(savedRows = []) {
  if (savedRows.length > 0) {
    return savedRows.map(normalizeProduct);
  }

  return products.map((product) => normalizeProduct({ ...product, active: true }));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ProductAdminClient() {
  const [productRows, setProductRows] = useState(() => buildProductRows());
  const [newProduct, setNewProduct] = useState(emptyProductForm);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    try {
      const savedRows = JSON.parse(localStorage.getItem(productStorageKey)) || [];
      setProductRows(buildProductRows(savedRows));
    } catch {
      setProductRows(buildProductRows());
    }
  }, []);

  const metrics = useMemo(() => {
    const activeProducts = productRows.filter((product) => product.active).length;
    const inactiveProducts = productRows.length - activeProducts;
    const lowStock = productRows.filter((product) => product.stock <= 8).length;
    const inventoryValue = productRows.reduce((total, product) => total + product.price * product.stock, 0);

    return [
      { label: "Ativos", value: activeProducts },
      { label: "Inativos", value: inactiveProducts },
      { label: "Estoque baixo", value: lowStock },
      { label: "Valor em estoque", value: moneyFormatter.format(inventoryValue) }
    ];
  }, [productRows]);

  function updateProduct(productId, changes) {
    setProductRows((currentRows) =>
      currentRows.map((product) => {
        if (product.id !== productId) {
          return product;
        }

        const nextProduct = { ...product, ...changes };

        if (changes.name) {
          nextProduct.slug = slugify(changes.name);
        }

        if (changes.category) {
          nextProduct.categorySlug = slugify(changes.category);
        }

        return nextProduct;
      })
    );
    setSavedAt("");
  }

  function updateNewProduct(changes) {
    setNewProduct((currentProduct) => ({ ...currentProduct, ...changes }));
  }

  async function handleImageChange(productId, file) {
    if (!file) {
      return;
    }

    const imagePreview = await readFileAsDataUrl(file);

    updateProduct(productId, {
      imagePreview,
      fileName: file.name
    });
  }

  async function handleNewProductImage(file) {
    if (!file) {
      return;
    }

    const imagePreview = await readFileAsDataUrl(file);
    updateNewProduct({ imagePreview, fileName: file.name });
  }

  function handleCreateProduct(event) {
    event.preventDefault();

    const trimmedName = newProduct.name.trim();

    if (!trimmedName) {
      return;
    }

    const id = `${slugify(trimmedName)}-${Date.now()}`;
    const createdProduct = normalizeProduct({
      ...newProduct,
      id,
      slug: slugify(trimmedName),
      categorySlug: slugify(newProduct.category),
      price: Number(newProduct.price) || 0,
      stock: Number(newProduct.stock) || 0
    });

    setProductRows((currentRows) => [createdProduct, ...currentRows]);
    setNewProduct(emptyProductForm);
    setSavedAt("");
  }

  function handleSave() {
    localStorage.setItem(productStorageKey, JSON.stringify(productRows));
    setSavedAt("Catálogo salvo");
  }

  return (
    <div className="owner-page catalog-page">
      <section className="owner-hero shell">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h1>Produtos</h1>
          <p>Crie produtos, edite informações principais e controle disponibilidade.</p>
        </div>
        <div className="owner-actions">
          <Link className="button" href="/admin-loja">Dashboard</Link>
          <button className="button button-primary" type="button" onClick={handleSave}>Salvar catálogo</button>
        </div>
      </section>

      <section className="catalog-dashboard shell" aria-label="Resumo dos produtos">
        <div className="owner-metrics">
          {metrics.map((metric) => (
            <article className="owner-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.label === "Valor em estoque" ? "Preço atual x estoque" : "Catálogo INSÔNIA"}</p>
            </article>
          ))}
        </div>

        {savedAt ? <p className="catalog-save-note">{savedAt}</p> : null}
      </section>

      <section className="catalog-create shell" aria-label="Criar produto">
        <div className="owner-section-heading">
          <div>
            <span>Novo produto</span>
            <h2>Cadastrar peça</h2>
          </div>
          <p>Adicione uma nova peça ao catálogo do vendedor.</p>
        </div>

        <form className="product-create-panel" onSubmit={handleCreateProduct}>
          <div className="product-create-preview">
            {newProduct.imagePreview ? (
              <img src={newProduct.imagePreview} alt={newProduct.name || "Novo produto"} />
            ) : (
              <span className="fallback-art" aria-hidden="true"></span>
            )}
            <label className="image-upload-button">
              Imagem
              <input type="file" accept="image/*" onChange={(event) => handleNewProductImage(event.target.files?.[0])} />
            </label>
          </div>

          <div className="product-create-fields">
            <label className="admin-field">
              Nome
              <input value={newProduct.name} onChange={(event) => updateNewProduct({ name: event.target.value })} placeholder="Ex: Moletom Night" required />
            </label>
            <label className="admin-field">
              Categoria
              <select value={newProduct.category} onChange={(event) => updateNewProduct({ category: event.target.value })}>
                {categoryOptions.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              Preço
              <input type="number" min="0" step="0.01" value={newProduct.price} onChange={(event) => updateNewProduct({ price: event.target.value })} placeholder="0,00" />
            </label>
            <label className="admin-field">
              Estoque
              <input type="number" min="0" step="1" value={newProduct.stock} onChange={(event) => updateNewProduct({ stock: event.target.value })} placeholder="0" />
            </label>
            <label className="admin-field">
              Tamanhos
              <input value={newProduct.sizesText} onChange={(event) => updateNewProduct({ sizesText: event.target.value })} placeholder="P, M, G, GG" />
            </label>
            <label className="admin-field admin-field-wide">
              Descrição
              <textarea value={newProduct.description} onChange={(event) => updateNewProduct({ description: event.target.value })} placeholder="Descrição curta do produto" />
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={newProduct.active} onChange={(event) => updateNewProduct({ active: event.target.checked })} />
              Produto ativo
            </label>
            <button className="button button-primary" type="submit">Criar produto</button>
          </div>
        </form>
      </section>

      <section className="catalog-manager shell" aria-label="Gerenciar produtos">
        <div className="owner-section-heading">
          <div>
            <span>Gestão do vendedor</span>
            <h2>Editar produtos</h2>
          </div>
          <p>Imagem, nome, descrição, categoria, preço, estoque, tamanhos e disponibilidade.</p>
        </div>

        <div className="product-admin-list">
          {productRows.map((product) => (
            <article className={`product-admin-card${product.active ? "" : " is-inactive"}`} key={product.id}>
              <div className="product-admin-preview">
                {product.imagePreview ? (
                  <img src={product.imagePreview} alt={product.name} />
                ) : (
                  <span className="fallback-art" aria-hidden="true"></span>
                )}
                <label className="image-upload-button">
                  Trocar imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(product.id, event.target.files?.[0])}
                  />
                </label>
              </div>

              <div className="product-admin-editor">
                <div className="product-admin-title">
                  <div>
                    <span>{product.category}</span>
                    <strong>{product.name || "Produto sem nome"}</strong>
                    <p>{product.fileName || product.slug}</p>
                  </div>
                  <div className="product-status-control">
                    <span className={`status-pill ${product.active ? "is-delivered" : "is-pending"}`}>
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
                    <button
                      className="status-toggle"
                      type="button"
                      aria-pressed={product.active}
                      onClick={() => updateProduct(product.id, { active: !product.active })}
                    >
                      {product.active ? "Inativar" : "Ativar"}
                    </button>
                  </div>
                </div>

                <div className="product-edit-grid">
                  <label className="admin-field">
                    Nome
                    <input value={product.name} onChange={(event) => updateProduct(product.id, { name: event.target.value })} />
                  </label>
                  <label className="admin-field">
                    Categoria
                    <select value={product.category} onChange={(event) => updateProduct(product.id, { category: event.target.value })}>
                      {categoryOptions.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="admin-field">
                    Preço
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(event) => updateProduct(product.id, { price: Number(event.target.value) })}
                    />
                    <span>{moneyFormatter.format(product.price || 0)}</span>
                  </label>
                  <label className="admin-field">
                    Estoque
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={product.stock}
                      onChange={(event) => updateProduct(product.id, { stock: Number(event.target.value) })}
                    />
                    <span>{product.stock <= 8 ? "Baixo" : "Disponível"}</span>
                  </label>
                  <label className="admin-field">
                    Tamanhos
                    <input value={product.sizesText} onChange={(event) => updateProduct(product.id, { sizesText: event.target.value })} />
                  </label>
                  <label className="admin-field admin-field-wide">
                    Descrição
                    <textarea value={product.description} onChange={(event) => updateProduct(product.id, { description: event.target.value })} />
                  </label>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
