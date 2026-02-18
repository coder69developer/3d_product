'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'

const DEFAULT_DETAILS = ['Powerful cleaning action', 'Eco-friendly formula', '1L / 33.8 fl oz']
const PREVIEW_SIZE = 280
const PREVIEW_LOGO_SIZE = 64

export default function LabelCreator({ onApplyLabel, onSaveLabel, showSaveButton = false }) {
  const [companyName, setCompanyName] = useState('CleanCo')
  const [productName, setProductName] = useState('Multi Surface Cleaner')
  const [description, setDescription] = useState('Cuts grease and removes tough stains for a sparkling finish.')
  const [details, setDetails] = useState(DEFAULT_DETAILS.join('\n'))
  const [backgroundColor, setBackgroundColor] = useState('#0f766e')
  const [accentColor, setAccentColor] = useState('#14b8a6')
  const [textColor, setTextColor] = useState('#ffffff')
  const [logoUrl, setLogoUrl] = useState('')
  const [previewLabel, setPreviewLabel] = useState('')
  const [logoPosition, setLogoPosition] = useState({ x: 0.78, y: 0.03 })

  const dragContainerRef = useRef(null)
  const detailList = useMemo(() => details.split('\n').map((line) => line.trim()).filter(Boolean), [details])

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

  const updateLogoPositionFromPointer = (clientX, clientY) => {
    if (!dragContainerRef.current) return
    const rect = dragContainerRef.current.getBoundingClientRect()
    const px = (clientX - rect.left - PREVIEW_LOGO_SIZE / 2) / rect.width
    const py = (clientY - rect.top - PREVIEW_LOGO_SIZE / 2) / rect.height
    setLogoPosition({
      x: clamp(px, 0, 1 - PREVIEW_LOGO_SIZE / PREVIEW_SIZE),
      y: clamp(py, 0, 1 - PREVIEW_LOGO_SIZE / PREVIEW_SIZE),
    })
  }

  const handleLogoUpload = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoUrl(reader.result?.toString() || '')
    reader.readAsDataURL(file)
  }

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight, maxLines = 3) => {
    const words = text.split(' ')
    let line = ''
    let linesUsed = 0

    for (let i = 0; i < words.length; i += 1) {
      const testLine = `${line}${words[i]} `
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, y)
        line = `${words[i]} `
        y += lineHeight
        linesUsed += 1
        if (linesUsed >= maxLines - 1) break
      } else {
        line = testLine
      }
    }

    if (line && linesUsed < maxLines) ctx.fillText(line.trim(), x, y)
  }

  const buildLabel = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = accentColor
    ctx.fillRect(0, 0, canvas.width, 220)
    ctx.fillRect(0, 780, canvas.width, 244)

    const drawText = () => {
      ctx.fillStyle = textColor
      ctx.font = '700 74px Inter, Arial, sans-serif'
      ctx.fillText(companyName.toUpperCase(), 70, 130)
      ctx.font = '800 66px Inter, Arial, sans-serif'
      wrapText(ctx, productName, 70, 345, 670, 76, 2)
      ctx.font = '400 36px Inter, Arial, sans-serif'
      wrapText(ctx, description, 70, 470, 880, 46, 4)
      ctx.font = '600 32px Inter, Arial, sans-serif'
      detailList.forEach((item, index) => ctx.fillText(`• ${item}`, 70, 840 + index * 52))
      return canvas.toDataURL('image/png')
    }

    if (!logoUrl) return Promise.resolve(drawText())

    return new Promise((resolve) => {
      const logoImage = document.createElement('img')
      logoImage.onload = () => {
        const boxSize = 200
        const size = 190
        const boxX = logoPosition.x * canvas.width
        const boxY = logoPosition.y * canvas.height

        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.fillRect(boxX, boxY, boxSize, boxSize)
        ctx.drawImage(logoImage, boxX + 5, boxY + 5, size, size)
        resolve(drawText())
      }
      logoImage.src = logoUrl
    })
  }

  const generateLabel = async () => {
    const output = await buildLabel()
    if (!output) return
    setPreviewLabel(output)
    onApplyLabel?.(output)
  }

  const handleSave = async () => {
    const output = previewLabel || await buildLabel()
    if (!output) return
    setPreviewLabel(output)
    onSaveLabel?.({
      id: `label-${Date.now()}`,
      name: productName || companyName || 'Custom Label',
      image: output,
      companyName,
      productName,
      description,
      details: detailList,
      logoPosition,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="d-flex flex-column gap-2">
      <h3 className="h6 mb-1">Label Creator</h3>
      <input className="form-control form-control-sm" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
      <input className="form-control form-control-sm" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name" />
      <textarea className="form-control form-control-sm" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description" />
      <textarea className="form-control form-control-sm" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="One detail per line" />

      <div className="d-flex gap-2">
        <label className="form-label mb-0 small">Background <input type="color" className="form-control form-control-color form-control-sm" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} /></label>
        <label className="form-label mb-0 small">Accent <input type="color" className="form-control form-control-color form-control-sm" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} /></label>
        <label className="form-label mb-0 small">Text <input type="color" className="form-control form-control-color form-control-sm" value={textColor} onChange={(e) => setTextColor(e.target.value)} /></label>
      </div>

      <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => handleLogoUpload(e.target.files?.[0])} />

      {logoUrl && (
        <div>
          <small className="text-muted d-block mb-1">Drag and drop logo position</small>
          <div
            ref={dragContainerRef}
            className="position-relative border rounded"
            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, background: `linear-gradient(${accentColor} 0 22%, ${backgroundColor} 22% 78%, ${accentColor} 78% 100%)` }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              updateLogoPositionFromPointer(event.clientX, event.clientY)
            }}
            onClick={(event) => updateLogoPositionFromPointer(event.clientX, event.clientY)}
          >
            <div
              draggable
              onDragStart={(event) => event.dataTransfer.setData('text/plain', 'logo')}
              className="position-absolute bg-white bg-opacity-25 rounded p-1"
              style={{
                width: PREVIEW_LOGO_SIZE,
                height: PREVIEW_LOGO_SIZE,
                left: logoPosition.x * PREVIEW_SIZE,
                top: logoPosition.y * PREVIEW_SIZE,
                cursor: 'grab',
              }}
            >
              <Image src={logoUrl} alt="Logo position preview" width={56} height={56} unoptimized className="w-100 h-100 object-fit-contain" />
            </div>
          </div>
        </div>
      )}

      <div className="d-flex gap-2">
        <button type="button" className="btn btn-success btn-sm" onClick={generateLabel}>Generate Label Preview</button>
        {showSaveButton && <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>Save Label</button>}
      </div>

      {previewLabel && <Image src={previewLabel} alt="Generated label preview" width={320} height={320} unoptimized className="img-fluid rounded border" />}
    </div>
  )
}
