# Patient Admission Management App

A web app for hospital staff to manage admitted patients: add, view, search, filter, edit, delete and discharge.

Built for the DScribe (Unriddle Technologies) Software Engineer Intern – Round 1 task.

## Live Demo

- **Frontend:** https://YOUR-FRONTEND-URL
- **Backend API:** https://YOUR-BACKEND-URL
- **API docs (Swagger):** https://YOUR-BACKEND-URL/docs

> Free hosting may sleep when idle. The first request can take ~30 seconds to wake up.

## Screenshots

| Desktop | Tablet | Mobile |
|---|---|---|
| ![Desktop](screenshots/desktop.png) | ![Tablet](screenshots/tablet.png) | ![Mobile](screenshots/mobile.png) |

| Add / Edit form | Delete confirmation | Filters and search |
|---|---|---|
| ![Form](screenshots/form.png) | ![Delete](screenshots/delete.png) | ![Filters](screenshots/filters.png) |

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React.js (Vite), plain CSS (responsive) |
| Backend | Python, FastAPI, Pydantic |
| Database | PostgreSQL (SQLite for local dev), via SQLAlchemy |
| Hosting | Frontend on Vercel/Netlify, backend on Render, DB on Neon |

Data is stored in a real database, so it survives server restarts.

## Features

1. Add a patient
2. View all patients
3. Filter by Ward, Department and Doctor
4. Search by name
5. Edit a patient
6. Delete a patient (with confirmation dialog)
7. Mark a patient as Discharged
8. Responsive design for mobile, tablet and desktop

## Patient Fields

| Field | Type |
|---|---|
| Name | Text |
| Age | Number |
| Gender | Select |
| Ward | Select |
| Department | Select |
| Doctor | Select |
| Admission Date | Date |
| Status | Admitted / Discharged |

## Validation

Rules are enforced in **both** the frontend and the backend. The backend is the final authority and returns clear error messages.

| Field | Rule |
|---|---|
| Name | Required, letters (and spaces) only |
| Age | Required, number from 0 to 120 |
| Gender, Ward, Department, Doctor | Required, must be a value from the allowed list |
| Admission Date | Required, cannot be in the future |

Example error response (HTTP 422):

```json
{
  "detail": [
    { "field": "age", "message": "Age must be between 0 and 120" }
  ]
}
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/patients` | List patients. Optional query params: `search`, `ward`, `department`, `doctor` |
| POST | `/patients` | Add a patient |
| GET | `/patients/{id}` | Get one patient |
| PUT | `/patients/{id}` | Edit a patient |
| PATCH | `/patients/{id}/discharge` | Mark as Discharged |
| DELETE | `/patients/{id}` | Delete a patient |
| GET | `/options` | Dropdown values (genders, wards, departments, doctors) |

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app and routes
│   │   ├── models.py      # Database tables
│   │   ├── schemas.py     # Validation rules
│   │   └── database.py    # DB connection
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── screenshots/
└── README.md
```

## Run Locally

**Prerequisites:** Python 3.10+, Node.js 18+ (used only to run the React dev server), Git.

### 1. Clone

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # defaults to local SQLite, no edits needed
uvicorn app.main:app --reload
```

Backend runs at http://localhost:8000 (docs at http://localhost:8000/docs).

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env            # VITE_API_URL=http://localhost:8000
npm run dev
```

Frontend runs at http://localhost:5173.

## Environment Variables

No secrets are committed. Only `.env.example` files with placeholders are in the repo.

**backend/.env.example**
```
DATABASE_URL=sqlite:///./patients.db
CORS_ORIGINS=http://localhost:5173
```

**frontend/.env.example**
```
VITE_API_URL=http://localhost:8000
```

## Deployment Notes

- **Database:** create a free PostgreSQL database on Neon, copy its connection string into the backend's `DATABASE_URL`.
- **Backend (Render):** root `backend`, build `pip install -r requirements.txt`, start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set `DATABASE_URL` and `CORS_ORIGINS` (your frontend URL).
- **Frontend (Vercel/Netlify):** root `frontend`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the backend URL.

## Author

**Your Full Name**: your.email@example.com
