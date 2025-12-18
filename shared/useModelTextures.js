import { useMemo } from 'react'
import * as THREE from 'three'

export function useModelTexture(url, options = {}) {
  return useMemo(() => {
    if (!url) return null
    const texture = new THREE.TextureLoader().load(url)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.flipY = options.flipY ?? false    // flipped by default
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    if (options.repeat) texture.repeat.set(...options.repeat)
    if (options.offset) texture.offset.set(...options.offset)
    texture.needsUpdate = true
    return texture
  }, [url])
}

