// Compact pagination: Previous, a few page numbers, Next.
// totalPages <= 1 renders nothing.
export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      {start > 1 && <span className="dots">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={`page-btn page-num${p === page ? " page-num-active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="dots">…</span>}

      <button
        type="button"
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
      <span className="page-hint">Page {page} of {totalPages}</span>
    </div>
  );
}
