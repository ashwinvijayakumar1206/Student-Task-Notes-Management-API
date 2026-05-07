# 🎓 Student Hub | Next.js + FastAPI

A premium, full-stack platform for students to manage tasks and study notes. Built with **Next.js 14**, **FastAPI**, and **SQLAlchemy**.

---

## 🚀 Features

- **Next.js Dashboard**: A sleek, modern UI with Framer Motion animations.
- **FastAPI Backend**: Robust serverless API for managing data.
- **Responsive Design**: Fully optimized for mobile and desktop.
- **Glassmorphism Aesthetic**: Modern design system using Tailwind CSS.

## 📁 Project Structure

```text
├── api/             # FastAPI Backend (Serverless Functions)
│   ├── main.py      # Entry point
│   ├── models.py    # Database models
│   └── ...
├── src/app/         # Next.js Frontend (App Router)
│   ├── layout.tsx
│   └── page.tsx
├── package.json     # Node.js dependencies
├── requirements.txt # Python dependencies
└── vercel.json      # Vercel deployment config
```

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
