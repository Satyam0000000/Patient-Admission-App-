export default function ConfirmDialog({ patient, onConfirm, onCancel }) {
  if (!patient) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true">
        <h3>Delete patient</h3>
        <p>
          Are you sure you want to delete <strong>{patient.name}</strong>?
          This cannot be undone.
        </p>
        <div className="modal-actions">
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
