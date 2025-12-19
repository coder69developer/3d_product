'use client'

import { useId} from "react"

export default function ColorPicker({ label, value, onChange, disabled }) {
  const id = useId();
  return (
    <div className="text-center">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-control form-control-color"
        disabled={disabled}
      />
    </div>
  )
}