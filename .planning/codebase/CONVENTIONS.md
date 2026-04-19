# Coding Conventions

**Analysis Date:** 2026-04-18

This project is a Django 4.2 backend with two data apps (`lojapp`, `pdv`) and a `user` stub. It exposes both a REST API (DRF) and a GraphQL API (graphene-django). Conventions are largely implicit — no linter config exists. Portuguese is used throughout for domain naming (model fields, verbose names, admin labels), while Python identifiers follow Django/PEP8 conventions.

---

## Naming Patterns

**Models:**
- Class names are PascalCase Portuguese nouns: `Produto`, `Categoria`, `Marca`, `Venda`, `ItemVenda`, `NomeVariacao`, `ValorVariacao`, `Variacao`
- Field names are `snake_case` Portuguese: `preco_venda`, `preco_custo`, `data_venda`, `valor_total`, `lucro_total`
- Primary string field is consistently named `name` (English), not `nome` — even though all other domain language is Portuguese
- Slug fields are named `slug`, always `blank=True, null=True`, auto-populated in `save()`
- `related_name` is pluralized Portuguese: `imagens`, `variacoes`, `itens`, `valores`

**Views (ViewSets):**
- Named `<Model>ViewSet`: `ProdutoViewSet`, `VendaViewSet`, `ItemVendaViewSet`
- All views are class-based `ModelViewSet` subclasses; no function-based views in active use (commented-out FBV code exists in `lojapp/views.py`)

**URLs:**
- REST endpoints registered via `DefaultRouter` in `api/urls.py`
- URL segments are kebab-case Portuguese: `itens-venda`, `nome-variacao`, `valor-variacao`, `produtos-imagem`
- GraphQL exposed at `/graphql/` (single endpoint, csrf_exempt)
- Admin mounted at `/admin/` with a custom `MyAdminSite` instance that replaces `admin.site`

**Serializers:**
- Named `<Model>Serializer` for read, `<Model>CreateUpdateSerializer` for write
- `ProdutoSerializer` exists in both `lojapp/serializers.py` and `pdv/serializers.py` (two separate definitions — the `pdv` one is a minimal local copy to avoid circular imports)

**GraphQL Types:**
- Named `<Model>Type` for `DjangoObjectType` subclasses: `ProdutoType`, `VendaType`, `ItemVendaType`
- Input types named `<Action><Model>Input`: `CriarVendaInput`, `ItemVendaInput`
- Mutation classes named in PascalCase Portuguese verb phrases: `CriarVenda`, `CriarItemVenda`, `RemoverItemVenda`, `RemoverVenda`
- Query field names are Portuguese snake_case: `todos_produtos`, `todas_categorias`, `vendas_por_id`, `total_vendas`

**Files:**
- One `models.py`, `views.py`, `serializers.py`, `schema.py`, `admin.py` per app — flat, no sub-modules within apps
- Test files follow `test_<subject>.py` naming under `lojapp/tests/tests_models/`
- Migrations use auto-generated Django sequential naming: `0001_initial.py`, `0002_...`

---

## Code Style

**Formatting:**
- No `.editorconfig`, `.prettierrc`, or `pyproject.toml` present
- No `flake8`, `black`, `ruff`, or `isort` configuration found
- Style is informal PEP8; some files have inconsistent spacing (e.g. `pdv/admin.py` uses both `=` with and without spaces around `=` in function calls)

**Linting:**
- No linter configured — style is entirely by convention and review

**Comments:**
- Portuguese inline comments throughout: `# Utilitário para verificar estoque`, `# Atualiza os totais da venda associada`
- Docstrings used selectively in `pdv/models.py` and `pdv/views.py` (ModelViewSet methods), absent in `lojapp`
- Dead/commented-out code left in place: several view functions and import statements commented out in `lojapp/views.py` and `pdv/models.py`

---

## Model Design Patterns

**`save()` overrides:**
- Used heavily to auto-populate slugs (`Categoria`, `Marca`), run `full_clean()` before saving (`Produto`, `Variacao`, `ItemVenda`), and recalculate computed fields (`Venda.calcular_totais()`)
- Pattern: call `full_clean()` then `super().save()`, or call `super().save()` first when a PK is needed before side effects

**`clean()` and `clean_precos()`:**
- Business validation (negative prices, promo price must be less than regular price, stock checks) goes in `clean()` methods on models
- `Produto` has a separate `clean_precos()` method that normalizes `Money` and string inputs to `Decimal` before validation — called explicitly from `save()`

