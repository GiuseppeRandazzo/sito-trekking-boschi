import { ArrowDown, Bike, Compass } from 'lucide-react'
import { ExplorerLauncher } from '@/components/forest/forest-explorer'

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur-sm">
            <Compass className="size-3.5" />
            <span>Trekking & Gravel/E-Bike · Sicilia Outdoor Experience</span>
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] md:text-7xl">
            Vivi la Sicilia a piedi e in sella.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Dall’anello vulcanico dell’Etna alle faggete dei Nebrodi, dalle Gole dell’Alcantara allo Zingaro: tour auto-guidati in Gravel ed E-Bike con navigazione GPS vocale intelligente.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#percorsi"
              className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-all hover:brightness-110"
            >
              Scopri i Tour & GPX
            </a>
            <a
              href="#prenota"
              className="rounded-full border border-border bg-background/50 px-6 py-3 font-medium backdrop-blur-sm transition-colors hover:bg-background/80"
            >
              Prenota Tour o Bici
            </a>
            <ExplorerLauncher />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-8 flex justify-center text-muted-foreground">
        <ArrowDown className="size-5 motion-safe:animate-bounce" aria-hidden="true" />
        <span className="sr-only">Scorri per continuare</span>
      </div>
    </section>
  )
}
