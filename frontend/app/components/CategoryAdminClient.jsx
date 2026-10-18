"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { collections, products } from "../lib/store";

const categoryStorageKey = "insoniaAdminCategories";

const emptyCategoryForm = {
  name: "",
  slug: "",
  title: "",
  description: "",
  label: "",
  active: true,
  featured: false,
  menuOrder: 1,
  productIds: []
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

function buildCategories(savedCategories = []) {
  if (savedCategories.length > 0) {
    return savedCategories;
  }

  return Object.entries(collections).map(([slug, collection], index) => ({
    id: slug,
    slug,
    name: collection.kicker,
    title: collection.title,
    description: collection.description,
    label: collection.label,
    active: true,
    featured: slug === "novidades",
    menuOrder: index + 1,
    productIds: products.filter((product) => product.collections.includes(slug)).map((product) => product.id)
  }));
}

export function CategoryAdminClient() {
  const [categories, setCategories] = useState(() => buildCategories());
  const [newCategory, setNewCategory] = useState(emptyCategoryForm);
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    try {
      const savedCategories = JSON.parse(localStorage.getItem(categoryStorageKey)) || [];
      setCategories(buildCategories(savedCategories));
    } catch {
      setCategories(buildCategories());
    }
  }, []);

  const metrics = useMemo(() => {
    const activeCategories = categories.filter((category) => category.active).length;
    const inactiveCategories = categories.length - activeCategories;
    const featuredCategories = categories.filter((category) => category.featured).length;
    const linkedProducts = categories.reduce((total, category) => total + category.productIds.length, 0);

    return [
      { label: "Ativas", value: activeCategories },
      { label: "Inativas", value: inactiveCategories },
      { label: "Destaques", value: featuredCategories },
      { label: "Produtos vinculados", value: linkedProducts }
    ];
  }, [categories]);

  const orderedCategories = [...categories].sort((firstCategory, secondCategory) => firstCategory.menuOrder - secondCategory.menuOrder);

  function updateCategory(categoryId, changes) {
    setCategories((currentCategories) =>
      currentCategories.map((category) => {
        if (category.id !== categoryId) {
          return category;
        }

        const nextCategory = { ...category, ...changes };

        if (changes.name && !changes.slug) {
          nextCategory.slug = slugify(changes.name);
        }

        return nextCategory;
      })
    );
    setSavedAt("");
  }

  function updateNewCategory(changes) {
    setNewCategory((currentCategory) => {
      const nextCategory = { ...currentCategory, ...changes };

      if (changes.name && !currentCategory.slug) {
        nextCategory.slug = slugify(changes.name);
      }

      return nextCategory;
    });
  }

  function toggleProduct(categoryId, productId) {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) {
      return;
    }

    const productIds = category.productIds.includes(productId)
      ? category.productIds.filter((id) => id !== productId)
      : [...category.productIds, productId];

    updateCategory(categoryId, { productIds });
  }

  function handleCreateCategory(event) {
    event.preventDefault();

    const trimmedName = newCategory.name.trim();

    if (!trimmedName) {
      return;
    }

    const slug = newCategory.slug || slugify(trimmedName);

    setCategories((currentCategories) => [
      {
        ...newCategory,
        id: `${slug}-${Date.now()}`,
        slug,
        title: newCategory.title || trimmedName,
        label: newCategory.label || "Seleção da categoria",
        menuOrder: Number(newCategory.menuOrder) || currentCategories.length + 1,
        productIds: []
      },
      ...currentCategories
    ]);
    setNewCategory(emptyCategoryForm);
    setSavedAt("");
  }

  function handleSave() {
    localStorage.setItem(categoryStorageKey, JSON.stringify(categories));
    setSavedAt("Categorias salvas");
  }

  return (
    <div className="owner-page categories-page">
      <section className="owner-hero shell">
        <div>
          <p className="eyebrow">Categorias</p>
          <h1>Vitrines</h1>
          <p>Organize o menu, controle categorias ativas e vincule produtos às páginas da loja.</p>
        </div>
        <div className="owner-actions">
          <Link className="button" href="/admin-loja">Dashboard</Link>
          <button className="button button-primary" type="button" onClick={handleSave}>Salvar categorias</button>
        </div>
      </section>

      <section className="catalog-dashboard shell" aria-label="Resumo de categorias">
        <div className="owner-metrics">
          {metrics.map((metric) => (
            <article className="owner-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>Menu e vitrines</p>
            </article>
          ))}
        </div>

        {savedAt ? <p className="catalog-save-note">{savedAt}</p> : null}
      </section>

      <section className="catalog-create shell" aria-label="Criar categoria">
        <div className="owner-section-heading">
          <div>
            <span>Nova categoria</span>
            <h2>Criar vitrine</h2>
          </div>
          <p>Crie uma nova página de produtos para aparecer no menu.</p>
        </div>

        <form className="category-create-panel" onSubmit={handleCreateCategory}>
          <label className="admin-field">
            Nome
            <input value={newCategory.name} onChange={(event) => updateNewCategory({ name: event.target.value })} placeholder="Ex: Moletons" required />
          </label>
          <label className="admin-field">
            Slug
            <input value={newCategory.slug} onChange={(event) => updateNewCategory({ slug: slugify(event.target.value) })} placeholder="moletons" />
          </label>
          <label className="admin-field">
            Ordem
            <input type="number" min="1" value={newCategory.menuOrder} onChange={(event) => updateNewCategory({ menuOrder: Number(event.target.value) })} />
          </label>
          <label className="admin-field">
            Título
            <input value={newCategory.title} onChange={(event) => updateNewCategory({ title: event.target.value })} placeholder="Título da página" />
          </label>
          <label className="admin-field admin-field-wide">
            Descrição
            <textarea value={newCategory.description} onChange={(event) => updateNewCategory({ description: event.target.value })} placeholder="Descrição curta da categoria" />
          </label>
          <label className="admin-field">
            Etiqueta da grade
            <input value={newCategory.label} onChange={(event) => updateNewCategory({ label: event.target.value })} placeholder="Seleção da categoria" />
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={newCategory.active} onChange={(event) => updateNewCategory({ active: event.target.checked })} />
            Ativa
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={newCategory.featured} onChange={(event) => updateNewCategory({ featured: event.target.checked })} />
            Destaque
          </label>
          <button className="button button-primary" type="submit">Criar categoria</button>
        </form>
      </section>

      <section className="categories-manager shell" aria-label="Gerenciar categorias">
        <div className="owner-section-heading">
          <div>
            <span>Menu da loja</span>
            <h2>Categorias cadastradas</h2>
          </div>
          <p>Edite a ordem, textos e produtos vinculados a cada vitrine.</p>
        </div>

        <div className="category-admin-list">
          {orderedCategories.map((category) => (
            <article className={`category-admin-card${category.active ? "" : " is-inactive"}`} key={category.id}>
              <div className="category-admin-head">
                <div>
                  <span>/{category.slug}</span>
                  <h3>{category.name}</h3>
                  <p>{category.productIds.length} produtos vinculados</p>
                </div>
                <div className="product-status-control">
                  <span className={`status-pill ${category.active ? "is-delivered" : "is-pending"}`}>{category.active ? "Ativa" : "Inativa"}</span>
                  <button className="status-toggle" type="button" onClick={() => updateCategory(category.id, { active: !category.active })}>
                    {category.active ? "Inativar" : "Ativar"}
                  </button>
                </div>
              </div>

              <div className="category-edit-grid">
                <label className="admin-field">
                  Nome
                  <input value={category.name} onChange={(event) => updateCategory(category.id, { name: event.target.value })} />
                </label>
                <label className="admin-field">
                  Slug
                  <input value={category.slug} onChange={(event) => updateCategory(category.id, { slug: slugify(event.target.value) })} />
                </label>
                <label className="admin-field">
                  Ordem
                  <input type="number" min="1" value={category.menuOrder} onChange={(event) => updateCategory(category.id, { menuOrder: Number(event.target.value) })} />
                </label>
                <label className="admin-field">
                  Título
                  <input value={category.title} onChange={(event) => updateCategory(category.id, { title: event.target.value })} />
                </label>
                <label className="admin-field">
                  Etiqueta
                  <input value={category.label} onChange={(event) => updateCategory(category.id, { label: event.target.value })} />
                </label>
                <label className="admin-field admin-field-wide">
                  Descrição
                  <textarea value={category.description} onChange={(event) => updateCategory(category.id, { description: event.target.value })} />
                </label>
                <label className="admin-check">
                  <input type="checkbox" checked={category.featured} onChange={(event) => updateCategory(category.id, { featured: event.target.checked })} />
                  Destaque
                </label>
              </div>

              <div className="category-product-picker">
                <span>Produtos da categoria</span>
                <div>
                  {products.map((product) => (
                    <label key={`${category.id}-${product.id}`}>
                      <input
                        type="checkbox"
                        checked={category.productIds.includes(product.id)}
                        onChange={() => toggleProduct(category.id, product.id)}
                      />
                      {product.name}
                    </label>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
