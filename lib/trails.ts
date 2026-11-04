export type Trail = {
  id: string
  name: string
  level: 'Facile' | 'Media' | 'Impegnativa'
  km: number
  gain: number
  duration: string
  price: number
  image: string
  description: string
}

export const trails: Trail[] = [
  {
    id: 'anello-faggeta',
    name: 'Anello della Faggeta',
    level: 'Facile',
    km: 7,
    gain: 280,
    duration: '3 h 30',
    price: 28,
    image: '/images/faggeta.png',
    description:
      'Mezza giornata tra faggi di oltre duecento anni. Ideale per famiglie e per chi fa il primo trekking.',
  },
  {
    id: 'rio-scuro',
    name: 'Rio Scuro e le Cascatelle',
    level: 'Media',
    km: 12,
    gain: 620,
    duration: '6 h',
    price: 42,
    image: '/images/torrente.png',
    description:
      'Si risale il torrente tra abeti e felci. Pranzo al sacco accanto alla cascata più alta della valle.',
  },
  {
    id: 'crinale-larici',
    name: 'Crinale dei Larici',
    level: 'Impegnativa',
    km: 18,
    gain: 1050,
    duration: '8 h',
    price: 58,
    image: '/images/crinale.png',
    description:
      'Dal bosco al crinale: si esce dal limite degli alberi per il tramonto e si rientra con le frontali.',
  },
]
