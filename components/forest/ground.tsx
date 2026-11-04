'use client'

import { useMemo } from 'react'
import { BufferAttribute, Color, MathUtils, PlaneGeometry, Vector2 } from 'three'
import { distToPath, heightAt } from '@/lib/forest-data'
import { createGroundTextures } from '@/lib/procedural-textures'

const NORMAL_SCALE = new Vector2(1.2, 1.2)

export function Ground() {
  const textures = useMemo(() => createGroundTextures(), [])

  const geometry = useMemo(() => {
    const g = new PlaneGeometry(150, 220, 300, 440)
    g.rotateX(-Math.PI / 2)
    g.translate(0, 0, -55)
    const pos = g.attributes.position
    const colors = new Float32Array(pos.count * 3)
    const grass = new Color('#2c5236')
    const moss = new Color('#4a7544')
    const earth = new Color('#6b5236')
    const leaf = new Color('#8a5a2b')
    const needles = new Color('#4d3a26')
    const c = new Color()
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const d = distToPath(x, z)
      pos.setY(i, heightAt(x, z, d))
      const n = 0.5 + 0.5 * Math.sin(x * 0.7) * Math.sin(z * 0.9)
      const patch = 0.5 + 0.5 * Math.sin(x * 0.19 + 2.1) * Math.cos(z * 0.23 - 0.7)
      c.copy(grass).lerp(moss, n * 0.7)
      c.lerp(needles, patch * 0.45)
      c.lerp(leaf, MathUtils.smoothstep(d, 2, 5) * (1 - MathUtils.smoothstep(d, 5, 9)) * 0.35 * n)
      c.lerp(earth, 1 - MathUtils.smoothstep(d, 0.9, 2.2))
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    g.setAttribute('color', new BufferAttribute(colors, 3))
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial
        vertexColors
        map={textures.map}
        normalMap={textures.normalMap}
        normalScale={NORMAL_SCALE}
        roughness={1}
      />
    </mesh>
  )
}
