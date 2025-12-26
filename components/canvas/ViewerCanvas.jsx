'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import SceneLights from './SceneLights'

export default function ViewerCanvas({ children }) {
  return (
    <Canvas camera={{ position: [0, 3, 8], fov: 40 }} gl={{ antialias: true }}>
      <color attach="background" args={['#f5f5f5']} />
      <SceneLights />
      <Environment preset="city" />
      <OrbitControls enablePan={false} />
      {children}
    </Canvas>
  )
}
