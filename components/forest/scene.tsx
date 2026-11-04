'use client'

import { Sparkles } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { useRef, type MutableRefObject, type RefObject } from 'react'
import { Group, MathUtils, Vector3 } from 'three'
import { heightAt, pathCurve } from '@/lib/forest-data'
import { Atmosphere } from './atmosphere'
import { Ground } from './ground'
import { Hut } from './hut'
import { LightShafts } from './light-shafts'
import { SkyDome } from './sky-dome'
import { Trees } from './trees'
import { Undergrowth } from './undergrowth'

function Fireflies() {
  const group = useRef<Group>(null)
  const { camera } = useThree()
  useFrame(() => {
    group.current?.position.set(camera.position.x, camera.position.y + 1, camera.position.z - 8)
  })
  return (
    <group ref={group}>
      <Sparkles count={140} scale={[36, 8, 36]} size={5} speed={0.3} color="#ffe9a8" opacity={0.9} />
    </group>
  )
}

const lookTarget = new Vector3()

function CameraRig({ smooth }: { smooth: MutableRefObject<number> }) {
  const { camera, pointer } = useThree()

  useFrame(() => {
    const t = Math.min(0.92, 0.002 + smooth.current * 0.918)
    const p = pathCurve.getPointAt(t)
    const look = pathCurve.getPointAt(Math.min(1, t + 0.05))
    const bob = Math.sin(smooth.current * 160) * 0.05
    const arrival = MathUtils.smoothstep(smooth.current, 0.82, 1)
    camera.position.set(p.x, heightAt(p.x, p.z) + 1.7 + bob, p.z)
    lookTarget.set(
      look.x - arrival * 4 + pointer.x * 1.8,
      heightAt(look.x, look.z) + 1.5 + pointer.y * 0.7,
      look.z,
    )
    camera.lookAt(lookTarget)
  })

  return null
}

export function Scene({
  progress,
  lowQuality = false,
  explore = false,
}: {
  progress: RefObject<number>
  lowQuality?: boolean
  explore?: boolean
}) {
  const smooth = useRef(0)

  useFrame((_, dt) => {
    smooth.current += ((progress.current ?? 0) - smooth.current) * Math.min(1, dt * 2.5)
  })

  return (
    <>
      <Atmosphere smooth={smooth} />
      {!explore && <CameraRig smooth={smooth} />}
      <SkyDome />
      <Ground />
      <Trees />
      <Undergrowth />
      <LightShafts />
      <Hut />
      <Fireflies />
      <EffectComposer multisampling={lowQuality ? 0 : 4}>
        <Bloom intensity={0.7} luminanceThreshold={0.9} luminanceSmoothing={0.25} mipmapBlur />
        <Vignette offset={0.25} darkness={0.55} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  )
}
