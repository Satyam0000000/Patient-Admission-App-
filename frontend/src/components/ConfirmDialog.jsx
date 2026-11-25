// Delete confirmation modal.
// Shows the patient's name; Cancel and Delete buttons.
// While `loading` is true, the Delete button shows a spinner and both are disabled.
export default function ConfirmDialog({ patient, loading = false, onConfirm, onCancel }) {
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
          <button
            type="button"
            className="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="spinner" aria-hidden="true"></span>}
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
