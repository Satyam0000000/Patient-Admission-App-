"""Pydantic validation models for the API.

All rules are enforced here (backend is the final authority). The frontend
keeps a matching copy of the same rules.
"""

from __future__ import annotations

import re
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, field_validator

from .options import DEPARTMENTS, DOCTORS, GENDERS, WARDS

NAME_PATTERN = re.compile(r"^[A-Za-z ]+$")


def _validate_choice(value: str, allowed: list, label: str) -> str:
    if value is None or value == "":
        raise ValueError(f"{label} is required")
    if value not in allowed:
        raise ValueError(f"Choose a valid {label.lower()}")
    return value


class PatientBase(BaseModel):
    """Fields shared by create and update bodies."""

    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        name = v.strip() if isinstance(v, str) else ""
        if not name:
            raise ValueError("Name is required")
        if not NAME_PATTERN.match(name):
            raise ValueError("Name must contain letters and spaces only")
        if len(name) > 100:
            raise ValueError("Name must be 100 characters or less")
        return name

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v is None or v == "":
            raise ValueError("Age is required")
        if not 0 <= v <= 120:
            raise ValueError("Age must be between 0 and 120")
        return v

    @field_validator("admission_date")
    @classmethod
    def validate_admission_date(cls, v: date) -> date:
        if v is None:
            raise ValueError("Admission date is required")
        if v > date.today():
            raise ValueError("Admission date cannot be in the future")
        return v

    @field_validator("gender", mode="before")
    @classmethod
    def validate_gender(cls, v):
        return _validate_choice(v, GENDERS, "Gender")

    @field_validator("ward", mode="before")
    @classmethod
    def validate_ward(cls, v):
        return _validate_choice(v, WARDS, "Ward")

    @field_validator("department", mode="before")
    @classmethod
    def validate_department(cls, v):
        return _validate_choice(v, DEPARTMENTS, "Department")

    @field_validator("doctor", mode="before")
    @classmethod
    def validate_doctor(cls, v):
        return _validate_choice(v, DOCTORS, "Doctor")


class PatientCreate(PatientBase):
    """Body for POST /patients. Status is decided by the server."""

    status: str = "Admitted"

    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, v):
        if v is None or v == "":
            return "Admitted"
        return _validate_choice(v, ["Admitted", "Discharged"], "Status")


class PatientUpdate(PatientBase):
    """Body for PUT /patients/{id}. Status is optional here."""

    status: str | None = None

    @field_validator("status", mode="before")
    @classmethod
    def validate_status_opt(cls, v):
        if v is None or v == "":
            return None
        return _validate_choice(v, ["Admitted", "Discharged"], "Status")


class PatientOut(BaseModel):
    """Shape returned by all GET endpoints (serialized from the ORM object)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date
    status: str
    created_at: datetime | None = None
