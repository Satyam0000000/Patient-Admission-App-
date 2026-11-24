"""The fixed dropdown lists for the four select fields.

This is the single source of truth on the backend side. The frontend keeps a
copy in src/options.js so both sides always show the same values.
"""

GENDERS = ["Male", "Female", "Other"]
WARDS = ["General", "ICU", "Pediatric", "Emergency"]
DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "General Medicine"]
DOCTORS = ["Dr. Mehta", "Dr. Rao", "Dr. Kapoor", "Dr. Singh"]


def options_dict():
    """Return all four lists in the shape used by GET /options."""
    return {
        "genders": GENDERS,
        "wards": WARDS,
        "departments": DEPARTMENTS,
        "doctors": DOCTORS,
    }
