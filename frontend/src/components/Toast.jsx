// Floating toasts — appear at the top-right and auto-dismiss (see App.jsx).
// Simple: just a list of { id, message, type } objects passed in.
export default function Toast({ toasts }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
