# Codebase Concerns

**Analysis Date:** 2026-04-18

## Summary

The insonia project is in an early/active development state with several issues that would block a production deployment. The most critical problems are: a hardcoded insecure Django secret key with `DEBUG=True` and empty `ALLOWED_HOSTS`, a completely unauthenticated GraphQL endpoint, a silent no-op bug in stock deduction logic inside `ItemVenda.save()`, and a broken `lojapp/urls.py` that imports a commented-out view. There are significant test coverage gaps across `pdv`, `user`, and all GraphQL/REST API paths. Several patterns are duplicated between `lojapp` and `pdv` rather than shared.

---

## HIGH Severity

**Hardcoded insecure SECRET_KEY with DEBUG=True**
- `DEBUG = True`, `ALLOWED_HOSTS = []`, and `SECRET_KEY = 'django-insecure-4hka03wioz=)k45=...'` are all committed directly in settings with no environment variable override path. Deploying this as-is exposes the full debug stack trace to any user and makes session/CSRF tokens trivially forgeable.
- File: `insonia/settings.py` lines 23-28

**GraphQL endpoint has no authentication or authorization**
- `/graphql/` is registered with `csrf_exempt(GraphQLView.as_view(graphiql=True))`. No middleware, no `login_required`, and no `info.context.user` checks exist in any resolver or mutation in `lojapp/schema.py` or `pdv/schema.py`. Any anonymous user can query all products, all sales, all users, and mutate (create/delete) sales data.
- Files: `insonia/urls.py` line 31, `lojapp/schema.py`, `pdv/schema.py`

**GraphiQL enabled in production URL config**
- `graphiql=True` is set on the GraphQL view, exposing an interactive query IDE to anyone. This is only appropriate for development.
- File: `insonia/urls.py` line 31

**pdv REST ViewSet has no permission_classes**
- `VendaViewSet` and `ItemVendaViewSet` in `pdv/views.py` have no `permission_classes` defined. The global DRF default (`IsAuthenticated`) applies, but this is silent and can easily be broken by a settings change. Unlike `lojapp/views.py`, permissions are never stated explicitly.
- File: `pdv/views.py` lines 9-43

**Silent no-op bug in ItemVenda.save() stock deduction**
- On update (`self.pk` is set), the intent is to restore the old quantity before subtracting the new one. The code reads `self.produto.quantidade +- old_item.quantidade` (line 189). The `+-` operator is Python unary minus applied to `old_item.quantidade`, making the right-hand side expression a no-op — the result is discarded and `self.produto.quantidade` is never restored. This causes permanent stock undercount on every item edit.
- File: `pdv/models.py` line 189

**lojapp/urls.py imports a non-existent view**
- `lojapp/urls.py` imports `product_list` from `lojapp/views.py`, but that function is entirely commented out (lines 3-9 of `views.py`). Starting the Django dev server will raise an `ImportError` if this URL module is ever loaded.
- Files: `lojapp/urls.py` line 2, `lojapp/views.py` lines 3-9

---

## MEDIUM Severity

**VendaType references a non-existent model field `data`**
- `VendaType.Meta.fields` includes `'data'` (line 56 of `pdv/schema.py`), but the `Venda` model field is named `data_venda`. `resolve_dataVenda` compensates by returning `self.data_venda`, but the `Meta.fields` entry will silently cause issues or be ignored by graphene-django.
- File: `pdv/schema.py` lines 54-56, 75-76

**`MoneyObjectType` duplicated across both schemas**
- `MoneyObjectType` (a plain graphene `ObjectType` with `amount` and `currency`) is defined independently in both `lojapp/schema.py` (line 33) and `pdv/schema.py` (line 16). `MoneyType` (a custom Scalar) exists only in `lojapp/schema.py` and is unused in schema queries. There is no shared `core` or `common` location for these types.
- Files: `lojapp/schema.py` lines 8-35, `pdv/schema.py` lines 16-18

**`ProdutoCreateUpdateSerializer` defined twice in the same file**
- `lojapp/serializers.py` contains two full class definitions of `ProdutoCreateUpdateSerializer` (lines 70-78 and lines 83-120). The second definition silently overwrites the first. The first definition has no `validate()` method; only the second does. Any future edit to the first block will have no effect.
- File: `lojapp/serializers.py` lines 70-120

**`Categoria` and `Marca` models define `get_absolute_url` twice each**
- Both models have `get_absolute_url` defined twice in the same class body (lines 22-23 and 33-34 in `Categoria`, lines 48-49 and 59-60 in `Marca`). The first definition is shadowed. Both call `reverse('')` with an empty string, which will raise a `NoReverseMatch` at runtime whenever called.
- File: `lojapp/models.py` lines 22-34, 48-60

**`ItemVenda.save()` decrements stock but never persists it**
- `ItemVenda.save()` modifies `self.produto.quantidade` in memory but never calls `self.produto.save()`. The separate `atualizar_estoque()` method (lines 196-203) does call `self.produto.save()` but is never invoked. Stock levels are silently not updated through the main save path.
- File: `pdv/models.py` lines 182-194, 196-203

