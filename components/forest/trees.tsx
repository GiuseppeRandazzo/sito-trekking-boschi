'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three'
import { trees, type TreeData } from '@/lib/forest-data'
import {
  createBarkTextures,
  createBeechLeafTextures,
  createPineLeafTextures,
} from '@/lib/procedural-textures'
import {
  createBeechFoliage,
  createPineFoliage,
  createTrunkGeometry,
} from '@/lib/tree-geometry'

const PINE_TRUNK_HEIGHT = 7.4
const BEECH_TRUNK_HEIGHT = 5.3

const frac = (x: number) => x - Math.floor(x)

export function Trees() {
  const pines = useMemo(() => trees.filter((t) => t.kind === 'pine'), [])
  const beeches = useMemo(() => trees.filter((t) => t.kind === 'beech'), [])

  const assets = useMemo(
    () => ({
      pineTrunk: createTrunkGeometry('pine'),
      beechTrunk: createTrunkGeometry('beech'),
      pineFoliage: createPineFoliage(),
      beechFoliage: createBeechFoliage(),
      pineBark: createBarkTextures('pine'),
      beechBark: createBarkTextures('beech'),
      pineLeaf: createPineLeafTextures(),
      beechLeaf: createBeechLeafTextures(),
    }),
    [],
  )

  const pineTrunkRef = useRef<InstancedMesh>(null)
  const pineLeafRef = useRef<InstancedMesh>(null)
  const beechTrunkRef = useRef<InstancedMesh>(null)
  const beechLeafRef = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    const m = new Matrix4()
    const p = new Vector3()
    const s = new Vector3()
    const q = new Quaternion()
    const e = new Euler()
    const c = new Color()

    const place = (
      mesh: InstancedMesh,
      i: number,
      t: TreeData,
      scaleY: number,
      color: Color,
    ) => {
      const tiltX = (frac(t.tint * 37.1) - 0.5) * 0.09
      const tiltZ = (frac(t.tint * 91.7) - 0.5) * 0.09
      const yaw = frac(t.tint * 97.3) * Math.PI * 2
      q.setFromEuler(e.set(tiltX, yaw, tiltZ, 'YXZ'))
      m.compose(p.set(t.x, t.y - 0.1, t.z), q, s.set(t.s, scaleY * t.s, t.s))
      mesh.setMatrixAt(i, m)
      mesh.setColorAt(i, color)
    }

    pines.forEach((t, i) => {
      const k = 0.8 + 0.2 * t.tint
      place(pineTrunkRef.current!, i, t, PINE_TRUNK_HEIGHT, c.setRGB(k, k, k))
      place(pineLeafRef.current!, i, t, 1, c.setRGB(0.85 * k, k, 0.85 * k))
    })

    beeches.forEach((t, i) => {
      const k = 0.85 + 0.15 * t.tint
      place(beechTrunkRef.current!, i, t, BEECH_TRUNK_HEIGHT, c.setRGB(k, k, k))
      if (t.tint > 0.86) c.setRGB(2.2, 1.25, 0.45)
      else c.setRGB(0.9 + 0.3 * t.tint, 1.05, 0.8 + 0.2 * t.tint)
      place(beechLeafRef.current!, i, t, 1, c)
    })

    for (const mesh of [
      pineTrunkRef.current,
      pineLeafRef.current,
      beechTrunkRef.current,
      beechLeafRef.current,
    ]) {
      if (!mesh) continue
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }, [pines, beeches])

  return (
    <group>
      <instancedMesh
        ref={pineTrunkRef}
        args={[undefined, undefined, pines.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <primitive object={assets.pineTrunk} attach="geometry" />
        <meshStandardMaterial
          map={assets.pineBark.map}
          normalMap={assets.pineBark.normalMap}
          roughness={0.95}
        />
      </instancedMesh>

      <instancedMesh
        ref={pineLeafRef}
        args={[undefined, undefined, pines.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <primitive object={assets.pineFoliage} attach="geometry" />
        <meshStandardMaterial
          map={assets.pineLeaf.map}
          alphaMap={assets.pineLeaf.alphaMap}
          vertexColors
          alphaTest={0.5}
          alphaToCoverage
          side={DoubleSide}
          roughness={0.9}
        />
      </instancedMesh>

      <instancedMesh
        ref={beechTrunkRef}
        args={[undefined, undefined, beeches.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <primitive object={assets.beechTrunk} attach="geometry" />
        <meshStandardMaterial
          map={assets.beechBark.map}
          normalMap={assets.beechBark.normalMap}
          roughness={0.9}
        />
      </instancedMesh>

      <instancedMesh
        ref={beechLeafRef}
        args={[undefined, undefined, beeches.length]}
        frustumCulled={false}
        castShadow
        receiveShadow
      >
        <primitive object={assets.beechFoliage} attach="geometry" />
        <meshStandardMaterial
          map={assets.beechLeaf.map}
          alphaMap={assets.beechLeaf.alphaMap}
          vertexColors
          alphaTest={0.5}
          alphaToCoverage
          side={DoubleSide}
          roughness={0.85}
        />
      </instancedMesh>
    </group>
  )
}
