function DateSelector({ value, onChange }) {
  return (
    <div className="card">
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="date-selector">
        Fecha del día
      </label>
      <input
        id="date-selector"
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input"
      />
    </div>
  );
}

export default DateSelector;
