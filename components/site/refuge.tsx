import Image from 'next/image'
import { Flame, Tent } from 'lucide-react'

export function Refuge() {
  return (
    <section id="rifugio" className="relative flex min-h-screen scroll-mt-16 items-center px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl overflow-hidden rounded-2xl border border-border bg-background/65 backdrop-blur-md">
          <div className="relative aspect-[16/9]">
            <Image
              src="/images/rifugio.png"
              alt="Il Rifugio del Cervo al tramonto con le finestre illuminate"
              fill
              sizes="(min-width: 768px) 576px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-10">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">Una notte al Rifugio Timparossa</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Due giorni di sella o cammino, una cena calda con specialità tipiche dei Nebrodi e dell&apos;Etna,
              e il cielo stellato più limpido del Mediterraneo. Il rifugio nel bosco ha sedici posti e colonnine di ricarica per e-bike.
            </p>
            <ul className="mt-6 flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <Tent className="size-5 text-primary" aria-hidden="true" />
                16 posti letto in camerate di legno da 4
              </li>
              <li className="flex items-center gap-3">
                <Flame className="size-5 text-primary" aria-hidden="true" />
                Mezza pensione con cena tipica siciliana e colazione da 110 € a persona
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
