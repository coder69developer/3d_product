import { Decal } from '@react-three/drei'

export default function LogoDecalWithText({
  mesh,
  texture,
  labelWidth = 1.3,
  labelHeight = 1.3,
  x = 0,
  y = 0,
  rotationY = 0,
  scale = [1, 0.75, 1.35],
}) {
  if (!mesh?.current || !texture) return null

  const position = [
    x * labelWidth,
    y * labelHeight,
    0.02, // forward from label
  ]

  return (
    <Decal
      mesh={mesh.current}
      position={position}
      rotation={[0, rotationY, 0]}
      scale={scale}
      map={texture}
      transparent
      depthTest={false}
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={-10}
    />
  )
}
