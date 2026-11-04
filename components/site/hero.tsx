import { ArrowDown } from 'lucide-react'
import { ExplorerLauncher } from '@/components/forest/forest-explorer'

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-6">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary">
            Trekking guidati · Alta Valle del Rio Scuro
          </p>
          <h1 className="text-balance text-5xl font-semibold leading-[1.02] md:text-7xl">
            Cammina dentro il bosco.
          </h1>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Escursioni in piccoli gruppi nella faggeta secolare, da una mezza
            giornata fino a due giorni con notte al rifugio. Scorri per
            percorrere il sentiero fino alla lanterna accesa.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#percorsi"
              className="rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Scopri i percorsi
            </a>
            <a
              href="#prenota"
              className="rounded-full border border-border bg-background/40 px-6 py-3 font-medium backdrop-blur-sm transition-colors hover:bg-background/70"
            >
              Prenota un&apos;uscita
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