**`CriarVenda` mutation in GraphQL does not use `@transaction.atomic`**
- `CriarVenda.mutate()` creates the `Venda`, then iterates items, checking stock and creating `ItemVenda` objects. If stock check fails mid-loop, already-created `ItemVenda` rows are left orphaned (the `Venda` has 0 items but exists). `transaction` is imported but unused.
- File: `pdv/schema.py` lines 86-115

**SQLite database used with no swap path to production DB**
- `DATABASES` is hard-coded to `sqlite3`. There is no `DATABASE_URL` environment variable pattern, no comments or config for switching to PostgreSQL for production.
- File: `insonia/settings.py` lines 114-119

**Hardcoded absolute file paths in import scripts**
- `lojapp/import_data.py` and `scripts/import_data.py` contain hardcoded `/home/tiago/...` paths. Running these on any other machine will fail with `FileNotFoundError`.
- Files: `lojapp/import_data.py` lines 2, 18, 43; `scripts/import_data.py` lines 15, 39

**`lojapp` schema has no mutations**
- `lojapp/schema.py` exposes only read queries (products, categories, brands). There is no GraphQL mutation path to create or update products. The `core/schema.py` root `Mutation` class only inherits from `pdv.schema.Mutation`, meaning lojapp data is only writable via the REST API.
- Files: `core/schema.py` line 9, `lojapp/schema.py`

**`user` app is entirely empty**
- `user/models.py`, `user/views.py`, and `user/tests.py` contain only stub comments. The app is in `INSTALLED_APPS` but provides no functionality. Authentication relies on Django's built-in `User` model with no custom profile or token issuance endpoint.
- Files: `user/models.py`, `user/views.py`, `user/tests.py`

---

## LOW Severity

**lojapp migration chain is 23 migrations long**
- `lojapp/migrations/` contains 23 sequential migration files including several that add and immediately remove the same field (e.g., `0019` removes `variacao.quantidade`, `0020` re-adds it, `0021` removes it again). This is schema churn that should be squashed before production deployment.
- Directory: `lojapp/migrations/`

**`lojapp/admin.py` has three commented-out registrations**
- Three `admin.site.register(...)` calls at the bottom of `lojapp/admin.py` (lines 70-73) are commented out. The models are registered via `pdv/admin.py`'s `admin_site` instead, but the dead comments create confusion about what is registered where.
- File: `lojapp/admin.py` lines 70-73

**`VariacaoFilter` in admin references non-existent `variacoes_set` and `.nome`**
- `lojapp/admin.py`'s `VariacaoFilter.lookups()` calls `produto.variacoes_set.all()` (the related name is `variacoes`, not `variacoes_set`) and accesses `.nome` (the model uses `.valor`). This filter will raise `AttributeError` if used.
- File: `lojapp/admin.py` lines 27-33

**`scripts/import_data.py` calls `Produto.objects.create()` with a non-existent `imagem` field**
- The script passes `'imagem': None` in the `defaults` dict, but `Produto` has no `imagem` field (images live in the separate `ProdutoImagem` model). This will raise `TypeError` when executed.
- File: `scripts/import_data.py` line 33

**`conftest.py` calls `django.setup()` without setting `DJANGO_SETTINGS_MODULE` first reliably**
- The project-root `conftest.py` calls `os.environ.setdefault(...)` then `django.setup()` at module import time. This pattern can conflict with pytest-django's own setup if `pytest.ini` or `pyproject.toml` also sets `DJANGO_SETTINGS_MODULE`. There is no `pytest.ini` or `setup.cfg` visible.
- File: `conftest.py`

**Test coverage gaps: pdv and user apps have zero tests**
- `pdv/tests.py` and `user/tests.py` contain only `# Create your tests here.`. No tests exist for `Venda`, `ItemVenda`, stock deduction, total calculation, or any GraphQL resolver or mutation. The only tests present cover `Categoria` and `Marca` slug generation in `lojapp`.
- Files: `pdv/tests.py`, `user/tests.py`, `lojapp/tests/tests_models/`

**`lojapp/schema.py` defines a `MoneyType` Scalar that is never used**
- `MoneyType` (lines 8-31 of `lojapp/schema.py`) is a custom Scalar with `serialize`, `parse_literal`, and `parse_value` methods. It is never referenced anywhere in the schema; all resolvers return plain dicts, and `MoneyObjectType` is used for field types instead.
- File: `lojapp/schema.py` lines 8-31

**`pdv/urls.py` is unused dead code**
- `pdv/urls.py` defines its own router and registers `ItemVendaViewSet`, but this file is never included from `insonia/urls.py` or `api/urls.py`. All pdv routing goes through `api/urls.py` which registers both ViewSets directly.
- File: `pdv/urls.py`

---

*Concerns audit: 2026-04-18*
