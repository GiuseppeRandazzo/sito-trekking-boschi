'use client'

import React, { useState } from 'react'
import { X, Layers, Server, Smartphone, Cloud, Database, CheckCircle, ExternalLink } from 'lucide-react'

export function TechStackModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
      >
        <Layers className="size-3.5" /> Outdoora Stack
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#0e2219] text-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#f1c56b]">
                  Progetto Candidatura Sviluppatore Outdoora
                </span>
                <h3 className="font-display text-2xl font-bold">Architettura Full-Stack</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 overflow-y-auto p-6 text-sm">
              <p className="text-white/80">
                Questo progetto è stato strutturato per rispecchiare al 100% l’ecosistema tecnologico di{' '}
                <strong className="text-white">Outdoora</strong> per tour in bicicletta ed escursioni auto-guidate:
              </p>

              <div className="grid gap-3">
                {/* Frontend Web */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-2 font-bold text-[#f1c56b]">
                    <Layers className="size-4" /> 1. Web Portal & 3D Canvas (Next.js 16)
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    Sviluppato con <strong>Next.js 16 (App Router)</strong>, <strong>React 19</strong>,{' '}
                    <strong>TypeScript</strong> e <strong>Tailwind CSS v4</strong>. Include scena 3D
                    procedurale Three.js sincronizzata allo scroll, visualizzatore di tracce GPX, altimetria
                    e form di prenotazione reattivo.
                  </p>
                </div>

                {/* Backend Django */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-2 font-bold text-[#f1c56b]">
                    <Server className="size-4" /> 2. API Backend & CMS (Django 5.1 + REST Framework)
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    Modulo in <code className="text-[#f1c56b]">backend/</code> con modelli per{' '}
                    <strong>Tour</strong>, <strong>Waypoint / POI</strong> con guida vocale e{' '}
                    <strong>Booking</strong>. Include <strong>Pannello Admin Django</strong> personalizzato
                    per gli operatori turistici ed endpoint REST documentati.
                  </p>
                </div>

                {/* React Native Mobile */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-2 font-bold text-[#f1c56b]">
                    <Smartphone className="size-4" /> 3. Mobile App (React Native + Expo)
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    Modulo in <code className="text-[#f1c56b]">mobile/</code> con l’engine{' '}
                    <code className="text-[#f1c56b]">useGpsAudioGuide.ts</code> per la navigazione GPS dei ciclisti:{' '}
                    <strong>Geofencing Haversine</strong> a 35m di raggio per riproduzione automatica della voce
                    narrante in prossimità di bivi e punti panoramici.
                  </p>
                </div>

                {/* Cloud & Storage */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-center gap-2 font-bold text-[#f1c56b]">
                    <Cloud className="size-4" /> 4. Cloud, Storage & Deploy (Amazon S3 + Heroku)
                  </div>
                  <p className="mt-1 text-xs text-white/70">
                    Predisposto con <strong>django-storages (boto3)</strong> per hosting su{' '}
                    <strong>Amazon S3</strong> dei file GPX e delle tracce audio MP3, file{' '}
                    <strong>Procfile</strong> e configurazione <strong>WhiteNoise</strong> pronti per deploy su{' '}
                    <strong>Heroku</strong>.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs text-white/80">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <CheckCircle className="size-4" /> Pronto per la condivisione nel Portfolio / GitHub
                </div>
                <p className="mt-1">
                  I tipi TypeScript (<code className="text-white font-mono">Tour</code>,{' '}
                  <code className="text-white font-mono">Waypoint</code>,{' '}
                  <code className="text-white font-mono">Booking</code>) sono condivisi in modo consistente tra il
                  portale web, l’app mobile e i serializzatori Django.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end border-t border-white/10 bg-[#0b1c15] px-6 py-3.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-[#0e2219] transition hover:brightness-110"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
