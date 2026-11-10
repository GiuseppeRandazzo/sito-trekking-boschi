import { Tour, BookingPayload, BookingResponse } from '../types/tour';

// Default Django backend URL (local development or production Heroku)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export const OutdooraApi = {
  /**
   * Recupera la lista di tutti i tour per ciclisti ed escursionisti
   */
  async getTours(category?: string): Promise<Tour[]> {
    try {
      const url = category && category !== 'all' 
        ? `${BASE_URL}/tours/?category=${category}` 
        : `${BASE_URL}/tours/`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.results || data;
    } catch (error) {
      console.warn('API non raggiungibile, utilizzo dati offline/mock:', error);
      return FALLBACK_TOURS;
    }
  },

  /**
   * Recupera i dettagli completi del tour con waypoints e traccia GPS
   */
  async getTourBySlug(slug: string): Promise<Tour> {
    try {
      const response = await fetch(`${BASE_URL}/tours/${slug}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('API non raggiungibile, fallback:', error);
      const fallback = FALLBACK_TOURS.find((t) => t.slug === slug);
      if (!fallback) throw new Error('Tour non trovato');
      return fallback;
    }
  },

  /**
   * Invia una prenotazione al backend Django
   */
  async createBooking(payload: BookingPayload): Promise<BookingResponse> {
    const response = await fetch(`${BASE_URL}/bookings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Errore prenotazione: ${response.statusText}`);
    return await response.json();
  },
};

const FALLBACK_TOURS: Tour[] = [
  {
    id: 1,
    title: 'Pista Altomontana dell’Etna: Crateri & Lave',
    slug: 'pista-altomontana-etna',
    category: 'gravel',
    category_display: 'Gravel & All-Road',
    short_description: 'Anello leggendario su piste vulcaniche e basalto tra pini larici, colate storiche e rifugi alpini.',
    difficulty: 'Intermedia',
    difficulty_display: 'Media',
    distance_km: 36.0,
    elevation_gain_m: 780,
    estimated_duration: '3 h 45 min',
    price_per_person: 45,
    cover_image: '/images/crinale.png',
    starting_point: 'Piano Vetore / Rifugio Sapienza (Nicolosi)',
    bike_rental_available: true,
    is_featured: true,
    waypoints: [
      {
        id: 101,
        title: 'Rifugio Galvarina (1875 m)',
        description: 'Bivacco in pietra lavica aperto tutto l’anno con vista aperta sulla piana di Catania.',
        poi_type: 'refuge',
        poi_type_display: 'Rifugio Vulcanico',
        lat: 37.749,
        lng: 14.928,
        elevation_m: 1875,
        km_marker: 8.4,
        audio_guide_url: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/etna-galvarina.mp3',
        order: 1,
      },
      {
        id: 102,
        title: 'Grotta dei Lamponi (1745 m)',
        description: 'Tunnel di scorrimento lavico tra i più estesi dell’Etna (eruzione 1614).',
        poi_type: 'cultural',
        poi_type_display: 'Tunnel Lavico',
        lat: 37.810,
        lng: 14.972,
        elevation_m: 1745,
        km_marker: 21.3,
        audio_guide_url: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/etna-lamponi.mp3',
        order: 2,
      },
      {
        id: 103,
        title: 'Faggeta di Timparossa (1840 m)',
        description: 'La faggeta più meridionale d’Europa incastonata nel versante nord del vulcano.',
        poi_type: 'viewpoint',
        poi_type_display: 'Faggeta Secolare & Belvedere',
        lat: 37.822,
        lng: 15.015,
        elevation_m: 1840,
        km_marker: 28.6,
        audio_guide_url: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/etna-timparossa.mp3',
        order: 3,
      },
    ],
  },
  {
    id: 2,
    title: 'Dorsale dei Nebrodi: Lago Maulazzo & Monte Soro',
    slug: 'dorsale-nebrodi-maulazzo',
    category: 'ebike',
    category_display: 'E-Bike Panoramica',
    short_description: 'Foreste di faggi secolari, cavalli Sanfratellani al pascolo e il Lago Maulazzo a 1440m.',
    difficulty: 'Facile',
    difficulty_display: 'Facile',
    distance_km: 31.0,
    elevation_gain_m: 680,
    estimated_duration: '3 h 15 min',
    price_per_person: 42,
    cover_image: '/images/faggeta.png',
    starting_point: 'Portella Femmina Morta (Cesarò)',
    bike_rental_available: true,
    is_featured: true,
    waypoints: [
      {
        id: 104,
        title: 'Lago Maulazzo',
        description: 'Specchio lacustre nel cuore della faggeta dei Nebrodi.',
        poi_type: 'water_source',
        poi_type_display: 'Lago Montano',
        lat: 37.925,
        lng: 14.668,
        elevation_m: 1440,
        km_marker: 7.5,
        audio_guide_url: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/nebrodi-maulazzo.mp3',
        order: 1,
      },
      {
        id: 105,
        title: 'Vetta di Monte Soro (1847 m)',
        description: 'Il punto più alto dei Nebrodi con vista sull’Etna e sulle Isole Eolie.',
        poi_type: 'viewpoint',
        poi_type_display: 'Belvedere Panoramico',
        lat: 37.942,
        lng: 14.698,
        elevation_m: 1847,
        km_marker: 15.8,
        audio_guide_url: 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/nebrodi-montesoro.mp3',
        order: 2,
      },
    ],
  },
];
