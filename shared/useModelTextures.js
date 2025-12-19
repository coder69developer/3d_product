import { useMemo } from 'react'
import * as THREE from 'three'

export function useModelTexture(url) {
  return useMemo(() => {
    if (!url) return null
    const texture = new THREE.TextureLoader().load(url)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = false
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true
    return texture
  }, [url])
}

