export default function FilterBar({ filters, options, onChange, onClear }) {
  return (
    <div className="filterbar">
      <input
        className="filter-search"
        type="search"
        placeholder="Search by name"
        value={filters.search}
        onChange={onChange("search")}
      />
      <select className="filter-select" value={filters.ward} onChange={onChange("ward")}>
        <option value="">All wards</option>
        {options.wards.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={filters.department}
        onChange={onChange("department")}
      >
        <option value="">All departments</option>
        {options.departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select className="filter-select" value={filters.doctor} onChange={onChange("doctor")}>
        <option value="">All doctors</option>
        {options.doctors.map((doc) => (
          <option key={doc} value={doc}>
            {doc}
          </option>
        ))}
      </select>
      <button type="button" className="ghost" onClick={onClear}>
        Clear filters
      </button>
    </div>
  );
}
