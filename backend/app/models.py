"""SQLAlchemy model for the Patient table."""

from __future__ import annotations

from datetime import date

from sqlalchemy import CheckConstraint, Date, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Patient(Base):
    """A patient currently admitted (or discharged) in the system."""

    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    ward: Mapped[str] = mapped_column(String(50), nullable=False)
    department: Mapped[str] = mapped_column(String(50), nullable=False)
    doctor: Mapped[str] = mapped_column(String(100), nullable=False)
    admission_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(10), nullable=False, default="Admitted")
    created_at: Mapped[str] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        CheckConstraint("age BETWEEN 0 AND 120", name="chk_age_range"),
        CheckConstraint(
            "status IN ('Admitted', 'Discharged')", name="chk_patient_status"
        ),
    )

    def __repr__(self) -> str:  # helps debugging, harmless in prod
        return f"<Patient id={self.id} name={self.name!r}>"
