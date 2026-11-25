// Delete confirmation modal.
// Shows the patient's name; Cancel or Delete buttons.
export default function ConfirmModal({ patient, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop confirm" role="dialog" aria-modal="true">
      <div className="modal-wrap confirm-modal">
        <h2 className="modal-title">Delete patient</h2>
        <p className="confirm-text">
          Delete <strong>{patient?.name}</strong>? This cannot be undone.
        </p>
        <div className="confirm-actions">
          <button type="button" className="ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
