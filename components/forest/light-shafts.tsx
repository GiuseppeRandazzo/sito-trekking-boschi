'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import {
  AdditiveBlending,
  DoubleSide,
  MathUtils,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from 'three'
import { atmosphere } from '@/lib/atmosphere-state'
import { heightAt, pathCurve } from '@/lib/forest-data'
import { createShaftTexture, mulberry32 } from '@/lib/procedural-textures'

const SHAFT_COUNT = 9
const SHAFT_LENGTH = 30

export function LightShafts() {
  const { camera } = useThree()

  const shafts = useMemo(() => {
    const rand = mulberry32(77)
    const texture = createShaftTexture()
    const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), atmosphere.sunDir)
    return Array.from({ length: SHAFT_COUNT }, (_, i) => {
      const t = 0.04 + (i / SHAFT_COUNT) * 0.78 + rand() * 0.04
      const c = pathCurve.getPointAt(t)
      const side = i % 2 === 0 ? -1 : 1
      const x = c.x + side * (3 + rand() * 7)
      const z = c.z + (rand() - 0.5) * 4
      const pos = new Vector3(x, heightAt(x, z), z).addScaledVector(
        atmosphere.sunDir,
        SHAFT_LENGTH / 2 - 1,
      )
      const material = new MeshBasicMaterial({
        map: texture,
        color: '#ffe7b0',
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
        side: DoubleSide,
        fog: false,
      })
      return {
        pos,
        q,
        width: 3 + rand() * 4,
        phase: rand() * 6,
        base: 0.12 + rand() * 0.1,
        material,
      }
    })
  }, [])

  useFrame(({ clock }) => {
    const day = (1 - atmosphere.night) ** 2
    for (const s of shafts) {
      const d = camera.position.distanceTo(s.pos)
      const fade =
        MathUtils.smoothstep(d, 5, 12) * (1 - MathUtils.smoothstep(d, 38, 62))
      const pulse = 0.75 + 0.25 * Math.sin(clock.elapsedTime * 0.35 + s.phase)
      s.material.opacity = s.base * fade * day * pulse
    }
  })

  return (
    <group>
      {shafts.map((s, i) => (
        <group key={i} position={s.pos} quaternion={s.q}>
          {[0, Math.PI / 2].map((r) => (
            <mesh key={r} rotation={[0, r, 0]} renderOrder={5}>
              <planeGeometry args={[s.width, SHAFT_LENGTH]} />
              <primitive object={s.material} attach="material" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}
