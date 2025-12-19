export default function Switch({ id, checked, onChange, label }) {
  return (
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        id={id}
      />
      <label className="form-check-label" htmlFor={id}>{label}</label>
    </div>
  )
}