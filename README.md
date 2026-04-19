# 💤 Insônia – Sistema de Vendas de Produtos

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0.4-green?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql&logoColor=white)
![uv](https://img.shields.io/badge/uv-package%20manager-blueviolet?logo=python&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Insônia é um sistema de gerenciamento de vendas desenvolvido com Django. Permite:

> **Cadastro e controle de produtos**, **controle de vendas**, **análise de lucro por período** — e muito mais (tipo sua ansiedade às 2 da manhã).

🚀 Projeto desenvolvido por **Tiago Monteiro** – estudante de Análise e Desenvolvimento de Sistemas e apaixonado por Python e Django (*quase romântico*).

---

## 🖼️ Imagens do Sistema

<img src="https://github.com/user-attachments/assets/fcd61bad-3a55-4d7e-bc96-64a2ea7bd81b" width="800"/>

---

## ⚙️ Funcionalidades

- 🧾 Cadastro, edição e exclusão de produtos  
- 💰 Registro de vendas e controle de estoque  
- 📊 Filtro de lucro por período  
- 🔍 Busca e filtros inteligentes  
- 📈 Análise de desempenho das vendas  
- 📋 Dashboard simples e intuitivo  
- 🔐 Sistema de autenticação de usuários  

<img src="https://github.com/user-attachments/assets/c3a185fe-1bf5-4774-a36a-21faeea3a173" width="800"/>


---

## 💻 Tecnologias Utilizadas

- Python 3.12 🐍  
- Django 6.0.4 🕸️  
- PostgreSQL 🐘  
- Bootstrap com HTML e CSS 🎨
- GraphQL (graphene-django)
- uv (gerenciador de pacotes e ambientes virtuais) ⚡

---

## 🚧 Como rodar o projeto localmente

```bash
git clone https://github.com/Tiago-Monteirox/insonia.git
cd insonia
```

<p>&nbsp;</p>

## ➡️ Instale o uv (se ainda não tiver):
<p>&nbsp;</p>

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

<p>&nbsp;</p>

## ⚙️ Crie o ambiente virtual e instale as dependências:
<p>&nbsp;</p>

```bash
uv sync
```

> Isso cria automaticamente o `.venv` e instala todas as dependências declaradas no `pyproject.toml`.

<p>&nbsp;</p>

## ▶️ Ative o ambiente virtual:
<p>&nbsp;</p>

```bash
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows
```

<p>&nbsp;</p>

## 🛠️ Criar o banco no PostgreSQL
<p>&nbsp;</p>

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
```

```sql
CREATE DATABASE insonia_db;
CREATE USER meu_usuario WITH PASSWORD 'senha_forte' SUPERUSER;
ALTER ROLE meu_usuario SET client_encoding TO 'utf8';
ALTER ROLE meu_usuario SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE insonia_db TO meu_usuario;
```

<p>&nbsp;</p>

## ✏️ Editar o settings.py

No bloco `DATABASES`, substitua pelo PostgreSQL:
<p>&nbsp;</p>

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'insonia_db',
        'USER': 'meu_usuario',
        'PASSWORD': 'minha_senha',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

<p>&nbsp;</p>

## 🔀 Execute as migrações:
<p>&nbsp;</p>

```bash
python manage.py migrate
```

<p>&nbsp;</p>

## 🔐 Criar o superusuário:
<p>&nbsp;</p>

```bash
python manage.py createsuperuser
```

<p>&nbsp;</p>

## ▶️ Inicie o servidor:
<p>&nbsp;</p>

```bash
python manage.py runserver
```

<p>&nbsp;</p>

✨ Acesse http://127.0.0.1:8000/admin/
<p>&nbsp;</p>



## 📥 Importação de Dados via Planilha Excel

O sistema possui um script automatizado para leitura de dados diretamente de uma planilha Excel (.xlsx), permitindo importar produtos em massa para o banco de dados.

Esse recurso é útil, por exemplo, para cadastrar rapidamente uma grande quantidade de itens com informações como:

<img src="https://github.com/user-attachments/assets/867d1379-784b-4274-a1dd-e1a7ba14ac4b" width="600"/>

Esse script faz a leitura da planilha, processa os dados e registra os produtos diretamente no banco utilizando os modelos do Django.

🧠 **Esse recurso é ideal para quem já tem o estoque organizado em Excel e deseja migrar para o sistema sem precisar cadastrar item por item manualmente.**

---

## 📌 To-do

- [ ] Implementar testes (porque confiar no código sem testar é um estilo de vida... perigoso)   
- [ ] Documentação de API
