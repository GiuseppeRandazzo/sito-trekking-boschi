'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Clock, Mountain, Route, Map, Bike, Sparkles } from 'lucide-react'
import { trails, type Trail } from '@/lib/trails'
import { TrailMapModal } from './trail-map-modal'

export function Trails() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [modalTrail, setModalTrail] = useState<Trail | null>(null)

  const filteredTrails =
    selectedCategory === 'all'
      ? trails
      : trails.filter((t) => t.category === selectedCategory)

  return (
    <section id="percorsi" className="relative scroll-mt-16 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl rounded-2xl border border-border bg-background/65 p-6 backdrop-blur-md md:p-8">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Bike className="size-3.5" /> Outdoor & Cicloturismo
            </span>
            <h2 className="mt-2 text-balance text-3xl font-semibold md:text-4xl">
              Percorsi Gravel, E-Bike e Sentieri a Piedi
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Itinerari auto-guidati con tracce GPX verificate e navigazione vocale GPS.
              Noleggio e-bike e assistenza disponibili in loco.
            </p>
          </div>

          {/* Filtri per categoria */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'Tutti i Tour' },
              { id: 'gravel', label: 'Gravel & All-Road' },
              { id: 'ebike', label: 'E-Bike Panoramico' },
              { id: 'trekking', label: 'Trekking a Piedi' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'border border-border bg-background/50 text-foreground/80 hover:bg-background/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Griglia Card Percorsi */}
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {filteredTrails.map((trail) => (
            <li
              key={trail.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/85 backdrop-blur-md transition-all hover:border-primary/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={trail.image}
                  alt={`Paesaggio del percorso ${trail.name}`}
                  fill
                  sizes="(min-width: 768px) 384px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow">
                  {trail.categoryLabel}
                </span>
                {trail.bikeRentalAvailable && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    <Bike className="size-3 text-primary" /> Noleggio bici
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-primary">{trail.level}</span>
                  <span>{trail.waypoints.length} waypoint GPS</span>
                </div>

                <h3 className="mt-2 text-xl font-semibold leading-snug">{trail.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {trail.description}
                </p>

                <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border/50 bg-background/30 p-2.5 text-center text-xs">
                  <div>
                    <dt className="text-muted-foreground">Distanza</dt>
                    <dd className="mt-1 font-semibold text-foreground">{trail.km} km</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Dislivello</dt>
                    <dd className="mt-1 font-semibold text-foreground">+{trail.gain} m</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Durata</dt>
                    <dd className="mt-1 font-semibold text-foreground">{trail.duration}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Quota a persona</p>
                    <p className="text-lg font-bold text-foreground">{trail.price} €</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalTrail(trail)}
                      className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      <Map className="size-3.5" /> Mappa & GPX
                    </button>
                    <a
                      href="#prenota"
                      className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-90"
                    >
                      Prenota
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Modal interattivo Mappa e profilo GPX */}
        {modalTrail && (
          <TrailMapModal trail={modalTrail} onClose={() => setModalTrail(null)} />
        )}
      </div>
    </section>
  )
}
