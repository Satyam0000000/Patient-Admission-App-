# Patient Admission Management App

A web app for hospital staff: manage admitted patients — add, view, search, filter, edit, delete, and mark as discharged.

## Features

- Add new patients (name, age, gender, ward, department, doctor, admission date)
- View the list of all patients
- Search patients by name
- Filter by Ward, Department and Doctor (filters combine)
- Edit any patient
- Delete a patient (with a confirmation dialog)
- Mark a patient as Discharged
- Responsive design — works on mobile, tablet and desktop

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React.js (Vite), plain CSS (responsive) |
| Backend | Python, FastAPI, Pydantic |
| Database | PostgreSQL (SQLite for local dev), via SQLAlchemy |
| Hosting | Frontend on Vercel/Netlify, backend on Render, DB on Neon |

Validation (required, letters-only name, age 0–120, dropdowns from a fixed list, no future admission dates) is enforced in both frontend and backend.

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app + routes
│   │   ├── models.py       # SQLAlchemy Patient table
│   │   ├── schemas.py      # Pydantic validation models
│   │   ├── options.py      # Allowed dropdown values
│   │   ├── database.py     # Engine, SessionLocal, Base
│   │   └── tests are run manually via curl / browser (see Testing)
│   ├── requirements.txt
│   ├── .env.example
│   └── venv/               # your virtualenv (not committed)
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # all state and API calls (simple on purpose)
│   │   ├── api.js           # fetch helper
│   │   ├── options.js       # same dropdown values as backend
│   │   ├── styles.css       # responsive styles
│   │   └── components/      # Header, FilterBar, PatientForm, PatientList, ConfirmDialog, Alert
│   ├── package.json
│   └── .env.example
├── screenshots/             # capture from the app (desktop, tablet, mobile)
└── README.md
```

## Run locally

**Prerequisites:** Python 3.10+, Node.js 18+, Git.

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000 (docs at /docs)
```

Default DB is a local file `patients.db`. API docs: http://localhost:8000/docs.

### Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

The frontend calls `VITE_API_URL` (default `http://localhost:8000`) — set it via `.env` if your backend is elsewhere.

## Deployment (free tier)

### 1. Database (Neon)
1. Sign up at https://neon.tech (free tier).
2. Create a project, copy the Postgres connection string.
3. Paste it into Render's `DATABASE_URL` below. (Keep it out of GitHub — use Render's env vars.)

### 2. Backend (Render)
1. Push this repo to GitHub (it must be public).
2. Create a new Web Service on Render:
   - Connect your repo, root directory `backend`
   - Runtime: Python
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment variables:
     - `DATABASE_URL` = your Neon connection string (append `?sslmode=require` if missing)
     - `CORS_ORIGINS` = your final frontend URL, e.g. `https://your-frontend.vercel.app`
3. Deploy, then open `https://your-backend.onrender.com/docs` — you should see the Swagger UI.

### 3. Frontend (Vercel or Netlify)
1. Import the repo, root directory `frontend`, framework Vite.
2. Set environment variable `VITE_API_URL` = the live backend URL (e.g. `https://your-backend.onrender.com`) — set it **before** the first deploy.
3. Build command: `npm run build` (default), output `dist` (default).
4. Save the live URL — add it to Render's `CORS_ORIGINS` and re-deploy the backend if you changed it.

### Notes
- Free hosting may sleep when idle — the first request can take ~30 seconds.
- Data persists on the live Postgres (Neon); locally it persists in `backend/patients.db`.

## Testing

Run locally:
1. Start backend (`cd backend && .venv/bin/uvicorn app.main:app --reload` or `venv/bin/uvicorn` on Windows).
2. Start frontend (`cd frontend && npm run dev`).
3. Try every feature in the browser: add, list, search, filters, edit, discharge, delete (confirm dialog), mobile/desktop widths.
4. Try backend rules directly in `/docs` — bad names, age 121, future dates, unknown dropdown values → expect clear errors.

## Screenshots

Add screenshots of the app at three widths into `screenshots/` (`desktop.png`, `tablet.png`, `mobile.png`) and of the add form, delete dialog and filters (`form.png`, `delete.png`, `filters.png`).

## Author

Your Name <your.email@example.com>
