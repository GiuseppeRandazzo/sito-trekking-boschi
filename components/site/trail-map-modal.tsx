'use client'

import React, { useState } from 'react'
import {
  X,
  MapPin,
  Volume2,
  Download,
  Smartphone,
  TrendingUp,
  Navigation,
  Compass,
} from 'lucide-react'
import type { Trail, WaypointData } from '@/lib/trails'

interface Props {
  trail: Trail
  onClose: () => void
}

export function TrailMapModal({ trail, onClose }: Props) {
  const [selectedWaypoint, setSelectedWaypoint] = useState<WaypointData | null>(
    trail.waypoints[0] || null
  )

  // Calcolo punti SVG per il profilo altimetrico
  const profile = trail.elevationProfile
  const minElev = Math.min(...profile.map((p) => p.elevation)) - 40
  const maxElev = Math.max(...profile.map((p) => p.elevation)) + 40
  const totalKm = trail.km

  const width = 500
  const height = 140
  const padding = 20

  const pointsSvg = profile
    .map((p) => {
      const x = padding + (p.km / totalKm) * (width - padding * 2)
      const y =
        height -
        padding -
        ((p.elevation - minElev) / (maxElev - minElev)) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#0f231a] text-white shadow-2xl">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Compass className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Tracciato GPX & Telemetria
              </p>
              <h3 className="font-display text-xl font-bold">{trail.name}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Contenuto scrollabile */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Mappa vettoriale / Rappresentazione Traccia */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#071510] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/60">
                Mappa Sentiero & Waypoints Vocali (GPS)
              </span>
              <span className="flex items-center gap-1.5 text-xs text-primary">
                <Navigation className="size-3.5" /> Start: {trail.startingPoint}
              </span>
            </div>

            {/* Canvas stilizzato con percorso */}
            <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-white/5 bg-[#0b1d15]">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, #f1c56b 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Linea traccia stilizzata */}
              <svg className="absolute inset-0 size-full" viewBox="0 0 500 200">
                <path
                  d="M 40 160 Q 150 40, 260 110 T 460 70"
                  fill="none"
                  stroke="#f1c56b"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </svg>

              {/* Waypoints cliccabili sulla mappa */}
              <div className="relative z-10 flex w-full max-w-md justify-between px-6">
                {trail.waypoints.map((wp, idx) => (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => setSelectedWaypoint(wp)}
                    className={`group flex flex-col items-center transition-transform hover:scale-110 ${
                      selectedWaypoint?.id === wp.id ? 'scale-110' : 'opacity-80'
                    }`}
                  >
                    <span
                      className={`flex size-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors shadow-lg ${
                        selectedWaypoint?.id === wp.id
                          ? 'border-white bg-primary text-[#0f231a]'
                          : 'border-primary/50 bg-[#162e24] text-white'
                      }`}
                    >
                      {wp.hasAudio ? <Volume2 className="size-4" /> : idx + 1}
                    </span>
                    <span className="mt-1 max-w-[80px] truncate text-[11px] font-medium text-white/90">
                      {wp.title}
                    </span>
                    <span className="text-[10px] text-white/50">{wp.km} km</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dettagli Waypoint selezionato */}
            {selectedWaypoint && (
              <div className="mt-3 rounded-xl border border-white/10 bg-[#142d22] p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <MapPin className="size-3.5" /> {selectedWaypoint.poiTypeLabel}
                  </span>
                  <span className="text-xs text-white/60">
                    Quota: {selectedWaypoint.elevation} m s.l.m.
                  </span>
                </div>
                <h4 className="mt-1 text-base font-bold text-white">
                  {selectedWaypoint.title} (km {selectedWaypoint.km})
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-white/70">
                  {selectedWaypoint.description}
                </p>
                {selectedWaypoint.hasAudio && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-xs text-primary">
                    <Volume2 className="size-3.5 shrink-0" />
                    <span>
                      Audio guida GPS pronta: si attiva automaticamente in bici/a piedi con l’app Outdoora.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profilo Altimetrico SVG */}
          <div className="rounded-2xl border border-white/10 bg-[#071510] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-white/60">
                <TrendingUp className="size-3.5 text-primary" /> Profilo Altimetrico (+{trail.gain} m)
              </span>
              <span className="text-xs text-white/60">{trail.km} km totali</span>
            </div>

            <div className="h-28 w-full">
              <svg viewBox={`0 0 ${width} ${height}`} className="size-full overflow-visible">
                <polyline
                  fill="none"
                  stroke="#f1c56b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsSvg}
                />
                {profile.map((p, i) => {
                  const x = padding + (p.km / totalKm) * (width - padding * 2)
                  const y =
                    height -
                    padding -
                    ((p.elevation - minElev) / (maxElev - minElev)) * (height - padding * 2)
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="3.5" fill="#f1c56b" />
                      <text
                        x={x}
                        y={y - 8}
                        fontSize="9"
                        fill="#d2ded8"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {p.elevation}m
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Footer con Download GPX ed Integrazione Mobile */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0c1c15] px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Smartphone className="size-4 text-primary" />
            <span>Compatibile con Garmin, Wahoo e App Outdoora GPS</span>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href={trail.gpxUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:bg-white/15"
            >
              <Download className="size-3.5" /> Scarica Traccia GPX
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-[#0f231a] transition hover:brightness-110"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
