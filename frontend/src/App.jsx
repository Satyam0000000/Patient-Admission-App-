import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "./api";
import { OPTIONS } from "./options";
import Alert from "./components/Alert";
import ConfirmDialog from "./components/ConfirmDialog";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";

const EMPTY_FILTERS = { search: "", ward: "", department: "", doctor: "" };

function toParams(filters) {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.ward) params.set("ward", filters.ward);
  if (filters.department) params.set("department", filters.department);
  if (filters.doctor) params.set("doctor", filters.doctor);
  return params.toString();
}

export default function App() {
  const [patients, setPatients] = useState([]);
  const [options, setOptions] = useState(OPTIONS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [editingId, setEditingId] = useState(null); // null = no form; "new" = add; number = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [dischargingId, setDischargingId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loadPatients = useCallback(async (f) => {
    setLoading(true);
    setApiError(null);
    const qs = toParams(f);
    try {
      setPatients(await apiRequest(`/patients${qs ? "?" + qs : ""}`));
    } catch (e) {
      setApiError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients(filters);
  }, [filters, loadPatients]);

  useEffect(() => {
    apiRequest("/options")
      .then(setOptions)
      .catch((e) => setApiError(e.message));
  }, []);

  const editPatient =
    editingId === null
      ? null
      : patients.find((p) => p.id === editingId) || null;

  const handleSaved = () => {
    setEditingId(null);
    setSuccess("Patient saved.");
    loadPatients(filters);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeletingId(id);
    try {
      await apiRequest(`/patients/${id}`, { method: "DELETE" });
      setSuccess(`Patient ${deleteTarget.name} deleted.`);
      setDeleteTarget(null);
      loadPatients(filters);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleDischarge = async (id) => {
    setDischargingId(id);
    try {
      await apiRequest(`/patients/${id}/discharge`, { method: "PATCH" });
      setSuccess("Marked as Discharged.");
      loadPatients(filters);
    } catch (e) {
      setApiError(e.message);
    } finally {
      setDischargingId(null);
    }
  };

  // Clicking "+ Add patient" scrolls down to the form right below the list.
  const addPatient = () => {
    setEditingId("new");
    setTimeout(() => {
      document
        .getElementById("add-patient-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  // Clicking Edit scrolls down to the form below the list.
  const handleEdit = (id) => {
    setEditingId(id);
    setTimeout(() => {
      document
        .getElementById("add-patient-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <main className="app">
      <Header onAddPatient={addPatient} />
      <FilterBar
        filters={filters}
        options={options}
        onChange={(key) => (e) =>
          setFilters((f) => ({ ...f, [key]: e.target.value }))
        }
        onClear={() => setFilters(EMPTY_FILTERS)}
      />
      <Alert error={apiError} success={success} />
      <PatientList
        patients={patients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={(id) =>
          setDeleteTarget(patients.find((p) => p.id === id) || { id })
        }
        onDischarge={handleDischarge}
        deletingId={deletingId}
        dischargingId={dischargingId}
      />
      <PatientForm
        patient={editingId === "new" ? null : editPatient}
        options={options}
        onSaved={handleSaved}
        onCancel={() => setEditingId(null)}
      />
      <ConfirmDialog
        patient={deleteTarget}
        loading={deletingId !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
