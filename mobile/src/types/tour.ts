export type PoiType = 'viewpoint' | 'water_source' | 'refuge' | 'cultural' | 'audio_cue';

export interface Waypoint {
  id: number;
  title: string;
  description: string;
  poi_type: PoiType;
  poi_type_display: string;
  lat: number;
  lng: number;
  elevation_m: number;
  km_marker: number;
  audio_guide_url?: string;
  order: number;
}

export interface Tour {
  id: number;
  title: string;
  slug: string;
  category: 'ebike' | 'gravel' | 'mtb' | 'trekking';
  category_display: string;
  short_description: string;
  description?: string;
  difficulty: 'Facile' | 'Intermedia' | 'Impegnativa';
  difficulty_display: string;
  distance_km: number;
  elevation_gain_m: number;
  estimated_duration: string;
  price_per_person: number;
  cover_image: string;
  gpx_file_url?: string;
  starting_point: string;
  bike_rental_available: boolean;
  is_featured: boolean;
  coordinates_geojson?: [number, number, number][]; // [lng, lat, elevation]
  waypoints?: Waypoint[];
  waypoints_count?: number;
}

export interface BookingPayload {
  tour: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  tour_date: string; // YYYY-MM-DD
  participants_count: number;
  bike_rental_needed: boolean;
  notes?: string;
}

export interface BookingResponse {
  booking_code: string;
  tour: number;
  tour_title: string;
  customer_name: string;
  customer_email: string;
  tour_date: string;
  participants_count: number;
  bike_rental_needed: boolean;
  total_price: string;
  status: string;
  status_display: string;
}
