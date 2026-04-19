# Technology Stack

**Analysis Date:** 2026-04-18

This is a Django-based retail/POS (Point of Sale) web application called "insonia". It exposes both a REST API (Django REST Framework) and a GraphQL API (graphene-django), and is configured for Brazilian Real (BRL) currency operations.

## Languages

**Primary:**
- Python 3.12.3 - All application code

**Secondary:**
- SQL - Database queries via Django ORM

## Runtime

**Environment:**
- Python 3.12.3 (system interpreter: `/usr/bin/python3.12`)

**Package Manager:**
- pip (standard)
- Lockfile: `requirements2.txt` (pinned versions — note: non-standard filename, no `requirements.txt`)
- Two venv directories exist: `venv_clean/` and `venvclean/` — the latter was created from a different path (`/home/tiagomonteiro/projects/insonia/venvclean`), suggesting development environment inconsistency

## Frameworks

**Core:**
- Django 4.2.20 - Web framework, ORM, admin interface

**API:**
- djangorestframework (not in requirements2.txt but used in code via `rest_framework`) - REST API
- graphene-django (not in requirements2.txt but in `INSTALLED_APPS` and imported in code) - GraphQL API

**Testing:**
- pytest 2.x (imported in conftest.py; not pinned in requirements2.txt)
- pytest-django (implied by `pytest.ini` with `DJANGO_SETTINGS_MODULE`)

**Build/Dev:**
- No build system detected (no webpack, vite, etc.)
- Django's `manage.py` for CLI operations

## Key Dependencies

**Critical:**
- `Django==4.2.20` - Core framework (`insonia/settings.py`)
- `django-money==3.5.3` - MoneyField support for BRL currency fields (`requirements2.txt`; used in `lojapp/models.py`, `pdv/models.py`)
- `py-moneyed==3.0` - Underlying money type library (`requirements2.txt`)
- `psycopg2-binary==2.9.10` - PostgreSQL adapter (`requirements2.txt`) — **flag: installed but settings use SQLite**
- `pillow==11.2.1` - Image handling for `ProdutoImagem.imagem` (`requirements2.txt`)
- `boto3==1.37.33` - AWS SDK (`requirements2.txt`) — **flag: in requirements but no usage found in application code**
- `botocore==1.37.33` - AWS core library, boto3 dependency (`requirements2.txt`)
- `s3transfer==0.11.4` - AWS S3 transfer utility, boto3 dependency (`requirements2.txt`)

**Infrastructure:**
- `asgiref==3.8.1` - ASGI support (Django dependency)
- `sqlparse==0.5.3` - SQL formatting (Django dependency)
- `babel==2.17.0` - Locale/currency formatting
- `python-dateutil==2.9.0.post0` - Date parsing utilities
- `six==1.17.0` - Python 2/3 compatibility shim (legacy dependency, should be unneeded with Python 3.12)
- `typing_extensions==4.13.2` - Backported type hints
- `urllib3==1.26.20` - HTTP library (boto3 dependency)
- `jmespath==1.0.1` - JSON querying (boto3 dependency)

**Missing from requirements2.txt (used in code):**
- `djangorestframework` - Used throughout `api/`, `pdv/`, `lojapp/`
- `django-filter` - Listed in `INSTALLED_APPS` as `django_filters`, used in REST framework config
- `graphene-django` - Listed in `INSTALLED_APPS`, imported in `insonia/urls.py`, `core/schema.py`, `lojapp/schema.py`, `pdv/schema.py`
- `jazzmin` - Referenced in `settings.py` (`JAZZMIN_SETTINGS`) but not in `INSTALLED_APPS` and not in requirements

## Configuration

**Environment:**
- `insonia/settings.py` - Single settings file, no environment-specific overrides detected
- `SECRET_KEY` is hardcoded (insecure placeholder value starting with `django-insecure-`)
- `DEBUG = True` hardcoded — not suitable for production as-is
- `ALLOWED_HOSTS = []` — empty, will reject non-localhost requests in production
- `TIME_ZONE = 'America/Sao_Paulo'`
- `DEFAULT_CURRENCY = 'BRL'`
- `.env` file: not present

**Build:**
- No build config files (no webpack, Makefile, Dockerfile detected)

**Test Config:**
- `pytest.ini` — sets `DJANGO_SETTINGS_MODULE = settings` (note: should be `insonia.settings`; may conflict with `conftest.py` which sets `insonia.settings`)
- `conftest.py` — manually calls `django.setup()` at project root

## Platform Requirements

**Development:**
- Python 3.12.3
- pip + venv
- SQLite (current database engine)

**Production:**
- PostgreSQL adapter (`psycopg2-binary`) is installed, suggesting PostgreSQL is the intended production database
- boto3/S3 in requirements suggest intended S3 media storage for production
- WSGI server via `insonia/wsgi.py`

---

*Stack analysis: 2026-04-18*
