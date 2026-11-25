// Desktop table of patients (sits in a scrollable wrapper with a sticky header).
// Action buttons are labeled like the original version; Discharge is hidden for discharged patients.
export default function PatientTable({
  patients,
  loading,
  onEdit,
  onDischarge,
  onDelete,
}) {
  if (loading) return <div className="loading">Loading patients…</div>;
  if (!patients || patients.length === 0) {
    return <div className="empty">No patients found</div>;
  }
  return (
    <div className="table-wrapper">
      <table className="patients">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">Gender</th>
            <th scope="col">Ward</th>
            <th scope="col">Department</th>
            <th scope="col">Doctor</th>
            <th scope="col">Admission Date</th>
            <th scope="col">Status</th>
            <th scope="col" className="col-actions">Actions</th>
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
              <td>{p.admission_date}</td>
              <td>
                <span className={`badge badge-${String(p.status).toLowerCase()}`}>
                  {p.status}
                </span>
              </td>
              <td className="actions">
                <button type="button" className="action-btn" onClick={() => onEdit(p.id)}>
                  Edit
                </button>
                {p.status !== "Discharged" && (
                  <button type="button" className="action-btn" onClick={() => onDischarge(p.id)}>
                    Discharge
                  </button>
                )}
                <button type="button" className="action-btn danger" onClick={() => onDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
