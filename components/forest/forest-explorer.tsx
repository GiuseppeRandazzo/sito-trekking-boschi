'use client'

import { PointerLockControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { Scene } from './scene'

function ExploreCamera({ active, onUnlock }: { active: boolean; onUnlock: () => void }) {
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new Vector3())

  useEffect(() => {
    const down = (event: KeyboardEvent) => { keys.current[event.code] = true }
    const up = (event: KeyboardEvent) => { keys.current[event.code] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  useFrame(({ camera }, delta) => {
    if (!active) return
    const direction = new Vector3(
      Number(keys.current.KeyD || keys.current.ArrowRight) - Number(keys.current.KeyA || keys.current.ArrowLeft),
      0,
      Number(keys.current.KeyS || keys.current.ArrowDown) - Number(keys.current.KeyW || keys.current.ArrowUp),
    )
    if (direction.lengthSq()) direction.normalize().multiplyScalar(4.2 * Math.min(delta, 0.05))
    velocity.current.lerp(direction, 0.18)
    camera.translateX(velocity.current.x)
    camera.translateZ(velocity.current.z)
    camera.position.y = 2.05
    camera.position.x = Math.max(-15, Math.min(15, camera.position.x))
    camera.position.z = Math.max(-30, Math.min(18, camera.position.z))
  })

  return (
    <PointerLockControls
      makeDefault
      enabled={active}
      selector="#forest-explorer-canvas"
      onUnlock={onUnlock}
    />
  )
}

export function ForestExplorer({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-[#071510]" role="dialog" aria-modal="true" aria-label="Esplora il bosco">
      <div id="forest-explorer-canvas" className="absolute inset-0">
        <Canvas shadows="percentage" dpr={[1, 1.5]} camera={{ fov: 68, near: 0.1, far: 260, position: [0, 2.05, 8] }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <Scene progress={{ current: 0.45 }} lowQuality={false} explore />
          <ExploreCamera active={active} onUnlock={() => setActive(false)} />
        </Canvas>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
        <div className="rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-white backdrop-blur-md">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#f1c56b]">Modalità esplorazione</p>
          <p className="mt-1 text-sm text-white/75">Muoviti tra gli alberi e trova il sentiero.</p>
        </div>
        <button type="button" onClick={() => { setActive(false); onExit() }} className="pointer-events-auto rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/15">Esci dal bosco</button>
      </div>
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-6">
          <div className="max-w-sm rounded-3xl border border-white/15 bg-[#10261d]/90 p-7 text-center text-white shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#f1c56b]">Sei nel bosco</p>
            <h2 className="mt-3 font-display text-3xl">Pronto a partire?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">Clicca per guardarti intorno. Usa W A S D o le frecce per camminare.</p>
            <button type="button" onClick={() => setActive(true)} className="mt-6 rounded-full bg-[#f1c56b] px-6 py-3 font-medium text-[#10261d] transition hover:brightness-110">Entra nel bosco</button>
          </div>
        </div>
      )}
      {active && <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-xs text-white/70 backdrop-blur-md">W A S D per muoverti · mouse per guardarti intorno · Esc per liberare il mouse</p>}
    </div>
  )
}

export function ExplorerLauncher() {
  const [open, setOpen] = useState(false)
  return <>
    <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-primary/50 bg-background/50 px-6 py-3 font-medium backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground">Esplora il bosco in 3D</button>
    {open && <ForestExplorer onExit={() => setOpen(false)} />}
  </>
}
