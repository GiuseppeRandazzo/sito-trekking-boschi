'use client'

import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { useExplorer } from '@/lib/explorer-state'
import { Scene } from './scene'
import { ExplorerOverlay } from './forest-explorer'

export function ForestCanvas() {
  const progress = useRef(0)
  const [lowQuality, setLowQuality] = useState(false)
  const { isExploring, stopExploring } = useExplorer()
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Quando si esce dall'esplorazione, sblocchiamo il puntatore
  useEffect(() => {
    if (!isExploring) {
      setIsLocked(false)
    }
  }, [isExploring])

  return (
    <>
      <div className={`fixed inset-0 ${isExploring ? 'z-40' : 'z-0'}`}>
        <Canvas
          shadows="percentage"
          flat
          dpr={lowQuality ? 1 : [1, 1.5]}
          camera={{ fov: 60, near: 0.1, far: 260, position: [0, 1.7, 12] }}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
        >
          <PerformanceMonitor
            flipflops={2}
            onDecline={() => setLowQuality(true)}
            onFallback={() => setLowQuality(true)}
          />
          <Scene
            progress={progress}
            lowQuality={lowQuality}
            isExploring={isExploring}
            isLocked={isLocked}
            onUnlock={() => {
              setIsLocked(false)
              stopExploring()
            }}
          />
        </Canvas>
      </div>

      <ExplorerOverlay isLocked={isLocked} setIsLocked={setIsLocked} />
    </>
  )
}
