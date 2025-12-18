import { useMemo } from 'react'
import * as THREE from 'three'

export function useBodyMaterial(color) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.1,
        roughness: 0.5,
        side: THREE.DoubleSide
      }),
    [color]
  )
}
