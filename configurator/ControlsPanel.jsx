'use client'
import Slider from "./Slider"
import ColorPicker from "./ColorPicker"
import ImageUploader from "./ImageUploader"
import Switch from "./Switch"


export default function ControlsPanel({ config }) {
  const {
    bodyColor,
    setBodyColor,
    capColor,
    setCapColor,
    singleColorMode,
    setSingleColorMode,
    labelImage,
    setLabelImage,
    logoImage,
    setLogoImage,
    logoX,
    setLogoX,
    logoY,
    setLogoY,
    logoRotation,
    setLogoRotation,
    logoScale,
    setLogoScale
  } = config

  const handleImageUpload = (file, setter) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setter(url)
  }

  return (
    <div className="p-3 border-start overflow-auto theme-bg-primary text-light vh-100">
      <h2 className="h4 mb-4">Product Customization</h2>

      <Card>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-label mb-0">Colors</label>
          <Switch
            id="singleColorMode"
            checked={singleColorMode}
            onChange={setSingleColorMode}
            label="Single Color"
          />
        </div>

        <div className="d-flex gap-3">
          <ColorPicker
            label="Body"
            value={bodyColor}
            onChange={(color) => {
              setBodyColor(color)
              if (singleColorMode) setCapColor(color)
            }}
          />
          <ColorPicker
            label="Cap"
            value={singleColorMode ? bodyColor : capColor}
            onChange={setCapColor}
            disabled={singleColorMode}
          />
        </div>
      </Card>

      <Card>
        <ImageUploader
          label="Label Image"
          value={labelImage}
          onChange={(file) => handleImageUpload(file, setLabelImage)}
        />
      </Card>

      <Card>
        <ImageUploader
          label="Logo Image"
          value={logoImage}
          onChange={(file) => handleImageUpload(file, setLogoImage)}
        />
      </Card>

      <Card>
        <h3 className="h6 mb-3">Logo Settings</h3>
        <Slider label="Horizontal (X)" min={-0.5} max={0.5} step={0.01} value={logoX} onChange={setLogoX} />
        <Slider label="Vertical (Y)" min={-0.5} max={3} step={0.01} value={logoY} onChange={setLogoY} />
        <Slider label="Rotation (Y-axis)" min={-Math.PI} max={Math.PI} step={0.01} value={logoRotation} onChange={setLogoRotation} />
        <Slider label="Scale X" min={0.1} max={3} step={0.01} value={logoScale[0]} onChange={(v) => setLogoScale([v, logoScale[1], logoScale[2]])} />
        <Slider label="Scale Y" min={0.1} max={3} step={0.01} value={logoScale[1]} onChange={(v) => setLogoScale([logoScale[0], v, logoScale[2]])} />
        <Slider label="Scale Z" min={0.1} max={3} step={0.01} value={logoScale[2]} onChange={(v) => setLogoScale([logoScale[0], logoScale[1], v])} />
      </Card>
    </div>
  )
}

/** Card wrapper */
function Card({ children }) {
  return (
    <div className="card bg-secondary text-light mb-3 p-3 shadow-sm">
      {children}
    </div>
  )
}