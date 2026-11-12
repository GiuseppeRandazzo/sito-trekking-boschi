'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three'
import { distToPath, heightAt, hutPosition, pathCurve } from '@/lib/forest-data'
import {
  createBarkTextures,
  createFernTextures,
  createGrassTextures,
  mulberry32,
} from '@/lib/procedural-textures'
import {
  createFernGeometry,
  createGrassGeometry,
  createRockGeometry,
} from '@/lib/tree-geometry'

type Spot = { x: number; y: number; z: number; yaw: number; s: number; tint: number }

function scatter(count: number, seed: number, dMin: number, dMax: number): Spot[] {
  const rand = mulberry32(seed)
  const out: Spot[] = []
  let tries = 0
  while (out.length < count && tries < count * 10) {
    tries++
    const c = pathCurve.getPointAt(rand() * 0.97)
    const side = rand() < 0.5 ? -1 : 1
    const off = dMin + Math.pow(rand(), 1.4) * (dMax - dMin)
    const x = c.x + side * off + (rand() - 0.5) * 3
    const z = c.z + (rand() - 0.5) * 3
    const d = distToPath(x, z)
    if (d < dMin || d > dMax) continue
    if (Math.hypot(x - hutPosition.x, z - hutPosition.z) < 5) continue
    out.push({
      x,
      y: heightAt(x, z, d),
      z,
      yaw: rand() * Math.PI * 2,
      s: 0.7 + rand() * 0.8,
      tint: rand(),
    })
  }
  return out
}

function fill(
  mesh: InstancedMesh | null,
  spots: Spot[],
  scale: (s: Spot) => [number, number, number],
  color: (s: Spot, c: Color) => Color,
  sink = 0,
  tilt = 0,
) {
  if (!mesh) return
  const m = new Matrix4()
  const p = new Vector3()
  const sc = new Vector3()
  const q = new Quaternion()
  const e = new Euler()
  const c = new Color()
  spots.forEach((s, i) => {
    const [sx, sy, sz] = scale(s)
    q.setFromEuler(e.set((s.tint - 0.5) * tilt, s.yaw, (s.s - 1) * tilt, 'YXZ'))
    m.compose(p.set(s.x, s.y - sink * sy, s.z), q, sc.set(sx, sy, sz))
    mesh.setMatrixAt(i, m)
    mesh.setColorAt(i, color(s, c))
  })
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}

