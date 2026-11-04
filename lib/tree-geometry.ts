import {
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  Euler,
  IcosahedronGeometry,
  Matrix4,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from 'three'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { mulberry32 } from './procedural-textures'

const ONE = new Vector3(1, 1, 1)
type Shade = (x: number, y: number, z: number) => number

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x))

/**
 * Quad che parte dall'origine e si estende verso +Z (anchor "base")
 * oppure centrato sull'origine (anchor "center").
 * La luminosità per vertice simula l'occlusione ambientale dentro la chioma.
 */
function card(
  width: number,
  length: number,
  position: Vector3,
  rotation: Euler,
  shade: Shade,
  anchor: 'base' | 'center' = 'base',
) {
  const g = new PlaneGeometry(width, length)
  g.rotateX(Math.PI / 2)
  if (anchor === 'base') g.translate(0, 0, length / 2)
  g.applyMatrix4(new Matrix4().compose(position, new Quaternion().setFromEuler(rotation), ONE))
  const pos = g.attributes.position
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const s = clamp(shade(pos.getX(i), pos.getY(i), pos.getZ(i)), 0.15, 1)
    colors[i * 3] = s
    colors[i * 3 + 1] = s
    colors[i * 3 + 2] = s
  }
  g.setAttribute('color', new BufferAttribute(colors, 3))
  return g
}

function merge(list: BufferGeometry[]) {
  const merged = mergeGeometries(list, false)!
  list.forEach((g) => g.dispose())
  return merged
}

export function createTrunkGeometry(kind: 'pine' | 'beech') {
  const bottom = kind === 'pine' ? 0.3 : 0.27
  const top = kind === 'pine' ? 0.09 : 0.13
  const phase = kind === 'pine' ? 0.4 : 1.7
  const g = new CylinderGeometry(top, bottom, 1, 12, 10, true)
  g.translate(0, 0.5, 0)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    const angle = Math.atan2(z, x)
    const flare = 1 + 1.1 * Math.exp(-y * 16) * (0.75 + 0.25 * Math.sin(angle * 5 + phase))
    pos.setX(i, x * flare + Math.sin(y * 3.2 + phase) * 0.1 * y)
    pos.setZ(i, z * flare + Math.cos(y * 2.6 + phase) * 0.08 * y)
  }
  g.computeVertexNormals()
  return g
}

/** Pino alto ~7.7 unità, con rami a strati che pendono verso il basso. */
export function createPineFoliage() {
  const rand = mulberry32(5)
  const list: BufferGeometry[] = []
  const tiers = 9

  for (let k = 0; k < tiers; k++) {
    const f = k / (tiers - 1)
    const y = 2.4 + f * 4.2
    const reach = 1.9 * Math.pow(1 - f, 0.9) + 0.5
    const count = Math.round(10 - f * 3)
    for (let i = 0; i < count; i++) {
      const yaw = (i / count) * Math.PI * 2 + rand() * 0.6 + k * 0.7
      const droop = 0.35 + rand() * 0.25 + (1 - f) * 0.15
      const len = reach * (0.85 + rand() * 0.3)
      const rotation = new Euler(droop, yaw, (rand() - 0.5) * 0.5, 'YXZ')
      const origin = new Vector3(0, y + (rand() - 0.5) * 0.3, 0)
      list.push(
        card(len * 1.15, len, origin, rotation, (x, py, z) => {
          const out = Math.hypot(x, z) / (reach + 0.001)
          return 0.38 + 0.42 * Math.min(1, out) + 0.2 * f + (py - y) * 0.05
        }),
      )
    }
  }

  for (let i = 0; i < 5; i++) {
    const rotation = new Euler(-1.2, (i / 5) * Math.PI * 2 + rand() * 0.5, 0, 'YXZ')
    list.push(card(0.9, 1.6, new Vector3(0, 6.2, 0), rotation, () => 0.95))
  }
  return merge(list)
}

