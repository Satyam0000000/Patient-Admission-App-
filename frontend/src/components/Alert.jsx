export default function Alert({ error, success }) {
  if (!error && !success) return null;
  return (
    <div className="alerts">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
}
