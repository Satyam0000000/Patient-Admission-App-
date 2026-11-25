import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { apiRequest } from "./api";
import { OPTIONS } from "./options";
import Toast from "./components/Toast";
import ConfirmModal from "./components/ConfirmModal";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import PatientCard from "./components/PatientCard";
import PatientFormModal from "./components/PatientFormModal";
import PatientTable from "./components/PatientTable";
import Pagination from "./components/Pagination";

const EMPTY_FILTERS = { search: "", ward: "", department: "", doctor: "", status: "all" };
const PAGE_SIZE = 10;
const MOBILE_QUERY = "(max-width: 640px)";

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
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null); // null = closed; "new" = add; number = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia(MOBILE_QUERY).matches
  );
  const barRef = useRef(null);

  // Keeps the top bar (header + filters) pinned while the list scrolls.
  useEffect(() => {
    if (!barRef.current) return undefined;
    document.documentElement.style.setProperty(
      "--sticky-top",
      `${barRef.current.offsetHeight}px`
    );
  }, []);

  // Mobile detection for the layout switch (table on desktop, cards on mobile).
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Loads the (optionally filtered) patient list. Newest first.
  const loadPatients = useCallback(async (f) => {
    setLoading(true);
    const qs = toParams(f);
    try {
      const data = await apiRequest(`/patients${qs ? "?" + qs : ""}`);
      data.sort(
        (a, b) => (b.admission_date || "").localeCompare(a.admission_date) || b.id - a.id
      );
      setPatients(data);
    } catch (e) {
      setServerError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced reload: resets to page 1 and refetches whenever filters change.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadPatients(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, loadPatients]);

  useEffect(() => {
    apiRequest("/options").then(setOptions).catch(() => {});
  }, []);

  // Body scroll lock while the modal is open.
  useEffect(() => {
    if (!editingId) return undefined;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [editingId]);

  // Close the modal with the Escape key while it is open.
  useEffect(() => {
    if (!editingId) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) {
        setEditingId(null);
        setServerError(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [editingId, saving]);

  const addToast = (message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  // --- add/edit (modal) -------------------------------------------------
  const handleSave = async (formData) => {
    setSaving(true);
    setServerError(null);
    try {
      if (editingId === "new") {
        await apiRequest("/patients", { method: "POST", body: formData });
        addToast("Patient added");
      } else {
        await apiRequest(`/patients/${editingId}`, { method: "PUT", body: formData });
        addToast("Patient updated");
      }
      setEditingId(null);
      await loadPatients(filters);
    } catch (e) {
      setServerError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // --- discharge --------------------------------------------------------
  const handleDischarge = async (id) => {
    try {
      await apiRequest(`/patients/${id}/discharge`, { method: "PATCH" });
      addToast("Marked as Discharged");
      await loadPatients(filters);
    } catch (e) {
      addToast(e.message, "error");
    }
  };

  // --- delete ------------------------------------------------------------
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiRequest(`/patients/${deleteTarget.id}`, { method: "DELETE" });
      addToast(`Deleted ${deleteTarget.name}`);
      setDeleteTarget(null);
      await loadPatients(filters);
    } catch (e) {
      addToast(e.message, "error");
      setDeleteTarget(null);
    }
  };

  // --- list + pagination -------------------------------------------------
  const filtered = useMemo(
    () => patients.filter((p) => filters.status === "all" || p.status === filters.status),
    [patients, filters.status]
  );
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const startShown = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endShown = Math.min(page * PAGE_SIZE, total);
  const hasActiveFilters =
    filters.search || filters.ward || filters.department || filters.doctor;

  return (
    <main className="app">
      {/* Sticky header + filter bar — stays visible while scrolling */}
      <div className="sticky-bar" ref={barRef}>
        <Header onAddPatient={() => { setEditingId("new"); setServerError(null); }} />
        <FilterBar
          filters={filters}
          options={options}
          onChange={(key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <Toast toasts={toasts} />

      {total > 0 && (
        <p className="result-count">
          Showing {startShown}–{endShown} of {total} patients
        </p>
      )}

      {isMobile ? (
        <div className="patient-cards">
          {pageItems.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              onEdit={(id) => setEditingId(id)}
              onDischarge={handleDischarge}
              onDelete={(id) => setDeleteTarget(patients.find((x) => x.id === id))}
            />
          ))}
        </div>
      ) : (
        <PatientTable
          patients={pageItems}
          loading={loading}
          onEdit={(id) => setEditingId(id)}
          onDischarge={handleDischarge}
          onDelete={(id) => setDeleteTarget(patients.find((x) => x.id === id))}
        />
      )}

      {total > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}

      {total === 0 && !loading && (
        <div className="empty">
          <div className="empty-text">No patients found</div>
          {hasActiveFilters && (
            <button type="button" className="ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {editingId !== null && (
        <PatientFormModal
          patient={editingId === "new" ? null : patients.find((p) => p.id === editingId)}
          options={options}
          saving={saving}
          serverError={serverError}
          onClose={() => {
            setEditingId(null);
            setServerError(null);
          }}
          onSubmit={handleSave}
        />
      )}

      <ConfirmModal
        patient={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
