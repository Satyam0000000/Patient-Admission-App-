export default function Header({ onAddPatient }) {
  return (
    <header className="header">
      <div>
        <h1>Patient Admission</h1>
        <p className="subtitle">Manage admitted patients in the hospital.</p>
      </div>
      <button className="primary" onClick={onAddPatient}>
        + Add patient
      </button>
    </header>
  );
}
