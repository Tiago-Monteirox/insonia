# Testing Patterns

**Analysis Date:** 2026-04-18

Testing coverage is minimal. Only two model-level tests exist, both in `lojapp`. The `pdv` app has a placeholder `tests.py` with no tests. The `user` app has no test file at all. GraphQL mutations, REST API views, serializer validation, and all business logic in `pdv/models.py` are completely untested.

---

## Test Framework

**Runner:**
- `pytest` with `pytest-django` plugin
- Config: `pytest.ini` at project root

**`pytest.ini` contents:**
```ini
[pytest]
DJANGO_SETTINGS_MODULE = settings
python_files = tests.py test_*.py *_tests.py
```

**Note:** `DJANGO_SETTINGS_MODULE = settings` is incorrect — the actual settings module is `insonia.settings`. This means running `pytest` from the project root will fail unless the settings path is corrected or the runner is invoked from within the `insonia/` package directory. `conftest.py` partially compensates by calling `os.environ.setdefault("DJANGO_SETTINGS_MODULE", "insonia.settings")` and `django.setup()` manually, but this is non-standard and fragile.

**Assertion Library:**
- Plain `assert` statements (pytest style) — no `unittest.TestCase` assertion methods used in existing tests

**Run Commands:**
```bash
pytest                          # Run all tests (from project root — subject to settings path bug)
pytest lojapp/tests/            # Run lojapp tests only
pytest -v                       # Verbose output
```

No coverage command is configured. No `--cov` flag or `pytest-cov` configuration found.

---

## Test File Organization

**Location:**
- `lojapp` tests live in a dedicated subdirectory: `lojapp/tests/`
- Sub-grouped by type: `lojapp/tests/tests_models/`
- Both `lojapp/tests/__init__.py` and `lojapp/tests/tests_models/__init__.py` exist (package structure)

**Naming:**
- Test files: `test_<subject>.py` — e.g. `test_categoria_slug.py`, `test_marca_slug.py`
- Test classes: `Test<Model>` — e.g. `TestCategoria`, `TestMarca`
- Test methods: `test_<behavior>` — e.g. `test_categoria_slug`, `test_marca_slug`

**Structure:**
```
lojapp/
  tests/
    __init__.py
    tests_models/
      __init__.py
      test_categoria_slug.py    # Tests Categoria.save() auto-slug
      test_marca_slug.py        # Tests Marca.save() auto-slug
pdv/
  tests.py                      # Empty placeholder only
user/
  (no test file)
```

---

## Test Structure

**Suite Organization:**
```python
import pytest
from lojapp.models import Categoria

@pytest.mark.django_db
class TestCategoria:
    def test_categoria_slug(self):
        categoria = Categoria.objects.create(name="Skates completos")
        assert categoria.slug == "skates-completos"
```

**Patterns:**
- Tests are grouped in classes decorated with `@pytest.mark.django_db` (class-level decorator applies to all methods)
- No `setUp` / `tearDown` or pytest `fixtures` used — objects created inline with `Model.objects.create()`
- No `conftest.py` fixtures defined for test data; the root `conftest.py` only handles Django setup
- Direct database access via `Model.objects.create()` — no mocking or factories

---

## Mocking

**Framework:** None in use

**Current pattern:** None — existing tests hit the real SQLite test database directly. No `unittest.mock`, `pytest-mock`, or `MagicMock` usage detected.

---

## Fixtures and Factories

**Test Data:**
- No fixture files (JSON/YAML/Python fixtures)
- No factory libraries (`factory_boy`, `model_bakery`, `faker`) detected in requirements
- Data created inline with `Model.objects.create()` per test

**Location:** Not applicable — no shared fixtures exist.

---

## Coverage

**Requirements:** None enforced

**Current coverage (estimated):**
- `lojapp/models.py`: ~5% — only `Categoria.save()` slug and `Marca.save()` slug tested
- `pdv/models.py`: 0%
- `lojapp/serializers.py`: 0%
- `pdv/serializers.py`: 0%
- `lojapp/views.py`: 0%
- `pdv/views.py`: 0%
- `lojapp/schema.py`: 0%
- `pdv/schema.py`: 0%
- `pdv/admin.py`: 0%

**View coverage report:**
```bash
pytest --cov=. --cov-report=term-missing   # Not yet configured, but this is the command to use
```

---

## Test Types

**Unit Tests:**
- Only type present
- Scope: model `save()` side effects (auto-slug generation)
- Files: `lojapp/tests/tests_models/test_categoria_slug.py`, `lojapp/tests/tests_models/test_marca_slug.py`

**Integration Tests:**
- None present

**E2E Tests:**
- None present; no browser automation framework detected

**GraphQL Tests:**
- None present; `graphene-django` provides `graphene_django.utils.testing.GraphQLTestCase` which is not used

---

## Coverage Gaps (High Priority)

**`pdv/models.py` — Business logic completely untested:**
- `Venda.calcular_totais()` — calculates and persists `valor_total` and `lucro_total`
- `ItemVenda.save()` — deducts stock, triggers total recalculation; contains a known bug (`+=` written as `+-` on line 189)
- `ItemVenda.delete()` — restores stock on deletion
- `ItemVenda.clean()` — validates quantity, price, and stock levels

**`lojapp/models.py` — Validation untested:**
- `Produto.clean()` — validates negative prices and promo-price < regular-price rule
- `Produto.clean_precos()` — normalizes string/Money inputs; edge cases untested
- `Produto.save()` — runs `clean_precos()` then `full_clean()` before persisting

**Serializers — Validation logic untested:**
- `ProdutoSerializer.validate()` in `lojapp/serializers.py`
- `ProdutoCreateUpdateSerializer.validate()` — duplicate class defined twice in the same file (lines 70-78 and 83-120); only the second definition is active
- `ItemVendaCreateSerializer.validate()` in `pdv/serializers.py`

**GraphQL mutations — Completely untested:**
- `CriarVenda.mutate()` — creates sale, checks stock, creates items
- `CriarItemVenda.mutate()` — adds item to existing sale
- `RemoverItemVenda.mutate()` and `RemoverVenda.mutate()` — deletion with recalculation

**REST API views — Completely untested:**
- All ViewSet endpoints for both `lojapp` and `pdv`
- Permission enforcement (`IsAuthenticated` vs `IsAuthenticatedOrReadOnly`)
- Custom `@action` endpoints: `ProdutoViewSet.adicionar_imagem`, `VendaViewSet.itens`

---

## Known Test Infrastructure Issues

- `pytest.ini` has incorrect `DJANGO_SETTINGS_MODULE = settings`; should be `insonia.settings`
- `conftest.py` uses manual `django.setup()` call as workaround — this is redundant when `pytest-django` is configured correctly and may cause issues with test isolation
- No `pytest-django` in `requirements2.txt` — its presence must be verified in the active virtualenv before running tests
- No test database configuration separate from development; tests run against SQLite in-memory by default (Django's default for tests), which is acceptable but not explicitly configured

---

*Testing analysis: 2026-04-18*
