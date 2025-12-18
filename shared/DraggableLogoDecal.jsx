import { Decal } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

export default function DraggableLogoDecal({
  texture,
  initialPosition = [0, 2.35, 1.0],
  initialRotation = [0, Math.PI / 2, 0],
  initialScale = 1,
  outlineColor = '#00aaff',
  onChange,
}) {
  const [position, setPosition] = useState(initialPosition)
  const [rotation, setRotation] = useState(initialRotation)
  const [scale, setScale] = useState(initialScale)
  const [selected, setSelected] = useState(false)

  const dragging = useRef(false)
  const last = useRef([0, 0])

  const logoMaterial = useMemo(() => {
    if (!texture) return null
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -10,
    })
  }, [texture])

  const outlineMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: outlineColor,
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      depthWrite: false,
    })
  }, [outlineColor])

  if (!logoMaterial) return null

  const onPointerDown = (e) => {
    e.stopPropagation()
    setSelected(true)
    dragging.current = true
    last.current = [e.clientX, e.clientY]
  }

  const onPointerUp = () => {
    dragging.current = false
    onChange?.({ position, rotation, scale })
  }

  const onPointerMissed = () => {
    setSelected(false)
  }

  const onPointerMove = (e) => {
    if (!dragging.current) return
    const dx = e.clientX - last.current[0]
    const dy = e.clientY - last.current[1]
    last.current = [e.clientX, e.clientY]

    setRotation(([x, y, z]) => [x, y + dx * 0.005, z])
    setPosition(([x, y, z]) => [x, y - dy * 0.002, z])
  }

  const onWheel = (e) => {
    e.stopPropagation()
    setScale((s) => THREE.MathUtils.clamp(s - e.deltaY * 0.0005, 0.05, 0.6))
  }

  return (
    <>
      {/* Outline decal (only when selected) */}
      {selected && (
        <Decal
          position={position}
          rotation={rotation}
          scale={scale * 1.08}
          material={outlineMaterial}
        />
      )}

      {/* Main decal */}
      <Decal
      debug='true'
        position={position}
        rotation={rotation}
        scale={scale}
        material={logoMaterial}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onWheel={onWheel}
        onPointerMissed={onPointerMissed}
      />
    </>
  )
}
