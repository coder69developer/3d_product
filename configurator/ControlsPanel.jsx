'use client'

export default function ControlsPanel({ config }) {
  const {
    bodyColor,
    setBodyColor,
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

  /* ---------------- File Upload ---------------- */
  const handleImageUpload = (file, setter) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setter(url)
  }

  return (
    <div className="p-6 border-l space-y-6 overflow-y-auto">
      <h2 className="text-xl font-semibold">Product Customization</h2>

      {/* Body Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Body Color</label>
        <input
          type="color"
          value={bodyColor}
          onChange={(e) => setBodyColor(e.target.value)}
          className="w-16 h-10 cursor-pointer"
        />
      </div>

      {/* Label Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Label Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], setLabelImage)}
        />
        {labelImage && <p className="text-xs text-green-600 mt-1">Label applied</p>}
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Logo Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0], setLogoImage)}
        />
        {logoImage && <p className="text-xs text-green-600 mt-1">Logo applied</p>}
      </div>

      {/* Brand Text */}
      {/* <div>
        <label className="block text-sm font-medium mb-2">Brand Name (Text Logo)</label>
        <input
          type="text"
          value={brandText}
          onChange={(e) => setBrandText(e.target.value)}
          placeholder="Enter brand name"
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">Used if no logo image is uploaded</p>
      </div> */}

      {/* Visibility Toggles */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLabel}
            onChange={(e) => setShowLabel(e.target.checked)}
          />
          Show Label
        </label>

        {/* <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showLogo}
            onChange={(e) => setShowLogo(e.target.checked)}
          />
          Show Logo
        </label> */}
      </div>

      {/* Logo Position, Rotation & Scale */}
      
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Logo Settings</h3>

          {/* Position */}
          <label className="block text-xs">Horizontal (X)</label>
          {/* <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={logoRotation}
            onChange={(e) => setLogoRotation(parseFloat(e.target.value))}
          /> */}
          <input
            type="range"
            min={-0.5} max={0.5} step={0.01}
            value={logoX}
            onChange={(e) => setLogoX(parseFloat(e.target.value))}
          />

          <label className="block text-xs">Vertical (Y)</label>
          <input
            type="range"
            min={-0.5} max={3.0} step={0.01}
            value={logoY}
            onChange={(e) => setLogoY(parseFloat(e.target.value))}
          />

          {/* Rotation */}
          <label className="block text-xs">Rotation (Y-axis)</label>
          <input
            type="range"
            min={-Math.PI} max={Math.PI} step={0.01}
            value={logoRotation}
            onChange={(e) => setLogoRotation(parseFloat(e.target.value))}
          />

          {/* Scale */}
          <label className="block text-xs">Scale X</label>
          <input
            type="range"
            min={0.1} max={3} step={0.01}
            value={logoScale[0]}
            onChange={(e) => setLogoScale([parseFloat(e.target.value), logoScale[1], logoScale[2]])}
          />

          <label className="block text-xs">Scale Y</label>
          <input
            type="range"
            min={0.1} max={3} step={0.01}
            value={logoScale[1]}
            onChange={(e) => setLogoScale([logoScale[0], parseFloat(e.target.value), logoScale[2]])}
          />

          <label className="block text-xs">Scale Z</label>
          <input
            type="range"
            min={0.1} max={3} step={0.01}
            value={logoScale[2]}
            onChange={(e) => setLogoScale([logoScale[0], logoScale[1], parseFloat(e.target.value)])}
          />
        </div>
      
    </div>
  )
}
