'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import SceneLights from './SceneLights'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export default function ViewerCanvas({ children, onReady }) {

  function ThreeRefCollector() {
    const { gl: renderer, scene, camera } = useThree()

    useEffect(() => {
      if (onReady) {
        onReady({ renderer, scene, camera })
      }
    }, [renderer, scene, camera])

    return null
  }

  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 40 }} gl={{ antialias: true }}>
      <color attach="background" args={['#f5f5f5']} />
      <SceneLights />
      <Environment preset="city" />
      <OrbitControls enablePan={false} />
      <ThreeRefCollector />
      {children}
    </Canvas>
  )
}
