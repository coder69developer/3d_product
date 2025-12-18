import { Decal } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

export default function SimpleLogoDecal({
  textureUrl,
}) {
  const texture = useMemo(() => {
    if (!textureUrl) return null
    const t = new THREE.TextureLoader().load(textureUrl)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = true
    return t
  }, [textureUrl])

  if (!texture) return null

  return (
    <Decal
      position={[0, 2.35, 1.05]}   // ⬅️ forward from label
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
      map={texture}
      transparent
      depthTest={false}
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={-10}
    />
  )
}
