"""FastAPI app with all patient routes.

Run locally with:

    uvicorn app.main:app --reload

Create tables at startup; no migrations needed for this scale.
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import DATABASE_URL, get_db, init_db
from .models import Patient
from .options import options_dict
from .schemas import PatientCreate, PatientOut, PatientUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables at startup; print which DB is in use."""
    init_db()
    print(f"[main] Database URL: {DATABASE_URL}")
    yield


app = FastAPI(title="Patient Admission API", lifespan=lifespan)

CORS_ORIGINS = [
    o.strip()
    for o in os.environ.get("CORS_ORIGINS", "").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS or ["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request, exc: RequestValidationError):
    """Reshape Pydantic errors into {"detail": [{"field", "message"}]}."""
    details = []
    for err in exc.errors():
        loc = err.get("loc") or []
        field = str(loc[-1]) if loc else ""
        if field in ("body", ""):
            field = "general"
        msg = str(err.get("msg", "Invalid value"))
        if msg.startswith("Value error, "):
            msg = msg[len("Value error, "):]
        details.append({"field": field, "message": msg})
    return JSONResponse(status_code=422, content={"detail": details})


def _get_patient(db: Session, patient_id: int) -> Patient:
    patient = db.get(Patient, patient_id)
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@app.get("/health")
def health():
    """Tiny endpoint for quick live checks."""
    return {"status": "ok"}


@app.get("/options")
def get_options():
    """Dropdown values for the four selects (genders, wards, ...)."""
    return options_dict()


@app.get("/patients", response_model=list[PatientOut])
def list_patients(
    search: str | None = Query(None, max_length=100),
    ward: str | None = Query(None),
    department: str | None = Query(None),
    doctor: str | None = Query(None),
    db: Session = Depends(get_db),
):
    """List patients, optionally filtered by name or the three selects."""
    query = select(Patient).order_by(Patient.id)
    if search:
        query = query.where(Patient.name.ilike(f"%{search.strip()}%"))
    if ward:
        query = query.where(Patient.ward == ward)
    if department:
        query = query.where(Patient.department == department)
    if doctor:
        query = query.where(Patient.doctor == doctor)
    return db.execute(query).scalars().all()


@app.post("/patients", response_model=PatientOut, status_code=201)
def create_patient(patient_in: PatientCreate, db: Session = Depends(get_db)):
    """Add a patient. Status is always set to 'Admitted' by the server."""
    patient = Patient(**patient_in.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@app.get("/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Get one patient by id."""
    return _get_patient(db, patient_id)


@app.put("/patients/{patient_id}", response_model=PatientOut)
def update_patient(
    patient_id: int,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db),
):
    """Edit a patient. Fields with status=None keep their current value."""
    patient = _get_patient(db, patient_id)
    for key, value in patient_in.model_dump(exclude_none=True).items():
        setattr(patient, key, value)
    db.commit()
    db.refresh(patient)
    return patient


@app.patch("/patients/{patient_id}/discharge", response_model=PatientOut)
def discharge_patient(patient_id: int, db: Session = Depends(get_db)):
    """Mark a patient as Discharged."""
    patient = _get_patient(db, patient_id)
    patient.status = "Discharged"
    db.commit()
    db.refresh(patient)
    return patient


@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    """Delete a patient."""
    patient = _get_patient(db, patient_id)
    db.delete(patient)
    db.commit()
    return {"message": "Patient deleted"}
