'use client'

import { Mail } from 'lucide-react'
import { trails } from '@/lib/trails'

const CONTACT_EMAIL = 'info@faggetaalta.example'

const fieldClass =
  'w-full rounded-lg border border-input bg-background/60 px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'

export function Booking() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const body = [
      `Nome: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Esperienza: ${data.get('trail')}`,
      `Data desiderata: ${data.get('date')}`,
      `Partecipanti: ${data.get('people')}`,
    ].join('\n')
    const subject = `Richiesta di prenotazione: ${data.get('trail')}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="prenota" className="relative flex min-h-screen scroll-mt-16 items-center px-6 py-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-xl rounded-2xl border border-border bg-background/70 p-6 backdrop-blur-md md:p-10">
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">Prenota la tua uscita</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Scegli il percorso e la data: la richiesta si apre nel tuo programma di posta e ti
            ricontattiamo con la disponibilità.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="trail" className="mb-1.5 block text-sm font-medium">
                Esperienza
              </label>
              <select id="trail" name="trail" required className={fieldClass} defaultValue={trails[0].name}>
                {trails.map((t) => (
                  <option key={t.id} value={t.name} className="bg-card">
                    {t.name}
                  </option>
                ))}
                <option value="Notte al Rifugio del Cervo" className="bg-card">
                  Notte al Rifugio del Cervo
                </option>
              </select>
            </div>
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-medium">
                Data desiderata
              </label>
              <input id="date" name="date" type="date" required className={fieldClass} />
            </div>
            <div>
              <label htmlFor="people" className="mb-1.5 block text-sm font-medium">
                Partecipanti
              </label>
              <input
                id="people"
                name="people"
                type="number"
                min={1}
                max={8}
                defaultValue={2}
                required
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Nome
              </label>
              <input id="name" name="name" type="text" required autoComplete="name" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 sm:col-span-2"
            >
              <Mail className="size-4" aria-hidden="true" />
              Invia la richiesta
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
