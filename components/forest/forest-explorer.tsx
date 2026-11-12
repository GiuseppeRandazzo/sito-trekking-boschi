'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Compass, Eye, Trees as TreesIcon, X } from 'lucide-react'
import { Euler, Vector3 } from 'three'
import { useExplorer } from '@/lib/explorer-state'
import { heightAt } from '@/lib/forest-data'

const moveForward = new Vector3()
const moveRight = new Vector3()
const moveDelta = new Vector3()
const lookEuler = new Euler(0, 0, 0, 'YXZ')
const MAX_PITCH = Math.PI * 0.42

export function ExploreCamera({
  active,
  onUnlock,
}: {
  active: boolean
  onUnlock: () => void
}) {
  const { camera, gl } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new Vector3())
  const hasInitialized = useRef(false)
  const isDragging = useRef(false)
  const wasPointerLocked = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })

  // Inizializza la posizione della telecamera a livello degli occhi sul sentiero
  useEffect(() => {
    if (!hasInitialized.current) {
      const startX = 0
      const startZ = 8
      const groundY = heightAt(startX, startZ)
      camera.position.set(startX, groundY + 1.75, startZ)
      camera.lookAt(0, groundY + 1.75, -12)
      hasInitialized.current = true
    }
  }, [camera])

  // Listener tastiera (WASD/frecce/Esc), Pointer Lock nativo e fallback drag col mouse
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current[event.code] = true
      if (event.code === 'Escape' && active && !document.pointerLockElement) {
        onUnlock()
      }
    }
    const up = (event: KeyboardEvent) => {
      keys.current[event.code] = false
    }
    const resetKeys = () => {
      keys.current = {}
    }

    const dom = gl.domElement

    const applyLookDelta = (dx: number, dy: number, sensitivity: number) => {
      lookEuler.setFromQuaternion(camera.quaternion, 'YXZ')
      lookEuler.y -= dx * sensitivity
      lookEuler.x = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, lookEuler.x - dy * sensitivity))
      camera.quaternion.setFromEuler(lookEuler)
    }

    const onPointerLockChange = () => {
      const lockedToCanvas = document.pointerLockElement === dom
      if (wasPointerLocked.current && !lockedToCanvas && active) {
        onUnlock()
      }
      wasPointerLocked.current = lockedToCanvas
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!active || document.pointerLockElement !== dom) return
      applyLookDelta(e.movementX || 0, e.movementY || 0, 0.0022)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!active || document.pointerLockElement === dom) return
      isDragging.current = true
      lastPointer.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!active || !isDragging.current || document.pointerLockElement === dom) return
      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }
      applyLookDelta(dx, dy, 0.0035)
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', resetKeys)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)
    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', resetKeys)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      dom.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [active, camera, gl, onUnlock])

  useEffect(() => {
    if (!active) {
      keys.current = {}
      velocity.current.set(0, 0, 0)
      isDragging.current = false
    }
  }, [active])

  // Loop di movimento sul piano del sentiero siciliano
  useFrame((_, delta) => {
    if (!active) return

    const strafe =
      Number(Boolean(keys.current.KeyD || keys.current.ArrowRight)) -
      Number(Boolean(keys.current.KeyA || keys.current.ArrowLeft))
    const forwardInput =
      Number(Boolean(keys.current.KeyW || keys.current.ArrowUp)) -
      Number(Boolean(keys.current.KeyS || keys.current.ArrowDown))

    moveForward.set(0, 0, -1).applyQuaternion(camera.quaternion)
    moveForward.y = 0
    if (moveForward.lengthSq() > 1e-6) moveForward.normalize()

    moveRight.set(1, 0, 0).applyQuaternion(camera.quaternion)
    moveRight.y = 0
    if (moveRight.lengthSq() > 1e-6) moveRight.normalize()

    moveDelta
      .set(0, 0, 0)
      .addScaledVector(moveForward, forwardInput)
      .addScaledVector(moveRight, strafe)

    if (moveDelta.lengthSq() > 0) {
      moveDelta.normalize().multiplyScalar(5.2 * Math.min(delta, 0.05))
    }

    velocity.current.lerp(moveDelta, 0.24)
    if (
      Number.isFinite(velocity.current.x) &&
      Number.isFinite(velocity.current.z)
    ) {
      camera.position.x += velocity.current.x
      camera.position.z += velocity.current.z
    }

    // Limiti dell'area esplorabile nel bosco
    camera.position.x = Math.max(-22, Math.min(22, camera.position.x))
    camera.position.z = Math.max(-105, Math.min(18, camera.position.z))

    // Altezza occhi sempre sopra il terreno
    const groundY = heightAt(camera.position.x, camera.position.z)
    camera.position.y = (Number.isFinite(groundY) ? groundY : 0) + 1.75
  })

  return null
}

