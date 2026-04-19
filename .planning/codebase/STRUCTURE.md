# Codebase Structure

**Analysis Date:** 2026-04-18

## Directory Layout

```
insonia/                         # Project root
├── manage.py                    # Django management entry point
├── conftest.py                  # Pytest global fixtures
├── pytest.ini                   # Pytest configuration
├── requirements2.txt            # Python dependencies
├── db.sqlite3                   # SQLite database (development)
├── backup_file.sql              # Manual DB backup
│
├── insonia/                     # Django project package (settings, urls, wsgi)
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   ├── asgi.py
│   └── utils/
│       └── utils.py
│
├── core/                        # GraphQL schema aggregation (not a Django app)
│   └── schema.py                # Root Query + Mutation combining all app schemas
│
├── api/                         # REST API URL router (not a Django app)
│   └── urls.py                  # Registers all ViewSets from lojapp + pdv
│
├── lojapp/                      # Django app: product catalog
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── schema.py                # GraphQL types and queries for catalog
│   ├── urls.py                  # Legacy template-based urls (unused)
│   ├── admin.py
│   ├── apps.py
│   ├── import_data.py           # Data import helper
│   ├── management/
│   │   └── commands/
│   │       └── removerduplicatas.py
│   ├── migrations/
│   └── tests/
│       └── tests_models/
│           ├── test_categoria_slug.py
│           └── test_marca_slug.py
│
├── pdv/                         # Django app: point-of-sale
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── schema.py                # GraphQL types, queries, mutations for sales
│   ├── urls.py                  # DRF router for ItemVendaViewSet (legacy, unused in favour of api/)
│   ├── admin.py                 # Custom AdminSite replacing default admin.site
│   ├── forms.py                 # DateRangeForm for admin statistics view
│   ├── apps.py
│   ├── migrations/
│   └── tests.py
│
├── user/                        # Django app: placeholder for user profiles
│   ├── models.py                # Empty — no models defined
│   ├── views.py
│   ├── urls.py                  # Not included in any urlconf
│   ├── admin.py
│   ├── apps.py
│   └── tests.py
│
├── scripts/
│   ├── import_data.py
│   └── update_names.py
│
├── templates/                   # Django HTML templates
│   └── admin/
│       └── estatisticas.html    # Custom admin statistics page (pdv)
│
├── static/                      # Source static files
│   └── files/
├── staticfiles/                 # Collected static files (collectstatic output)
├── media/                       # User-uploaded files
│   └── produto_imagens/         # Product images (date-partitioned: YYYY/MM/)
└── .planning/
    └── codebase/                # Architecture and planning documents
```

## Directory Purposes

**`insonia/` (project package):**
- Purpose: Django project configuration and root URL dispatch
- Contains: `settings.py`, `urls.py`, `wsgi.py`, `asgi.py`, a `utils/` sub-package
- Key files: `insonia/settings.py` (all configuration), `insonia/urls.py` (mounts `/admin/`, `/api/`, `/graphql/`)

**`core/`:**
- Purpose: GraphQL schema root — combines `lojapp.schema` and `pdv.schema` into the single schema registered in settings
- Contains: `core/schema.py` only
- Note: Not a registered Django app; has no models, migrations, or admin. It is a thin aggregation module.

**`api/`:**
- Purpose: REST API URL aggregator — registers all DRF ViewSets in one router
- Contains: `api/urls.py` only
- Note: Not a registered Django app. All ViewSet implementations live in their respective feature apps.

**`lojapp/`:**
- Purpose: Product catalog domain
- Contains: Models (`Categoria`, `Marca`, `Produto`, `ProdutoImagem`, `NomeVariacao`, `ValorVariacao`, `Variacao`), REST serializers/viewsets, GraphQL schema, admin classes, management commands
- Key files: `lojapp/models.py`, `lojapp/schema.py`, `lojapp/serializers.py`, `lojapp/views.py`

