import { useMemo } from 'react'
import * as THREE from 'three'

export default function SimpleLogoDecal({
  textureUrl,
  labelWidth = 1.655,
  labelHeight = 1.515,
  x = 0,        // left/right
  y = 0,        // up/down (label Y)
  z = 0.02,     // depth offset from label
  rotationZ = 0,
  scale = [0.5, 0.5, 0.5],
}) {
  const texture = useMemo(() => {
    if (!textureUrl) return null
    const t = new THREE.TextureLoader().load(textureUrl)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = false
    return t
  }, [textureUrl])

  if (!texture) return null

  /* -------------------------------
     Label mesh is rotated X = 90°
     Local label axes:
     X → world X
     Y → world Z
     Z → world -Y
  -------------------------------- */

  const position = [
    x * labelWidth,     // left / right
    z,                 // depth (push out from label)
    y * labelHeight,    // up / down
  ]

  return (
    <mesh position={position} rotation={[Math.PI/2, rotationZ, 0]} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

