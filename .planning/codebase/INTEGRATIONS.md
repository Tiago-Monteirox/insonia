# External Integrations

**Analysis Date:** 2026-04-18

This project currently runs with minimal active external integrations. The primary data store is SQLite (local file), media files are stored on local disk, and authentication uses Django's built-in session/token auth. However, boto3 and psycopg2-binary are present in `requirements2.txt`, indicating intended-but-not-yet-wired integrations with AWS S3 and PostgreSQL.

## APIs & External Services

**GraphQL (internal):**
- graphene-django exposes a GraphQL endpoint at `/graphql/` (GraphiQL enabled)
- Schema defined at `core/schema.py`, combining `lojapp.schema` (Query) and `pdv.schema` (Query + Mutation)
- No external GraphQL consumption detected

**REST (internal):**
- Django REST Framework exposes a REST API at `/api/`
- Registered resources: `vendas`, `itens-venda`, `categorias`, `marcas`, `produtos`, `produtos-imagem`, `nome-variacao`, `valor-variacao`, `variacao`
- Auth endpoint: `/api/auth/` (DRF built-in login/logout)

**AWS (present in requirements, not wired in code):**
- `boto3==1.37.33` and `botocore==1.37.33` are installed
- No `import boto3` found in any application Python file
- No `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, or `AWS_STORAGE_BUCKET_NAME` settings detected
- Likely intended for S3 media storage but not yet implemented

## Data Storage

**Databases:**
- SQLite (active, development)
  - Engine: `django.db.backends.sqlite3`
  - File: `db.sqlite3` at project root (`BASE_DIR / 'db.sqlite3'` in `insonia/settings.py`)
  - No database URL env var configured

- PostgreSQL (intended, not yet configured)
  - `psycopg2-binary==2.9.10` is installed
  - No PostgreSQL `DATABASES` config in `insonia/settings.py`
  - A `backup_file.sql` exists at project root, suggesting prior PostgreSQL use or migration planning

**File Storage:**
- Local filesystem (active)
  - Media root: `MEDIA_ROOT = BASE_DIR / 'media'` (`insonia/settings.py`)
  - Media URL: `/media/`
  - Product images uploaded to `produto_imagens/%Y/%m/` (`lojapp/models.py` line 147)

- AWS S3 (not yet configured — see above)

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Django built-in (`django.contrib.auth`)
  - `AUTH_USER_MODEL` not customized — uses default `auth.User`
  - `user/` app exists but `user/models.py` contains no custom model (empty)

**Authentication Classes (REST API):**
- `TokenAuthentication` — DRF token-based auth
- `SessionAuthentication` — DRF session-based auth
- Both configured in `REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']` in `insonia/settings.py`

**Authorization:**
- Default permission: `IsAuthenticated` for all REST API endpoints
- GraphQL endpoint at `/graphql/` uses `csrf_exempt` — no authentication enforced on GraphQL

**CSRF:**
- GraphQL endpoint decorated with `@csrf_exempt` (`insonia/urls.py` line 31) — potential security surface

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry, Rollbar, etc.)

**Logs:**
- Django default logging (console output); no custom log configuration in `settings.py`

## CI/CD & Deployment

**Hosting:**
- Not configured (no Dockerfile, Procfile, `render.yaml`, `fly.toml`, etc. detected)

**CI Pipeline:**
- None detected

**WSGI:**
- `insonia/wsgi.py` present for WSGI-compatible server deployment

## Environment Configuration

**Required env vars:**
- None currently enforced (all config is hardcoded in `insonia/settings.py`)

**Secrets location:**
- `SECRET_KEY` is hardcoded in `insonia/settings.py` — must be externalized before production
- No `.env` file present; no `python-decouple`, `django-environ`, or `python-dotenv` in use

**Flag:** The settings file contains `SECRET_KEY = 'django-insecure-4hka03wioz=)k45=901b@9r7p)7qmsd7l7oq95)#f30m!%e=js'` and `DEBUG = True` — these must be changed before any production deployment.

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Data Import/Export

**Scripts:**
- `scripts/import_data.py` — data import script (also a management command at `lojapp/management/`)
- `scripts/update_names.py` — name update script
- `backup_file.sql` — SQL backup file at project root

---

*Integration audit: 2026-04-18*
