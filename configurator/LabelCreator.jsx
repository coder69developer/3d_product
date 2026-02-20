'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'

const DEFAULT_DETAILS = ['Powerful cleaning action', 'Eco-friendly formula', '1L / 33.8 fl oz']
const PREVIEW_SIZE = 280
const PREVIEW_LOGO_BASE_SIZE = 64
const LOGO_BOX_BASE_SIZE = 200
const LOGO_IMAGE_INSET = 5
const TEXT_BOX_PREVIEW = { width: 170, height: 120 }

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
  const [logoScale, setLogoScale] = useState(1)
  const [textPosition, setTextPosition] = useState({ x: 0.07, y: 0.09 })
  const [textPlacementMode, setTextPlacementMode] = useState('auto')

  const dragContainerRef = useRef(null)
  const activeDragTargetRef = useRef('logo')
  const detailList = useMemo(() => details.split('\n').map((line) => line.trim()).filter(Boolean), [details])

  const logoPreviewSize = PREVIEW_LOGO_BASE_SIZE * logoScale

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
  const maxPosition = (size, containerSize) => 1 - size / containerSize

  const clampLogoPosition = (position, size, containerSize) => ({
    x: clamp(position.x, 0, maxPosition(size, containerSize)),
    y: clamp(position.y, 0, maxPosition(size, containerSize)),
  })

  const clampTextPosition = (position) => ({
    x: clamp(position.x, 0, maxPosition(TEXT_BOX_PREVIEW.width, PREVIEW_SIZE)),
    y: clamp(position.y, 0, maxPosition(TEXT_BOX_PREVIEW.height, PREVIEW_SIZE)),
  })

  const rectanglesOverlap = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

  const getSafeTextPosition = (position, logoRect) => {
    const safePosition = clampTextPosition(position)
    if (!logoRect) return safePosition

    const textRect = {
      x: safePosition.x * PREVIEW_SIZE,
      y: safePosition.y * PREVIEW_SIZE,
      width: TEXT_BOX_PREVIEW.width,
      height: TEXT_BOX_PREVIEW.height,
    }
    if (!rectanglesOverlap(textRect, logoRect)) return safePosition

    const candidateX = (logoRect.x + logoRect.width + 10) / PREVIEW_SIZE
    const rightAligned = clampTextPosition({ x: candidateX, y: safePosition.y })
    const rightRect = { ...textRect, x: rightAligned.x * PREVIEW_SIZE, y: rightAligned.y * PREVIEW_SIZE }
    if (!rectanglesOverlap(rightRect, logoRect)) return rightAligned

    const candidateY = (logoRect.y + logoRect.height + 10) / PREVIEW_SIZE
    const belowAligned = clampTextPosition({ x: safePosition.x, y: candidateY })
    const belowRect = { ...textRect, x: belowAligned.x * PREVIEW_SIZE, y: belowAligned.y * PREVIEW_SIZE }
    if (!rectanglesOverlap(belowRect, logoRect)) return belowAligned

    return safePosition
  }

  const getAutoTextLayout = () => {
    const logoBoxSize = LOGO_BOX_BASE_SIZE * logoScale
    const logoBoxX = logoPosition.x * 1024
    const logoBoxY = logoPosition.y * 1024
    const logoRight = logoBoxX + logoBoxSize
    const logoBottom = logoBoxY + logoBoxSize

    const defaultTextX = 70
    const textRightLimit = 980
    const logoIntersectsTextBand = logoUrl && logoBoxY < 620 && logoBottom > 90

    let textX = defaultTextX
    let productMaxWidth = 670
    let descriptionMaxWidth = 880
    let textYOffset = 0

    if (logoIntersectsTextBand) {
      const spaceLeftOfLogo = logoBoxX - defaultTextX - 20
      const spaceRightOfLogo = textRightLimit - (logoRight + 20)

      if (spaceLeftOfLogo >= 380) {
        productMaxWidth = Math.min(670, spaceLeftOfLogo)
        descriptionMaxWidth = Math.min(880, spaceLeftOfLogo)
      } else if (spaceRightOfLogo >= 380) {
        textX = logoRight + 20
        productMaxWidth = Math.min(670, spaceRightOfLogo)
        descriptionMaxWidth = Math.min(880, spaceRightOfLogo)
      } else {
        textYOffset = Math.max(0, logoBottom - 80)
      }
    }

    return { textX, textY: 0 + textYOffset, productMaxWidth, descriptionMaxWidth }
  }

  const updateLogoPositionFromPointer = (clientX, clientY) => {
    if (!dragContainerRef.current) return
    const rect = dragContainerRef.current.getBoundingClientRect()
    const px = (clientX - rect.left - logoPreviewSize / 2) / rect.width
    const py = (clientY - rect.top - logoPreviewSize / 2) / rect.height
    setLogoPosition(clampLogoPosition({ x: px, y: py }, logoPreviewSize, PREVIEW_SIZE))
  }

  const updateTextPositionFromPointer = (clientX, clientY) => {
    if (!dragContainerRef.current) return
    const rect = dragContainerRef.current.getBoundingClientRect()
    const px = (clientX - rect.left - TEXT_BOX_PREVIEW.width / 2) / rect.width
    const py = (clientY - rect.top - TEXT_BOX_PREVIEW.height / 2) / rect.height

    const logoRect = logoUrl
      ? { x: logoPosition.x * PREVIEW_SIZE, y: logoPosition.y * PREVIEW_SIZE, width: logoPreviewSize, height: logoPreviewSize }
      : null

    setTextPosition(getSafeTextPosition({ x: px, y: py }, logoRect))
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

    if (line && linesUsed < maxLines) {
      ctx.fillText(line.trim(), x, y)
      linesUsed += 1
    }

    return { linesUsed, endY: y }
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

    const logoBoxSize = LOGO_BOX_BASE_SIZE * logoScale
    const logoBoxX = logoPosition.x * canvas.width
    const logoBoxY = logoPosition.y * canvas.height

    const logoRectPreview = logoUrl
      ? { x: logoPosition.x * PREVIEW_SIZE, y: logoPosition.y * PREVIEW_SIZE, width: logoPreviewSize, height: logoPreviewSize }
      : null

    const safeTextPosition = getSafeTextPosition(textPosition, logoRectPreview)

    const manualTextLayout = {
      textX: safeTextPosition.x * canvas.width,
      textY: safeTextPosition.y * canvas.height,
      productMaxWidth: 620,
      descriptionMaxWidth: 620,
    }

    const autoTextLayout = getAutoTextLayout()
    const { textX, textY, productMaxWidth, descriptionMaxWidth } = textPlacementMode === 'manual' ? manualTextLayout : autoTextLayout

    const drawText = () => {
      ctx.fillStyle = textColor
      ctx.font = '700 74px Inter, Arial, sans-serif'
      ctx.fillText(companyName.toUpperCase(), textX, 130 + textY)
      ctx.font = '800 66px Inter, Arial, sans-serif'
      const productInfo = wrapText(ctx, productName, textX, 345 + textY, productMaxWidth, 76, 2)
      ctx.font = '400 36px Inter, Arial, sans-serif'
      const descriptionStartY = productInfo.endY + 80
      const descriptionInfo = wrapText(ctx, description, textX, descriptionStartY, descriptionMaxWidth, 46, 4)
      ctx.font = '600 32px Inter, Arial, sans-serif'
      const detailStartY = Math.min(960, descriptionInfo.endY + 70)
      detailList.forEach((item, index) => ctx.fillText(`• ${item}`, textX, detailStartY + index * 52))
      return canvas.toDataURL('image/png')
    }

    if (!logoUrl) return Promise.resolve(drawText())

    return new Promise((resolve) => {
      const logoImage = document.createElement('img')
      logoImage.onload = () => {
        const size = logoBoxSize - LOGO_IMAGE_INSET * 2
        drawText()
        ctx.fillStyle = 'rgba(255,255,255,0.12)'
        ctx.fillRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize)
        ctx.drawImage(logoImage, logoBoxX + LOGO_IMAGE_INSET, logoBoxY + LOGO_IMAGE_INSET, size, size)
        resolve(canvas.toDataURL('image/png'))
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
      logoScale,
      textPosition,
      textPlacementMode,
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

      <label className="form-label small mb-0">
        Text Placement Mode
        <select className="form-select form-select-sm" value={textPlacementMode} onChange={(event) => setTextPlacementMode(event.target.value)}>
          <option value="auto">Auto (previous behavior)</option>
          <option value="manual">Manual (click/drag text area)</option>
        </select>
      </label>

      <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => handleLogoUpload(e.target.files?.[0])} />

      {logoUrl && (
        <>
          <label className="form-label small mb-0">
            Logo Size ({logoScale.toFixed(2)}x)
            <input
              type="range"
              min={0.5}
              max={2}
              step={0.05}
              value={logoScale}
              className="form-range"
              onChange={(event) => {
                const nextScale = Number(event.target.value)
                const nextSize = PREVIEW_LOGO_BASE_SIZE * nextScale
                setLogoScale(nextScale)
                setLogoPosition((position) => clampLogoPosition(position, nextSize, PREVIEW_SIZE))
              }}
            />
          </label>

          <div>
            <small className="text-muted d-block mb-1">Drag and drop logo/text positions</small>
            <div
              ref={dragContainerRef}
              className="position-relative border rounded"
              style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, background: `linear-gradient(${accentColor} 0 22%, ${backgroundColor} 22% 78%, ${accentColor} 78% 100%)` }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                if (activeDragTargetRef.current === 'text') {
                  updateTextPositionFromPointer(event.clientX, event.clientY)
                  return
                }
                updateLogoPositionFromPointer(event.clientX, event.clientY)
              }}
              onClick={(event) => {
                if (textPlacementMode === 'manual') {
                  updateTextPositionFromPointer(event.clientX, event.clientY)
                  return
                }
                updateLogoPositionFromPointer(event.clientX, event.clientY)
              }}
            >
              <div
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', 'logo')
                  activeDragTargetRef.current = 'logo'
                }}
                onMouseDown={() => {
                  activeDragTargetRef.current = 'logo'
                }}
                className="position-absolute bg-white bg-opacity-25 rounded p-1"
                style={{
                  width: logoPreviewSize,
                  height: logoPreviewSize,
                  left: logoPosition.x * PREVIEW_SIZE,
                  top: logoPosition.y * PREVIEW_SIZE,
                  cursor: 'grab',
                }}
              >
                <Image src={logoUrl} alt="Logo position preview" width={56} height={56} unoptimized className="w-100 h-100 object-fit-contain" />
              </div>

              {textPlacementMode === 'manual' && (
                <div
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/plain', 'text')
                    activeDragTargetRef.current = 'text'
                  }}
                  onMouseDown={() => {
                    activeDragTargetRef.current = 'text'
                  }}
                  className="position-absolute border border-white rounded px-2 py-1"
                  style={{
                    width: TEXT_BOX_PREVIEW.width,
                    height: TEXT_BOX_PREVIEW.height,
                    left: textPosition.x * PREVIEW_SIZE,
                    top: textPosition.y * PREVIEW_SIZE,
                    background: 'rgba(15, 23, 42, 0.35)',
                    cursor: 'grab',
                    color: '#fff',
                    fontSize: 12,
                  }}
                >
                  <div className="fw-semibold">Text Area</div>
                  <div className="small opacity-75">Click canvas or drag to position</div>
                </div>
              )}
            </div>
            {textPlacementMode === 'manual' && <small className="text-muted d-block mt-1">Tip: click anywhere in preview to place text area.</small>}
          </div>
        </>
      )}

      <div className="d-flex gap-2">
        <button type="button" className="btn btn-success btn-sm" onClick={generateLabel}>Generate Label Preview</button>
        {showSaveButton && <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>Save Label</button>}
      </div>

      {previewLabel && <Image src={previewLabel} alt="Generated label preview" width={320} height={320} unoptimized className="img-fluid rounded border" />}
    </div>
  )
}
