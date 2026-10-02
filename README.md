# Taskify
Taskify is a simple yet powerful daily task and habit management application designed to help you stay organized, productive, and consistent.


🚀 Taskify — Task Management Web Application

Taskify is a simple and user-friendly Task Management Web Application designed to help users organize, manage, and track their daily tasks efficiently.

The project is built using HTML, CSS, JavaScript, Python, and FastAPI, with a clean frontend and a lightweight backend API.

✨ Features

- 📝 Create and add new tasks
- ✏️ Update/edit existing tasks
- 🗑️ Delete tasks
- ✅ Mark tasks as completed
- 📋 View and manage all tasks
- 🔄 Fast and responsive API communication
- 🎨 Clean and simple user interface
- ⚡ FastAPI-based backend

🛠️ Tech Stack

Frontend

- HTML5
- CSS3
- JavaScript

Backend

- Python
- FastAPI

Tools

- REST API
- Uvicorn
- Git & GitHub

📁 Project Structure

Taskify/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── main.py
│   └── ...
│
├── requirements.txt
└── README.md

⚙️ Installation & Setup

1. Clone the repository

git clone https://github.com/your-username/taskify.git
cd taskify

2. Create a virtual environment

python -m venv venv

Activate it:

Windows:

venv\Scripts\activate

Linux / macOS:

source venv/bin/activate

3. Install dependencies

pip install -r requirements.txt

4. Run the FastAPI server

uvicorn backend.main:app --reload

The API will be available at:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs

🔌 API Functionality

Taskify uses REST APIs to manage tasks.

Method| Purpose
"GET"| Fetch tasks
"POST"| Create a new task
"PUT"| Update a task
"DELETE"| Delete a task

🎯 Project Objective

The main objective of Taskify is to provide a simple platform for managing everyday tasks while demonstrating how a frontend application can communicate with a Python FastAPI backend through REST APIs.

🔮 Future Improvements

- 🔐 User authentication and registration
- 👤 Personal task dashboards
- 📅 Task deadlines and reminders
- 🔎 Search and filtering
- 🏷️ Task categories and priorities
- 🌐 Cloud database integration
- 📱 Improved mobile responsiveness

👨‍💻 Author

Uma Jaiswal

«Taskify — Organize your tasks. Manage your time. Get things done. 🚀»
