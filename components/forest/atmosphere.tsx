'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef, type MutableRefObject } from 'react'
import {
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  MathUtils,
  Object3D,
  PointLight,
  Vector3,
} from 'three'
import { atmosphere } from '@/lib/atmosphere-state'
import { hutPosition } from '@/lib/forest-data'

const FOG_DAWN = new Color('#4e7466')
const FOG_NIGHT = new Color('#0a1816')
const TOP_DAWN = new Color('#7fa3b0')
const TOP_NIGHT = new Color('#050b14')
const SUN_DAWN = new Color('#ffd9a0')
const SUN_NIGHT = new Color('#7f9bd4')

const forward = new Vector3()

export function Atmosphere({ smooth }: { smooth: MutableRefObject<number> }) {
  const { camera } = useThree()
  const fog = useRef<Fog>(null)
  const hemi = useRef<HemisphereLight>(null)
  const sun = useRef<DirectionalLight>(null)
  const lantern = useRef<PointLight>(null)
  const target = useMemo(() => new Object3D(), [])

  useLayoutEffect(() => {
    if (sun.current) sun.current.target = target
  }, [target])

  useFrame(() => {
    const n = MathUtils.smoothstep(smooth.current, 0.45, 0.95)
    atmosphere.night = n
    atmosphere.fog.copy(FOG_DAWN).lerp(FOG_NIGHT, n)
    atmosphere.top.copy(TOP_DAWN).lerp(TOP_NIGHT, n)
    atmosphere.sunColor.copy(SUN_DAWN).lerp(SUN_NIGHT, n)

    if (fog.current) {
      fog.current.color.copy(atmosphere.fog)
      fog.current.near = 8 - 5 * n
      fog.current.far = 85 - 40 * n
    }
    if (hemi.current) hemi.current.intensity = 1.1 - 0.75 * n
    if (sun.current) {
      sun.current.intensity = 2.8 - 2.4 * n
      sun.current.color.copy(atmosphere.sunColor)
    }
    if (lantern.current) lantern.current.intensity = 22 * n

    camera.getWorldDirection(forward)
    target.position.set(
      camera.position.x + forward.x * 16,
      camera.position.y - 1.7,
      camera.position.z + forward.z * 16,
    )
    target.updateMatrixWorld()
    sun.current?.position.copy(target.position).addScaledVector(atmosphere.sunDir, 60)
  })

  return (
    <>
      <fog ref={fog} attach="fog" args={['#4e7466', 8, 85]} />
      <hemisphereLight ref={hemi} args={['#cfe6d4', '#2a3a2c', 1.1]} />
      <primitive object={target} />
      <directionalLight
        ref={sun}
        intensity={2.8}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={34}
        shadow-camera-bottom={-34}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      />
      <pointLight
        ref={lantern}
        position={[hutPosition.x, hutPosition.y + 2.4, hutPosition.z + 3.4]}
        color="#ffb347"
        distance={32}
        decay={1.6}
        intensity={0}
      />
    </>
  )
}
