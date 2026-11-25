import { useEffect, useState } from "react";
import { apiRequest } from "../api";

const FIELD_LABELS = {
  gender: "Gender",
  ward: "Ward",
  department: "Department",
  doctor: "Doctor",
};

function todayStr() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function initialForm(patient) {
  return {
    name: patient?.name ?? "",
    age: patient?.age ?? "",
    gender: patient?.gender ?? "",
    ward: patient?.ward ?? "",
    department: patient?.department ?? "",
    doctor: patient?.doctor ?? "",
    admission_date: patient?.admission_date ?? todayStr(),
    status: patient?.status ?? "Admitted",
  };
}

// Frontend mirrors the backend rules (backend is the final authority).
function validate(form, options) {
  const errors = {};
  const name = form.name.trim();
  if (!name) errors.name = "Name is required";
  else if (!/^[A-Za-z ]+$/.test(name))
    errors.name = "Name must contain letters and spaces only";
  else if (name.length > 100)
    errors.name = "Name must be at most 100 characters";

  const age = String(form.age).trim();
  if (!age) errors.age = "Age is required";
  else if (!/^\d+$/.test(age) || Number(age) < 0 || Number(age) > 120)
    errors.age = "Age must be between 0 and 120";

  for (const key of ["gender", "ward", "department", "doctor"]) {
    if (!form[key]) {
      errors[key] = `${FIELD_LABELS[key]} is required`;
    } else if (!options[key + "s"]?.includes(form[key])) {
      errors[key] = `Choose a valid ${key}`;
    }
  }

  if (!form.admission_date) errors.admission_date = "Admission date is required";
  else if (form.admission_date > todayStr())
    errors.admission_date = "Admission date cannot be in the future";

  return errors;
}

export default function PatientForm({ patient, options, onSaved, onCancel }) {
  const [form, setForm] = useState(initialForm(patient));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // When the form opens in "Edit" mode (or the patient changes),
  // pre-fill all fields from the patient object.
  useEffect(() => {
    setForm(initialForm(patient));
  }, [patient]);

  const change = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const showErr = (key) =>
    errors[key] ? <span className="err">{errors[key]}</span> : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form, options);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await apiRequest(patient ? `/patients/${patient.id}` : "/patients", {
        method: patient ? "PUT" : "POST",
        body: {
          name: form.name.trim(),
          age: Number(form.age),
          gender: form.gender,
          ward: form.ward,
          department: form.department,
          doctor: form.doctor,
          admission_date: form.admission_date,
          status: form.status,
        },
      });
      setErrors({});
      onSaved();
    } catch (err) {
      setErrors({ general: err.message || "Save failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{patient ? "Edit patient" : "Add new patient"}</h2>
      {errors.general && <div className="err">{errors.general}</div>}
      <div className="form-grid">
        <label>
          Name *
          <input value={form.name} onChange={change("name")} placeholder="Full name" />
          {showErr("name")}
        </label>
        <label>
          Age *
          <input
            type="number"
            min="0"
            max="120"
            value={form.age}
            onChange={change("age")}
          />
          {showErr("age")}
        </label>
        <label>
          Gender *
          <select value={form.gender} onChange={change("gender")}>
            <option value="">Choose…</option>
            {options.genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          {showErr("gender")}
        </label>
        <label>
          Ward *
          <select value={form.ward} onChange={change("ward")}>
            <option value="">Choose…</option>
            {options.wards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {showErr("ward")}
        </label>
        <label>
          Department *
          <select value={form.department} onChange={change("department")}>
            <option value="">Choose…</option>
            {options.departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {showErr("department")}
        </label>
        <label>
          Doctor *
          <select value={form.doctor} onChange={change("doctor")}>
            <option value="">Choose…</option>
            {options.doctors.map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
          </select>
          {showErr("doctor")}
        </label>
        <label>
          Admission date *
          <input
            type="date"
            value={form.admission_date}
            onChange={change("admission_date")}
          />
          {showErr("admission_date")}
        </label>
        <label>
          Status
          <select value={form.status} onChange={change("status")}>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="primary" disabled={saving}>
          {saving && <span className="spinner" aria-hidden="true"></span>}
          {saving ? "Saving…" : patient ? "Save changes" : "Add patient"}
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
