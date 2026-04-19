# Insonia — Contexto do Projeto para Claude

> Carregue este arquivo no início de cada sessão para evitar re-varredura do codebase.
> Última atualização: 2026-04-19

---

## O que é este projeto

**Insonia** é um sistema de gerenciamento de loja e ponto de venda (PDV) desenvolvido em Django. Backend puro — sem frontend próprio. Toda a comunicação com clientes é via REST API (DRF) ou GraphQL (graphene-django). Domínio em português (Brasil), moeda BRL via `django-money`.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Linguagem | Python 3.12.3 |
| Framework | Django 4.2.20 |
| REST API | Django REST Framework (não está no requirements2.txt — instalado à mão) |
| GraphQL | graphene-django (também não está no requirements2.txt) |
| Banco (dev) | SQLite (`db.sqlite3`) |
| Banco (prod) | PostgreSQL (psycopg2-binary instalado, mas não configurado) |
| Moeda | django-money 3.5.3 + py-moneyed 3.0 |
| Imagens | Pillow 11.2.1 |
| AWS (futuro) | boto3 1.37.33 — instalado mas sem uso no código |
| Testes | pytest + pytest-django |

**Dependências faltando no requirements2.txt:** `djangorestframework`, `graphene-django`, `django-filter`

---

## Apps Django

| App | Responsabilidade |
|-----|-----------------|
| `insonia/` | Config do projeto (settings, urls, wsgi/asgi) |
| `lojapp/` | Catálogo de produtos — categorias, marcas, produtos, imagens, variações |
| `pdv/` | Ponto de venda — vendas (`Venda`) e itens de venda (`ItemVenda`) |
| `user/` | Stub vazio — reservado para perfis de usuário futuros |
| `core/` | Aggregador do schema GraphQL (não é Django app) |
| `api/` | Router REST centralizado (não é Django app) |

---

## Modelos principais

**lojapp:**
- `Categoria` — categoria de produto, auto-slug
- `Marca` — marca de produto, auto-slug
- `Produto` — produto com 3 MoneyFields (preco_venda, preco_custo, preco_venda_promocional), estoque, FK Categoria + Marca
- `ProdutoImagem` — imagem de produto, FK Produto
- `NomeVariacao` — dimensão de variação (ex: "Tamanho")
- `ValorVariacao` — valor da dimensão (ex: "M"), FK NomeVariacao
- `Variacao` — join Produto × ValorVariacao

**pdv:**
- `Venda` — cabeçalho da venda, FK auth.User, totais desnormalizados (valor_total, lucro_total)
- `ItemVenda` — linha de venda, FK Venda + Produto; subtotal e lucro são @property

---

## Rotas

```
/admin/      → MyAdminSite (custom, definida em pdv/admin.py)
/api/        → DRF DefaultRouter (api/urls.py)
    vendas/, itens-venda/, categorias/, marcas/, produtos/,
    produtos-imagem/, nome-variacao/, valor-variacao/, variacao/
    auth/    → login/logout DRF built-in
/graphql/    → GraphQLView (graphiql=True, csrf_exempt — SEM autenticação)
```

---

## Bugs conhecidos (HIGH severity)

1. **`pdv/models.py:189`** — `self.produto.quantidade +- old_item.quantidade` — operador `+-` é unário minus, nunca atualiza o estoque no update. Bug silencioso.
2. **`pdv/models.py:182-203`** — `ItemVenda.save()` modifica `self.produto.quantidade` mas **nunca chama `self.produto.save()`**. Estoque não é persistido via save path principal.
3. **GraphQL sem autenticação** — `/graphql/` é público. Qualquer usuário anônimo pode ler e mutar dados de vendas.
4. **`insonia/settings.py`** — `DEBUG=True`, `SECRET_KEY` hardcoded inseguro, `ALLOWED_HOSTS=[]`.
5. **`lojapp/urls.py:2`** — importa `product_list` que está comentado em `views.py`. Causaria `ImportError` se o módulo fosse carregado.

---

## Problemas MEDIUM

- `VendaType.Meta.fields` inclui `'data'` mas o campo no model é `data_venda`
- `MoneyObjectType` duplicado em `lojapp/schema.py` e `pdv/schema.py`
- `ProdutoCreateUpdateSerializer` definido duas vezes no mesmo arquivo (`lojapp/serializers.py`)
- `Categoria` e `Marca` têm `get_absolute_url` definido duas vezes cada (shadow)
- `CriarVenda` mutation sem `@transaction.atomic` — risco de dados órfãos
- Banco SQLite hardcoded, sem path para PostgreSQL em produção

---

## Cobertura de testes

Apenas 2 testes existem (slug de Categoria e Marca). Zero testes para:
- `pdv/models.py` (toda lógica de negócio)
- Qualquer endpoint REST
- Qualquer mutation/query GraphQL
- Serializers

**Comando para rodar:** `pytest` (mas `pytest.ini` tem `DJANGO_SETTINGS_MODULE = settings` — incorreto, deveria ser `insonia.settings`)

---

## Convenções de código

- Modelos: PascalCase português (`Produto`, `ItemVenda`)
- Campos: snake_case português (`preco_venda`, `data_venda`)
- Exceção: campo de nome principal é sempre `name` (inglês)
- GraphQL: snake_case internamente, camelCase exposto (`data_venda` → `dataVenda`)
- Mutations: PascalCase verbo português (`CriarVenda`, `RemoverItemVenda`)

---

## Onde adicionar código novo

| Feature | Arquivo |
|---------|---------|
| Model (catálogo) | `lojapp/models.py` |
| Serializer REST (catálogo) | `lojapp/serializers.py` |
| ViewSet REST (catálogo) | `lojapp/views.py` + `api/urls.py` |
| GraphQL query (catálogo) | `lojapp/schema.py` |
| GraphQL mutation (catálogo) | `lojapp/schema.py` → expor em `core/schema.py` |
| Model (vendas) | `pdv/models.py` |
| GraphQL mutation (vendas) | `pdv/schema.py` (já composto em `core/schema.py`) |
| Perfil de usuário | `user/models.py` + montar `user/urls.py` em `insonia/urls.py` |

---

## Arquivos de referência detalhados

Os documentos completos do mapeamento estão em `.planning/codebase/`:
- `STACK.md` — stack completa e dependências
- `ARCHITECTURE.md` — arquitetura, fluxo de dados, abstrações
- `STRUCTURE.md` — estrutura de diretórios, modelos, rotas
- `INTEGRATIONS.md` — integrações externas e configuração
- `CONVENTIONS.md` — convenções de código detalhadas
- `TESTING.md` — padrões de teste e gaps
- `CONCERNS.md` — bugs e problemas por severidade
