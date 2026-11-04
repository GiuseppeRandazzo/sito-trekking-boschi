import { TreePine } from 'lucide-react'

const links = [
  { href: '#percorsi', label: 'Percorsi' },
  { href: '#guida', label: 'La guida' },
  { href: '#rifugio', label: 'Rifugio' },
]

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-background/90 to-transparent">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2 font-display text-lg font-semibold">
          <TreePine className="size-5 text-primary" aria-hidden="true" />
          Faggeta Alta
        </a>
        <nav aria-label="Principale" className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#prenota"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Prenota
          </a>
        </nav>
      </div>
    </header>
  )
}
