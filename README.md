![](..//SmartCity/FrontEnd/src/assets/Logo.png)

# Smart City


### Platform for managing sensors, environments and history for a smart city. It can perform a complete CRUD of Sensors (temperature 🌡️, humidity💧, luminosity💡 and count🔢), Environments and Histories. The platform comes with a Dashboard for better data visualization.


### Technologies used
### BackEnd

<img src="https://1000logos.net/wp-content/uploads/2020/08/Django-Logo.png" align="center" alt="django-icon" width="120" heigth="auto" style="margin-right: 20px;">
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzo4vK4D5nnq7lpwvbWJOzkdPI9Fj3oEHFHg&s" alt="django-icon" width="120" heigth="auto" align="center" style="margin-right: 20px;">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt="django-icon" width="60" heigth="auto" align="center" style="margin-right: 20px;">

### FrontEnd

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png" align="center" alt="django-icon" width="60" heigth="auto" style="margin-right: 20px;">
<img src="https://img.icons8.com/fluent/512/vite.png" alt="django-icon" width="60" heigth="auto" align="center" style="margin-right: 20px;">
<img src="https://img.icons8.com/color/512/sass.png" alt="django-icon" width="60" heigth="auto" align="center" style="margin-right: 20px;">



### How to start the project


### 1. start BackEnd
### 1.1 Enter the BackEnd folder:
    cd ./SmartCity/BackEnd

### 1.2 Install the virtual environment:
    python -m venv env

### 1.3 Start the virtual environment:
    ./env/Scripts/activate

### 1.4 install the libraries from requirements.txt
    pip install -r requirements.txt

### 1.5 Create a super user (admin)
    python manage.py createsuperuser

### 1.6 Update the db.sqlite3 database
    python manage.py makemigrations
    python manage.py migrate

### 1.7 Start BackEnd
    python manage.py runserver

### Backend is running, now go back to the root of the project
    cd..
    cd..

### 2. Start FrontEnd
### 2.1 Enter the FrontEnd folder
    ./SmartCity/FrontEnd

### Install the Libraries used
    npm i

### Start the FrontEnd in React
    npm run dev

### The project is running! Now click on the link provided in the terminal.

    

### Django API documentation link 
https://documenter.getpostman.com/view/21570052/2sB2xBDpx8

### Link Documentação Project
https://docs.google.com/document/d/1VO-hmSUhJF6IImUhMjrjvHk8TlAjtL2VxpymGZPjZlE/edit?tab=t.0
