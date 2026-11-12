'use client'

import { useSyncExternalStore } from 'react'

let isExploring = false
const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

export const explorerStore = {
  isExploring() {
    return isExploring
  },
  startExploring() {
    isExploring = true
    emitChange()
  },
  stopExploring() {
    isExploring = false
    emitChange()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useExplorer() {
  const exploring = useSyncExternalStore(
    explorerStore.subscribe,
    explorerStore.isExploring,
    () => false, // Server snapshot
  )

  return {
    isExploring: exploring,
    startExploring: explorerStore.startExploring,
    stopExploring: explorerStore.stopExploring,
  }
}
