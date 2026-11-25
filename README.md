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

### 0. Push the app to GitHub (public repo)

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Make sure `.env` is **not** committed (it's gitignored) — only `backend/.env.example` and `frontend/.env.example` are in the repo.

### 1. Database (Neon)
1. Sign up at https://neon.tech (free tier).
2. Create a project, copy the Postgres connection string.
3. Paste it into Render's `DATABASE_URL` below. (Keep it out of GitHub — use Render's env vars.)

### 2. Backend (Render)
1. Go to render.com → **New → Web Service** → connect your GitHub repo.
2. Settings:
   - **Root directory:** `backend`
   - **Runtime:** Python
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Environment variables** (before first deploy):
   - `DATABASE_URL` = your Neon connection string (include `?sslmode=require`)
   - `CORS_ORIGINS` = the **exact frontend origin** you will use, e.g. `https://your-frontend.vercel.app`
     - **Important:** no trailing slash, no path — just the origin. Example: `https://patient-admission-app-frontend.vercel.app`
     - List multiple with commas if you use more than one (e.g. `https://app.vercel.app,https://www.app.vercel.app`)
4. **Deploy**, then open `https://your-backend.onrender.com/docs` — you should see the Swagger UI.
5. If you change `CORS_ORIGINS` later, **Manual Deploy → Deploy latest commit** (env changes alone may not redeploy).

### 3. Frontend (Vercel)
1. Go to vercel.com → **Add New → Project** → import the same GitHub repo.
2. Settings:
   - **Root directory:** `frontend`
   - **Framework preset:** Vite (auto-detected)
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. **Environment variable — set BEFORE the first deploy:**
   - `VITE_API_URL` = the **live Render backend URL** (e.g. `https://patient-admission-app-j15x.onrender.com`), no trailing slash.
4. Click **Deploy**. You'll get a URL like `https://your-frontend.vercel.app`.

### 4. Link backend ↔ frontend (CORS)
1. Now that the frontend has a real URL, go back to Render → your backend service.
2. Update `CORS_ORIGINS` to the exact frontend URL, e.g. `https://your-frontend.vercel.app` (no trailing slash).
3. Save → **Manual Deploy → Deploy latest commit**.
4. Verify it worked (in terminal):
   ```bash
   curl -H "Origin: https://your-frontend.vercel.app" \
        -D- -o /dev/null \
        https://your-backend.onrender.com/options | grep -i access-control
   ```
   Expect to see: `access-control-allow-origin: https://your-frontend.vercel.app`
5. Hard-refresh the Vercel page (Cmd/Ctrl+Shift+R) — the CORS errors should be gone.

### Live links
- Frontend: https://YOUR-FRONTEND-URL
- Backend API: https://YOUR-BACKEND-URL
- API docs (Swagger): https://YOUR-BACKEND-URL/docs

### Notes
- Free hosting may sleep when idle — the first request can take ~30 seconds.
- Data persists on the live Postgres (Neon); locally it persists in `backend/patients.db`.

## Testing

Run locally:
1. Start backend (`cd backend && ./venv/bin/uvicorn app.main:app --reload` or `venv\Scripts\activate` + `uvicorn app.main:app --reload` on Windows).
2. Start frontend (`cd frontend && npm run dev`).
3. Try every feature in the browser: add, list, search, filters, edit, discharge, delete (confirm dialog), mobile/desktop widths.
4. Try backend rules directly in `/docs` — bad names, age 121, future dates, unknown dropdown values → expect clear errors.
5. Live check: open the Vercel frontend → add a patient → **refresh the page** → patient still there (proves Neon persistence).

## Screenshots

Add screenshots of the app at three widths into `screenshots/` (`desktop.png`, `tablet.png`, `mobile.png`) and of the add form, delete dialog and filters (`form.png`, `delete.png`, `filters.png`).

## Author

Your Name <your.email@example.com>
