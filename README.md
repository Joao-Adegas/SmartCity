![](..//SmartCity/FrontEnd/src/assets/Logo.png)

# Smart City
<br/>

### Plataforma para gerenciamento de sensores , ambientes e histórico para uma cidade inteligente. Assim podendo realizar CRUD completo de Sensores ( temperaturam 🌡️, umidade💧, luminosidade💡 e contagem🔢), Ambientes e Históricos. A plataforma vem com um painel Dashboard para melhor vizualização de dados.
<br/>

# Tecnologias ultilizadas
## BackEnd
<br/>
<img src="https://1000logos.net/wp-content/uploads/2020/08/Django-Logo.png" align="center" alt="django-icon" width="120" heigth="auto" style="margin-right: 20px;">
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzo4vK4D5nnq7lpwvbWJOzkdPI9Fj3oEHFHg&s" alt="django-icon" width="120" heigth="auto" align="center" style="margin-right: 20px;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt="django-icon" width="60" heigth="auto" align="center" style="margin-right: 20px;">

## FrontEnd
<br/>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png" align="center" alt="django-icon" width="60" heigth="auto" style="margin-right: 20px;">
<img src="https://img.icons8.com/fluent/512/vite.png" alt="django-icon" width="60" heigth="auto" align="center" style="margin-right: 20px;">
<img src="https://img.icons8.com/color/512/sass.png" alt="django-icon" width="60" heigth="auto" align="center" style="margin-right: 20px;">

<br/><br/>

# Como iniciar o projeto


## 1. Inciar o BackEnd
### 1.1 Entre na pasta do BackEnd:
    cd ./SmartCity/BackEnd

### 1.2 Instale o ambiente virtual:
    python -m venv env

### 1.3 Inicie o ambiente virtual
    ./env/Scripts/activate

### 1.4 Instale as bibliotecas presentes no requiremenmts.txt
    pip install -r requirements.txt

### 1.5 Crie um super usuário (admin)
    python manage.py createsuperuser

### 1.6 Atualize o Banco de Dados db.sqlite3
    python manage.py makemigrations
    python manage.py migrate

### 1.7 Inicie o BackEnd
    python manage.py runserver

## Backend esta rodadnom, agora volte para a raiz do projeto
    cd..
    cd..

## 2. Iniciar FrontEnd
### 2.1 Entre na pasta do FrontEnd
    ./SmartCity/FrontEnd

### Instale as Bibliotecas usadas
    npm i

## Inicie o FrontEnd em React
    npm run dev

## O projeto esta rodando !! Agora clique no link que foi fornecido no terminal.

    

# Link documentação API Django 
https://documenter.getpostman.com/view/21570052/2sB2xBDpx8

# Link Documentação
https://docs.google.com/document/d/1VO-hmSUhJF6IImUhMjrjvHk8TlAjtL2VxpymGZPjZlE/edit?tab=t.0
