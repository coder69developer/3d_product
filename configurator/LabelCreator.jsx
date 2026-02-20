'use client'

import Image from 'next/image'
import { useMemo, useRef, useState } from 'react'

const DEFAULT_DETAILS = ['Powerful cleaning action', 'Eco-friendly formula', '1L / 33.8 fl oz']
const PREVIEW_SIZE = 280
const PREVIEW_LOGO_BASE_SIZE = 64
const LOGO_BOX_BASE_SIZE = 200
const LOGO_IMAGE_INSET = 5

const ELEMENT_BOX_PREVIEW = {
  company: { width: 170, height: 44 },
  product: { width: 190, height: 70 },
  description: { width: 210, height: 84 },
  details: { width: 210, height: 92 },
}

const ELEMENT_LABELS = {
  company: 'Company',
  product: 'Product',
  description: 'Description',
  details: 'Details',
}

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
  const [textPlacementMode, setTextPlacementMode] = useState('auto')

  const [companyPosition, setCompanyPosition] = useState({ x: 0.07, y: 0.06 })
  const [productPosition, setProductPosition] = useState({ x: 0.07, y: 0.23 })
  const [descriptionPosition, setDescriptionPosition] = useState({ x: 0.07, y: 0.46 })
  const [detailsPosition, setDetailsPosition] = useState({ x: 0.07, y: 0.67 })

  const [textAreaScale, setTextAreaScale] = useState({
    company: 1,
    product: 1,
    description: 1,
    details: 1,
  })

  const dragContainerRef = useRef(null)
  const activeDragTargetRef = useRef('logo')
  const detailList = useMemo(() => details.split('\n').map((line) => line.trim()).filter(Boolean), [details])

  const logoPreviewSize = PREVIEW_LOGO_BASE_SIZE * logoScale

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
  const maxPosition = (size, containerSize) => 1 - size / containerSize

  const getElementBox = (elementKey) => {
    const base = ELEMENT_BOX_PREVIEW[elementKey]
    const scale = textAreaScale[elementKey] || 1
    return { width: base.width * scale, height: base.height * scale }
  }

  const clampLogoPosition = (position, size, containerSize) => ({
    x: clamp(position.x, 0, maxPosition(size, containerSize)),
    y: clamp(position.y, 0, maxPosition(size, containerSize)),
  })

  const clampElementPosition = (position, elementKey) => {
    const box = getElementBox(elementKey)
    return {
      x: clamp(position.x, 0, maxPosition(box.width, PREVIEW_SIZE)),
      y: clamp(position.y, 0, maxPosition(box.height, PREVIEW_SIZE)),
    }
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

    return { textX, textY: textYOffset, productMaxWidth, descriptionMaxWidth }
  }

  const updateLogoPositionFromPointer = (clientX, clientY) => {
    if (!dragContainerRef.current) return
    const rect = dragContainerRef.current.getBoundingClientRect()
    const px = (clientX - rect.left - logoPreviewSize / 2) / rect.width
    const py = (clientY - rect.top - logoPreviewSize / 2) / rect.height
    setLogoPosition(clampLogoPosition({ x: px, y: py }, logoPreviewSize, PREVIEW_SIZE))
  }

  const setPositionByTarget = (target, position) => {
    const clampedPosition = clampElementPosition(position, target)
    if (target === 'company') setCompanyPosition(clampedPosition)
    if (target === 'product') setProductPosition(clampedPosition)
    if (target === 'description') setDescriptionPosition(clampedPosition)
    if (target === 'details') setDetailsPosition(clampedPosition)
  }

  const updateElementPositionFromPointer = (target, clientX, clientY) => {
    if (!dragContainerRef.current) return
    const rect = dragContainerRef.current.getBoundingClientRect()
    const box = getElementBox(target)
    if (!box) return

    const px = (clientX - rect.left - box.width / 2) / rect.width
    const py = (clientY - rect.top - box.height / 2) / rect.height
    setPositionByTarget(target, { x: px, y: py })
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

    const autoTextLayout = getAutoTextLayout()

    const drawAutoText = () => {
      const { textX, textY, productMaxWidth, descriptionMaxWidth } = autoTextLayout
      ctx.fillStyle = textColor
      ctx.font = '700 74px Inter, Arial, sans-serif'
      ctx.fillText(companyName.toUpperCase(), textX, 130 + textY)
      ctx.font = '800 66px Inter, Arial, sans-serif'
      const productInfo = wrapText(ctx, productName, textX, 345 + textY, productMaxWidth, 76, 2)
      ctx.font = '400 36px Inter, Arial, sans-serif'
      const descriptionInfo = wrapText(ctx, description, textX, productInfo.endY + 80, descriptionMaxWidth, 46, 4)
      ctx.font = '600 32px Inter, Arial, sans-serif'
      const detailStartY = Math.min(960, descriptionInfo.endY + 70)
      detailList.forEach((item, index) => ctx.fillText(`• ${item}`, textX, detailStartY + index * 52))
    }

    const drawManualText = () => {
      const toCanvas = (value) => value * canvas.width
      const companyBox = getElementBox('company')
      const productBox = getElementBox('product')
      const descriptionBox = getElementBox('description')
      const detailsBox = getElementBox('details')

      const companyX = companyPosition.x * canvas.width
      const companyY = companyPosition.y * canvas.height
      const productX = productPosition.x * canvas.width
      const productY = productPosition.y * canvas.height
      const descriptionX = descriptionPosition.x * canvas.width
      const descriptionY = descriptionPosition.y * canvas.height
      const detailsX = detailsPosition.x * canvas.width
      const detailsY = detailsPosition.y * canvas.height

      const companyMaxWidth = toCanvas(companyBox.width / PREVIEW_SIZE)
      const productMaxWidth = toCanvas(productBox.width / PREVIEW_SIZE)
      const descriptionMaxWidth = toCanvas(descriptionBox.width / PREVIEW_SIZE)
      const detailsMaxWidth = toCanvas(detailsBox.width / PREVIEW_SIZE)

      ctx.fillStyle = textColor
      ctx.font = '700 74px Inter, Arial, sans-serif'
      wrapText(ctx, companyName.toUpperCase(), companyX, companyY + 70, companyMaxWidth, 76, 2)
      ctx.font = '800 66px Inter, Arial, sans-serif'
      wrapText(ctx, productName, productX, productY + 66, productMaxWidth, 76, 2)
      ctx.font = '400 36px Inter, Arial, sans-serif'
      wrapText(ctx, description, descriptionX, descriptionY + 44, descriptionMaxWidth, 46, 4)
      ctx.font = '600 32px Inter, Arial, sans-serif'
      detailList.forEach((item, index) => wrapText(ctx, `• ${item}`, detailsX, detailsY + 36 + index * 52, detailsMaxWidth, 38, 2))
    }

    if (textPlacementMode === 'manual') {
      drawManualText()
    } else {
      drawAutoText()
    }

    if (!logoUrl) return Promise.resolve(canvas.toDataURL('image/png'))

    return new Promise((resolve) => {
      const logoImage = document.createElement('img')
      logoImage.onload = () => {
        const size = logoBoxSize - LOGO_IMAGE_INSET * 2
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
      textPlacementMode,
      companyPosition,
      productPosition,
      descriptionPosition,
      detailsPosition,
      textAreaScale,
      createdAt: new Date().toISOString(),
    })
  }

  const manualBoxes = [
    { key: 'company', position: companyPosition },
    { key: 'product', position: productPosition },
    { key: 'description', position: descriptionPosition },
    { key: 'details', position: detailsPosition },
  ]

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
          <option value="manual">Manual (separate drag/drop)</option>
        </select>
      </label>

      {textPlacementMode === 'manual' && (
        <div className="border rounded p-2">
          <small className="text-muted d-block mb-2">Resize each text drag/drop area</small>
          {Object.keys(ELEMENT_LABELS).map((key) => (
            <label key={key} className="form-label small d-block mb-2">
              {ELEMENT_LABELS[key]} Size ({textAreaScale[key].toFixed(2)}x)
              <input
                type="range"
                min={0.7}
                max={2}
                step={0.05}
                value={textAreaScale[key]}
                className="form-range"
                onChange={(event) => {
                  const nextScale = Number(event.target.value)
                  setTextAreaScale((prev) => ({ ...prev, [key]: nextScale }))
                  if (key === 'company') setCompanyPosition((pos) => clampElementPosition(pos, key))
                  if (key === 'product') setProductPosition((pos) => clampElementPosition(pos, key))
                  if (key === 'description') setDescriptionPosition((pos) => clampElementPosition(pos, key))
                  if (key === 'details') setDetailsPosition((pos) => clampElementPosition(pos, key))
                }}
              />
            </label>
          ))}
        </div>
      )}

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
            <small className="text-muted d-block mb-1">Drag logo and each text block independently</small>
            <div
              ref={dragContainerRef}
              className="position-relative border rounded"
              style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE, background: `linear-gradient(${accentColor} 0 22%, ${backgroundColor} 22% 78%, ${accentColor} 78% 100%)` }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                const target = activeDragTargetRef.current
                if (target === 'logo') {
                  updateLogoPositionFromPointer(event.clientX, event.clientY)
                  return
                }
                if (textPlacementMode === 'manual') {
                  updateElementPositionFromPointer(target, event.clientX, event.clientY)
                }
              }}
              onClick={(event) => {
                if (textPlacementMode === 'manual' && activeDragTargetRef.current !== 'logo') {
                  updateElementPositionFromPointer(activeDragTargetRef.current, event.clientX, event.clientY)
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

              {textPlacementMode === 'manual' && manualBoxes.map(({ key, position }) => {
                const box = getElementBox(key)
                return (
                  <div
                    key={key}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('text/plain', key)
                      activeDragTargetRef.current = key
                    }}
                    onMouseDown={() => {
                      activeDragTargetRef.current = key
                    }}
                    className="position-absolute border border-white rounded px-2 py-1"
                    style={{
                      width: box.width,
                      height: box.height,
                      left: position.x * PREVIEW_SIZE,
                      top: position.y * PREVIEW_SIZE,
                      background: 'rgba(15, 23, 42, 0.35)',
                      cursor: 'grab',
                      color: '#fff',
                      fontSize: 12,
                    }}
                  >
                    <div className="fw-semibold">{ELEMENT_LABELS[key]}</div>
                    <div className="small opacity-75">Drag or click canvas to place</div>
                  </div>
                )
              })}
            </div>
            {textPlacementMode === 'manual' && <small className="text-muted d-block mt-1">Tip: click the block first, then click preview to place that block.</small>}
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