/** Faggio con chioma tondeggiante fatta di grappoli di foglie. */
export function createBeechFoliage() {
  const rand = mulberry32(9)
  const list: BufferGeometry[] = []
  const clusters: [number, number, number, number][] = [[0, 5.6, 0, 1.3]]
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4
    clusters.push([Math.cos(a) * 1.4, 4.6, Math.sin(a) * 1.4, 1.5])
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 1.2
    clusters.push([Math.cos(a) * 1.9, 3.7, Math.sin(a) * 1.9, 1.2])
  }

  for (const [cx, cy, cz, r] of clusters) {
    for (let i = 0; i < 12; i++) {
      const dir = new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5)
        .normalize()
        .multiplyScalar(r * 0.8 * Math.cbrt(rand()))
      const size = 1.7 + rand() * 0.6
      const rotation = new Euler(rand() * Math.PI, rand() * Math.PI * 2, rand() * Math.PI)
      list.push(
        card(
          size,
          size,
          new Vector3(cx + dir.x, cy + dir.y, cz + dir.z),
          rotation,
          (x, y, z) =>
            0.4 + 0.35 * clamp(Math.hypot(x, z) / 2.8, 0, 1) + 0.25 * clamp((y - 3) / 3, 0, 1),
          'center',
        ),
      )
    }
  }
  return merge(list)
}

export function createFernGeometry() {
  const rand = mulberry32(13)
  const list: BufferGeometry[] = []
  const fronds = 7
  for (let i = 0; i < fronds; i++) {
    const yaw = (i / fronds) * Math.PI * 2 + rand() * 0.5
    const rotation = new Euler(-(0.85 + rand() * 0.3), yaw, 0, 'YXZ')
    list.push(
      card(0.6, 1.2 + rand() * 0.25, new Vector3(0, 0.02, 0), rotation, (_x, y) => 0.5 + y * 0.5),
    )
  }
  return merge(list)
}

export function createGrassGeometry() {
  const rand = mulberry32(17)
  const list: BufferGeometry[] = []
  for (let i = 0; i < 3; i++) {
    const rotation = new Euler(-Math.PI / 2, (i * Math.PI) / 3 + rand() * 0.3, 0, 'YXZ')
    list.push(card(0.9, 0.7, new Vector3(0, 0, 0), rotation, (_x, y) => 0.45 + y * 0.9))
  }
  return merge(list)
}

export function createRockGeometry(seed: number) {
  let g: BufferGeometry = new IcosahedronGeometry(1, 3)
  g.deleteAttribute('normal')
  g.deleteAttribute('uv')
  g = mergeVertices(g, 1e-4)

  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const v = new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).normalize()
    const d =
      1 +
      0.18 * Math.sin(v.x * 3.1 + seed) * Math.cos(v.y * 2.7 + seed * 0.7) +
      0.1 * Math.sin(v.z * 7.3 + v.x * 5 + seed) +
      0.05 * Math.sin(v.x * 13 + v.y * 11 + v.z * 9 + seed)
    v.multiplyScalar(d)
    v.y *= 0.72
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()

  const normal = g.attributes.normal
  const colors = new Float32Array(pos.count * 3)
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i)
    const py = pos.getY(i)
    const gray = 0.16 + 0.07 * (0.5 + 0.5 * Math.sin(px * 9 + py * 7 + seed))
    const top = clamp((normal.getY(i) - 0.35) / 0.4, 0, 1)
    const moss = top * top * (3 - 2 * top) * (0.55 + 0.45 * Math.sin(px * 5 + pos.getZ(i) * 6 + seed))
    colors[i * 3] = gray * 1.05 * (1 - moss) + 0.07 * moss
    colors[i * 3 + 1] = gray * (1 - moss) + 0.14 * moss
    colors[i * 3 + 2] = gray * 0.92 * (1 - moss) + 0.04 * moss
  }
  g.setAttribute('color', new BufferAttribute(colors, 3))
  return g
}
