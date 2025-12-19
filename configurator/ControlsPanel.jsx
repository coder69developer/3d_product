'use client'

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
    brandText,
    setBrandText,
    showLabel,
    setShowLabel,
    showLogo,
    setShowLogo,
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
    <div className="p-6 border-l space-y-6 overflow-y-auto bg-gray-900 h-full text-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-white">Product Customization</h2>

      {/* Body Color */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-200">Colors</label>
          <label className="flex items-center gap-2 text-sm text-gray-200">
            <input
              type="checkbox"
              checked={singleColorMode}
              onChange={(e) => setSingleColorMode(e.target.checked)}
            />
            Single Color
          </label>
        </div>

        <div className="flex gap-4">
          {/* Body Color */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-200 mb-1">Body</span>
            <input
              type="color"
              value={singleColorMode ? bodyColor : bodyColor}
              onChange={(e) => {
                const color = e.target.value
                setBodyColor(color)
                if (singleColorMode) setCapColor(color)
              }}
              className="w-16 h-10 cursor-pointer rounded border border-gray-700"
            />
          </div>

          {/* Cap Color */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-200 mb-1">Cap</span>
            <input
              type="color"
              value={singleColorMode ? bodyColor : capColor}
              onChange={(e) => setCapColor(e.target.value)}
              className="w-16 h-10 cursor-pointer rounded border border-gray-700"
              disabled={singleColorMode}
            />
          </div>
        </div>
      </Card>

      {/* Label Upload */}
      <Card>
        <label className="block text-sm font-medium text-gray-200">Label Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], setLabelImage)}
          className="block w-full text-sm text-gray-300 cursor-pointer"
        />
        {labelImage && <p className="text-xs text-green-400 mt-1">Label applied</p>}
      </Card>

      {/* Logo Upload */}
      <Card>
        <label className="block text-sm font-medium text-gray-200">Logo Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], setLogoImage)}
          className="block w-full text-sm text-gray-300 cursor-pointer"
        />
        {logoImage && <p className="text-xs text-green-400 mt-1">Logo applied</p>}
      </Card>

      {/* Logo Settings */}
      <Card>
        <h3 className="text-sm font-medium text-gray-200 mb-2">Logo Settings</h3>

        <Slider label="Horizontal (X)" min={-0.5} max={0.5} step={0.01} value={logoX} onChange={setLogoX} dark />
        <Slider label="Vertical (Y)" min={-0.5} max={3} step={0.01} value={logoY} onChange={setLogoY} dark />
        <Slider label="Rotation (Y-axis)" min={-Math.PI} max={Math.PI} step={0.01} value={logoRotation} onChange={setLogoRotation} dark />
        <Slider label="Scale X" min={0.1} max={3} step={0.01} value={logoScale[0]} onChange={(v) => setLogoScale([v, logoScale[1], logoScale[2]])} dark />
        <Slider label="Scale Y" min={0.1} max={3} step={0.01} value={logoScale[1]} onChange={(v) => setLogoScale([logoScale[0], v, logoScale[2]])} dark />
        <Slider label="Scale Z" min={0.1} max={3} step={0.01} value={logoScale[2]} onChange={(v) => setLogoScale([logoScale[0], logoScale[1], v])} dark />
      </Card>
    </div>
  )
}

/** Card wrapper with hover lift & shadow */
function Card({ children }) {
  return (
    <div className="p-4 bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 space-y-2">
      {children}
    </div>
  )
}

/** Slider Component with dark mode */
function Slider({ label, min, max, step, value, onChange, dark }) {
  return (
    <div className="space-y-1">
      <label className={`block text-xs ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full cursor-pointer ${dark ? 'accent-blue-500 hover:accent-blue-400' : 'accent-blue-500 hover:accent-blue-600'}`}
      />
    </div>
  )
}
