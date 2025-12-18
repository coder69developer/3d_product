'use client'

export default function SceneLights() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.5} />

      {/* Key light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Rim / back light */}
      <directionalLight
        position={[-5, 6, -5]}
        intensity={0.6}
      />

      {/* Top soft light */}
      <pointLight
        position={[0, 10, 0]}
        intensity={0.4}
      />
    </>
  )
}
