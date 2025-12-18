import { useMemo } from 'react'
import * as THREE from 'three'

export function useTextTexture({
  text,
  fontSize = 96,
  color = '#111',
  font = 'bold 96px Arial',
  padding = 40,
}) {
  return useMemo(() => {
    if (!text) return null

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ctx.font = font
    const metrics = ctx.measureText(text)

    canvas.width = metrics.width + padding * 2
    canvas.height = fontSize + padding * 2

    ctx.font = font
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true

    return texture
  }, [text, fontSize, color, font, padding])
}
