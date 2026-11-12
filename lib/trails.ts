export type WaypointData = {
  id: number
  title: string
  description: string
  poiType: 'viewpoint' | 'water_source' | 'refuge' | 'cultural'
  poiTypeLabel: string
  km: number
  elevation: number
  lat?: number
  lng?: number
  hasAudio: boolean
}

export type Trail = {
  id: string
  name: string
  slug: string
  category: 'gravel' | 'ebike' | 'trekking'
  categoryLabel: string
  level: 'Facile' | 'Media' | 'Impegnativa'
  km: number
  gain: number
  duration: string
  price: number
  image: string
  description: string
  startingPoint: string
  bikeRentalAvailable: boolean
  gpxUrl: string
  coordinates: [number, number, number][]
  waypoints: WaypointData[]
  elevationProfile: { km: number; elevation: number }[]
}

export const trails: Trail[] = [
  {
    id: 'pista-altomontana-etna',
    slug: 'pista-altomontana-etna',
    name: 'Pista Altomontana dell’Etna: Crateri & Lave',
    category: 'gravel',
    categoryLabel: 'Gravel & All-Road',
    level: 'Media',
    km: 36.0,
    gain: 780,
    duration: '3 h 45 min',
    price: 45,
    image: '/images/crinale.png',
    startingPoint: 'Rifugio Sapienza / Piano Vetore (Nicolosi)',
    bikeRentalAvailable: true,
    gpxUrl: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/altomontana-etna.gpx',
    coordinates: [
      [14.982, 37.698, 1740],
      [14.945, 37.721, 1820],
      [14.928, 37.749, 1875],
      [14.935, 37.785, 1810],
      [14.972, 37.81, 1745],
      [15.015, 37.822, 1840],
      [15.042, 37.795, 1800],
      [14.982, 37.698, 1740],
    ],
    description:
      'L’itinerario gravel per eccellenza in Sicilia. Un anello leggendario su piste battute e basalto lavico tra pini larici, colate storiche e rifugi alpini attorno ai crateri sommitali.',
    waypoints: [
      {
        id: 1,
        title: 'Rifugio Galvarina (1875 m)',
        description: 'Bivacco storico in pietra lavica aperto tutto l’anno con vista aperta sulla piana di Catania.',
        poiType: 'refuge',
        poiTypeLabel: 'Rifugio Vulcanico',
        km: 8.4,
        elevation: 1875,
        lat: 37.749,
        lng: 14.928,
        hasAudio: true,
      },
      {
        id: 2,
        title: 'Grotta dei Lamponi',
        description: 'Uno dei più lunghi tunnel di scorrimento lavico dell’Etna, formatosi durante l’eruzione del 1614-1624.',
        poiType: 'cultural',
        poiTypeLabel: 'Tunnel Lavico Naturale',
        km: 21.3,
        elevation: 1745,
        lat: 37.81,
        lng: 14.972,
        hasAudio: true,
      },
      {
        id: 3,
        title: 'Faggeta di Timparossa (1840 m)',
        description: 'La faggeta più meridionale d’Europa, incastonata a ridosso delle colate nere del versante nord.',
        poiType: 'viewpoint',
        poiTypeLabel: 'Faggeta Secolare & Panorama',
        km: 28.6,
        elevation: 1840,
        lat: 37.822,
        lng: 15.015,
        hasAudio: true,
      },
    ],
    elevationProfile: [
      { km: 0, elevation: 1740 },
      { km: 8.4, elevation: 1875 },
      { km: 16, elevation: 1810 },
      { km: 21.3, elevation: 1745 },
      { km: 28.6, elevation: 1840 },
      { km: 36.0, elevation: 1740 },
    ],
  },
  {
    id: 'dorsale-nebrodi-lago-maulazzo',
    slug: 'dorsale-nebrodi-maulazzo',
    name: 'Dorsale dei Nebrodi: Lago Maulazzo & Monte Soro',
    category: 'ebike',
    categoryLabel: 'E-Bike Panoramica',
    level: 'Facile',
    km: 31.0,
    gain: 680,
    duration: '3 h 15 min',
    price: 42,
    image: '/images/faggeta.png',
    startingPoint: 'Portella Femmina Morta (Cesarò)',
    bikeRentalAvailable: true,
    gpxUrl: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/nebrodi-maulazzo.gpx',
    coordinates: [
      [14.652, 37.915, 1524],
      [14.668, 37.925, 1440],
      [14.695, 37.938, 1680],
      [14.698, 37.942, 1847],
      [14.675, 37.93, 1610],
      [14.652, 37.915, 1524],
    ],
    description:
      'Immergiti nella foresta più grande della Sicilia in sella a una E-MTB. Strade forestali d’alta quota, cavalli Sanfratellani al pascolo e il riflesso verde smeraldo del Lago Maulazzo.',
    waypoints: [
      {
        id: 4,
        title: 'Lago Maulazzo (1440 m)',
        description: 'Splendido specchio d’acqua artificiale incastonato nella fitta faggeta di Sollazzo Verde.',
        poiType: 'water_source',
        poiTypeLabel: 'Lago & Bosco di Faggi',
        km: 7.5,
        elevation: 1440,
        lat: 37.925,
        lng: 14.668,
        hasAudio: true,
      },
      {
        id: 5,
        title: 'Vetta di Monte Soro (1847 m)',
        description: 'Il punto più alto dei Monti Nebrodi. Panorama incredibile a 360° sull’Etna e sulle Isole Eolie.',
        poiType: 'viewpoint',
        poiTypeLabel: 'Tetto dei Nebrodi',
        km: 15.8,
        elevation: 1847,
        lat: 37.942,
        lng: 14.698,
        hasAudio: true,
      },
      {
        id: 6,
        title: 'Sorgente del Cannone',
        description: 'Fontanile montano dove rinfrescarsi con acqua pura sorgiva prima della discesa.',
        poiType: 'water_source',
        poiTypeLabel: 'Sorgente d’Acqua',
        km: 24.2,
        elevation: 1520,
        lat: 37.93,
        lng: 14.675,
        hasAudio: false,
      },
    ],
    elevationProfile: [
      { km: 0, elevation: 1524 },
      { km: 7.5, elevation: 1440 },
      { km: 15.8, elevation: 1847 },
      { km: 24.2, elevation: 1520 },
      { km: 31.0, elevation: 1524 },
    ],
  },
  {
    id: 'canyon-alcantara-gurne',
    slug: 'canyon-alcantara-gurne',
    name: 'Gole dell’Alcantara: Canyon Basaltico & Gurne',
    category: 'trekking',
    categoryLabel: 'Trekking & Guadi Fluviali',
    level: 'Facile',
    km: 9.5,
    gain: 320,
    duration: '3 h 30 min',
    price: 32,
    image: '/images/torrente.png',
    startingPoint: 'Francavilla di Sicilia / Castiglione',
    bikeRentalAvailable: false,
    gpxUrl: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/gole-alcantara.gpx',
    coordinates: [
      [15.132, 37.895, 330],
      [15.148, 37.886, 330],
      [15.165, 37.88, 420],
      [15.178, 37.876, 310],
      [15.132, 37.895, 330],
    ],
    description:
      'Un’avventura a piedi tra le pareti prismatiche di basalto vulcanico raffreddate dal fiume. Bagni nelle pozze d’acqua limpida (gurne) e profumo di zagare negli agrumeti secolari.',
    waypoints: [
      {
        id: 7,
        title: 'Gurne di Francavilla',
        description: 'Sedici piccoli laghetti e cascate naturali scavati nella roccia lavica dal corso impetuoso dell’acqua.',
        poiType: 'water_source',
        poiTypeLabel: 'Piscine Naturali',
        km: 3.2,
        elevation: 330,
        lat: 37.886,
        lng: 15.148,
        hasAudio: true,
      },
      {
        id: 8,
        title: 'Mulino Antico e Ponte Normanno',
        description: 'Vestigia medievali che testimoniano l’uso dell’energia idraulica per la macinazione del grano sin dall’anno 1100.',
        poiType: 'cultural',
        poiTypeLabel: 'Patrimonio Storico Siciliano',
        km: 6.0,
        elevation: 370,
        lat: 37.88,
        lng: 15.165,
        hasAudio: true,
      },
      {
        id: 9,
        title: 'Canyon delle Colonne a Prisma',
        description: 'Gola spettacolare con pareti a canne d’organo alte fino a 30 metri.',
        poiType: 'viewpoint',
        poiTypeLabel: 'Monumento Geologico',
        km: 8.8,
        elevation: 310,
        lat: 37.876,
        lng: 15.178,
        hasAudio: true,
      },
    ],
    elevationProfile: [
      { km: 0, elevation: 330 },
      { km: 3.2, elevation: 330 },
      { km: 6.0, elevation: 420 },
      { km: 8.8, elevation: 310 },
      { km: 9.5, elevation: 330 },
    ],
  },
  {
    id: 'riserva-zingaro-scopello',
    slug: 'riserva-zingaro-scopello',
    name: 'Riserva dello Zingaro: Il Sentiero Costiero',
    category: 'trekking',
    categoryLabel: 'Trekking a Piedi',
    level: 'Media',
    km: 14.0,
    gain: 450,
    duration: '4 h 30 min',
    price: 36,
    image: '/images/hero-bosco.png',
    startingPoint: 'Ingresso Sud - Tonnara di Scopello (Castellammare del Golfo)',
    bikeRentalAvailable: false,
    gpxUrl: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/riserva-zingaro.gpx',
    coordinates: [
      [12.822, 38.075, 40],
      [12.818, 38.09, 15],
      [12.805, 38.115, 320],
      [12.79, 38.14, 20],
    ],
    description:
      'Il trekking costiero più iconico della Sicilia occidentale. Sentiero affacciato sul mare turchese tra palme nane, calette solitarie di ciottoli bianchi e profumo di finocchietto selvatico.',
    waypoints: [
      {
        id: 10,
        title: 'Cala Capreria',
        description: 'La prima caletta turchese, famosa per i suoi fondali limpidi ricchi di praterie di posidonia.',
        poiType: 'water_source',
        poiTypeLabel: 'Caletta Naturale',
        km: 2.2,
        elevation: 15,
        lat: 38.09,
        lng: 12.818,
        hasAudio: true,
      },
      {
        id: 11,
        title: 'Borgo Cusenza',
        description: 'Antico agglomerato rurale di pastori e contadini del XIX secolo, intatto e immerso nel silenzio.',
        poiType: 'cultural',
        poiTypeLabel: 'Borgo Rurale Tradizionale',
        km: 7.8,
        elevation: 320,
        lat: 38.115,
        lng: 12.805,
        hasAudio: true,
      },
    ],
    elevationProfile: [
      { km: 0, elevation: 40 },
      { km: 2.2, elevation: 15 },
      { km: 7.8, elevation: 320 },
      { km: 11.5, elevation: 60 },
      { km: 14.0, elevation: 20 },
    ],
  },
  {
    id: 'canyon-pantalica-gravel',
    slug: 'canyon-pantalica-gravel',
    name: 'Gravel Pantalica: Valle dell’Anapo & Necropoli',
    category: 'gravel',
    categoryLabel: 'Gravel & Archeologia',
    level: 'Facile',
    km: 26.0,
    gain: 390,
    duration: '2 h 45 min',
    price: 38,
    image: '/images/rifugio.png',
    startingPoint: 'Stazione di Cassaro-Ferla / Valle Anapo',
    bikeRentalAvailable: true,
    gpxUrl: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/pantalica-anapo.gpx',
    coordinates: [
      [15.012, 37.125, 220],
      [15.035, 37.138, 260],
      [15.06, 37.142, 340],
      [15.045, 37.135, 290],
      [15.012, 37.125, 220],
    ],
    description:
      'Un itinerario magico sull’ex ferrovia a scartamento ridotto Siracusa-Vizzini. Pedalando lungo il torrente Anapo attraverserai gallerie nella roccia viva sotto oltre cinquemila tombe rupestri Patrimonio UNESCO.',
    waypoints: [
      {
        id: 12,
        title: 'Galleria dei Pipistrelli',
        description: 'Galleria scavata nella roccia calcarea, fresca anche nelle estati più torride.',
        poiType: 'cultural',
        poiTypeLabel: 'Ex Ferrovia Storica',
        km: 6.5,
        elevation: 260,
        lat: 37.138,
        lng: 15.035,
        hasAudio: true,
      },
      {
        id: 13,
        title: 'Necropoli Nord di Pantalica',
        description: 'La parete a nido d’ape più celebre d’Europa: 5.000 tombe a grotticella scavate tra il XIII e l’VIII sec. a.C.',
        poiType: 'viewpoint',
        poiTypeLabel: 'Sito UNESCO Patrimonio Umanità',
        km: 14.0,
        elevation: 340,
        lat: 37.142,
        lng: 15.06,
        hasAudio: true,
      },
    ],
    elevationProfile: [
      { km: 0, elevation: 220 },
      { km: 6.5, elevation: 260 },
      { km: 14.0, elevation: 340 },
      { km: 20.0, elevation: 290 },
      { km: 26.0, elevation: 220 },
    ],
  },
]

export const DJANGO_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
