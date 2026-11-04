import {
  CanvasTexture,
  ClampToEdgeWrapping,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three'

type Rand = () => number

export function mulberry32(seed: number): Rand {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const cache = new Map<string, unknown>()
function cached<T>(key: string, build: () => T): T {
  if (!cache.has(key)) cache.set(key, build())
  return cache.get(key) as T
}

const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function toTexture(canvas: HTMLCanvasElement, srgb: boolean, repeat = true) {
  const t = new CanvasTexture(canvas)
  const wrap = repeat ? RepeatWrapping : ClampToEdgeWrapping
  t.wrapS = wrap
  t.wrapT = wrap
  t.colorSpace = srgb ? SRGBColorSpace : NoColorSpace
  t.anisotropy = 8
  return t
}

function makeNoise(cx: number, cy: number, rand: Rand) {
  const lattice = new Float32Array(cx * cy)
  for (let i = 0; i < lattice.length; i++) lattice[i] = rand()
  return (u: number, v: number) => {
    const fx = u * cx
    const fy = v * cy
    const x0 = Math.floor(fx)
    const y0 = Math.floor(fy)
    const tx = fx - x0
    const ty = fy - y0
    const sx = tx * tx * (3 - 2 * tx)
    const sy = ty * ty * (3 - 2 * ty)
    const xa = ((x0 % cx) + cx) % cx
    const xb = (xa + 1) % cx
    const ya = ((y0 % cy) + cy) % cy
    const yb = (ya + 1) % cy
    const a = lattice[ya * cx + xa]
    const b = lattice[ya * cx + xb]
    const c = lattice[yb * cx + xa]
    const d = lattice[yb * cx + xb]
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
  }
}

function fbm(rand: Rand, octaves: number, cx: number, cy: number) {
  const layers = Array.from({ length: octaves }, (_, o) =>
    makeNoise(cx * 2 ** o, cy * 2 ** o, rand),
  )
  let norm = 0
  for (let o = 0; o < octaves; o++) norm += 0.5 ** o
  return (u: number, v: number) => {
    let sum = 0
    for (let o = 0; o < octaves; o++) sum += layers[o](u, v) * 0.5 ** o
    return sum / norm
  }
}

function normalTexture(heights: Float32Array, size: number, strength: number) {
  const canvas = makeCanvas(size, size)
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(size, size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = heights[y * size + ((x - 1 + size) % size)]
      const r = heights[y * size + ((x + 1) % size)]
      const u = heights[((y - 1 + size) % size) * size + x]
      const d = heights[((y + 1) % size) * size + x]
      const nx = (l - r) * strength
      const ny = (d - u) * strength
      const len = Math.hypot(nx, ny, 1)
      const i = (y * size + x) * 4
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255
      img.data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return toTexture(canvas, false)
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

/* ------------------------------------------------------------------ */
/* Terreno                                                             */
/* ------------------------------------------------------------------ */

export function createGroundTextures() {
  return cached('ground', () => {
    const size = 512
    const rand = mulberry32(11)
    const broad = fbm(rand, 5, 4, 4)
    const fine = fbm(rand, 3, 32, 32)
    const heights = new Float32Array(size * size)
    const canvas = makeCanvas(size, size)
    const ctx = canvas.getContext('2d')!
    const img = ctx.createImageData(size, size)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const h = broad(x / size, y / size) * 0.65 + fine(x / size, y / size) * 0.35
        heights[y * size + x] = h
        const shade = 0.58 + 0.42 * Math.min(1, h * 1.25)
        const i = (y * size + x) * 4
        img.data[i] = shade * 255
        img.data[i + 1] = shade * 248
        img.data[i + 2] = shade * 232
        img.data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)

    const litter = mulberry32(12)
    for (let k = 0; k < 1100; k++) {
      const x = litter() * size
      const y = litter() * size
      const a = litter() * Math.PI
      const len = 3 + litter() * 7
      const wid = 1.2 + litter() * 2
      ctx.fillStyle = litter() < 0.45 ? 'rgba(255,238,205,0.38)' : 'rgba(30,22,14,0.34)'
      for (const ox of [-size, 0, size]) {
        for (const oy of [-size, 0, size]) {
          const px = x + ox
          const py = y + oy
          if (px < -12 || px > size + 12 || py < -12 || py > size + 12) continue
          ctx.beginPath()
          ctx.ellipse(px, py, len, wid, a, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    const map = toTexture(canvas, true)
    const normalMap = normalTexture(heights, size, 3.2)
    for (const t of [map, normalMap]) t.repeat.set(75, 110)
    return { map, normalMap }
  })
}

/* ------------------------------------------------------------------ */
/* Cortecce                                                            */
/* ------------------------------------------------------------------ */

export function createBarkTextures(kind: 'pine' | 'beech') {
  return cached(`bark-${kind}`, () => {
    const size = 512
    const pine = kind === 'pine'
    const rand = mulberry32(pine ? 3 : 7)
    const streak = fbm(rand, 4, pine ? 9 : 4, pine ? 2 : 8)
    const broad = fbm(rand, 3, 3, 3)
    const patch = fbm(rand, 3, 5, 5)
    const heights = new Float32Array(size * size)
    const canvas = makeCanvas(size, size)
    const ctx = canvas.getContext('2d')!
    const img = ctx.createImageData(size, size)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size
        const v = y / size
        const n = streak(u, v)
        const ridge = 1 - Math.abs(n * 2 - 1)
        const b = broad(u, v)
        let h: number
        let r: number
        let g: number
        let bl: number
        if (pine) {
          h = Math.pow(ridge, 1.4) * 0.8 + b * 0.2
          const t = Math.pow(Math.min(1, h), 1.2)
          const k = 0.85 + 0.3 * b
          r = (34 + t * 106) * k
          g = (24 + t * 76) * k
          bl = (17 + t * 53) * k
        } else {
          h = 0.35 * ridge + 0.65 * b
          const k = 0.9 + 0.1 * ridge
          r = (118 + b * 42) * k
          g = (113 + b * 42) * k
          bl = (102 + b * 40) * k
          const lichen = sstep(0.58, 0.7, patch(u, v))
          r += (106 - r) * lichen * 0.7
          g += (122 - g) * lichen * 0.7
          bl += (86 - bl) * lichen * 0.7
        }
        heights[y * size + x] = h
        const i = (y * size + x) * 4
        img.data[i] = r
        img.data[i + 1] = g
        img.data[i + 2] = bl
        img.data[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
    const map = toTexture(canvas, true)
    const normalMap = normalTexture(heights, size, pine ? 4.5 : 1.6)
    for (const t of [map, normalMap]) t.repeat.set(1, 3)
    return { map, normalMap }
  })
}

/* ------------------------------------------------------------------ */
/* Fogliame (mappa colore + mappa alpha separate per evitare aloni)    */
/* ------------------------------------------------------------------ */

function cutoutTextures(
  w: number,
  h: number,
  background: string,
  draw: (ctx: CanvasRenderingContext2D, mask: boolean) => void,
) {
  const color = makeCanvas(w, h)
  const cctx = color.getContext('2d')!
  cctx.fillStyle = background
  cctx.fillRect(0, 0, w, h)
  draw(cctx, false)

  const mask = makeCanvas(w, h)
  const mctx = mask.getContext('2d')!
  mctx.fillStyle = '#000'
  mctx.fillRect(0, 0, w, h)
  draw(mctx, true)

  return { map: toTexture(color, true, false), alphaMap: toTexture(mask, false, false) }
}

function drawPineSpray(ctx: CanvasRenderingContext2D, mask: boolean, S: number) {
  const rand = mulberry32(21)
  const paint = (c: string) => (mask ? '#fff' : c)
  ctx.lineCap = 'round'
  const stemX = (t: number) => S / 2 + Math.sin(t * 3.2) * 7

  ctx.strokeStyle = paint('#2e2118')
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(stemX(0), S)
  for (let k = 1; k <= 20; k++) ctx.lineTo(stemX(k / 20), S * (1 - k / 20))
  ctx.stroke()

  const branches = 24
  for (let i = 0; i < branches; i++) {
    const t = 0.03 + (0.94 * i) / branches
    const x = stemX(t)
    const y = S * (1 - t)
    for (const side of [-1, 1]) {
      const len = (1 - t * 0.75) * S * 0.33 * (0.8 + rand() * 0.4)
      const a = 0.85 + rand() * 0.35
      const dx = side * Math.sin(a) * len
      const dy = -Math.cos(a) * len

      ctx.strokeStyle = paint('#1d3524')
      ctx.lineWidth = 20 * (1 - t * 0.5)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx * 0.95, y + dy * 0.95)
      ctx.stroke()

      ctx.strokeStyle = paint('#3a2b1e')
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + dx, y + dy)
      ctx.stroke()

      const base = Math.atan2(dy, dx)
      const needles = 30
      ctx.lineWidth = 3
      for (let j = 0; j < needles; j++) {
        const f = (j + rand()) / needles
        const px = x + dx * f
        const py = y + dy * f
        const nl = 20 + rand() * 16
        for (const s2 of [-1, 1]) {
          const na = base + s2 * (1.0 + rand() * 0.45)
          const fresh = f > 0.8 && rand() < 0.5
          ctx.strokeStyle = paint(
            fresh
              ? `hsl(${88 + rand() * 12} 50% ${34 + rand() * 8}%)`
              : `hsl(${135 + rand() * 18} ${36 + rand() * 10}% ${13 + rand() * 15}%)`,
          )
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(px + Math.cos(na) * nl, py + Math.sin(na) * nl)
          ctx.stroke()
        }
      }
    }
  }
}

function drawBeechCluster(ctx: CanvasRenderingContext2D, mask: boolean, S: number) {
  const rand = mulberry32(33)
  const paint = (c: string) => (mask ? '#fff' : c)
  ctx.lineCap = 'round'

  ctx.strokeStyle = paint('#4a3a2a')
  ctx.lineWidth = 4
  for (let i = 0; i < 9; i++) {
    const a = rand() * Math.PI * 2
    const r = S * (0.18 + rand() * 0.2)
    ctx.beginPath()
    ctx.moveTo(S / 2, S / 2)
    ctx.lineTo(S / 2 + Math.cos(a) * r, S / 2 + Math.sin(a) * r)
    ctx.stroke()
  }

  const leaves = 420
  for (let i = 0; i < leaves; i++) {
    const r = Math.sqrt(rand()) * 0.4 * S
    const a = rand() * Math.PI * 2
    const x = S / 2 + Math.cos(a) * r
    const y = S / 2 + Math.sin(a) * r * 0.95
    const rot = rand() * Math.PI * 2
    const rx = 20 + rand() * 14
    const ry = rx * 0.55
    const depth = i / leaves
    const hue = 78 + rand() * 26
    const sat = 45 + rand() * 20
    const light = 20 + depth * 22 + rand() * 6

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot)
    ctx.fillStyle = paint(`hsl(${hue} ${sat}% ${light}%)`)
    ctx.beginPath()
    ctx.moveTo(-rx, 0)
    ctx.quadraticCurveTo(0, -ry * 1.3, rx, 0)
    ctx.quadraticCurveTo(0, ry * 1.3, -rx, 0)
    ctx.fill()
    ctx.strokeStyle = paint(`hsl(${hue} ${sat}% ${light + 14}%)`)
    ctx.lineWidth = 1.3
    ctx.beginPath()
    ctx.moveTo(-rx, 0)
    ctx.lineTo(rx, 0)
    ctx.stroke()
    ctx.restore()
  }
}

function drawFern(ctx: CanvasRenderingContext2D, mask: boolean, w: number, h: number) {
  const rand = mulberry32(51)
  const paint = (c: string) => (mask ? '#fff' : c)
  const p0 = { x: w / 2, y: h }
  const p1 = { x: w / 2 - 14, y: h * 0.5 }
  const p2 = { x: w / 2 + 12, y: 10 }
  const at = (t: number) => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y,
  })

  ctx.lineCap = 'round'
  ctx.strokeStyle = paint('#2f4a22')
  ctx.lineWidth = 4
  ctx.beginPath()
  for (let k = 0; k <= 24; k++) {
    const p = at(k / 24)
    if (k === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  }
  ctx.stroke()

  const pairs = 34
  for (let i = 0; i < pairs; i++) {
    const t = 0.03 + (0.94 * i) / pairs
    const p = at(t)
    const q = at(Math.min(1, t + 0.01))
    const tangent = Math.atan2(q.y - p.y, q.x - p.x)
    const len =
      w * 0.46 * Math.pow(Math.sin(Math.PI * (0.12 + 0.85 * t)), 0.8) * (1 - 0.35 * t)
    for (const side of [-1, 1]) {
      const ang = tangent + side * (Math.PI * 0.5 - 0.5)
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(ang)
      ctx.fillStyle = paint(`hsl(${100 + rand() * 15} 50% ${20 + t * 14 + rand() * 5}%)`)
      ctx.beginPath()
      ctx.ellipse(len / 2, 0, len / 2, 3.2 + len * 0.05, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
}

function drawGrass(ctx: CanvasRenderingContext2D, mask: boolean, w: number, h: number) {
  const rand = mulberry32(61)
  for (let i = 0; i < 34; i++) {
    const bx = w * (0.15 + 0.7 * rand())
    const bh = h * (0.55 + 0.4 * rand())
    const bend = (rand() - 0.5) * w * 0.5
    const bw = 5 + rand() * 5
    const topHue = 80 + rand() * 15

    ctx.beginPath()
    ctx.moveTo(bx - bw, h)
    ctx.quadraticCurveTo(bx - bw * 0.4 + bend * 0.3, h - bh * 0.55, bx + bend, h - bh)
    ctx.quadraticCurveTo(bx + bw * 0.4 + bend * 0.3, h - bh * 0.55, bx + bw, h)
    ctx.closePath()
    if (mask) {
      ctx.fillStyle = '#fff'
    } else {
      const grad = ctx.createLinearGradient(0, h, 0, h - bh)
      grad.addColorStop(0, 'hsl(95 40% 14%)')
      grad.addColorStop(1, `hsl(${topHue} 55% 38%)`)
      ctx.fillStyle = grad
    }
    ctx.fill()
  }
}

export function createPineLeafTextures() {
  return cached('leaf-pine', () =>
    cutoutTextures(512, 512, '#1d3524', (ctx, mask) => drawPineSpray(ctx, mask, 512)),
  )
}

export function createBeechLeafTextures() {
  return cached('leaf-beech', () =>
    cutoutTextures(512, 512, '#2f4a1c', (ctx, mask) => drawBeechCluster(ctx, mask, 512)),
  )
}

export function createFernTextures() {
  return cached('fern', () =>
    cutoutTextures(256, 512, '#2a4a1e', (ctx, mask) => drawFern(ctx, mask, 256, 512)),
  )
}

export function createGrassTextures() {
  return cached('grass', () =>
    cutoutTextures(256, 256, '#2a4a1e', (ctx, mask) => drawGrass(ctx, mask, 256, 256)),
  )
}

/* ------------------------------------------------------------------ */
/* Rifugio: pietra, tegole, assi                                       */
/* ------------------------------------------------------------------ */

export function createStoneTexture() {
  return cached('stone', () => {
    const S = 512
    const canvas = makeCanvas(S, S)
    const ctx = canvas.getContext('2d')!
    const rand = mulberry32(41)
    ctx.fillStyle = '#262320'
    ctx.fillRect(0, 0, S, S)
    let y = 0
    while (y < S) {
      const rowH = Math.min(S - y, 44 + rand() * 34)
      let x = -rand() * 60
      while (x < S) {
        const w = 56 + rand() * 80
        ctx.fillStyle = `hsl(${28 + rand() * 14} ${4 + rand() * 8}% ${30 + rand() * 20}%)`
        roundedRect(ctx, x + 3, y + 3, w - 6, rowH - 6, 10)
        ctx.fill()
        x += w
      }
      y += rowH
    }
    for (let k = 0; k < 4000; k++) {
      ctx.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)'
      ctx.fillRect(rand() * S, rand() * S, 2, 2)
    }
    return toTexture(canvas, true)
  })
}

export function createShingleTexture() {
  return cached('shingle', () => {
    const S = 512
    const canvas = makeCanvas(S, S)
    const ctx = canvas.getContext('2d')!
    const rand = mulberry32(43)
    ctx.fillStyle = '#16110e'
    ctx.fillRect(0, 0, S, S)
    const rowH = 43
    for (let row = 0; row * rowH < S + rowH; row++) {
      const offset = row % 2 === 0 ? 0 : 32
      for (let x = -offset; x < S; x += 64) {
        ctx.fillStyle = `hsl(${22 + rand() * 8} ${10 + rand() * 8}% ${17 + rand() * 11}%)`
        roundedRect(ctx, x + 2, row * rowH + 1, 60, rowH + 6, 4)
        ctx.fill()
        ctx.strokeStyle = 'rgba(0,0,0,0.25)'
        ctx.lineWidth = 1
        for (let g = 0; g < 4; g++) {
          const gx = x + 8 + rand() * 46
          ctx.beginPath()
          ctx.moveTo(gx, row * rowH + 2)
          ctx.lineTo(gx + (rand() - 0.5) * 4, row * rowH + rowH)
          ctx.stroke()
        }
      }
    }
    return toTexture(canvas, true)
  })
}

export function createPlankTexture() {
  return cached('plank', () => {
    const S = 512
    const canvas = makeCanvas(S, S)
    const ctx = canvas.getContext('2d')!
    const rand = mulberry32(47)
    const boards = 8
    const bw = S / boards
    for (let b = 0; b < boards; b++) {
      ctx.fillStyle = `hsl(${26 + rand() * 6} ${28 + rand() * 8}% ${22 + rand() * 10}%)`
      ctx.fillRect(b * bw, 0, bw, S)
      ctx.strokeStyle = 'rgba(0,0,0,0.14)'
      ctx.lineWidth = 1.2
      for (let g = 0; g < 14; g++) {
        const gx = b * bw + 4 + rand() * (bw - 8)
        ctx.beginPath()
        ctx.moveTo(gx, 0)
        for (let y = 0; y <= S; y += 64) ctx.lineTo(gx + Math.sin(y * 0.03 + g) * 2, y)
        ctx.stroke()
      }
      ctx.fillStyle = '#17110c'
      ctx.fillRect(b * bw, 0, 3, S)
    }
    return toTexture(canvas, true)
  })
}

/* ------------------------------------------------------------------ */
/* Effetti: fumo e raggi di luce                                       */
/* ------------------------------------------------------------------ */

export function createSoftCircleTexture() {
  return cached('soft-circle', () => {
    const S = 128
    const canvas = makeCanvas(S, S)
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.5, 'rgba(255,255,255,0.45)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, S, S)
    return toTexture(canvas, true, false)
  })
}

export function createShaftTexture() {
  return cached('shaft', () => {
    const w = 128
    const h = 512
    const canvas = makeCanvas(w, h)
    const ctx = canvas.getContext('2d')!
    const img = ctx.createImageData(w, h)
    for (let y = 0; y < h; y++) {
      const v = 1 - y / h
      const along = sstep(0, 0.18, v) * (1 - sstep(0.55, 1, v))
      for (let x = 0; x < w; x++) {
        const dx = (x - w / 2) / (w * 0.22)
        const across = Math.exp(-dx * dx)
        const i = (y * w + x) * 4
        img.data[i] = 255
        img.data[i + 1] = 255
        img.data[i + 2] = 255
        img.data[i + 3] = 255 * across * along
      }
    }
    ctx.putImageData(img, 0, 0)
    return toTexture(canvas, true, false)
  })
}
