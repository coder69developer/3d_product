
import {useMemo} from 'react'
import * as THREE from 'three'
import { Decal } from '@react-three/drei'

export default function DecalLogo({
  texture,
  position = [0, 0, 0.01],
  rotation = [0, 0, 0],
  scale = 0.25,
  opacity = 1,
  }) {
  const material = useMemo(() => {
    if (!texture) return null

    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthTest: false,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -10,
    })
  }, [texture, opacity])

  if (!material) return null

  return (
    <Decal
      debug='true'
      position={position}
      rotation={rotation}
      scale={scale}
      material={material}
    />
  )
}
