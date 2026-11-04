import Image from 'next/image'

export function Guide() {
  return (
    <section id="guida" className="relative flex min-h-screen scroll-mt-16 items-center px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid max-w-3xl overflow-hidden rounded-2xl border border-border bg-background/65 backdrop-blur-md md:grid-cols-[260px_1fr]">
          <div className="relative aspect-[3/4] md:aspect-auto">
            <Image
              src="/images/guida.png"
              alt="Marta, guida naturalistica, con una mappa in mano nel bosco"
              fill
              sizes="(min-width: 768px) 260px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">La guida</p>
            <h2 className="mt-2 text-balance text-3xl font-semibold">Marta, vent&apos;anni sugli stessi sentieri</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              &ldquo;Non porto le persone da nessuna parte: le accompagno ad ascoltare. Il bosco
              parla piano, basta fermarsi dieci minuti e smettere di guardare il telefono.&rdquo;
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Guida ambientale escursionistica e primo soccorso in ambiente impervio.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
