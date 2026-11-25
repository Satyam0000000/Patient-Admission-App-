// Mobile card: one card per patient with key fields and labeled action buttons at the bottom.
export default function PatientCard({ patient, onEdit, onDischarge, onDelete }) {
  return (
    <div className="patient-card">
      <div className="card-actions">
        <button type="button" onClick={() => onEdit(patient.id)}>
          Edit
        </button>
        {patient.status !== "Discharged" && (
          <button type="button" onClick={() => onDischarge(patient.id)}>
            Discharge
          </button>
        )}
        <button type="button" className="danger" onClick={() => onDelete(patient.id)}>
          Delete
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
