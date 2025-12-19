import { Bottle } from "@/models/Bottle"
import { Container } from "@/models/Container"
import { Kanster } from "@/models/Kanster"
import { SprayBottle } from "@/models/Spray_bottle"
import { useRef, useLayoutEffect, useState } from 'react'
import * as THREE from 'three'

function CenteredModel({ children}) {
  const groupRef = useRef()
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    if (!groupRef.current) return

    // Compute bounding box of the model
    const box = new THREE.Box3().setFromObject(groupRef.current)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // Recenter the model at origin
    groupRef.current.position.x -= center.x
    groupRef.current.position.y -= box.min.y // keep base at Y=0
    groupRef.current.position.z -= center.z

    // Optional: scale model to fit nicely
    const maxDim = Math.max(size.x, size.y, size.z)
    const targetSize = 2.5       // adjust depending on your canvas
    setScale(targetSize / maxDim)
  }, [])

  return <group ref={groupRef} scale={[scale, scale, scale]}>{children}</group>
}

export default function ModelRenderer({ modelType, config }) {
  let ModelComponent
  switch (modelType) {
    case 'spray_bottle':
      ModelComponent = SprayBottle
      break
    case 'bottle':
      ModelComponent = Bottle
      break
    case 'kanster':
      ModelComponent = Kanster
      break
    case 'container':
      ModelComponent = Container
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
