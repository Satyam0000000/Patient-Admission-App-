// Mobile card: one card per patient, shows key fields and action buttons at the bottom.
export default function PatientCard({
  patient,
  onEdit,
  onDischarge,
  onDelete,
}) {
  return (
    <div className="patient-card">
      <div className="card-actions">
        <button type="button" title="Edit" aria-label={`Edit ${patient.name}`} onClick={() => onEdit(patient.id)}>
          ✎
        </button>
        {patient.status !== "Discharged" && (
          <button type="button" title="Mark Discharged" aria-label={`Mark ${patient.name} discharged`} onClick={() => onDischarge(patient.id)}>
            ✓
          </button>
        )}
        <button type="button" title="Delete" aria-label={`Delete ${patient.name}`} onClick={() => onDelete(patient.id)}>
          ✕
        </button>
      </div>
      <h4>{patient.name}</h4>
      <div className="card-meta">
        <div>Age: <span>{patient.age}</span></div>
        <div>Gender: <span>{patient.gender}</span></div>
        <div>Ward: <span>{patient.ward}</span></div>
        <div>Department: <span>{patient.department}</span></div>
        <div>Doctor: <span>{patient.doctor}</span></div>
        <div>Admitted: <span>{patient.admission_date}</span></div>
        <div className="card-status">
          <span className={`badge badge-${String(patient.status).toLowerCase()}`}>
            {patient.status}
          </span>
        </div>
      </div>
    </div>
  );
}
