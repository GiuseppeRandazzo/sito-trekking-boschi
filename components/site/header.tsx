'use client'

import { TreePine } from 'lucide-react'
import { TechStackModal } from './tech-stack-modal'

const links = [
  { href: '#percorsi', label: 'Tour & GPX' },
  { href: '#metodo', label: 'Filosofia' },
  { href: '#guida', label: 'La Guida' },
  { href: '#rifugio', label: 'Il Rifugio' },
]

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-background/95 via-background/70 to-transparent backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          <TreePine className="size-5 text-primary" aria-hidden="true" />
          <span>Wild Sicily <span className="text-xs font-normal text-primary">· Outdoora Experience</span></span>
        </a>

        <nav aria-label="Principale" className="flex items-center gap-4 md:gap-6">
          <ul className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <TechStackModal />

          <a
            href="#prenota"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 shadow"
          >
            Prenota Tour
          </a>
        </nav>
      </div>
    </header>
  )
}