**`pdv/`:**
- Purpose: Point-of-sale domain
- Contains: Models (`Venda`, `ItemVenda`), REST serializers/viewsets, GraphQL schema with mutations, custom `AdminSite`, date-range form
- Key files: `pdv/models.py`, `pdv/schema.py`, `pdv/serializers.py`, `pdv/views.py`, `pdv/admin.py`

**`user/`:**
- Purpose: Reserved for future user profile extension of `auth.User`
- Contains: Scaffolded files only; `models.py` has no models, no URLs are mounted
- Key files: None active

**`scripts/`:**
- Purpose: One-off data maintenance scripts (import, name normalisation)
- Contains: `import_data.py`, `update_names.py`
- Note: Not wired into Django; run directly with Python

## Key File Locations

**Entry Points:**
- `manage.py`: CLI entry point
- `insonia/wsgi.py`: WSGI production entry point
- `insonia/urls.py`: Root URL configuration

**Configuration:**
- `insonia/settings.py`: All Django and third-party config (database, installed apps, DRF, Graphene, djmoney)
- `pytest.ini`: Test runner configuration
- `conftest.py`: Shared pytest fixtures

**Core Logic:**
- `lojapp/models.py`: Product catalog models with price validation and slug generation
- `pdv/models.py`: `Venda` and `ItemVenda` with stock management and total recalculation
- `core/schema.py`: GraphQL schema root
- `api/urls.py`: REST router registrations

**GraphQL Schemas:**
- `lojapp/schema.py`: Queries for products, categories, brands; custom `MoneyType` scalar
- `pdv/schema.py`: Queries for sales; mutations `CriarVenda`, `CriarItemVenda`, `RemoverItemVenda`, `RemoverVenda`

**REST Serializers:**
- `lojapp/serializers.py`: Read (`ProdutoSerializer`) and write (`ProdutoCreateUpdateSerializer`) serializers; note `ProdutoCreateUpdateSerializer` is defined twice in the same file (bug)
- `pdv/serializers.py`: `VendaSerializer`, `ItemVendaSerializer`, `ItemVendaCreateSerializer`; defines a local `ProdutoSerializer` to avoid a circular import from `lojapp`

**Testing:**
- `lojapp/tests/tests_models/test_categoria_slug.py`
- `lojapp/tests/tests_models/test_marca_slug.py`
- `pdv/tests.py`
- `user/tests.py`

## Models Per App

**`lojapp`:**
- `Categoria` — product category with auto-slug
- `Marca` — product brand with auto-slug
- `Produto` — product with three `MoneyField` prices, stock quantity, slug, FK to `Categoria` and `Marca`
- `ProdutoImagem` — product image file, FK to `Produto`
- `NomeVariacao` — variation dimension name (e.g., "Tamanho", "Cor")
- `ValorVariacao` — variation dimension value (e.g., "M", "Vermelho"), FK to `NomeVariacao`
- `Variacao` — joins `Produto` to `ValorVariacao`; unique together on `(produto, valor)`

**`pdv`:**
- `Venda` — sale header; FK to `auth.User`; two denormalised `MoneyField` totals recalculated on every item change
- `ItemVenda` — sale line item; FK to `Venda` and `Produto`; `subtotal` and `lucro` are `@property` computations; `save()` decrements `Produto.quantidade`

**`user`:**
- No models

## URL Routing Structure

```
/admin/          → MyAdminSite (custom AdminSite from pdv/admin.py)
/api/            → api/urls.py (DRF DefaultRouter)
    vendas/                  → VendaViewSet (pdv)
    itens-venda/             → ItemVendaViewSet (pdv)
    categorias/              → CategoriaViewSet (lojapp)
    marcas/                  → MarcaViewSet (lojapp)
    produtos/                → ProdutoViewSet (lojapp)
    produtos-imagem/         → ProdutoImagemViewSet (lojapp)
    nome-variacao/           → NomeVariacaoViewSet (lojapp)
    valor-variacao/          → ValorVariacaoViewSet (lojapp)
    variacao/                → VariacaoViewSet (lojapp)
    auth/                    → rest_framework.urls (login/logout)
/graphql/        → GraphQLView (graphiql=True, csrf_exempt)
```

