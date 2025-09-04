<p align="center">
  <img src="./FrontEnd/src/assets/Logo.png" alt="Smart City Logo" width="300">
</p>

# 🌆 Smart City Platform

Welcome to **Smart City**, a modern platform designed to manage sensors, environments, and historical data for smart urban spaces. Whether you're tracking temperature 🌡️, humidity 💧, luminosity 💡, or people count 🔢 — this app gives you full CRUD control and a sleek dashboard to visualize it all.

---

## 🛠️ Tech Stack

### 🔙 BackEnd
Built with the power of:

<p align="center">
  <img src="https://1000logos.net/wp-content/uploads/2020/08/Django-Logo.png" alt="Django" width="100">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png" alt="Python" width="60">
</p>

### 🔜 FrontEnd
Crafted using:

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png" alt="React" width="60">
  <img src="https://img.icons8.com/fluent/512/vite.png" alt="Vite" width="60">
  <img src="https://img.icons8.com/color/512/sass.png" alt="Sass" width="60">
</p>

---

## 🚀 Getting Started

Let’s get your Smart City up and running!

### 🧩 1. Start the BackEnd

```bash
# Navigate to the backend folder
cd ./SmartCity/BackEnd

# Create a virtual environment
python -m venv env

# Activate the environment
# On Windows:
./env/Scripts/activate
# On macOS/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create an admin user
python manage.py createsuperuser

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver
