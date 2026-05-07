# 🎓 Student Task & Notes Management API

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)

A robust, industry-standard backend system designed to help students manage their daily academic life. This project bridges the gap between basic coding and professional backend engineering.

---

## 🚀 Features

- **User Management**: Secure account creation with password hashing.
- **Task Tracking**: Create, read, update, and delete tasks with deadlines and completion status.
- **Notes Repository**: Store and organize learning goals and study notes.
- **Modular Architecture**: Clean separation of concerns (Models, Schemas, CRUD, Routes).
- **Auto-Generated Docs**: Interactive API documentation via Swagger UI.

## 🛠️ Tech Stack

- **Core**: Python 3.x
- **Framework**: FastAPI
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Security**: Passlib (Bcrypt)

## 📁 Project Structure

```text
├── main.py          # App initialization & Route definitions
├── models.py        # SQLAlchemy Database Models
├── schemas.py       # Pydantic Data Validation
├── crud.py          # Database logic & CRUD operations
├── database.py      # Database connection & Session management
├── requirements.txt # Project dependencies
└── README.md        # Project documentation
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd "Student Task & Notes Management API"
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   uvicorn main:app --reload
   ```

4. **Access the API**:
   - API Root: `http://127.0.0.1:8000`
   - **Swagger UI (Interactive Docs)**: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

## 📡 API Endpoints

### Users
- `POST /users/` - Create a new student account.

### Tasks
- `GET /tasks/` - List all tasks.
- `POST /users/{id}/tasks/` - Create a task for a specific user.
- `PUT /tasks/{id}` - Update task details.
- `DELETE /tasks/{id}` - Remove a task.

### Notes
- `GET /notes/` - List all notes.
- `POST /users/{id}/notes/` - Create a note for a specific user.
- `DELETE /notes/{id}` - Remove a note.

---

## 🌟 Future Enhancements
- [ ] JWT Authentication & Protected Routes
- [ ] AI-Powered Task Summarization
- [ ] Categories & Tags for organization
- [ ] Cloud Deployment (Vercel/Heroku)

---

Developed with ❤️ for Student Success.
