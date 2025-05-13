# 💤 Insônia – Sistema de Vendas de Produtos

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.1.4-green?logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Sistema completo de gerenciamento de vendas com backend API RESTful desenvolvido com Django REST Framework por Tiago Monteiro.

## 🖼️ Imagens do Sistema

<img src="https://github.com/user-attachments/assets/fcd61bad-3a55-4d7e-bc96-64a2ea7bd81b" width="800"/>

---

### Backend (API REST)
- **CRUD completo via API REST** para todos os modelos principais
- **Endpoints JSON** para integração com frontend ou apps móveis
- **Autenticação via Token** para acesso à API
- **Filtros avançados** diretamente na API (?search=, ?ordering=)
- **Paginação** dos resultados da API
- **Serializers** customizados para todos os modelos

### Frontend (Django Admin/Views)
- 🧾 Cadastro, edição e exclusão de produtos
- 💰 Registro de vendas e controle de estoque
- 📊 Filtro de lucro por período
- 📈 Dashboard analític

<img src="https://github.com/user-attachments/assets/c3a185fe-1bf5-4774-a36a-21faeea3a173" width="800"/>


---

## 💻 Tecnologias Utilizadas

- Python 🐍  
- Django 5.1.4 🕸️  
- PostgreSQL 🐘  
- Bootstrap com HTML e CSS 🎨  

---

## 🚧 Como rodar o projeto localmente


git clone https://github.com/Tiago-Monteirox/insonia.git
cd insonia

<p>&nbsp;</p>



## ➡️Crie e ative um ambiente virtual:
<p>&nbsp;</p>

python -m venv venv

source venv/bin/activate  # ou venv\Scripts\activate no Windows
<p>&nbsp;</p>


⚙️Instale as dependências principais:
<p>&nbsp;</p>

pip install django=="5.1.4"

pip install pillow

pip install django-money

pip install psycopg2-binary
<p>&nbsp;</p>

🛠️Criar o banco no PostgreSQL
<p>&nbsp;</p>


Abra o terminal do PostgreSQL ou o psql e crie o banco e o usuário (se necessário):
<p>&nbsp;</p>

sudo apt install postgresql postgresql-contrib

sudo -u postgres psql

CREATE DATABASE insonia_db;

CREATE USER usuario WITH PASSWORD 'senha_forte' SUPERUSER;

ALTER ROLE meu_usuario SET client_encoding TO 'utf8';

ALTER ROLE meu_usuario SET timezone TO 'UTC';

GRANT ALL PRIVILEGES ON DATABASE insonia_db TO meu_usuario;
<p>&nbsp;</p>


✏️Editar o settings.py


No bloco DATABASES, substitua pelo PostgreSQL:
<p>&nbsp;</p>

DATABASES =
{

    'default': { 
    
        'ENGINE': 'django.db.backends.postgresql', 
        
        'NAME': 'insonia_db',
        
        'USER': 'meu_usuario',
        
        'PASSWORD': 'minha_senha',
        
        'HOST': 'localhost',
        
        'PORT': '5432',
    }
}

<p>&nbsp;</p>

🔀Execute as migrações:
<p>&nbsp;</p>


python manage.py migrate
<p>&nbsp;</p>


 🔐Criar o superusuário:
<p>&nbsp;</p>

 
python manage.py createsuperuser
<p>&nbsp;</p>


▶️Inicie o servidor: 
<p>&nbsp;</p>


python manage.py runserver
<p>&nbsp;</p>


✨Acesse http://127.0.0.1:8000/admin/
<p>&nbsp;</p>


📡 Acessando a API
A API está disponível em http://localhost:8000/api/

Endpoints principais:

GET /api/products/ - Lista todos os produtos

POST /api/products/ - Cria novo produto

GET /api/products/{id}/ - Detalhes do produto

PUT /api/products/{id}/ - Atualiza produto

DELETE /api/products/{id}/ - Remove produto



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
