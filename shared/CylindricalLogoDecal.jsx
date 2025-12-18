import { Decal } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

export default function CylindricalLogoDecal({
  textureUrl,
  labelHeight = 1.3,     // Y
  labelWidth = 1.3,      // X (flat mapping, if used)
  labelCircumference = 2.77, // Z circumference of cylinder
  x = 0,                 // normalized horizontal [-0.5, 0.5]
  y = 0,                 // normalized vertical [-0.5, 0.5]
  rotationY = 0,
  cylindrical = true,
  scale = [1, 0.4, 1.35]
}) {
  const texture = useMemo(() => {
    if (!textureUrl) return null
    const t = new THREE.TextureLoader().load(textureUrl)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = true
    return t
  }, [textureUrl])

  if (!texture) return null

  let position, finalRotationY
  if (cylindrical) {
    const radius = labelCircumference / (2 * Math.PI)
    const angle = x * Math.PI  // horizontal slider [-0.5,0.5] maps to [-π/2, π/2]
    position = [
      Math.sin(angle) * radius,   // X
      y * labelHeight,            // Y linear
      Math.cos(angle) * radius    // Z
    ]
    finalRotationY = angle + rotationY
  } else {
    // flat label
    position = [
      x * labelWidth,
      y * labelHeight,
      0.02
    ]
    finalRotationY = rotationY
  }

  return (
    <Decal
      position={position}
      rotation={[0, finalRotationY, 0]}
      scale={scale}
      map={texture}
      transparent
      depthTest={false}
      depthWrite={false}
      
    />
  )
}
