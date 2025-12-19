export default function ImageUploader({ label, value, onChange }) {
  return (
    <div className="mb-2">
      <label className="form-label">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
        className="form-control form-control-sm"
      />
      {value && <small className="text-success">{label} applied</small>}
    </div>
  )
}