import { useRef, useMemo, useEffect } from 'react'
import { useGLTF, Text } from '@react-three/drei'
import { useBodyMaterial } from '@/shared/useBodyMaterial'
import CylindricalLogoDecal from '@/shared/CylindricalLogoDecal'
import * as THREE from 'three'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const MODEL_PATH = `${basePath}/3d_product/models/spray_bottle.glb`;
export function SprayBottle({
  bodyColor,
  capColor,
  singleColorMode,
  labelImage,
  logoImage,
  brandText,
  labelVisible = true,
  logoVisible = true,
  logoX = 0,
  logoY = 0,
  logoRotation = 0,
  cylindricalLabel = true, 
  logoScale, 
  scale = 0.5,
  ...props
}) {
  const { nodes, materials } = useGLTF(MODEL_PATH)
  const labelRef = useRef()
  const bodyRef = useRef()

  const bodyMaterial = useBodyMaterial(bodyColor);
  const capMaterial = useBodyMaterial(capColor);


  const labelMaterial = useMemo(() => {
    const mat = materials.Material.clone()
    mat.transparent = true
    mat.side = THREE.DoubleSide
    mat.depthWrite = false
    mat.needsUpdate = true
    mat.opacity = 1.0
    return mat
  }, [materials])

  useEffect(() => {
    if (labelImage && labelRef.current) {
      const loader = new THREE.TextureLoader()
      loader.load(labelImage, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.flipY = false
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(1, 2)
        texture.offset.set(0, 0)
        texture.needsUpdate = true

        const customMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: true,
        })
        if (labelRef.current) labelRef.current.material = customMaterial
      })
    } else if (labelRef.current) {
      labelRef.current.material = labelMaterial
    }
  }, [labelImage, labelMaterial])

  return (
    <group {...props} scale={scale} dispose={null}>
      {/* Body */}
      <mesh geometry={nodes.spray_nogal_back.geometry} material={singleColorMode ? bodyMaterial : capMaterial} position={[-0.313,5.033,-0.001]} scale={[0.547,0.547,0.177]} />
      <mesh geometry={nodes.spray_handle.geometry} material={singleColorMode ? bodyMaterial : capMaterial} position={[-0.74,4.299,0.072]} rotation={[Math.PI/2,-0.423,0]} scale={[0.115,0.186,0.186]} />
      <mesh geometry={nodes.spray_nogel.geometry} material={singleColorMode ? bodyMaterial : capMaterial} position={[-0.875,4.901,-0.001]} rotation={[0,0,-Math.PI/2]} scale={[0.143,0.135,0.176]} />
      <mesh geometry={nodes.cap.geometry} material={singleColorMode ? bodyMaterial : capMaterial} position={[0.017,4.038,0]} scale={0.313} />
      <mesh ref={bodyRef} geometry={nodes.bottle.geometry} material={bodyMaterial} position={[0.017,2.07,0]} scale={[0.62,1.241,0.62]} />

      {/* Label */}
      {labelVisible && (
        <mesh ref={labelRef} geometry={nodes.label.geometry} material={nodes.label.material} position={[0,1.345,0]} scale={0.649}>
          {logoVisible && logoImage && (
            <CylindricalLogoDecal
              textureUrl={logoImage}
              labelWidth={1.3}
              labelHeight={1.3}
              labelCircumference={2.77}
              x={logoX}
              y={logoY}
              rotationY={logoRotation}
              cylindrical={cylindricalLabel}
              scale={logoScale}
            />
          )}
        </mesh>
      )}
    </group>
  )
}

useGLTF.preload(MODEL_PATH)