/**
 * Overlay HUD dell'esploratore 3D (visualizzato sopra l'unico Canvas)
 */
export function ExplorerOverlay({
  isLocked,
  setIsLocked,
}: {
  isLocked: boolean
  setIsLocked: (v: boolean) => void
}) {
  const { isExploring, stopExploring } = useExplorer()

  if (!isExploring) return null

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-between p-5 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Esplora il bosco in 3D"
    >
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between">
        <div className="rounded-2xl border border-white/20 bg-black/55 px-4 py-3 text-white backdrop-blur-md shadow-xl">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.22em] text-[#f1c56b]">
            <Compass className="size-3.5" /> Wild Sicily · Modalità Esplorazione
          </p>
          <p className="mt-1 text-sm text-white/80">
            Pista Altomontana dell’Etna & Faggete dei Nebrodi
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (document.pointerLockElement) {
              try {
                document.exitPointerLock()
              } catch {}
            }
            setIsLocked(false)
            stopExploring()
          }}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/25 bg-black/60 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 hover:scale-105 active:scale-95 shadow-xl"
        >
          <X className="size-4" /> Esci dal bosco
        </button>
      </div>

      {/* Reticolo mirino al centro quando la visuale è attiva */}
      {isLocked && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="size-2.5 rounded-full border border-white/40 bg-white/70 shadow-sm" />
        </div>
      )}

      {/* Schermata di avvio per catturare il mouse */}
      {!isLocked && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/40 p-6 backdrop-blur-[2px]">
          <div className="max-w-md rounded-3xl border border-white/20 bg-[#0f241a]/95 p-8 text-center text-white shadow-2xl backdrop-blur-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f1c56b]/40 bg-[#f1c56b]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-[#f1c56b]">
              <TreesIcon className="size-3.5" /> Esplorazione Libera
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold">
              Sei nel bosco siciliano
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Cammina tra i pini larici, le ginestre dorate dell’Etna e i faggi secolari fino al rifugio.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs text-white/70 text-left space-y-1">
              <p>🎮 <strong>W A S D</strong> o frecce per camminare</p>
              <p>👀 <strong>Mouse</strong> (o trascina) per guardarti intorno a 360°</p>
              <p>⌨️ <strong>Esc</strong> per liberare il puntatore</p>
            </div>

            <button
              id="enter-forest-cta"
              type="button"
              onClick={() => {
                setIsLocked(true)
                const canvas = document.querySelector('canvas')
                if (canvas && typeof canvas.requestPointerLock === 'function') {
                  try {
                    const lockPromise = canvas.requestPointerLock() as unknown
                    if (
                      lockPromise &&
                      typeof (lockPromise as Promise<void>).catch === 'function'
                    ) {
                      ;(lockPromise as Promise<void>).catch(() => {})
                    }
                  } catch {}
                }
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#f1c56b] px-6 py-3.5 font-bold text-[#0c1a14] transition hover:brightness-110 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Eye className="size-4" /> Entra nel bosco
            </button>
          </div>
        </div>
      )}

      {/* Barra inferiore con suggerimenti */}
      {isLocked && (
        <div className="flex justify-center">
          <p className="rounded-full border border-white/20 bg-black/55 px-5 py-2 text-xs font-medium text-white/80 backdrop-blur-md shadow-lg">
            W A S D per camminare · Mouse per guardarti intorno · Premi <strong>Esc</strong> per uscire
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Pulsante per avviare l'esplorazione (posizionato nell'Hero)
 */
export function ExplorerLauncher() {
  const { startExploring } = useExplorer()

  return (
    <button
      type="button"
      onClick={startExploring}
      className="rounded-full border border-primary/50 bg-background/50 px-6 py-3 font-medium backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground shadow"
    >
      Esplora il bosco in 3D
    </button>
  )
}
