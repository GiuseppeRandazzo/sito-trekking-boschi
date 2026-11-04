'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, DoubleSide, Shape, ShapeGeometry, Sprite } from 'three'
import { hutPosition } from '@/lib/forest-data'
import {
  createBarkTextures,
  createPlankTexture,
  createShingleTexture,
  createSoftCircleTexture,
  createStoneTexture,
} from '@/lib/procedural-textures'

const LOG_ROWS = 5
const LOG_RADIUS = 0.19
const LOG_SPACING = 0.36
const WALL_BASE = 0.69
const ROOF_PITCH = 0.54
const SMOKE_PUFFS = 6

const rowY = (r: number) => WALL_BASE + r * LOG_SPACING

export function Hut() {
  const tex = useMemo(() => {
    const stone = createStoneTexture()
    const foundation = stone.clone()
    foundation.repeat.set(4, 1)
    const chimney = stone.clone()
    chimney.repeat.set(1, 3)
    const shingle = createShingleTexture().clone()
    shingle.repeat.set(4, 2)
    return {
      bark: createBarkTextures('pine'),
      plank: createPlankTexture(),
      smoke: createSoftCircleTexture(),
      foundation,
      chimney,
      shingle,
    }
  }, [])

  const glow = useMemo(() => new Color().setRGB(3.2, 1.7, 0.55), [])

  const gable = useMemo(() => {
    const shape = new Shape()
    shape.moveTo(-2.7, 2.3)
    shape.lineTo(2.7, 2.3)
    shape.lineTo(0, 4.1)
    shape.closePath()
    return new ShapeGeometry(shape)
  }, [])

  const smokeRefs = useRef<(Sprite | null)[]>([])
  useFrame(({ clock }) => {
    smokeRefs.current.forEach((sprite, i) => {
      if (!sprite) return
      const phase = (clock.elapsedTime * 0.12 + i / SMOKE_PUFFS) % 1
      sprite.position.set(1.4 + phase * 1.6, 5.1 + phase * 5, -0.7 + phase * 0.4)
      const size = 0.8 + phase * 3
      sprite.scale.set(size, size, 1)
      sprite.material.opacity = Math.sin(phase * Math.PI) * 0.26
    })
  })

  const frontBackLogs = Array.from({ length: LOG_ROWS }, (_, r) => r)
  const woodpile = [
    ...Array.from({ length: 5 }, (_, j) => ({ x: j * 0.23, y: 0.11 })),
    ...Array.from({ length: 4 }, (_, j) => ({ x: 0.115 + j * 0.23, y: 0.31 })),
    ...Array.from({ length: 3 }, (_, j) => ({ x: 0.23 + j * 0.23, y: 0.51 })),
  ]

  return (
    <group position={hutPosition}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 1, 4.6]} />
        <meshStandardMaterial map={tex.foundation} roughness={1} />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4.9, 2.2, 3.9]} />
        <meshStandardMaterial color="#1a120c" roughness={1} />
      </mesh>

      {frontBackLogs.map((r) =>
        [-1, 1].map((side) => (
          <mesh
            key={`fb-${r}-${side}`}
            position={[0, rowY(r), side * 2]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[LOG_RADIUS, LOG_RADIUS, 5.4, 12]} />
            <meshStandardMaterial
              map={tex.bark.map}
              normalMap={tex.bark.normalMap}
              roughness={0.95}
            />
          </mesh>
        )),
      )}
      {frontBackLogs.map((r) =>
        [-1, 1].map((side) => (
          <mesh
            key={`side-${r}-${side}`}
            position={[side * 2.5, rowY(r) + LOG_SPACING / 2 - 0.02, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <cylinderGeometry args={[LOG_RADIUS, LOG_RADIUS, 4.5, 12]} />
            <meshStandardMaterial
              map={tex.bark.map}
              normalMap={tex.bark.normalMap}
              roughness={0.95}
            />
          </mesh>
        )),
      )}

      {[-1, 1].map((side) => (
        <mesh
          key={`gable-${side}`}
          geometry={gable}
          position={[0, 0, side * 2.05]}
          rotation={[0, side === 1 ? 0 : Math.PI, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial map={tex.plank} roughness={0.95} side={DoubleSide} />
        </mesh>
      ))}

      {[-1, 1].map((side) => (
        <mesh
          key={`roof-${side}`}
          position={[side * 1.45, 3.29, 0]}
          rotation={[0, 0, -side * ROOF_PITCH]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3.5, 0.16, 5]} />
          <meshStandardMaterial map={tex.shingle} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 4.27, 0]} castShadow>
        <boxGeometry args={[0.34, 0.12, 5.1]} />
        <meshStandardMaterial color="#1c1612" roughness={1} />
      </mesh>

      <mesh position={[1.4, 4, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial map={tex.chimney} roughness={1} />
      </mesh>

      <mesh position={[0, 0.5 + 0.9, 2.24]} castShadow>
        <boxGeometry args={[0.95, 1.8, 0.08]} />
        <meshStandardMaterial map={tex.plank} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5 + 0.9, 2.2]}>
        <boxGeometry args={[1.15, 1.9, 0.06]} />
        <meshStandardMaterial color="#1c120b" roughness={1} />
      </mesh>
      <mesh position={[0.32, 1.4, 2.3]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color="#8a7a5a" metalness={0.8} roughness={0.4} />
      </mesh>

      {[-1.5, 1.5].map((x) => (
        <group key={x} position={[x, 1.55, 2.24]}>
          <mesh>
            <boxGeometry args={[1, 0.9, 0.08]} />
            <meshStandardMaterial color="#1c120b" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.8, 0.7]} />
            <meshBasicMaterial color={glow} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.04, 0.7, 0.03]} />
            <meshStandardMaterial color="#1c120b" roughness={1} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.8, 0.04, 0.03]} />
            <meshStandardMaterial color="#1c120b" roughness={1} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.62, 2.55]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.18, 0.6]} />
        <meshStandardMaterial map={tex.foundation} roughness={1} />
      </mesh>
      <mesh position={[0, 0.5, 2.95]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.18, 0.3]} />
        <meshStandardMaterial map={tex.foundation} roughness={1} />
      </mesh>

      <mesh position={[1.0, 2.05, 2.32]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>

      <group position={[-3.5, -0.05, 0.9]} rotation={[0, 0.1, 0]}>
        {woodpile.map((l, i) => (
          <mesh key={i} position={[l.x, l.y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.11, 1.1, 10]} />
            <meshStandardMaterial attach="material-0" map={tex.bark.map} roughness={0.95} />
            <meshStandardMaterial attach="material-1" color="#b88a5a" roughness={0.9} />
            <meshStandardMaterial attach="material-2" color="#b88a5a" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {Array.from({ length: SMOKE_PUFFS }, (_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            smokeRefs.current[i] = el
          }}
        >
          <spriteMaterial map={tex.smoke} color="#8e8e8e" transparent opacity={0} depthWrite={false} />
        </sprite>
      ))}
    </group>
  )
}