**Note:** `lojapp/urls.py` and `pdv/urls.py` define their own URL patterns but neither is mounted in `insonia/urls.py`. `api/urls.py` is the only active REST router. `user/urls.py` is similarly unmounted.

## How Apps Relate to Each Other

- `lojapp` is the foundational domain app; it has no dependencies on other project apps.
- `pdv` depends on `lojapp.models.Produto` via a direct FK (`ItemVenda.produto`) and imports it explicitly. This is the only inter-app model dependency.
- `pdv.admin` imports `lojapp.admin.ProdutoAdmin` and registers `lojapp` models on its custom `AdminSite`, effectively taking ownership of the admin for the entire project.
- `pdv.serializers` defines a local `ProdutoSerializer` (fields `id`, `name` only) to avoid a circular import that would arise from importing `lojapp.serializers.ProdutoSerializer`.
- `core.schema` composes `lojapp.schema.Query` and `pdv.schema.Query` via multiple inheritance; mutations come from `pdv.schema` only (lojapp has no mutations).
- `api.urls` imports ViewSets from both `lojapp.views` and `pdv.views` and registers them on one shared router.
- `user` is isolated — nothing imports from it.

## Naming Conventions

**Files:** snake_case for all Python modules (`models.py`, `serializers.py`, `test_categoria_slug.py`)
**Directories:** lowercase, no separators (`lojapp`, `pdv`, `user`, `core`)
**Models:** PascalCase, Portuguese domain names (`Produto`, `Categoria`, `ItemVenda`, `Venda`)
**Fields:** snake_case, Portuguese (`preco_venda`, `data_venda`, `lucro_total`)
**GraphQL types:** camelCase aliases exposed on `DjangoObjectType` (`precoVenda`, `valorTotal`, `dataVenda`); snake_case field names kept internally

## Where to Add New Code

**New catalog feature (model + API):**
- Model: `lojapp/models.py`
- Migration: `lojapp/migrations/`
- REST serializer: `lojapp/serializers.py`
- REST viewset: `lojapp/views.py`
- REST route: `api/urls.py` (add `router.register(...)`)
- GraphQL type/query: `lojapp/schema.py`
- Tests: `lojapp/tests/tests_models/`

**New sales feature:**
- Model: `pdv/models.py`
- REST serializer: `pdv/serializers.py`
- REST viewset: `pdv/views.py`
- REST route: `api/urls.py`
- GraphQL type/mutation: `pdv/schema.py`
- Tests: `pdv/tests.py`

**New user profile fields:**
- Model: `user/models.py` (extend or OneToOne to `auth.User`)
- Mount URLs: add `path('user/', include('user.urls'))` to `insonia/urls.py`

**New GraphQL mutation:**
- If for catalog: add to `lojapp/schema.py` and expose via a `Mutation` class, then include in `core/schema.py` root `Mutation`
- If for sales: add to `pdv/schema.py` `Mutation` class (already composed in `core/schema.py`)

**Shared utilities:**
- Project-wide: `insonia/utils/utils.py`
- Data scripts: `scripts/`

## Special Directories

**`staticfiles/`:**
- Purpose: Output of `python manage.py collectstatic`
- Generated: Yes
- Committed: Yes (present in repo — unusual; normally gitignored)

**`media/`:**
- Purpose: User-uploaded product images
- Generated: Yes (runtime uploads)
- Committed: Partially (directory and some sample images present)

**`migrations/`** (inside each app):
- Purpose: Django schema migration files
- Generated: Yes (via `makemigrations`)
- Committed: Yes

**`.planning/codebase/`:**
- Purpose: Architecture and planning documents for AI-assisted development
- Generated: Yes (by mapping agent)
- Committed: Yes

---

*Structure analysis: 2026-04-18*
