import Image from 'next/image'
import { Clock, Mountain, Route } from 'lucide-react'
import { trails } from '@/lib/trails'

export function Trails() {
  return (
    <section id="percorsi" className="relative scroll-mt-16 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl rounded-2xl border border-border bg-background/65 p-6 backdrop-blur-md md:p-8">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">Tre percorsi, tre modi di entrare nel bosco</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Tutte le uscite includono guida, assicurazione e un piccolo assaggio di prodotti locali.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {trails.map((trail) => (
            <li
              key={trail.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/85 backdrop-blur-md"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={trail.image}
                  alt={`Paesaggio del percorso ${trail.name}`}
                  fill
                  sizes="(min-width: 768px) 384px, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {trail.level}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-semibold">{trail.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{trail.description}</p>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Route className="size-4 text-primary" aria-hidden="true" />
                    <dt className="sr-only">Lunghezza</dt>
                    <dd>{trail.km} km</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mountain className="size-4 text-primary" aria-hidden="true" />
                    <dt className="sr-only">Dislivello</dt>
                    <dd>{trail.gain} m</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-primary" aria-hidden="true" />
                    <dt className="sr-only">Durata</dt>
                    <dd>{trail.duration}</dd>
                  </div>
                </dl>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    da <span className="text-lg font-semibold text-foreground">{trail.price} €</span>
                  </p>
                  <a
                    href="#prenota"
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    Prenota
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