**Money fields:**
- All monetary values use `djmoney.models.fields.MoneyField` with `default_currency='BRL'`
- Computed money results (totals, subtotals) use `moneyed.Money` arithmetic and Python `sum()` with a `Money(0, 'BRL')` identity start

**`Meta` class:**
- Always present on models with at least `verbose_name` / `verbose_name_plural` in Portuguese
- `ordering` defined on models that are listed frequently: `Categoria`, `Marca`, `Venda`, `ItemVenda`
- `unique_together` used on `ValorVariacao` and `Variacao`

---

## Serializer Patterns

- Read serializers (`ProdutoSerializer`) nest related objects using their own serializers (e.g. `categoria = CategoriaSerializer()`)
- Write serializers (`ProdutoCreateUpdateSerializer`) accept FK IDs directly, not nested objects
- `ProdutoViewSet.get_serializer_class()` switches between read and write serializers based on `self.action`
- `validate()` methods on serializers duplicate some model-level validation (negative price checks appear in both `Produto.clean()` and `ProdutoSerializer.validate()`)
- `read_only_fields` used on `VendaSerializer` for computed fields: `['usuario', 'data_venda', 'valor_total', 'lucro_total']`
- `subtotal` and `lucro` are model `@property` fields exposed as `read_only_fields` in `ItemVendaSerializer`

---

## GraphQL Organization

**Schema structure:**
- Each app has its own `schema.py` with a local `Query` and (for `pdv`) `Mutation` class
- `core/schema.py` composes the root schema by inheriting from all app-level `Query` classes and app-level `Mutation` classes
- `lojapp/schema.py` also defines a standalone `schema = graphene.Schema(query=Query)` at module level (unused — the active schema is in `core/schema.py`)

**Type naming:**
- `DjangoObjectType` subclasses all named `<Model>Type`
- Custom scalar `MoneyType` defined in `lojapp/schema.py` but not reused in `pdv/schema.py` — `pdv` defines its own `MoneyObjectType` (a plain `graphene.ObjectType`) separately, as does `lojapp`; `MoneyObjectType` is duplicated across both schema files

**Resolver naming:**
- `resolve_<fieldName>` pattern, with camelCase field names matching the GraphQL schema: `resolve_precoVenda`, `resolve_valorTotal`, `resolve_dataVenda`
- DB fields use `snake_case`; GraphQL-exposed aliases use `camelCase` (e.g. `data_venda` → `dataVenda`, `valor_total` → `valorTotal`)

**Mutations:**
- Defined as top-level classes with inner `Arguments` class
- Return the created/modified object or success flags and error messages
- Complex mutations (`CriarVenda`) handle stock validation inline via `verificar_estoque()` utility function defined at module top level

---

## Admin Registration Patterns

- `lojapp/admin.py`: registers `ModelAdmin` subclasses using `admin.site.register()` — but several registrations are commented out (`NomeVariacao`, `ValorVariacao`)
- `pdv/admin.py`: defines a custom `MyAdminSite` that replaces the global `admin.site` at the bottom of the file with `admin.site = admin_site`; all models (including lojapp models) are registered on this custom site
- Inline classes named `<Model>Inline`, always `TabularInline`
- `list_display`, `list_editable`, `search_fields` defined on all non-trivial `ModelAdmin` subclasses
- Custom admin actions use Portuguese `short_description`: `"Mostrar valor total das vendas"`
- Custom URL added to `VendaAdmin` for a `/admin/pdv/venda/estatisticas/` statistics view rendering `admin/estatisticas.html`

---

## Migration Practices

- Migrations are auto-generated with `makemigrations` and committed; no custom migration operations detected
- `lojapp` has 24 migrations (heavy iteration — schema evolved significantly post-initial)
- `pdv` has 4 migrations (newer, more stable)
- No squash migrations present
- Migration filenames reflect the change made: `0005_remove_produto_imagem_produtoimagem.py`, `0009_rename_nome_variacao_name_and_more.py`

---

## Import Organization

**Order observed:**
1. Standard library (`os`, `decimal`)
2. Django (`django.db.models`, `django.contrib.admin`, etc.)
3. Third-party (`rest_framework`, `graphene`, `djmoney`, `graphene_django`)
4. Local app imports (`from .models import ...`, `from lojapp.models import ...`)

**Notable:**
- `pdv/serializers.py` imports `Produto` from its own local models file (`from .models import Produto`) to avoid circular imports with `lojapp`
- `pdv/admin.py` uses `from lojapp.models import *` (wildcard import) — the only wildcard import in the project
- `conftest.py` manually calls `django.setup()` rather than relying on `pytest-django`'s `DJANGO_SETTINGS_MODULE` integration

---

*Convention analysis: 2026-04-18*