export function Undergrowth() {
  const assets = useMemo(
    () => ({
      fernGeo: createFernGeometry(),
      grassGeo: createGrassGeometry(),
      rockA: createRockGeometry(1.3),
      rockB: createRockGeometry(4.7),
      fern: createFernTextures(),
      grass: createGrassTextures(),
      bark: createBarkTextures('pine'),
    }),
    [],
  )

  const spots = useMemo(
    () => ({
      ferns: scatter(650, 101, 1.7, 16),
      grass: scatter(2000, 102, 1.5, 12),
      ginestre: scatter(160, 106, 1.8, 15), // Ginestra dell'Etna (Genista aetnensis) con fiori giallo oro
      rocksA: scatter(55, 103, 2.2, 15),
      rocksB: scatter(55, 104, 2.2, 15),
      logs: scatter(12, 105, 3, 12),
    }),
    [],
  )

  const fernRef = useRef<InstancedMesh>(null)
  const grassRef = useRef<InstancedMesh>(null)
  const ginestraRef = useRef<InstancedMesh>(null)
  const rockARef = useRef<InstancedMesh>(null)
  const rockBRef = useRef<InstancedMesh>(null)
  const logRef = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    fill(
      fernRef.current,
      spots.ferns,
      (s) => [s.s * 0.9, s.s * 0.9, s.s * 0.9],
      (s, c) => c.setRGB(0.8 + 0.3 * s.tint, 1, 0.8),
      0,
      0.12,
    )
    fill(
      grassRef.current,
      spots.grass,
      (s) => [s.s, s.s * (0.9 + s.tint * 0.5), s.s],
      (s, c) => c.setRGB(0.85 + 0.25 * s.tint, 1, 0.8),
    )
    // Ginestra dell'Etna: ciuffi dorati tipici dei versanti vulcanici
    fill(
      ginestraRef.current,
      spots.ginestre,
      (s) => [s.s * 1.3, s.s * (1.6 + s.tint * 0.7), s.s * 1.3],
      (s, c) => c.setRGB(1.0, 0.82 + s.tint * 0.12, 0.12),
      0,
      0.15,
    )
    const rockScale = (s: Spot): [number, number, number] => {
      const r = 0.25 + s.s * s.s * 0.45
      return [r * (1 + s.tint * 0.4), r, r * (1.3 - s.tint * 0.3)]
    }
    // Basalto lavico scuro dell'Etna
    fill(
      rockARef.current,
      spots.rocksA,
      rockScale,
      (_s, c) => c.setRGB(0.22 + _s.tint * 0.08, 0.22 + _s.tint * 0.08, 0.24 + _s.tint * 0.08),
      0.2,
      0.3,
    )
    fill(
      rockBRef.current,
      spots.rocksB,
      rockScale,
      (_s, c) => c.setRGB(0.19 + _s.tint * 0.06, 0.19 + _s.tint * 0.06, 0.21 + _s.tint * 0.06),
      0.2,
      0.3,
    )

    const logScale = (s: Spot): [number, number, number] => [
      0.22 + s.tint * 0.14,
      3 + s.s * 2.2,
      0.22 + s.tint * 0.14,
    ]
    if (logRef.current) {
      const m = new Matrix4()
      const p = new Vector3()
      const sc = new Vector3()
      const q = new Quaternion()
      const e = new Euler()
      const c = new Color()
      spots.logs.forEach((s, i) => {
        const [sx, sy, sz] = logScale(s)
        q.setFromEuler(e.set(0, s.yaw, Math.PI / 2 + (s.tint - 0.5) * 0.08, 'YXZ'))
        m.compose(p.set(s.x, s.y + sx * 0.7, s.z), q, sc.set(sx, sy, sz))
        logRef.current!.setMatrixAt(i, m)
        logRef.current!.setColorAt(i, c.setRGB(0.55 + 0.25 * s.tint, 0.5 + 0.2 * s.tint, 0.45))
      })
      logRef.current.instanceMatrix.needsUpdate = true
      if (logRef.current.instanceColor) logRef.current.instanceColor.needsUpdate = true
    }
  }, [spots])

  return (
    <group>
      <instancedMesh
        ref={fernRef}
        args={[undefined, undefined, spots.ferns.length]}
        frustumCulled={false}
        receiveShadow
      >
        <primitive object={assets.fernGeo} attach="geometry" />
        <meshStandardMaterial
          map={assets.fern.map}
          alphaMap={assets.fern.alphaMap}
          vertexColors
          alphaTest={0.5}
          alphaToCoverage
          side={DoubleSide}
          roughness={0.9}
        />
      </instancedMesh>

      <instancedMesh
        ref={grassRef}
        args={[undefined, undefined, spots.grass.length]}
        frustumCulled={false}
        receiveShadow
      >
        <primitive object={assets.grassGeo} attach="geometry" />
        <meshStandardMaterial
          map={assets.grass.map}
          alphaMap={assets.grass.alphaMap}
          vertexColors
          alphaTest={0.5}
          alphaToCoverage
          side={DoubleSide}
          roughness={1}
        />
      </instancedMesh>

      {/* Ginestra dell'Etna con fioritura giallo oro */}
      <instancedMesh
        ref={ginestraRef}
        args={[undefined, undefined, spots.ginestre.length]}
        frustumCulled={false}
        receiveShadow
      >
        <primitive object={assets.grassGeo} attach="geometry" />
        <meshStandardMaterial
          map={assets.grass.map}
          alphaMap={assets.grass.alphaMap}
          vertexColors
          alphaTest={0.5}
          alphaToCoverage
          side={DoubleSide}
          roughness={0.8}
        />
      </instancedMesh>

      <instancedMesh
        ref={rockARef}
        args={[undefined, undefined, spots.rocksA.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <primitive object={assets.rockA} attach="geometry" />
        <meshStandardMaterial vertexColors roughness={0.95} />
      </instancedMesh>

      <instancedMesh
        ref={rockBRef}
        args={[undefined, undefined, spots.rocksB.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <primitive object={assets.rockB} attach="geometry" />
        <meshStandardMaterial vertexColors roughness={0.95} />
      </instancedMesh>

      <instancedMesh
        ref={logRef}
        args={[undefined, undefined, spots.logs.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1, 0.9, 1, 14, 1]} />
        <meshStandardMaterial
          map={assets.bark.map}
          normalMap={assets.bark.normalMap}
          roughness={0.95}
        />
      </instancedMesh>
    </group>
  )
}
