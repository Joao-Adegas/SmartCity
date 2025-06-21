![](..//SmartCity/FrontEnd/src/assets/Logo.png)

# Smart City
### Plataforma para gerenciamento de sensores , ambientes e histórico para uma cidade inteligente. Assim podendo realizar CRUD completo de Sensores ( temperaturam 🌡️, umidade💧, luminosidade💡 e contagem🔢), Ambientes e Históricos. A plataforma vem com um painel Dashboard para melhor vizualização de dados.
     
# como iniciar o projeto

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
