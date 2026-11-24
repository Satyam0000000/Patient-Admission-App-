export default function PatientList({
  patients,
  loading,
  onEdit,
  onDelete,
  onDischarge,
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
            <th>Admission</th>
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
              <td>{p.admission_date}</td>
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
                  disabled={p.status === "Discharged"}
                >
                  Discharge
                </button>
                <button className="danger" onClick={() => onDelete(p.id)}>
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
