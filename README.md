Insônia - Sistema de Vendas de Produtos

Insonia é um sistema de gerenciamento de vendas de produtos desenvolvido com django, ele permite o cadastro e controle de produtos, controle de vendas, análise de lucro por período e muito mais.

🚀 Projeto desenvolvido por Tiago Monteiro – estudante de Análise e Desenvolvimento de Sistemas e apaixonado por Python e Django.

![image](https://github.com/user-attachments/assets/fcd61bad-3a55-4d7e-bc96-64a2ea7bd81b)
![image](https://github.com/user-attachments/assets/73577720-e040-47cb-9389-7860eb3d32cf)
<img src="[link-da-imagem.png](https://github.com/user-attachments/assets/fcd61bad-3a55-4d7e-bc96-64a2ea7bd81b)" width="200"/>
<img src="[link-da-imagem.png](https://github.com/user-attachments/assets/73577720-e040-47cb-9389-7860eb3d32cf)" width="50"/> 


⚙️ Funcionalidades:
<p>&nbsp;</p>
🧾 Cadastro, edição e exclusão de produtos

💰 Registro de vendas e controle de estoque

📊 Filtro de lucro por período

🔍 Busca e filtros inteligentes

📈 Análise de desempenho das vendas

📋 Dashboard simples e intuitivo

🔐 Sistema de autenticação de usuários


💻 Tecnologias utilizadas:
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

Python 🐍
Django==5.0 🕸️
Postgresql
bootstrap com HTML e CSS

🚧 Como rodar o projeto localmente:
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

git clone https://github.com/Tiago-Monteirox/insonia.git

cd insonia
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

Crie e ative um ambiente virtual:

python -m venv venv

source venv/bin/activate  # ou venv\Scripts\activate no Windows

Instale as dependências:
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

pip install -r requirements.txt

🛠️ Criar o banco no PostgreSQL
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

Abra o terminal do PostgreSQL ou o psql e crie o banco e o usuário (se necessário):
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

CREATE DATABASE insonia_db;

CREATE USER meu_usuario WITH PASSWORD 'minha_senha';

ALTER ROLE meu_usuario SET client_encoding TO 'utf8';

ALTER ROLE meu_usuario SET timezone TO 'UTC';

GRANT ALL PRIVILEGES ON DATABASE insonia_db TO meu_usuario;

✏️ Editar o settings.py
<p>Texto&nbsp;&nbsp;&nbsp;com&nbsp;&nbsp;&nbsp;vários&nbsp;&nbsp;&nbsp;espaços.</p>

No bloco DATABASES, substitua pelo PostgreSQL:

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


Execute as migrações:

python manage.py migrate

 🔐 Criar o superusuário:
 
python manage.py createsuperuser

Inicie o servidor: 

python manage.py runserver

Acesse http://127.0.0.1:8000/admin/


📥 Importação de Dados via Planilha Excel

O sistema possui um script automatizado para leitura de dados diretamente de uma planilha Excel (.xlsx), o que permite importar produtos em massa de forma prática e rápida para o banco de dados.

Esse recurso é útil, por exemplo, para cadastrar rapidamente uma grande quantidade de itens com informações como:

![image](https://github.com/user-attachments/assets/867d1379-784b-4274-a1dd-e1a7ba14ac4b)

Esse script faz a leitura da planilha, processa os dados e registra os produtos diretamente no banco utilizando os modelos do Django.

🧠 Esse recurso é ideal para quem já tem o estoque organizado em Excel e deseja migrar para o sistema sem precisar cadastrar item por item manualmente.



