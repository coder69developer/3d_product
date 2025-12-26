export default function Slider({ label, min, max, step, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label small">{label}</label>
      <input
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  )
}