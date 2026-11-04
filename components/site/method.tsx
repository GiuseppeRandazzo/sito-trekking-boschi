import Image from 'next/image'
import { Binoculars, Sunrise, Users } from 'lucide-react'

const points = [
  {
    icon: Users,
    title: 'Gruppi da otto persone',
    text: 'Pochi passi rumorosi, più occasioni di incontrare caprioli, picchi e volpi.',
  },
  {
    icon: Binoculars,
    title: 'Guide naturaliste',
    text: 'Riconoscere un faggio da un carpino cambia il modo di guardare il bosco.',
  },
  {
    icon: Sunrise,
    title: 'Partenza all’alba',
    text: 'La luce migliore e il sentiero tutto per noi, prima che arrivi il caldo.',
  },
]

export function Method() {
  return (
    <section className="relative flex min-h-screen items-center px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="ml-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-background/65 backdrop-blur-md">
          <div className="relative aspect-[16/8]">
            <Image
              src="/images/hero-bosco.png"
              alt="Un gruppo di escursionisti cammina su un sentiero nella faggeta all’alba"
              fill
              sizes="(min-width: 768px) 576px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-10">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Il bosco, un passo alla volta
            </h2>
            <ul className="mt-6 flex flex-col gap-5">
              {points.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <Icon className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
