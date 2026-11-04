import { CatmullRomCurve3, MathUtils, Vector3 } from 'three'

export const pathCurve = new CatmullRomCurve3(
  [
    new Vector3(0, 0, 12),
    new Vector3(3, 0, -4),
    new Vector3(-4, 0, -20),
    new Vector3(2, 0, -38),
    new Vector3(8, 0, -55),
    new Vector3(1, 0, -72),
    new Vector3(-6, 0, -90),
    new Vector3(0, 0, -106),
  ],
  false,
  'catmullrom',
  0.5,
)

const pathSamples = pathCurve.getSpacedPoints(320)

export function distToPath(x: number, z: number) {
  let min = Infinity
  for (const p of pathSamples) {
    const dx = p.x - x
    const dz = p.z - z
    const d = dx * dx + dz * dz
    if (d < min) min = d
  }
  return Math.sqrt(min)
}

export function heightAt(x: number, z: number, d: number = distToPath(x, z)) {
  const rolling =
    1.4 * Math.sin(x * 0.09 + 1.3) * Math.cos(z * 0.07) +
    0.8 * Math.sin(x * 0.21 + z * 0.17) +
    0.4 * Math.sin(z * 0.33 - x * 0.25)
  const valley = Math.max(0, Math.abs(x) - 14) * 0.3
  const flat = MathUtils.smoothstep(d, 1.5, 9)
  const pathLevel = 0.5 * Math.sin(z * 0.05)
  return (rolling + valley) * flat + pathLevel * (1 - flat)
}

export const hutPosition = (() => {
  const end = pathCurve.getPoint(1)
  return new Vector3(end.x, heightAt(end.x, end.z - 2), end.z - 2)
})()

export type TreeData = {
  x: number
  y: number
  z: number
  s: number
  tint: number
  kind: 'pine' | 'beech'
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const trees: TreeData[] = (() => {
  const rng = mulberry32(20260108)
  const result: TreeData[] = []
  let attempts = 0
  while (result.length < 720 && attempts < 6000) {
    attempts++
    const x = (rng() + rng() + rng() - 1.5) * 52
    const z = 24 - rng() * 150
    const d = distToPath(x, z)
    if (d < 4.2) continue
    if (Math.hypot(x - hutPosition.x, z - hutPosition.z) < 7) continue
    result.push({
      x,
      z,
      y: heightAt(x, z, d),
      s: 0.8 + rng() * 0.8,
      tint: rng(),
      kind: rng() < 0.62 ? 'pine' : 'beech',
    })
  }
  return result
})()
