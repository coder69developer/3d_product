import { SprayBottle } from "@/models/Spray_bottle"
import { useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'

function CenteredModel({ children }) {
  const groupRef = useRef()

  useLayoutEffect(() => {
    if (!groupRef.current) return

    const box = new THREE.Box3().setFromObject(groupRef.current)
    const min = box.min
    const max = box.max

    // Calculate the offset needed so base (min.y) sits at 0
    const offsetY = min.y

    groupRef.current.position.y -= min.y;
  }, [])

  return <group ref={groupRef}>{children}</group>
}

export default function ModelRenderer({ modelType, config }) {
  let ModelComponent
  switch (modelType) {
    case 'spray_bottle':
      ModelComponent = SprayBottle
      break
    default:
      ModelComponent = SprayBottle
  }

  return (
    <CenteredModel>
      <ModelComponent
        bodyColor={config.bodyColor}
        labelVisible={config.showLabel}
        logoVisible={config.showLogo}
        labelImage={config.labelImage}
        logoImage={config.logoImage}
        brandText={config.brandText}
        logoX={config.logoX}
        logoY={config.logoY}
        logoRotation={config.logoRotation}
        logoScale={config.logoScale}
      />
    </CenteredModel>
  )
}
