export default function PatientList({
  patients,
  loading,
  onEdit,
  onDelete,
  onDischarge,
  deletingId = null,
  dischargingId = null,
}) {
  if (loading && patients.length === 0) {
    return <div className="empty">Loading patients…</div>;
  }
  if (patients.length === 0) {
    return <div className="empty">No patients found.</div>;
  }
  return (
    <div className="table-wrapper">
      <table className="patients">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Ward</th>
            <th>Department</th>
            <th>Doctor</th>
            <th className="admission">Admission</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.ward}</td>
              <td>{p.department}</td>
              <td>{p.doctor}</td>
              <td className="admission">{p.admission_date}</td>
              <td>
                <span className={`badge ${String(p.status).toLowerCase()}`}>
                  {p.status}
                </span>
              </td>
              <td className="actions">
                <button className="ghost" onClick={() => onEdit(p.id)}>
                  Edit
                </button>
                <button
                  className="ghost"
                  onClick={() => onDischarge(p.id)}
                  disabled={p.status === "Discharged" || dischargingId === p.id}
                >
                  {dischargingId === p.id && (
                    <span className="spinner" aria-hidden="true"></span>
                  )}
                  {dischargingId === p.id ? "Discharging…" : "Discharge"}
                </button>
                <button
                  className="danger"
                  onClick={() => onDelete(p.id)}
                  disabled={deletingId === p.id}
                >
                  {deletingId === p.id && (
                    <span className="spinner" aria-hidden="true"></span>
                  )}
                  {deletingId === p.id ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
